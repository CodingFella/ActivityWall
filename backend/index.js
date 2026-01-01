import express from "express";
import cors from "cors";
import { DOMParser } from "@xmldom/xmldom";
import { query } from "./db.js";

import fs from "node:fs";
import path from "node:path";

const app = express();
const PORT = process.env.PORT || 3000;

const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 400;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World! This is my Node.js backend.");
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers (use 3958.8 for miles)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// convert a whole lotta longitude and latitude points into x/y coordinates on a screen
function convertToXY(points, width, height) {
  // find the Bounding Box
  let minLat = Infinity,
    maxLat = -Infinity;
  let minLon = Infinity,
    maxLon = -Infinity;

  points.forEach((p) => {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lon < minLon) minLon = p.lon;
    if (p.lon > maxLon) maxLon = p.lon;
  });

  // calculate Aspect Ratio Correction
  // use the middle latitude to calculate the scaling factor for longitude
  const midLat = (minLat + maxLat) / 2;
  const midLatRad = midLat * (Math.PI / 180);
  const aspectCorrection = Math.cos(midLatRad);

  // determine data ranges (with correction applied to longitude)
  const latRange = maxLat - minLat;
  const lonRange = (maxLon - minLon) * aspectCorrection;

  // calculate Scale to fit the container
  const xScale = width / lonRange;
  const yScale = height / latRange;
  const scale = Math.min(xScale, yScale) * 0.9; // 0.9 provides a 10% padding margin

  // center the map in the container
  const xOffset = (width - lonRange * scale) / 2;
  const yOffset = (height - latRange * scale) / 2;

  const result = [];
  let lastX = null;
  let lastY = null;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];

    const x = Math.round(xOffset + (p.lon - minLon) * aspectCorrection * scale);
    const y = Math.round(height - (yOffset + (p.lat - minLat) * scale));

    if (x !== lastX || y !== lastY) {
      result.push([x, y]); // Store as [x, y] instead of {x, y}
      lastX = x;
      lastY = y;
    }
  }

  // downsample if needed
  if (result.length > 1000) {
    return result.filter((_, index) => index % 2 === 0);
  }

  return result;
}

async function main() {
  try {
    const folder = "./gpx_files";

    const files = fs.readdirSync(folder);

    let processedCount = 0;

    for (const fileName of files) {
      if (path.extname(fileName).toLowerCase() == ".gpx") {
        const filePath = path.join(folder, fileName);
        const content = fs.readFileSync(filePath, "utf8");

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(content, "text/xml");

        const startTime =
          xmlDoc.getElementsByTagName("time")[0]?.textContent || "None";
        if (startTime == "None") {
          continue;
        }

        const checkResult = await query(
          "SELECT id FROM maps WHERE start_time = $1",
          [startTime],
        );

        if (checkResult.rows.length > 0) {
          // If it exists
          continue;
        }

        const name = "Activity";
        const trkpts = xmlDoc.getElementsByTagName("trkpt");

        let totalDistance = 0;
        const parsedPoints = [];

        for (let i = 0; i < trkpts.length; i++) {
          const pt = trkpts[i];
          const lat = parseFloat(pt.getAttribute("lat"));
          const lon = parseFloat(pt.getAttribute("lon"));

          const currentPoint = { lat, lon };

          // Calculate distance from the previous point
          if (i > 0) {
            const prevPoint = parsedPoints[i - 1];
            totalDistance += calculateDistance(
              prevPoint.lat,
              prevPoint.lon,
              currentPoint.lat,
              currentPoint.lon,
            );
          }

          parsedPoints.push(currentPoint);
        }

        const convertedData = convertToXY(
          parsedPoints,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
        );

        await query(
          "INSERT INTO maps (start_time, name, gpx_data, converted_data, distance) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (start_time) DO NOTHING",
          [
            startTime,
            name,
            JSON.stringify(parsedPoints),
            JSON.stringify(convertedData),
            totalDistance.toFixed(2),
          ],
        );

        processedCount++;
        console.log(`Successfully processed ${processedCount} files`);
      }
    }
    console.log(`Successfully processed ${processedCount} files`);
  } catch (err) {
    console.error(err);
  }
}

app.get("/api/get-points", async (req, res) => {
  const inputYear = req.query.year;
  const dbResult = await query(
    "SELECT id, start_time::text, converted_data FROM maps WHERE start_time::text LIKE $1",
    [`${inputYear}%`],
  );

  const response = {};

  dbResult.rows.map((row) => {
    const dateKey = new Date(row.start_time).toISOString().split("T")[0];

    row.converted_data;

    if (!response[dateKey]) {
      response[dateKey] = [];
    }

    response[dateKey].push({
      points: row.converted_data,
      startTime: row.start_time,
      id: row.id,
    });
  });

  res.json(response);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

main();

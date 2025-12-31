
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Paper from './components/Paper';
import type { Point } from 'roughjs/bin/geometry';

interface RouteData {
  points: Point[];
  start_time: string;
  id: number;
}

function CalendarPage() {
  const params = useParams();
  const year = Number(params.year) || new Date().getFullYear();

  const [data, setData] = useState<Record<string, RouteData[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3000/get-points?year=${year}`);
        const json_data = await response.json();
        setData(json_data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [year]);

  const runsByMonth = useMemo(() => {
    const groups: Record<string, { date: string, run: RouteData }[]> = {};

    const sortedDates = Object.keys(data).sort();
    console.log(sortedDates)

    sortedDates.forEach(date => {
      const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

      const monthIndex = parseInt(date.split('-')[1], 10) - 1;
      const monthName = months[monthIndex];

      console.log(date, monthName)

      if (!groups[monthName]) {
        groups[monthName] = [];
      }

      // We take the first run of the day for the Paper
      if (data[date].length > 0) {
        groups[monthName].push({
          date: date,
          run: data[date][0]
        });
      }
    });

    return groups;
  }, [data]);

  if (isLoading) {
    return (
      <>
        <h1 className='text-4xl text-center m-[2rem]'>
          Jacob's Run Wall<br />
          <span className='text-3xl'>{year}</span>
        </h1>
        <div className="text-center mt-20 text-2xl">Loading your runs...</div>;
      </>
    );
  }

  return (
    <>
      <h1 className='text-4xl text-center m-[2rem]'>
        Jacob's Run Wall<br />
        <span className='text-3xl'>{year}</span>
      </h1>

      {/* Loop through each Month Group */}
      {Object.entries(runsByMonth).map(([monthName, runs]) => (
        <div key={monthName}>

          {/* Dynamic Month Divider */}
          <div className='flex month-divider my-[2rem] items-center'>
            <div className="grow bg-repeat-x bg-contain bg-[url(wave.png)] h-[2rem]"></div>
            <h2 className='text-3xl mx-8 min-w-[100px] text-center'>{monthName}</h2>
            <div className="grow bg-repeat-x bg-contain bg-[url(wave.png)] h-[2rem]"></div>
          </div>

          <div className='calendar-container flex flex-wrap justify-center gap-[2rem]'>
            {runs.map(({ date, run }) => (
              <div key={run.id} className="flex flex-col items-center">
                <Paper year={year} route={run.points} />
                <span className="text-gray-500 mt-2">{date}</span>
              </div>
            ))}
          </div>

        </div>
      ))}

      {/* Empty State Handler */}
      {Object.keys(runsByMonth).length === 0 && (
        <div className="text-center mt-20 text-2xl">
          No runs found for {year}.
        </div>
      )}
    </>
  );
}

export default CalendarPage;

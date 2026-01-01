
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Paper from './components/Paper';
import { Link } from 'react-router-dom'
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

  const dividers = ['wave.png', 'teeth.png', 'chain.png']
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/get-points?year=${year}`);
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
    console.log(data)

    sortedDates.forEach(date => {
      const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

      const monthIndex = parseInt(date.split('-')[1], 10) - 1;
      const monthName = months[monthIndex];

      if (!groups[monthName]) {
        groups[monthName] = [];
      }

      for (let i = 0; i < data[date].length; i++) {
        groups[monthName].push({
          date: date,
          run: data[date][i]
        });
      }
    });

    return groups;
  }, [data]);

  if (isLoading) {
    return (
      <>
        <nav className="flex w-full px-6 py-2 gap-2">
          <Link className="hover:underline" to={`/${year - 1}`}>
            {year - 1}
          </Link>
          <Link className="hover:underline ml-auto" to={`/${year + 1}`}>
            {year + 1}
          </Link>
        </nav>
        <h1 className='text-4xl text-center m-[2rem]'>
          Jacob's Activity Wall<br />
          <span className='text-3xl'>{year}</span>
        </h1>
        <div className="text-center mt-20 text-2xl">Loading activities...</div>;
      </>
    );
  }

  return (
    <>
      <nav className="flex w-full px-6 py-2 gap-2">
        <Link className="hover:underline" to={`/${year - 1}`}>
          {year - 1}
        </Link>
        <Link className="hover:underline ml-auto" to={`/${year + 1}`}>
          {year + 1}
        </Link>
      </nav>
      <h1 className='text-4xl text-center m-[2rem]'>
        Jacob's Activity Wall<br />
        <span className='text-3xl'>{year}</span>
      </h1>

      <div className="paper-fade-in m-[2rem]">
        {/* Loop through each Month Group */}
        {Object.entries(runsByMonth).map(([monthName, runs], index) => (
          <div key={monthName}>

            {/* Dynamic Month Divider */}
            <div className='flex month-divider my-[2rem] items-center'>
              <div
                className="grow bg-repeat-x bg-contain h-[2rem]"
                style={{ backgroundImage: `url(/${dividers[index % dividers.length]})` }}
              ></div>
              <h2 className='text-3xl mx-8 min-w-[100px] text-center'>{monthName}</h2>
              <div
                className="grow bg-repeat-x bg-contain h-[2rem]"
                style={{ backgroundImage: `url(/${dividers[index % dividers.length]})` }}
              ></div>
            </div>

            <div className='calendar-container flex flex-wrap justify-center gap-[2rem]'>
              {runs.map(({ date, run }) => (
                <div key={run.id} className="flex flex-col items-center">
                  <Paper index={run.id} year={year} route={run.points} />
                  <span className="text-gray-600 mt-2">{date}</span>
                </div>
              ))}
            </div>

          </div>
        ))}

        {/* Empty State Handler */}
        {Object.keys(runsByMonth).length === 0 && (
          <div className="text-center mt-20 text-2xl">
            No activities found for {year}.
          </div>
        )}
      </div>
    </>
  );
}

export default CalendarPage;

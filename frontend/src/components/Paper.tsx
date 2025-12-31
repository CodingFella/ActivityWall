import { useEffect } from 'react';
import './Paper.css'


function Paper({ year }: { year: number }) {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/`);
        const data = await response.text();
        console.log("Auto-fetched data:", data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <a
      className="calendar flex flex-col items-center justify-center block h-[16rem] w-[12rem] bg-[url('paper.png')] bg-no-repeat bg-contain bg-center cursor-pointer"
    >
      <span className="sr-only">Open {year} calendar</span>
    </a>
  );
}


export default Paper

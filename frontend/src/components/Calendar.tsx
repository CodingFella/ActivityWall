import { Link } from 'react-router-dom'
import './Calendar.css'


function Calendar({ year }: { year: number }) {

  return (
    <Link
      to={`/${year}`}
      className="calendar flex flex-col items-center justify-center block h-[16rem] w-[20rem] bg-[url('calendar.png')] bg-no-repeat bg-contain bg-center cursor-pointer"
    >
      <span className="md:text-7xl text-5xl mt-12">{year}</span>
      <span className="sr-only">Open {year} calendar</span>
    </Link>
  );
}


export default Calendar

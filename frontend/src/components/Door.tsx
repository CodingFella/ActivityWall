import { Link } from 'react-router-dom'
import './Door.css'


function Calendar({ year }: { year: number }) {

  return (
    <div className='flex flex-col items-center'>
      <Link
        to={`/${year}`}
        className="door flex flex-col items-center justify-center block h-[16rem] w-[20rem] bg-[url('/door.png')] bg-no-repeat bg-contain bg-center cursor-pointer"
      >
        <span className="sr-only">Open {year} calendar</span>
      </Link>
    </div>
  );
}


export default Calendar

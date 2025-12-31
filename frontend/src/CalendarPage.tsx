
import { useParams } from "react-router-dom";
import Paper from './components/Paper'

function CalendarPage() {
  const { year } = useParams();

  return (
    <>
      <h1 className='text-4xl text-center m-[2rem]'>Jacob's Run Wall - {year}</h1>

      <div className='flex month-divider'>
        <div className="grow bg-repeat-x bg-contain bg-[url(wave.png)] h-[2rem]"></div>
        <h2 className='text-3xl mx-8'>December</h2>
        <div className="grow bg-repeat-x bg-contain bg-[url(wave.png)] h-[2rem]"></div>
      </div>

      <div className='calendar-container flex flex-wrap justify-center gap-[2rem]'>
        <Paper year={12}></Paper>
        <Paper year={12}></Paper>
        <Paper year={12}></Paper>
        <Paper year={12}></Paper>
        <Paper year={12}></Paper>
        <Paper year={12}></Paper>
        <Paper year={12}></Paper>
        <Paper year={12}></Paper>
      </div>
    </>
  );
}

export default CalendarPage;

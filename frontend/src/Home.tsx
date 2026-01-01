import './Home.css'
import Calendar from './components/Calendar'

function Home() {

  return (
    <>
      <h1 className='text-4xl text-center m-[2rem]'>Jacob's Activity Wall</h1>
      <div className='calendar-container flex justify-center items-center'>
        <Calendar year={2026} />
        <Calendar year={2025} />
        <Calendar year={2024} />
      </div>
    </>
  )
}

export default Home

import './Home.css'
import Door from './components/Door'

function Home() {

  return (
    <>
      <h1 className='text-4xl text-center mt-[8vh] mb-3'>Jacob's Activity Wall</h1>
      <p className='text-center'>The door compels you to enter...</p>
      <div className='calendar-container flex justify-center items-center mt-[8rem] mb-[8rem]'>
        <Door year={2025} />
        <span className='sr-only'>Door to Activity Wall</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h2 className="text-2xl mb-3">About this project</h2>
        <p className="mb-2">
          All of the data came from all the GPS data I have recorded on my Garmin watch.
          These activities range from runs to rides to swims. To create the maps, I converted
          the latitude and longitude points into relative pixel locations on an HTML canvas,
          and then placed each canvas into its sheet of paper.
        </p>

        <p className="mb-2">
          The motivation behind this project was to display all the routes I've done in a cozy
          and handmade feeling. I enjoyed drawing the art as well. I'm not the greatest artist, but I think it
          adds a certain charm, for better or for worse. I also learned how to make and host a database too!
        </p>

        <p className="mb-2">
          If you're curious, you can <a className="underline" href='https://github.com/CodingFella/ActivityWall'>
            access the Github repository
          </a>.
        </p>
      </div>
    </>
  )
}

export default Home

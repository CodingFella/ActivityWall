import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from './Home'
import CalendarPage from './CalendarPage'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:year" element={<CalendarPage />} />
      </Routes>
    </>
  )
}

export default App

import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>FHIR Clinical Dashboard</h1>
      <p>count: {count}</p>
      
      <button onClick= {() => setCount(count+1)}> Add to Count</button>
    </>
  )
}

export default App

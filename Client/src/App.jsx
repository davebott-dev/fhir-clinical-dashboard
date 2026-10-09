import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null);
  const [patientId, setPatientId] = useState('');

 // Basic React code for fetch and displaying patient data to test fhir client
  const fetchPatientData = async(patientId) => {
    try {
      const response = await fetch(`https://hapi.fhir.org/baseR4/Patient/${patientId}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/fhir+json'
          }
        }
      );
    const patient_data = await response.json();
    console.log(patient_data);
    if(response.ok) {
      setData(patient_data);
    } else {
      console.error('Error fetching patient data:', patient_data);
    }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  }

  return (
    <>
      <h1>FHIR Clinical Dashboard</h1>

      {data && (
        <div>
          <h2>Patient Data:</h2>
          <p>Patient ID: {data.id}</p>
          <p>Patient Name: {data?.name[0]?.given[0]?? ''} {data?.name[0]?.family?? ''}</p>
          <p>Patient Gender: {data.gender}</p>
          <p>Patient Birth Date: {data.birthDate}</p>
          <p>Resource Type: {data.resourceType}</p>
        </div>
      )}
      
      <input type="text" value = {patientId} onChange = {(e)=> setPatientId(e.target.value)}/>
      <button onClick= {() => fetchPatientData(patientId)}> Search Patient</button>
    </>
  )
}

export default App

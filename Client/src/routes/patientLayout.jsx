import { useState, useEffect } from 'react';
import {Outlet, useParams} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

function PatientLayout() {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [patientObservations, setPatientObservations] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Fetch patient data from fhir mock server based on patientId
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`https://hapi.fhir.org/baseR4/Patient/${patientId}`);
        const data = await response.json();
        setPatient(data);
        const observationsResponse = await fetch(`https://hapi.fhir.org/baseR4/Observation?patient=${patientId}`);
        const observationsData = await observationsResponse.json();
        setPatientObservations(observationsData.entry || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [patientId]);

  const getPatientName = () => {
    if (!patient) return '';
    const firstName = patient.name?.[0]?.given?.[0] || '';
    const lastName = patient.name?.[0]?.family || '';
    return `${firstName} ${lastName}`;
  }

  return (
    <main className ="min-h-screen bg-slate-50 px-4 py-6 sm:px-8">
      <div className="mb-8 flex flex-row items-center gap-4">
      <Avatar/>     
      {patientId && <p>{getPatientName()}</p>}
      <span>Data refreshed at: {timestamp}</span>
      <IconButton aria-label="refresh" onClick={() => setTimestamp(new Date().toLocaleTimeString())}>
        <RefreshIcon />
      </IconButton>
      </div>
      <Outlet context={ [patient ,loading, patientObservations] } />
    </main>
  );
}

export default PatientLayout;
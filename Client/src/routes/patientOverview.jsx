import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PatientOverview() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch patient data from fhir mock server based on patientId
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`https://hapi.fhir.org/baseR4/Patient/${patientId}`);
        const data = await response.json();
        setPatient(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setLoading(false);
      }
    };
    fetchPatientData();
  }, [patientId]);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">Patient Overview</h1>
        <p>Displaying information for patient with ID: {patientId}</p>
        {loading && <p>Loading...</p>}
        {patient && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Patient Details</h2>
            <p><strong>First Name:</strong> {patient.name?.[0]?.given?.[0]}</p>
            <p><strong>Last Name:</strong> {patient.name?.[0]?.family}</p>
            <p><strong>Email:</strong> {patient.telecom?.find(t => t.system === 'email')?.value}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Birth Date:</strong> {patient.birthDate}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default PatientOverview;
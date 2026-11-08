import {useState,useEffect} from 'react';
import { useOutletContext } from 'react-router-dom';

function MedicationList() {
  const [patient] = useOutletContext();
  const [patientMedications, setPatientMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientMedications = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://hapi.fhir.org/baseR4/MedicationRequest?patient=${patient?.id}`);
        const data = await response.json();
        setPatientMedications(data.entry ?? []);
      } catch (error) {
        console.error('Failed to fetch patient medications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientMedications();
  }, [patient?.id]);

  console.log(patientMedications);
  return (
    <div>
      <h1>Medication List</h1>
      {loading ? <p>Loading...</p> : (
        <ul>
          {patientMedications.map((entry) => {
            const medication = entry?.resource;
            return (
              <li key={medication?.id}>
                {medication?.status || 'N/A'}, {medication?.medicationCodeableConcept?.text || 'N/A'}
                {medication?.dosageInstruction?.[0]?.text || 'N/A'} - ordered by: {medication?.requester?.reference || 'N/A'}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MedicationList;
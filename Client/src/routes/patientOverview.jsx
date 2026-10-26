import {useMatch} from "react-router-dom";

function PatientOverview() {
  const match = useMatch("/patientOverview/:patientId");
  const patientId = match?.params?.patientId; // Extract the patientId from the URL parameters using useMatch

  return (
    <>
        {patientId ? (
      <div>
        <h1 className="text-2xl font-bold mb-4">Patient Overview</h1>
        <p>Displaying information for patient with ID: {patientId}</p>
      </div>
    ) : (
      <p>Patient not found.</p>
    )}
    </>
  );
}

export default PatientOverview;
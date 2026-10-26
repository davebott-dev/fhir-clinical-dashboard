import {Outlet, useParams} from 'react-router-dom';

function patientLayout() {
  const { patientId } = useParams();

  return (
    <div>
      <h1>Patient Layout</h1>
      <p>This is the patient layout component.</p>
      {patientId && <p>Patient ID: {patientId}</p>}
      <Outlet />
    </div>
  );
}

export default patientLayout;
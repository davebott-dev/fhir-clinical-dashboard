import {useState} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

function PatientLayout() {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const { patientId } = useParams();

  return (
    <main>
      <div>
      <Avatar/>
      {patientId && <p>Patient ID: {patientId}</p>}
      <span>Data refreshed at: {timestamp}</span>
      <IconButton aria-label="refresh" onClick={() => setTimestamp(new Date().toLocaleTimeString())}>
        <RefreshIcon />
      </IconButton>
      </div>
      <Outlet />
    </main>
  );
}

export default PatientLayout;
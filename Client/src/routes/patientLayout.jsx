import { useState, useEffect } from 'react';
import {Outlet, useParams, useNavigate} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar'; 
import Alert from '@mui/material/Alert';


function PatientLayout() {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [patientObservations, setPatientObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

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

  const handleEditPatient = () => {
    // Implement edit patient logic here
    console.log('Edit patient clicked');
  };

  const handleDeletePatient = async() => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try{
        await fetch(`https://hapi.fhir.org/baseR4/Patient/${patientId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting patient:', error);
      }
      setPatient(null);
      setPatientObservations([]);
      setLoading(true);
      setOpen(true);
      setTimeout(() => navigate('/patient_search'), 3000);

    }
  };

  return (
    <main className ="min-h-screen bg-slate-50 px-4 py-6 sm:px-8">
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-md">
      <div className = "flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      
      <div className ="flex min-w-0 items-center gap-4">
      <Avatar
       sx={{
            width: 56,
            height: 56,
            bgcolor: '#dbeafe',
            color: '#1d4ed8',
            fontSize: '1.25rem',
            fontWeight: 600,
          }}
      >
        {getPatientName().split(' ').map(name => name.toUpperCase()[0]).join('')|| 'P'}
      </Avatar>

          <div className= "min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500"> Patient Profile</p>
      <h1 className = "mt-1 truncate text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">{patientId? getPatientName() : 'Patient Details'}</h1>

      {patientId &&  (
        <p className = "mt-1 text-sm text-slate-500"> Patient ID: {patientId}</p>
      )}
      </div>
      </div>

      <div className = "flex items-center justify-between gap-3 sm:justify-end">
        <div className = "flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
          <div className = "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-500">
            <RefreshIcon fontSize="small" />
          </div>
      <div>
        <p className="text-xs font-medium text-slate-500">Data refreshed </p>
      <p className = "text-sm font-semibold tabular-nums text-slate-700">{timestamp}</p>
      
      </div>
      <IconButton aria-label="refresh" onClick={() => setTimestamp(new Date().toLocaleTimeString())}>
        <RefreshIcon />
      </IconButton>
        </div>
      {/* Menu set up with help from Material UI Docs */}
      <IconButton aria-label="more" onClick={(event) => setAnchorEl(event.currentTarget)}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => { setAnchorEl(null); handleEditPatient(); }}>Edit Patient</MenuItem>
        <MenuItem onClick={() => { setAnchorEl(null); handleDeletePatient(); }}>Delete Patient</MenuItem>
      </Menu>
      </div>
      </div>
      </section>
      <Outlet context={ [patient ,loading, patientObservations] } />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Patient deleted successfully
        </Alert>
      </Snackbar>
    </main>
  );
}

export default PatientLayout;
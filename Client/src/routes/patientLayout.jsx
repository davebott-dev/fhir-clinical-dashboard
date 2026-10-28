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
      <div className="mb-8 flex flex-row items-center gap-4">
      <Avatar/>     
      {patientId && <p>{getPatientName()}</p>}
      <span>Data refreshed at: {timestamp}</span>
      <IconButton aria-label="refresh" onClick={() => setTimestamp(new Date().toLocaleTimeString())}>
        <RefreshIcon />
      </IconButton>
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
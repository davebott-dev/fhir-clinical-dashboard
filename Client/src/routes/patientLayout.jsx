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
import AddCommentIcon from '@mui/icons-material/AddComment';
import NotesModal from '../components/notesModal.jsx';


function PatientLayout() {
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
// styled with Tailwind CSS with help of GenAI
  return (
    <main className ="min-h-screen bg-slate-50 px-4 pt-6 pb-28" >
    {/* Patient Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-blue-600" />

        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
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


      </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Patient Overview
            </p>

            <h1 className="mt-1 text-2xl font-bold text-slate-900">
            {getPatientName()}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Patient ID: {patientId}
            </p>
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
      <div className="mt-6">
      <Outlet context={ [patient] } />
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Patient deleted successfully
        </Alert>
      </Snackbar>
        {/* Patient Notes Button Specifications generated with help of GenAI */}
        <IconButton
          aria-label="Patient Notes"
          onClick={() => {handleOpenModal()}}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1300,
            width: 56,
            height: 56,
            backgroundColor: '#2563eb',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
          }}
        >
  <AddCommentIcon />
</IconButton>
          <NotesModal open={openModal} handleClose={handleCloseModal} patientId={patientId} />
    </main>
  );
}

export default PatientLayout;
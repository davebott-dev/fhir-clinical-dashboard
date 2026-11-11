import {useState,useEffect} from 'react';
import { useOutletContext } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MedicationModal from '../components/medicationModal';

function MedicationList() {
  const [patient] = useOutletContext();
  const [patientMedications, setPatientMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMedication, setSelectedMedication] = useState(null);  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

    // Pagination
    const paginatedMedications = patientMedications.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };``

    const handleEditMedication = () => {
      console.log('edit medication')
    }

    const handleDeleteMedication = () => {
      console.log('delete medication')
    }

    const getDate = (medication)=> {
    const date = medication?.authoredOn;
    if(!date) return 'N/A';
    const formattedDate = new Date(date).toLocaleDateString();
    return formattedDate;
  }

  return (
      <main className = "space-y-6 p-6">
      {loading ? <p>Loading...</p> : (
        <>
      {/* Medication List Header Section */}
      <section>
      <h1 className = "text-2xl font-bold text-slate-800">Medications</h1>
      <p className = "text-slate-600 mt-1 text-sm">Patient Medication List</p>
      </section>
      {/* Medication Summary Section */}
      <section className = "grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className = "text-sm font-medium text-slate-500">
          Total Results:
        </p>
        <h2 className = "mt-2 text-3xl font-bold text-slate-800">
        {patientMedications?.length}
        </h2>
        </div>
        <div className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className = "text-sm font-medium text-slate-500">
          Active Medications:
        </p>
        <h2 className = "mt-2 text-3xl font-bold text-slate-800">
        {patientMedications?.length > 0 ? getDate(patientMedications[patientMedications.length - 1]?.resource) : 'N/A'}
        </h2>
        </div>
          <div className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className = "text-sm font-medium text-slate-500">
          Inactive Medications:
        </p>
        <h2 className = "mt-2 text-3xl font-bold text-slate-800">
        {patientMedications?.length > 0 ? getDate(patientMedications[patientMedications.length - 1]?.resource) : 'N/A'}
        </h2>
        </div>
      </section>
      {/* Medication Table Search Bar and Add button */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
       <div className="w-full sm:max-w-md">
                <label
                    htmlFor="medication-search"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Search medications
                </label>

                <input
                    id="medication-search"
                    type="text"
                    placeholder="Search by medication name or code..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full border border-gray-300 bg-white rounded-lg px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        <IconButton color="primary" className ="!rounded-lg !bg-blue-600 !text-white hover:!bg-blue-700 !shadow-sm !p-2.5">
            <AddIcon onClick={handleOpen}/>
        </IconButton>
      </section>
    <section>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Medication Name</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Instructions</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Status</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Ordered By</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Date Prescribed</strong>
                            </TableCell>

                            <TableCell>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Loading medications...
                                </TableCell>
                            </TableRow>
                        ) : paginatedMedications.length > 0 ? (
                            paginatedMedications.map((entry) => {
                                const medication = entry.resource;

                                const medicationName =
                                    medication?.medicationCodeableConcept?.text ||
                                    medication?.code?.text ||
                                    'N/A';

                                const dosageInstructions =
                                    medication?.dosageInstruction?.[0]?.text || 
                                    'N/A';

                                const status =
                                    medication?.status ||
                                    'N/A';

                                const orderedBy =
                                    medication?.requester?.reference || 'N/A';

                                return (
                                    <TableRow key={medication.id}>
                                        <TableCell>
                                            {medicationName}
                                        </TableCell>

                                        <TableCell>
                                            {dosageInstructions}
                                        </TableCell>

                                        <TableCell>
                                            {status}
                                        </TableCell>

                                        <TableCell>
                                            {orderedBy}
                                        </TableCell>

                                        <TableCell>
                                            {getDate(medication)}
                                        </TableCell>

                                        <TableCell>
                                            <IconButton onClick={(event) => {
                                                setAnchorEl(event.currentTarget);
                                                setSelectedMedication(medication?.id); // store the selected medication
                                            }}>
                                                <MoreVertIcon />
                                            </IconButton>
                                              <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    onClose={() => setAnchorEl(null)}
                                                    elevation={1}
                                                    slotProps = {{
                                                        paper: {
                                                            sx: {
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                                                border: '1px solid #e0e0e0',
                                                                minWidth: '150px'
                                                            }
                                                        }
                                                    }}
                                                  >
                                                    <MenuItem onClick={() => { setAnchorEl(null); handleEditMedication(); }}>Edit Observation</MenuItem>
                                                    <MenuItem onClick={() => { setAnchorEl(null); handleDeleteMedication(selectedMedication); }}>Delete Observation</MenuItem>
                                                  </Menu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    {searchTerm
                                        ? 'No medications match your search.'
                                        : 'No medications found for this patient.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={paginatedMedications?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </TableContainer>
      </Paper>
    </section>
    </>)}
      <MedicationModal open={open} handleClose={handleClose} patientId={patient?.id}/>
    </main>
  );
}

export default MedicationList;
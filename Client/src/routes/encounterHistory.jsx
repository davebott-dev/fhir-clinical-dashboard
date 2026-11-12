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
import CircularProgress from '@mui/material/CircularProgress';
import EncounterModal from '../components/encounterModal';

function EncounterHistory() {
  const [patient] = useOutletContext();
  const [patientEncounters, setPatientEncounters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEncounter, setSelectedEncounter] = useState(null);  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(()=> {
        const fetchData = async() => {
          if(!patient?.id) return;
          setLoading(true);
      try{
          const response = await fetch(`https://hapi.fhir.org/baseR4/Encounter?patient=${patient?.id}`);
        if(!response.ok)  {
          throw new error (
            'unable to create new encounter'
          )
        }
        const data = await response.json();
        setPatientEncounters(data.entry ?? []);
      } catch (error) {
        console.error('Failed to fetch patient encounters:', error);
      } finally { 
        setLoading(false);
      }
    };
    fetchData();
  }, [patient?.id, open]);

    const sortedEncounters = [...patientEncounters].sort((a,b)=>{
      let date1 = new Date(a?.resource?.period?.start);
      let date2 = new Date(b?.resource?.period?.start);
      return date2-date1
  })

  // Filter encounters based on search term
   const filteredEncounters = sortedEncounters.filter((entry) => {
      const encounter = entry?.resource;
      const serviceProvider =
            encounter?.serviceProvider?.display || '';
      const reasonCode = encounter?.reasonCode?.[0]?.text;
        return (
            serviceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reasonCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

      // Pagination
    const paginatedEncounters = filteredEncounters.slice(
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

    const handleEditEncounter = () => {
      console.log('edit encounter')
    }

   const handleDeleteEncounter = async(encounterId) => {
      if (window.confirm('Are you sure you want to delete this encounter request?')) {
      try{
        await fetch(`https://hapi.fhir.org/baseR4/Encounter/${encounterId}`, {
          method: 'DELETE',
        });
        // Remove the deleted encounter from the state
        setPatientEncounters((prevEncounters) =>
          prevEncounters.filter((entry) => entry.resource.id !== encounterId)
        );
      } catch (error) {
        console.error('Error deleting observation:', error);
      }
    }
  };

    const handleCreatedEncounter = (newencounter) => {
      setPatientEncounter(curr=> [
        {resource: newencounter},
        ...curr //spread syntax to copy current content
      ]);
      setPage(0);
    }

    const getDate = (encounter)=> {
    const date = encounter?.period?.start;
    if(!date) return 'N/A';
    const formattedDate = new Date(date).toLocaleDateString();
    return formattedDate;
  }
  

  console.log(patientEncounters)
  return (
      <main className = "space-y-6 p-6">
        <>
      {/* Encounter List Header Section */}
      <section>
      <h1 className = "text-2xl font-bold text-slate-800">Encounters</h1>
      <p className = "text-slate-600 mt-1 text-sm">Patient Encounter History</p>
      </section>
      {/* Encounter Summary Section */}
      <section className = "grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className = "text-sm font-medium text-slate-500">
          Total Results:
        </p>
        <h2 className = "mt-2 text-3xl font-bold text-slate-800">
        {patientEncounters?.length}
        </h2>
        </div>
        <div className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className = "text-sm font-medium text-slate-500">
          Most Recent Encounter:
        </p>
        <h2 className = "mt-2 text-3xl font-bold text-slate-800">
        {getDate(sortedEncounters[0]?.resource)}
        </h2>
        </div>
 
      </section>
      {/* Encounter Table Search Bar and Add button */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
       <div className="w-full sm:max-w-md">
                <label
                    htmlFor="encounter-search"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Search encounters
                </label>

                <input
                    id="encounter-search"
                    type="text"
                    placeholder="Search by encounter name..."
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
                                <strong>Service Provider</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Description</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Status</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Type</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Length of Visit</strong>
                            </TableCell>

                            <TableCell>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress size={28}/>
                                    Loading encounters...
                                </TableCell>
                            </TableRow>
                        ) : paginatedEncounters.length > 0 ? (
                            paginatedEncounters.map((entry) => {
                                const encounter = entry.resource;

                                const serviceProvider =
                                    encounter?.serviceProvider?.display ||
                                    'N/A';

                                const description =
                                    encounter?.reasonCode?.[0]?.text || 
                                    'N/A';

                                const status =
                                    encounter?.status ||
                                    'N/A';

                                const type =
                                    encounter?.class?.display || 'N/A';

                                return (
                                    <TableRow key={encounter.id}>
                                        <TableCell>
                                            {serviceProvider}
                                        </TableCell>

                                        <TableCell>
                                            {description}
                                        </TableCell>

                                        <TableCell>
                                            {status}
                                        </TableCell>

                                        <TableCell>
                                            {type}
                                        </TableCell>

                                        <TableCell>
                                            {`${(new Date(encounter?.period?.end) - new Date(encounter?.period?.start))/(1000*60*60).toFixed(2)} hours`}
                                        </TableCell>

                                        <TableCell>
                                            <IconButton onClick={(event) => {
                                                setAnchorEl(event.currentTarget);
                                                setSelectedEncounter(encounter?.id); // store the selected encounter
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
                                                    <MenuItem onClick={() => { setAnchorEl(null); handleEditEncounter(); }}>Edit Encounter</MenuItem>
                                                    <MenuItem onClick={() => { setAnchorEl(null); handleDeleteEncounter(selectedEncounter); }}>Delete Encounter</MenuItem>
                                                  </Menu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    {searchTerm
                                        ? 'No encounter match your search.'
                                        : 'No encounter found for this patient.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={patientEncounters?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </TableContainer>
      </Paper>
    </section>
    </>
      <EncounterModal open={open} handleClose={handleClose} patientId={patient?.id} onEncounterCreated={handleCreatedEncounter}/>
    </main>
  );
}

export default EncounterHistory;
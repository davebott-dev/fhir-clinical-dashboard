import {useState, useEffect} from 'react';
import {useOutletContext} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';

function ObservationList() {
  const [patient] = useOutletContext();
  const [patientObservations, setPatientObservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading,setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  // Filter observations based on search term
   const filteredObservations = patientObservations.filter((entry) => {
      const observation = entry?.resource;
      const observationName =
            observation?.code?.coding?.[0]?.display || '';
      const loincCode =
            observation?.code?.coding?.[0]?.code || '';
        return (
            observationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loincCode.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

      // Pagination
    const paginatedObservations = filteredObservations.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

   useEffect(() => {
    setLoading(true);
    try{
      const fetchData = async () => {
        const response = await fetch(`https://hapi.fhir.org/baseR4/Observation?patient=${patient?.id}`);
        if(!response.ok) {
          throw new Error(`Failed to fetch patient observations: ${response.statusText}`);
        }
        const data = await response.json();
        setPatientObservations(data.entry ?? []);
      };
      fetchData();
    }catch(error){
      console.error('Error fetching patient observations:', error);
    } finally {
      setLoading(false);
    }
  }, [patient?.id]);

  const getDate = (observation)=> {
    const date = observation?.effectiveDateTime || observation?.effectivePeriod?.start || observation?.issued;
    if(!date) return 'N/A';
    const formattedDate = new Date(date).toLocaleDateString();
    return formattedDate;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };``

 
  return (
    <main className = "space-y-6 p-6">
      {loading ? <p>Loading...</p> : (
        <>
      {/* Observation Header Section */}
      <section>
      <h1 className = "text-2xl font-bold text-slate-800">Observations</h1>
      <p className = "text-slate-600 mt-1 text-sm">Patient Clinical Observations and Results</p>
      </section>
      {/* Observation Summary Section */}
      <section className = "grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className = "text-sm font-medium text-slate-500">
          Total Results:
        </p>
        <h2 className = "mt-2 text-3xl font-bold text-slate-800">
        {patientObservations?.length}
        </h2>
        </div>
        <div className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className = "text-sm font-medium text-slate-500">
          Last Updated:
        </p>
        <h2 className = "mt-2 text-3xl font-bold text-slate-800">
        {patientObservations?.length > 0 ? getDate(patientObservations[patientObservations.length - 1]?.resource) : 'N/A'}
        </h2>
        </div>
      </section>
      {/* Observation Table Search Bar */}
      <section>
       <div className="mb-5">
                <label
                    htmlFor="observation-search"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Search observations
                </label>

                <input
                    id="observation-search"
                    type="text"
                    placeholder="Search by observation name or LOINC code..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
      </section>
    <section>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <strong>Observation</strong>
                            </TableCell>

                            <TableCell>
                                <strong>LOINC Code</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Value</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Date</strong>
                            </TableCell>

                            <TableCell>
                                <strong>Status</strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Loading observations...
                                </TableCell>
                            </TableRow>
                        ) : paginatedObservations.length > 0 ? (
                            paginatedObservations.map((entry) => {
                                const observation = entry.resource;

                                const observationName =
                                    observation?.code?.coding?.[0]?.display ||
                                    observation?.code?.text ||
                                    'N/A';

                                const loincCode =
                                    observation?.code?.coding?.[0]?.code ||
                                    'N/A';

                                const value =
                                    observation?.valueQuantity?.value ??
                                    observation?.valueString ??
                                    observation?.valueCodeableConcept?.text ??
                                    'N/A';

                                const unit =
                                    observation?.valueQuantity?.unit || '';

                                const status =
                                    observation?.status || 'N/A';

                                return (
                                    <TableRow key={observation.id}>
                                        <TableCell>
                                            {observationName}
                                        </TableCell>

                                        <TableCell>
                                            {loincCode}
                                        </TableCell>

                                        <TableCell>
                                            {value} {unit}
                                        </TableCell>

                                        <TableCell>
                                            {getDate(observation)}
                                        </TableCell>

                                        <TableCell>
                                            {status}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    {searchTerm
                                        ? 'No observations match your search.'
                                        : 'No observations found for this patient.'}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={patientObservations?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        </TableContainer>
      </Paper>
    </section>
    </>)}
    </main>
  );
}

export default ObservationList;
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
  const [loading,setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


   useEffect(() => {
    setLoading(true);
    try{
      const fetchData = async () => {
        const response = await fetch(`https://hapi.fhir.org/baseR4/Observation?patient=${patient?.id}`);
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
         <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.5 3a5.5 5.5 0 103.446 9.787l3.634 3.633 1.414-1.414-3.633-3.634A5.5 5.5 0 008.5 3zM5 8.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"
                    clipRule="evenodd"
                  />
                </svg>
        <input
          type="text"
          placeholder="Search observations by observation name or LOINC code..."
          className="w-full p-2 border border-slate-200 rounded-lg"
        />
      </section>
    <section>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="left">Observation ID</TableCell>
                <TableCell align="left">Observation Name</TableCell>
                <TableCell align="left">LOINC Code</TableCell>
                <TableCell align="left">Value</TableCell>
                <TableCell align="left">Unit</TableCell>
                <TableCell align="left">Effective Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientObservations?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry) => {
                const observation = entry?.resource;
                return (
                  <TableRow key={observation?.id}>
                    <TableCell align="left">{observation?.id || 'N/A'}</TableCell>
                    <TableCell align="left">{observation?.code?.coding?.[0]?.display || 'N/A'}</TableCell>
                    <TableCell align="left">{observation?.code?.coding?.[0]?.code || 'N/A'}</TableCell>
                    <TableCell align="left">{observation?.valueQuantity?.value || 'N/A'}</TableCell>
                    <TableCell align="left">{observation?.valueQuantity?.unit || 'N/A'}</TableCell>
                    <TableCell align="left">{getDate(observation)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={patientObservations?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </section>
    </>)}
    </main>
  );
}

export default ObservationList;
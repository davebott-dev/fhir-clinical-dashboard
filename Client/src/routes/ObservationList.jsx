import {useState} from 'react';
import {useParams, useOutletContext} from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';

function ObservationList() {
  const [patient, loading, patientObservations] = useOutletContext();
  const observations = patientObservations??[];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  console.log(observations);

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
  };

  return (
    <main className = "space-y-6 p-6">
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
        {observations?.length}
        </h2>
        </div>
        <div className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className = "text-sm font-medium text-slate-500">
          Last Updated:
        </p>
        <h2 className = "mt-2 text-3xl font-bold text-slate-800">
        {observations?.length > 0 ? getDate(observations[observations.length - 1]?.resource) : 'N/A'}
        </h2>
        </div>
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
              {observations?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry) => {
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
          count={observations?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </section>
    </main>
  );
}

export default ObservationList;
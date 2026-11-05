import {useState} from 'react';
import {useParams, useOutletContext} from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function ObservationList() {
  const [patient, loading, patientObservations] = useOutletContext();
  const [expandedId, setExpandedId] = useState(null);
  const observations = patientObservations??[];

  const getDate = (observation)=> {
    const date = observation?.effectiveDateTime || observation?.effectivePeriod?.start || observation?.issued;
    if(!date) return 'N/A';
    const formattedDate = new Date(date).toLocaleDateString();
    return formattedDate;
  }

  const isNormal = (observation)=> {
    const interpretation = observation?.interpretation?.[0]?.coding?.[0]?.code;
    return interpretation === 'N' || interpretation === 'normal';
  }

  const isAbnormal = (observation)=> {
    const abnormalCodes = ['H', 'L', 'A', 'AA', 'HH', 'LL'];
    const interpretation = observation?.interpretation?.[0]?.coding?.[0]?.code;
    return abnormalCodes.includes(interpretation);
  }

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
 {patientObservations?.length}
        </h2>
        </div>
        <div className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className = "text-sm font-medium text-slate-500">
          Normal: 
        </p>
        <h2 className = "mt-2 text-3xl font-bold text-slate-800">
          {patientObservations?.filter(isNormal).length || 0}
        </h2>
        </div>
        <div className = "rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className = "text-sm font-medium text-slate-500">
          Abnormal: 
        </p>
        <h2 className = "mt-2 text-3xl font-bold text-slate-800">
          {patientObservations?.filter(isAbnormal).length || 0}
        </h2>
        </div>
      </section>
    <section>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Observation ID</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Reference Range</TableCell>
              <TableCell>Interpretation</TableCell>
              <TableCell>Effective Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patientObservations?.map((entry) => {
              const observation = entry?.resource;
              return (
                <TableRow key={observation?.id} aria-hidden={!open ? true: undefined}>
                   <TableCell>
                <IconButton onClick={() => setOpen(!open)}>
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
                  <TableCell>{observation?.id}</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A </TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>N/A</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
    </main>
  );
}

export default ObservationList;
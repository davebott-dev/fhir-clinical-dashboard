import { Link } from 'react-router-dom';


function Sidebar() {
  return (
    <div>
      <h2>Sidebar</h2>
      <ul>
        <li><Link to="/patientSearch">Patient Search</Link></li>
        <li><Link to="/patientOverview">Patient Overview</Link></li>
        <li><Link to="/observationList">Observation List</Link></li>
        <li><Link to="/medicationList">Medication List</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
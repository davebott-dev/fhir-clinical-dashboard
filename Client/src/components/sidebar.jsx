import { NavLink } from 'react-router-dom';


function Sidebar() {
  return (
    <aside className = "flex min-h-screen w-full shrink-0 flex-col bg-slate-950 p-5 text-white md:w-64">
      <div className ="mb-10 flex items-center gap-3 px-2 pt-2">
        <div className = "flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold shadow-lg shadow-indigo 950/30">
          F
        </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white">FHIR Clinical Dashboard</h2>
            <p className="mt-0.5 text-xs text-slate-400">Clinical Workspace</p>
          </div>
      </div>
      <p className = "mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Workspace
      </p>
      <nav className = "flex flex-col gap-2">
        <NavLink to="/">
          <span className="text-lg">🏠</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/patientSearch">
          <span className="text-lg">🔎</span>
          <span>Patient Search</span>
        </NavLink>
        
        <NavLink to="/patientOverview" >
          <span className="text-lg">👁️</span>
          <span>Patient Overview</span>
        </NavLink>

        <NavLink to="/observationList">
          <span className="text-lg">📊</span>
          <span>Observation List</span>
        </NavLink>

        <NavLink to="/medicationList">
          <span className="text-lg">💊</span>
          <span>Medication List</span>
        </NavLink>

        <NavLink to="/encounterHistory">
          <span className="text-lg">📅</span>
          <span>Encounter History</span>
        </NavLink>

      </nav>

      <div className ="mt-auto pt-8">
        <div className = "rounded-xl border border-white/10 bg-white/5 p-4">
        <p className = "text-sm font-medium text-white">Development Environment</p>
        <p className = "mt-1 text-xs leading-5 text-slate-400">Connected to FHIR Server</p>
        <div className = "mt-3 flex items-center gap-2">
          <div className = "h-2 w-2 rounded-full bg-green-500"></div>
          <span className = "text-xs text-slate-400">Online</span>
        </div>
        </div>
        <p className = "mt-5 px-2 text-xs text-slate-400">FHIR Clinical Dashboard</p>
      </div>
       
    </aside>
  );
}

export default Sidebar;
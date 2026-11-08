import { NavLink, useMatch} from 'react-router-dom';

function Sidebar() {
  const patientOverviewMatch = useMatch("/patient/:route/:patientId");
  const patientId= patientOverviewMatch?.params?.patientId; // Extract the patientId from the URL parameters using useMatch



  return (
    <aside className = "flex min-h-screen w-full shrink-0 flex-col bg-slate-950 p-5 text-white md:w-64">
      <div className="mb-5 flex items-center gap-3 px-2 pt-2">
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
      <nav className="flex flex-col gap-0.5">
        <NavLink to="/" 
            className={({ isActive }) => //built in navlink isActive prop determines if the link is active
  `flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800/60"
  }`
}
          >
          <span className="text-sm">🏠</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/patient_search" 
          className={({ isActive }) =>
  `flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800/60"
  }`
}
          >
          <span className="text-sm">🔎</span>
          <span>Patient Search</span>
        </NavLink>
        <NavLink to="/create_patient" 
          className={({ isActive }) =>
  `flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800/60"
  }`
}
          >
          <span className="text-sm">➕</span>
          <span>Create Patient</span>
        </NavLink>
        
        {patientOverviewMatch && (
          <>
          <NavLink to={`/patient/overview/${patientId}`} 
            className={({ isActive }) =>
  `flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800/60"
  }`
}
            >
            <span className="text-sm">👁️</span>
            <span>Patient Overview</span>
          </NavLink>
        

        <NavLink to={`/patient/observations/${patientId}`} 
          className={({ isActive }) =>
  `flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800/60"
  }`
}
          >
          <span className="text-sm">📊</span>
          <span>Observation List</span>
        </NavLink>

        <NavLink to={`/patient/medication-list/${patientId}`} 
          className={({ isActive }) =>
  `flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800/60"
  }`
}
          >
          <span className="text-sm">💊</span>
          <span>Medication List</span>
        </NavLink>

        <NavLink to={`/patient/encounter-history/${patientId}`} 
          className={({ isActive }) =>
  `flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800/60"
  }`
}
          >
          <span className="text-sm">📅</span>
          <span>Encounter History</span>
        </NavLink>

        <NavLink to={`/patient/files/${patientId}`}
          className={({ isActive }) =>
  `flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800/60"
  }`
}
          >
          <span className="text-sm">📁</span>
          <span>Patient Files</span>
        </NavLink>
        </>
        )}
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
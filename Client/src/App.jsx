import {useState, useEffect} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';

// Main application component that will render the sidebar and the main content area based on the current route

function App() {

  const location = useLocation(); // Get the current location object from react-router-dom
  const hideNavbarRoutes = ['/','/patient_search', '/create_patient']; // Define the routes where the Navbar should be hidden
  const showNavbar = !hideNavbarRoutes.includes(location.pathname) // Determine whether to show the Navbar based on the current route
  const [selectedProvider, setSelectedProvider] = useState(sessionStorage.getItem("selectedProvider")|| ""); // initialize variable by seeing if a variable exists in session first
  const [loadPractitioners, setLoadPractitioners] = useState(false);
  const [practitioners, setPractitioners] = useState([]);

  useEffect(()=> {
    setLoadPractitioners(true);
    const fetchProviders = async()=>{
       try{
        const response = await fetch('https://hapi.fhir.org/baseR4/Practitioner');
         if(!response.ok){
           throw new Error (
                'error fetching practitioners'
               )
          }
                const data = await response.json();
                setPractitioners(data.entry)

                console.log('providers', data.entry)
            } catch(error) {
                console.error('error fetching providers', error);
            }finally{
                setLoadPractitioners(false);
            }
        }
        fetchProviders();
    },[]);

  const handleProviderSelection = (e) => {
    setSelectedProvider(e.target.value);
    sessionStorage.setItem("selectedProvider", e.target.value); // store value in session state so it persists through page reloads
  }

  // tailwind css generated with help of GenAI
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
    {selectedProvider ? (
      <>
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-6">
          {showNavbar && (
          <header className="mb-4 shrink-0">
          <Navbar />
        </header>
          )}
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-8">
        <Outlet /> { /* Allows rendering of child routes based on the current route */ }
     </div>
      </main> 
      </>
    ):(
       <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Select a Provider
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Choose a provider to continue to the patient dashboard.
                    </p>

                    <select className="mt-5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      onChange= {handleProviderSelection}
                      value = {selectedProvider}
                    >
                        <option value="">Select a provider</option>
                        {practitioners.filter(el=>el.resource?.name?.[0]?.given[0]).map((practitioner)=> {
                                        const resource = practitioner.resource;
                                        return(
                                            <option value = {resource.id} key={resource.id}>
                                                {resource.name?.[0].given[0]} {resource.name?.[0].family} - {resource.qualification?.[0]?.code?.text || 'role unavailable'}
                                            </option>
                                        )
                                    })}
                    </select>
      </div>
      </div>
)}
    </div>
  )
}

export default App;

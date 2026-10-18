import {Outlet, useLocation} from 'react-router-dom';
import Sidebar from './components/sidebar';
import Navbar from './components/navbar';

// Main application component that will render the sidebar and the main content area based on the current route

function App() {

  const location = useLocation(); // Get the current location object from react-router-dom
  const hideNavbarRoutes = ['/','/patientSearch']; // Define the routes where the Navbar should be hidden

  const showNavbar = !hideNavbarRoutes.includes(location.pathname) // Determine whether to show the Navbar based on the current route

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        
        <header className="mb-4">
          <div>
          {showNavbar && <Navbar />}
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
        <Outlet /> { /* Allows rendering of child routes based on the current route */ }
     </div>
      </main>

    </div>
  )
}

export default App;

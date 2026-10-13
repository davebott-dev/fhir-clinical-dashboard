import {Outlet} from 'react-router-dom';
import Sidebar from './components/sidebar';

// Main application component that will render the sidebar and the main content area based on the current route

function App() {


  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet /> { /* Allows rendering of child routes based on the current route */ }
      </main>

    </div>
  )
}

export default App;

import {Outlet} from 'react-router-dom';
import Sidebar from './components/sidebar';
import './App.css';

// Main application component that will render the sidebar and the main content area based on the current route

function App() {


  return (
    <>
      <Sidebar />
      <Outlet /> { /* Allows rendering of child routes based on the current route */ }

    </>
  )
}

export default App;

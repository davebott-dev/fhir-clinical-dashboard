import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App.jsx';
import PatientSearch from './routes/patientSearch.jsx';
import PatientOverview from './routes/patientOverview.jsx';
import ObservationList from './routes/observationList.jsx';
import MedicationList from './routes/medicationList.jsx';
import EncounterHistory from './routes/encounterHistory.jsx';
import Index from './routes/index.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />
      },
      {
        path: 'patientSearch',
        element: <PatientSearch />
      },
      {
        path: 'patientOverview',
        element: <PatientOverview />
      },
      {
        path: 'observationList',
        element: <ObservationList />
      },
      {
        path: 'medicationList',
        element: <MedicationList />
      },
      {
        path: 'encounterHistory',
        element: <EncounterHistory />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

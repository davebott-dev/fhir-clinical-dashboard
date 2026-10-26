import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import App from './App.jsx';
import PatientSearch from './routes/patientSearch.jsx';
import PatientOverview from './routes/patientOverview.jsx';
import ObservationList from './routes/observationList.jsx';
import MedicationList from './routes/medicationList.jsx';
import EncounterHistory from './routes/encounterHistory.jsx';
import SearchResults from './routes/searchResults.jsx';
import PatientLayout from './routes/patientLayout.jsx';
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
        path: 'patientOverview/:patientId',
        element: <PatientOverview />
      },
      {
        path: 'observationList/:patientId',
        element: <ObservationList />
      },
      {
        path: 'medicationList/:patientId',
        element: <MedicationList />
      },
      {
        path: 'encounterHistory/:patientId',
        element: <EncounterHistory />
      },
      {
        path: 'searchResults',
        element: <SearchResults />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

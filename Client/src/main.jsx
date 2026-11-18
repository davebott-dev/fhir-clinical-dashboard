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
import CreatePatient from './routes/createPatient.jsx';
import PatientFiles from './routes/patientFiles.jsx';
import EncounterDetail from './routes/encounterDetail.jsx';
import MedicationDetail from './routes/medicationDetail.jsx';
import ObservationDetail from './routes/observationDetail.jsx';

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
        path: 'patient_search',
        element: <PatientSearch />
      },
      {
        path: 'create_patient',
        element: <CreatePatient />
      },
        {
        path: 'search_results',
        element: <SearchResults />
      },
      {
        path: 'patient',
        element: <PatientLayout />,
        children: [
          {
        path: ':patientId/overview',
        element: <PatientOverview />
      },
      {
        path: ':patientId/observations',
        element: <ObservationList />
      },
      {
        path: ':patientId/medication-list',
        element: <MedicationList />
      },
      {
        path: ':patientId/encounter-history',
        element: <EncounterHistory />
      },
      {
        path: ':patientId/files',
        element: <PatientFiles />
      },
      {
        path: ':patientId/observation-detail/:observationId',
        element: <ObservationDetail/>
      },
       {
        path: ':patientId/medication-request-detail/:medicationRequestId',
        element: <MedicationDetail/>
      },
       {
        path: ':patientId/encounter-detail/:encounterId',
        element: <EncounterDetail/>
      }
        ]
      }
      
    
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

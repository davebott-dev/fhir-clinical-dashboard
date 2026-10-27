import {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

function SearchResults(){
    const [page, setPage] = useState(1); // State to manage the current page for pagination

    const location = useLocation();
    const navigate = useNavigate();
    const {patientData} = location.state || {}; // Access the passed patient data from the state
    const entries = patientData?.entry || []; // Safely access the entry array from patientData using optional chaining
    const entriesPerPage = 10; // Define how many entries to show per page
    const totalPages = Math.ceil(entries.length/entriesPerPage); // Calculate total pages based on entries and entries per page
    const paginatedEntries = entries.slice((page-1)*entriesPerPage, page*entriesPerPage); // Slice the entries array to get only the entries for the current page use array slice method

    const handlePageChange = (e,value) => {
        setPage(value); // Update the current page state when the pagination control is used
    }
  
    // use of optional chaining (?.) seen below is important to avoid errors in accessing and rendering patient data
    // tailwindcss generated with help of generative AI, and then modified to fit the design of the application.
  return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Page Header */}
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Clinical Dashboard
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Patient Search Results
                    </h1>

                    <p className="mt-2 text-base text-slate-500">
                        Review patient information retrieved from the FHIR server.
                    </p>
                </div>

                {/* Results Summary */}
                <div className="mb-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            Search Results
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {entries.length}{' '}
                            {entries.length === 1 ? 'patient' : 'patients'} found
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        ← Back to Search
                    </button>
                </div>

                {/* Patient Results */}
                {entries.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {paginatedEntries.map((patient, index) => {
                            const resource = patient.resource;
                            const name = resource?.name?.[0];

                            const fullName = [
                                ...(name?.given || []),
                                name?.family
                            ]
                                .filter(Boolean)
                                .join(' ');

                            const initials = [
                                name?.given?.[0]?.[0],
                                name?.family?.[0]
                            ]
                                .filter(Boolean)
                                .join('')
                                .toUpperCase();

                            return (
                                <div
                                    key={resource?.id || index}
                                    className="cursor-pointer group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
                                    onClick={()=> navigate(`/patient/overview/${resource?.id}`, {state: {patientResource: resource}})}
                                >
                                    {/* Card Header */}
                                    <div className="flex items-center gap-4">
                                        <Avatar
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                bgcolor: '#dbeafe',
                                                color: '#1d4ed8',
                                                fontWeight: 700,
                                                fontSize: '1.1rem'
                                            }}
                                        >
                                            {initials || '?'}
                                        </Avatar>

                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-lg font-semibold text-slate-900">
                                                {fullName || 'Name unavailable'}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                Patient {index + 1}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                            FHIR
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="my-5 border-t border-slate-100" />

                                    {/* Patient Details */}
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="text-sm text-slate-500">
                                                Patient ID
                                            </span>
                                            <span className="break-all text-right text-sm font-medium text-slate-800">
                                                {resource?.id || 'Not available'}
                                            </span>
                                        </div>

                                        <div className="flex items-start justify-between gap-4">
                                            <span className="text-sm text-slate-500">
                                                Gender
                                            </span>
                                            <span className="text-right text-sm font-medium capitalize text-slate-800">
                                                {resource?.gender || 'Not available'}
                                            </span>
                                        </div>

                                        <div className="flex items-start justify-between gap-4">
                                            <span className="text-sm text-slate-500">
                                                Birth Date
                                            </span>
                                            <span className="text-right text-sm font-medium text-slate-800">
                                                {resource?.birthDate || 'Not available'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="mt-6 border-t border-slate-100 pt-4">
                                        <p className="text-xs text-slate-400">
                                            Source: FHIR Patient Resource
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                            🔍
                        </div>

                        <h2 className="text-lg font-semibold text-slate-800">
                            No patients found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            No patient records were returned. Try another search
                            or return to the patient search page.
                        </p>

                        <button
                            onClick={() => navigate(-1)}
                            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Back to Search
                        </button>
                    </div>
                )}
            </div>

               <Stack spacing={2} className="mt-6 flex items-center justify-center">
                                        <Pagination
                                            count={totalPages}
                                            page={page}
                                            onChange={handlePageChange}
                                            variant="outlined"
                                            shape="rounded"
                                        />
                                    </Stack>
        </div>
    );
}


export default SearchResults;
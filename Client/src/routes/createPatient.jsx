import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar'; 
import Alert from '@mui/material/Alert';

 const inputClass =
'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder outline-none transition focus focus focus';

const labelClass =
'block text-sm font-medium text-slate-700';

function CreatePatient() {
    const [patientId, setPatientId] = useState(crypto.randomUUID()); // Generate a unique patient ID initially
    const [patientFirst, setPatientFirst] = useState('');
    const [patientLast, setPatientLast] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientGender, setPatientGender] = useState('');
    const [patientBirthDate, setPatientBirthDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate(); // Initialize the useNavigate hook for programmatic navigation

    const createNewPatient = async(e) => {
        e.preventDefault(); // Prevent default form submission behavior
        
        setLoading(true); //Set Loading state to true before making the API call
        setError(null); //Clear any previous errors before making the API call
        
        try{
            const response = await fetch('https://hapi.fhir.org/baseR4/Patient', {
                method: 'POST', // POST request to create a new patient
                headers: {
                    'Content-Type': 'application/fhir+json'
                },
                body: JSON.stringify({
                    active: true,
                    birthDate: patientBirthDate,
                    gender: patientGender,
                    id: patientId, // Use the generated patient ID
                    resourceType: 'Patient',
                    name: [
                        {
                            given: [patientFirst],
                            family: patientLast,
                            use: 'official'
                        }
                    ],
                    telecom: [
                        {
                            system: 'email',
                            value: patientEmail
                        }
                    ]
                })
            });
            if(response.ok) {
                setOpen(true); // Show the success Snackbar
                setTimeout(() => { //delay navigation to allow snackbar to be seen
                    navigate(`/patient/overview/${patientId}`) // access same patient profile using the generated patient ID
                }, 3000); // 3-second delay
            } else {
                throw new Error(`Failed to create patient: ${response.statusText}`);
            }
        } catch (err) {
            setError(err.message);
            setOpen(true); // Show the error Snackbar
        } finally {
            setLoading(false);
        }
    };
    
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
       <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8 lg:px-12">
<div className="mx-auto max-w-6xl">

    {/* Page heading */}
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-700">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a2 2 0 114 0 2 2 0 01-4 0zm-3 7a5 5 0 0110 0H5z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        FHIR Clinical Dashboard
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Create Patient
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
        Create a new patient by entering their details below. 
        You can provide first name, last name, email, 
        gender, and date of birth.
      </p>
    </div>

    {/* create form card */}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-8">
        <h2 className="text-lg font-semibold text-slate-900">
          Patient Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the patient details below.
        </p>
      </div>

      <form onSubmit={createNewPatient} className="p-5 sm:p-8">

        {/* Form fields */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <label htmlFor="patientFirst" className={labelClass}>
              First Name
            </label>
            <input
              type="text"
              id="patientFirst"
              value={patientFirst}
              onChange={(e) => setPatientFirst(e.target.value)}
              placeholder="Enter first name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="patientLast" className={labelClass}>
              Last Name
            </label>
            <input
              type="text"
              id="patientLast"
              value={patientLast}
              onChange={(e) => setPatientLast(e.target.value)}
              placeholder="Enter last name"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="patientEmail" className={labelClass}>
              Email
            </label>
            <input
              type="email"
              id="patientEmail"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="name@example.com"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="patientGender" className={labelClass}>
              Gender
            </label>
            <select
              id="patientGender"
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              className={inputClass}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="patientBirthDate" className={labelClass}>
              Date of Birth
            </label>
            <input
              type="date"
              id="patientBirthDate"
              value={patientBirthDate}
              onChange={(e) => setPatientBirthDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Form actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Creating...
              </>
            ) : (
              <>
                + Create Patient
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  </div>
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={handleCloseSnackbar}
  >
    <Alert
      onClose={handleCloseSnackbar}
      severity={error ? 'error' : 'success'}
      variant="filled"
      sx={{ width: '100%' }}
    >
      {error ? error : 'Patient created successfully!'}
    </Alert>
  </Snackbar>
</main>
    );
}

export default CreatePatient;
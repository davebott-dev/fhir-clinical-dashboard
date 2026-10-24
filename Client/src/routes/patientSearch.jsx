import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PatientSearch() {
  const [data, setData] = useState(null);
  const [patientId, setPatientId] = useState('');
  const [patientFirst, setPatientFirst] = useState('');
  const [patientLast, setPatientLast] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientResourceType, setPatientResourceType] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientBirthDate, setPatientBirthDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let navigate = useNavigate();

  //tailwind css and svg tags created with help of generative AI
  
  const inputClass =
'mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder outline-none transition focus focus focus';

const labelClass =
'block text-sm font-medium text-slate-700';

 // Basic React code for fetch and displaying patient data to test fhir client

 // Function to fetch patient data from FHIR server based on patient ID
  const fetchPatientData = async(e) => {
    e.preventDefault(); // Prevent the default form submission behavior;

    setLoading(true); // Set loading state to true while fetching data
    setError(null); // Reset any previous error messages

    // Construct the query string based on the provided patient details
    let queryString = '';
    if(patientGender){
      queryString += `gender=${patientGender}&`;
    }
    if(patientBirthDate){
      queryString += `birthdate=${patientBirthDate}&`;
    }
    if(patientFirst){
      queryString += `name=${patientFirst}&`;
    }
    if(patientLast){
      queryString += `family=${patientLast}&`;
    }
    if(patientEmail){
      queryString += `email=${patientEmail}&`;
    }
    if(patientResourceType){
      queryString += `resourceType=${patientResourceType}&`;
    }
    if(patientId){
      queryString += `_id=${patientId}`;
    }

    try {
      console.log(`Fetching patient data with query: ${queryString}`);
      const response = await fetch(`https://hapi.fhir.org/baseR4/Patient/_search?${queryString}`, 
        {
          method: 'GET', //get request
          headers: {
            'Content-Type': 'application/fhir+json' //set the content type for FHIR JSON data
          }
        }
      );
    const patient_data = await response.json();
    console.log(patient_data);
    if(response.ok) { //check if the response is successful
      setData(patient_data); //store data in Data state defined above
      navigate('/searchResults', { state: { patientData: patient_data } }); //navigate to search results page with the fetched data
    } else {
      console.error('Error fetching patient data:', patient_data);
    }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  }

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
        Patient Search
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
        Search the FHIR server for a patient by entering their details below. 
        You can search by patient ID, first name, last name, email, resource type, 
        gender, and date of birth.
      </p>
    </div>

    {/* Search form card */}
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-8">
        <h2 className="text-lg font-semibold text-slate-900">
          Patient Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the patient details below.
        </p>
      </div>

      <form onSubmit={fetchPatientData} className="p-5 sm:p-8">

        {/* Form fields */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <label htmlFor="patientId" className={labelClass}>
              Patient Resource ID 
            </label>
            <input
              type="text"
              id="patientId"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. 123"
              className={inputClass}
            />
          </div>

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
            <label htmlFor="patientResourceType" className={labelClass}>
              Resource Type
            </label>
            <select
              id="patientResourceType"
              value={patientResourceType}
              onChange={(e) => setPatientResourceType(e.target.value)}
              className={inputClass}
            >
              <option value="Patient">Patient</option>
            </select>
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
              <option value="other">Other</option>
              <option value="unknown">Unknown</option>
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
          <p className="text-xs text-slate-500">
            * Patient resource ID is required for this search.
          </p>

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
                Searching...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.5 3a5.5 5.5 0 103.446 9.787l3.634 3.633 1.414-1.414-3.633-3.634A5.5 5.5 0 008.5 3zM5 8.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Search Patient
              </>
            )}
          </button>
        </div>
      </form>
    </section>

    {/* Patient results */}
    {/* {data && (
      <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-8">
          <h2 className="text-lg font-semibold text-slate-900">
            Patient Record
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            FHIR resource returned by the server.
          </p>
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Record retrieved
            </span>
            <span className="text-sm text-slate-500">
              Resource type: {data.resourceType || 'Unknown'}
            </span>
            <span className="text-sm text-slate-500">
              ID: {data.id || 'Unknown'}
            </span>
          </div>

          <pre className="max-h-[32rem] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-green-300 sm:p-6">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </section>
    )} */}
  </div>
</main>


  )
}

export default PatientSearch;

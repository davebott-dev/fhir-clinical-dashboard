import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar'; 
import Alert from '@mui/material/Alert';

function CreatePatient() {
    const [patientFirst, setPatientFirst] = useState('');
    const [patientLast, setPatientLast] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientGender, setPatientGender] = useState('');
    const [patientBirthDate, setPatientBirthDate] = useState('');
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("US");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [preferredLanguage, setPreferredLanguage] = useState("");
    const [ethnicity, setEthnicity] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate(); // Initialize the useNavigate hook for programmatic navigation

     const inputClass =
    'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition duration-150 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100';

    const labelClass =
    'block text-sm font-semibold text-slate-700';

    const languageOptions = [
    { code: "en-US", name: "English (United States)" },
    { code: "es", name: "Spanish" },
    { code: "ar", name: "Arabic" },
    { code: "am", name: "Amharic" },
    { code: "bn", name: "Bengali" },
    { code: "zh-Hans", name: "Chinese (Simplified)" },
    { code: "zh-Hant", name: "Chinese (Traditional)" },
    { code: "yue", name: "Cantonese" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "gu", name: "Gujarati" },
    { code: "ht", name: "Haitian Creole" },
    { code: "he", name: "Hebrew" },
    { code: "hi", name: "Hindi" },
    { code: "hmn", name: "Hmong" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ne", name: "Nepali" },
    { code: "fa", name: "Persian (Farsi)" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "pa", name: "Punjabi" },
    { code: "ru", name: "Russian" },
    { code: "so", name: "Somali" },
    { code: "tl", name: "Tagalog" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "uk", name: "Ukrainian" },
    { code: "ur", name: "Urdu" },
    { code: "vi", name: "Vietnamese" }
];

const ethnicityOptions = [
  { code: "2135-2", name: "Hispanic or Latino" },
    { code: "2186-5", name: "Not Hispanic or Latino" }
];

    const usStates = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Alaska", abbreviation: "AK" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Hawaii", abbreviation: "HI" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" }
];

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
                    resourceType: 'Patient',
                    name: [
                        {
                            given: [patientFirst],
                            family: patientLast,
                            use: 'official'
                        }
                    ],
                    ...((phoneNumber || patientEmail) && {
                      telecom: [
                        ...(patientEmail ? [{
                            system: 'email',
                            value: patientEmail
                        }] : []),
                        ...(phoneNumber ? [{
                          system: "phone",
                          value:phoneNumber,
                          use: "mobile"
                        }] : [] )
                    ]
                }),
                    ...(streetAddress && {
                      address: [{
                        use: "home",
                        line: [
                          streetAddress
                        ],
                        city: city,
                        state:state,
                        postalCode: zipCode,
                        country:country
                      }]
                    }),
                    ...(preferredLanguage && {
                      communication: [{
                        language: {
                          coding: [{
                            system: "urn:ietf:bcp:47",
                            code: preferredLanguage,
                            display: languageOptions.find(language => language.code == preferredLanguage)?.name
                          }],
                          text: languageOptions.find(language => language.code == preferredLanguage)?.name
                        },
                        preferred: true
                      }]
                    }),
                    ...(ethnicity && {
                      extension: [{
                       url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity",
                        extension: [
                          {
                            url: "ombCategory",
                            valueCoding: {
                              system: "urn:oid:2.16.840.1.113883.6.238",
                              code: ethnicity,
                              display: ethnicityOptions.find( item => item.code === ethnicity)?.name
                            }
                          },
                          {
                            url: "text",
                            valueString: ethnicityOptions.find( item => item.code === ethnicity)?.name
                          }
                        ]
                      }]
                    })

                })
            });
            if(response.ok) {
              const data = await response.json();
              console.log(data)
              setOpen(true); // Show the success Snackbar
                setTimeout(() => { //delay navigation to allow snackbar to be seen
                    navigate(`/patient/${data?.id}/overview`) // access same patient profile using the generated patient ID
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

    // tailwind css generate with help from GenAI
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

      <form onSubmit={createNewPatient} className="space-y-8 p-5 sm:p-8">
        <section>
        {/* Form fields */}
        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Personal Information
                </h3>
              <p className="text-sm text-slate-500">
                    Basic patient identification and demographics
              </p>  
            </div>
            </div>
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

          <div>
            <label htmlFor="ethnicity" className={labelClass}>
              Ethnicity
            </label>
            <select
              id="ethnicity"
              value={ethnicity}
              onChange={(e) => setEthnicity(e.target.value)}
              className={inputClass}
            >
              <option value="">Select Ethnicity</option>
              {ethnicityOptions.map((ethnicity)=> {
                return(
                  <option key={ethnicity.code} value= {ethnicity.code}>
                    {ethnicity.name}
                  </option>
                )
              })}
              <option value="">Unknown</option>

            </select>
          </div>

          <div>
            <label htmlFor="preferred-language" className={labelClass}>
              Preferred Language
            </label>
            <select
              id="preferred-language"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value)}
              className={inputClass}
            >
              <option value="">Select Language</option>
              {languageOptions.map((language)=> {
                return(
                  <option key={language.code} value= {language.code}>
                    {language.name}
                  </option>
                )
              })}
            </select>
          </div>
          </div>
      </section>
      <section>
        <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <span className="text-lg">📞</span>
            </div>
             <div>
                <h3 className="text-base font-semibold text-slate-900">
                    Contact Information
                </h3>
                <p className="text-sm text-slate-500">
                    Patient contact details
                </p>
            </div>
        </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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
            <label htmlFor="phone-number" className={labelClass}>
              Phone Number
            </label>
            <input
              type="text"
              id="phone-number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="123-456-7890"
              className={inputClass}
            />
          </div>
          </div>
          </section>
          
          <section>
             <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <span className="text-lg">📍</span>
            </div>
            <div>
                <h3 className="text-base font-semibold text-slate-900">
                    Address Information
                </h3>
                <p className="text-sm text-slate-500">
                    Patient residential address
                </p>
            </div>
        </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="street-address" className={labelClass}>
              Street Address
            </label>
            <input
              type="text"
              id="street-address"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="123 example street"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Chapel Hill"
              className={inputClass}
            />
          </div>
         <div>
            <label htmlFor="state" className={labelClass}>
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputClass}
            >
              <option value="">Select a State</option>
              {usStates.map((state)=> {
                return(
                  <option key={state.abbreviation} value= {state.abbreviation}>
                    {state.name}
                  </option>
                )
              })}
            </select>
          </div>
          <div>
            <label htmlFor="zip-code" className={labelClass}>
              Zip Code
            </label>
            <input
              type="text"
              id="zip-code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="12345"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="country" className={labelClass}>
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
              disabled
            >
              <option value="">Select a Country</option>
              <option value="US">United States</option>
            </select>
          </div>
        </div>
        </section>

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
import {useState,useEffect} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function EditModal({ open, handleClose, resourceType, resourceId }) {
    const [resource, setResource] = useState({});
    const [loading,setLoading] =useState(false);
    // initialize update objects for each
    const [patientData, setPatientData] = useState({
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        ethnicity: '',
        preferredLanguage: '',
        email: '',
        phone: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
    });
    const [practitionerData, setPractitionerData] = useState({
    firstName: '',
    lastName: '',
    prefix: '',
    suffix: '',
    qualification: '',
    email: '',
    phone: '',
    active: true
});

const [encounterData, setEncounterData] = useState({
    status: '',
    encounterClass: '',
    serviceType: '',
    serviceProvider: '',
    startDate: '',
    endDate: '',
    reason: '',
    location: ''
});

const [medicationData, setMedicationData] = useState({
    medicationName: '',
    status: '',
    priority: '',
    dose: '',
    doseUnit: '',
    route: '',
    frequency: '',
    quantity: '',
    refills: '',
    validFrom: '',
    validUntil: '',
    reason: ''
});

const [observationData, setObservationData] = useState({
    name: '',
    loincCode: '',
    category: '',
    status: '',
    date: '',
    value: '',
    unit: '',
    interpretation: '',
    referenceRangeLow: '',
    referenceRangeHigh: '',
    notes: ''
});

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

    useEffect(()=> {
        setLoading(true);
        const fetchResource = async()=>{
            try{
                const response = await fetch(`https://hapi.fhir.org/baseR4/${resourceType}/${resourceId}`);
                if(!response.ok){
                    throw new Error (
                        `error fetching ${resourceType}`
                    )
                }
                const data = await response.json();
                setResource(data)
                console.log('data from edit modal', data)
                  switch (resourceType) {
                case "Patient": {
                    const ethnicityExtension = data.extension?.find(
                        ext => ext.url ===
                            "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity"
                    );

                    const ethnicityCode = ethnicityExtension?.extension?.find(
                        ext => ext.url === "ombCategory"
                    )?.valueCoding?.code;

                    const email = data.telecom?.find(
                        item => item.system === "email"
                    )?.value || "";

                    const phone = data.telecom?.find(
                        item => item.system === "phone"
                    )?.value || "";

                    setPatientData({
                        firstName: data.name?.[0]?.given?.[0] || "",
                        lastName: data.name?.[0]?.family || "",
                        birthDate: data.birthDate || "",
                        gender: data.gender || "",
                        ethnicity: ethnicityCode || "",
                        preferredLanguage:
                            data.communication?.[0]?.language?.coding?.[0]?.code || "",
                        email,
                        phone,
                        streetAddress: data.address?.[0]?.line?.[0] || "",
                        city: data.address?.[0]?.city || "",
                        state: data.address?.[0]?.state || "",
                        zipCode: data.address?.[0]?.postalCode || "",
                        country: data.address?.[0]?.country || "US"
                    });
                    break;
                }

                // Add the other resource mappings here
                case "Practitioner":
                    // setPractitionerData(...)
                    break;

                case "Encounter":
                    // setEncounterData(...)
                    break;

                case "MedicationRequest":
                    // setMedicationData(...)
                    break;

                case "Observation":
                    // setObservationData(...)
                    break;

                default:
                    console.warn("Unsupported resource type:", resourceType);
            }
            } catch(error) {
                console.error(`error fetching ${resourceType}`, error);
            }finally{
                setLoading(false);
            }
        }
        fetchResource();
    },[resourceId,resourceType])    

// tailwind css generated with help of GenAI
const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

const labelClass =
    "block text-sm font-semibold text-slate-700";

const sectionTitleClass =
    "mb-4 border-b border-slate-100 pb-3 text-base font-semibold text-slate-900";

    // resource types split up for readability
    const renderPatientFields = () => (
        <>
            <h3 className={sectionTitleClass}>Personal Information</h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label className={labelClass}>First Name</label>
                    <input 
                        type="text" 
                        className={inputClass} 
                        placeholder="First name" 
                        value={patientData.firstName}
                        onChange={(e,prev)=> setPatientData({...prev,
                            firstName:e.target.value
                        })}
                        />
                </div>

                <div>
                    <label className={labelClass}>Last Name</label>
                    <input 
                        type="text" 
                        className={inputClass} 
                        placeholder="Last name"
                        value = {patientData.lastName}
                        onChange={(e,prev)=> setPatientData({...prev,
                            lastName:e.target.value
                        })}
                        />
                </div>

                <div>
                    <label className={labelClass}>Date of Birth</label>
                    <input 
                        type="date" 
                        className={inputClass}
                        value = {patientData.birthDate}
                        onChange={(e,prev)=> setPatientData({...prev,
                            birthDate:e.target.value
                        })}
                    />
                </div>

                <div>
                    <label className={labelClass}>Gender</label>
                    <select 
                        className={inputClass} 
                        value ={patientData.gender}
                        onChange={(e,prev)=> setPatientData({...prev,
                            gender:e.target.value
                        })}
                        >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="unknown">Unknown</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Ethnicity</label>
                    <select 
                        className={inputClass}
                        value={patientData.ethnicity}
                        onChange={(e,prev)=> setPatientData({...prev,
                            ethnicity:e.target.value
                        })}
                        >
                        <option value="">Select ethnicity</option>
                        <option value="2135-2">Hispanic or Latino</option>
                        <option value="2186-5">Not Hispanic or Latino</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Preferred Language</label>
                    <select
                    className={inputClass} 
                        placeholder="Preferred language"
                        value ={patientData.preferredLanguage}
                        onChange={(e,prev)=> setPatientData({...prev,
                            preferredLanguage:e.target.value
                        })}
                    >   
                        <option value="">Select a Language</option>
                        {languageOptions.map((language) => {
                            return(
                                <option value={language.code}>
                                    {language.name}
                                </option>
                            )
                        })}
                        </select>
                </div>
            </div>

            <h3 className={`${sectionTitleClass} mt-8`}>Contact Information</h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label className={labelClass}>Email</label>
                    <input 
                        type="email" 
                        className={inputClass} 
                        placeholder="Email address"
                        value ={patientData.email}
                        onChange={(e,prev)=> setPatientData({...prev,
                            email:e.target.value
                        })}
                        />
                </div>

                <div>
                    <label className={labelClass}>Phone Number</label>
                    <input 
                        type="tel" 
                        className={inputClass} 
                        placeholder="Phone number"
                        value = {patientData.phone}
                        onChange={(e,prev)=> setPatientData({...prev,
                            phone:e.target.value
                        })}
                        />
                </div>
            </div>

            <h3 className={`${sectionTitleClass} mt-8`}>Address Information</h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className={labelClass}>Street Address</label>
                    <input 
                        type="text" 
                        className={inputClass} 
                        placeholder="Street address"
                        value = {patientData.streetAddress}
                        onChange={(e,prev)=> setPatientData({...prev,
                            streetAddress:e.target.value
                        })}
                        />
                </div>

                <div>
                    <label className={labelClass}>City</label>
                    <input 
                        type="text" 
                        className={inputClass} 
                        placeholder="City"
                        value = {patientData.city}
                        onChange={(e,prev)=> setPatientData({...prev,
                            city:e.target.value
                        })}
                        />
                </div>

                <div>
                    <label className={labelClass}>State</label>
                    <select 
                        className={inputClass} 
                        value={patientData.state}
                        onChange={(e,prev)=> setPatientData({...prev,
                            state:e.target.value
                        })}
                        >
                    <option value="">Select a State</option>
                    {usStates.map((state)=> {
                        return(
                            <option value={state.abbreviation}>
                                {state.name}
                            </option>
                        )
                    })}
                        </select>
                </div>

                <div>
                    <label className={labelClass}>ZIP Code</label>
                    <input 
                        type="text" 
                        className={inputClass} 
                        placeholder="ZIP code"
                        value = {patientData.zipCode}
                        onChange={(e,prev)=> setPatientData({...prev,
                            zipCode:e.target.value
                        })}
                        />
                </div>

                <div>
                    <label className={labelClass}>Country</label>
                    <input 
                        type="text" 
                        className={inputClass} 
                        placeholder="Country"
                        value ={patientData.country}
                        onChange={(e,prev)=> setPatientData({...prev,
                            country:e.target.value
                        })}
                        />
                </div>
            </div>
        </>
    );

    const renderPractitionerFields = () => (
        <>
            <h3 className={sectionTitleClass}>Practitioner Information</h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label className={labelClass}>First Name</label>
                    <input type="text" className={inputClass} placeholder="First name" />
                </div>

                <div>
                    <label className={labelClass}>Last Name</label>
                    <input type="text" className={inputClass} placeholder="Last name" />
                </div>

                <div>
                    <label className={labelClass}>Prefix</label>
                    <input type="text" className={inputClass} placeholder="Dr., Mr., Ms." />
                </div>

                <div>
                    <label className={labelClass}>Suffix</label>
                    <input type="text" className={inputClass} placeholder="MD, DO, NP, etc." />
                </div>

                <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" className={inputClass} placeholder="Email address" />
                </div>

                <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="tel" className={inputClass} placeholder="Phone number" />
                </div>

                <div>
                    <label className={labelClass}>Active Status</label>
                    <select className={inputClass}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>
            </div>
        </>
    );

    const renderEncounterFields = () => (
        <>
            <h3 className={sectionTitleClass}>Encounter Information</h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                    <label className={labelClass}>Status</label>
                    <select className={inputClass}>
                        <option value="">Select status</option>
                        <option value="planned">Planned</option>
                        <option value="arrived">Arrived</option>
                        <option value="triaged">Triaged</option>
                        <option value="in-progress">In Progress</option>
                        <option value="onleave">On Leave</option>
                        <option value="finished">Finished</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Class</label>
                    <select className={inputClass}>
                        <option value="">Select class</option>
                        <option value="AMB">Ambulatory</option>
                        <option value="EMER">Emergency</option>
                        <option value="IMP">Inpatient</option>
                        <option value="VR">Virtual</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Service Type</label>
                    <input type="text" className={inputClass} placeholder="Service type" />
                </div>

                <div>
                    <label className={labelClass}>Service Provider</label>
                    <input type="text" className={inputClass} placeholder="Organization" />
                </div>

                <div>
                    <label className={labelClass}>Start Date/Time</label>
                    <input type="datetime-local" className={inputClass} />
                </div>

                <div>
                    <label className={labelClass}>End Date/Time</label>
                    <input type="datetime-local" className={inputClass} />
                </div>

                <div>
                    <label className={labelClass}>Reason</label>
                    <input type="text" className={inputClass} placeholder="Reason for encounter" />
                </div>

                <div>
                    <label className={labelClass}>Location</label>
                    <input type="text" className={inputClass} placeholder="Location" />
                </div>
            </div>
        </>
    );

    const renderMedicationRequestFields = () => (
        <>
            <h3 className={sectionTitleClass}>Medication Information</h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className={labelClass}>Medication Name</label>
                    <input type="text" className={inputClass} placeholder="Medication name" />
                </div>

                <div>
                    <label className={labelClass}>Status</label>
                    <select className={inputClass}>
                        <option value="">Select status</option>
                        <option value="active">Active</option>
                        <option value="on-hold">On Hold</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        <option value="stopped">Stopped</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Priority</label>
                    <select className={inputClass}>
                        <option value="">Select priority</option>
                        <option value="routine">Routine</option>
                        <option value="urgent">Urgent</option>
                        <option value="asap">ASAP</option>
                        <option value="stat">STAT</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Dose</label>
                    <input type="number" className={inputClass} placeholder="Dose amount" />
                </div>

                <div>
                    <label className={labelClass}>Dose Unit</label>
                    <input type="text" className={inputClass} placeholder="mg, mL, etc." />
                </div>

                <div>
                    <label className={labelClass}>Route</label>
                    <select className={inputClass}>
                        <option value="">Select route</option>
                        <option value="oral">Oral</option>
                        <option value="intravenous">Intravenous</option>
                        <option value="intramuscular">Intramuscular</option>
                        <option value="subcutaneous">Subcutaneous</option>
                        <option value="topical">Topical</option>
                        <option value="inhalation">Inhalation</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Frequency</label>
                    <input type="text" className={inputClass} placeholder="e.g. Twice daily" />
                </div>

                <div>
                    <label className={labelClass}>Quantity</label>
                    <input type="number" className={inputClass} placeholder="Quantity" />
                </div>

                <div>
                    <label className={labelClass}>Refills Allowed</label>
                    <input type="number" className={inputClass} placeholder="Number of refills" />
                </div>

                <div>
                    <label className={labelClass}>Valid From</label>
                    <input type="date" className={inputClass} />
                </div>

                <div>
                    <label className={labelClass}>Valid Until</label>
                    <input type="date" className={inputClass} />
                </div>

                <div className="sm:col-span-2">
                    <label className={labelClass}>Reason for Medication</label>
                    <textarea className={inputClass} rows="3" placeholder="Reason for medication" />
                </div>
            </div>
        </>
    );

    const renderObservationFields = () => (
        <>
            <h3 className={sectionTitleClass}>Observation Information</h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className={labelClass}>Observation Name</label>
                    <input type="text" className={inputClass} placeholder="Observation name" />
                </div>

                <div>
                    <label className={labelClass}>LOINC Code</label>
                    <input type="text" className={inputClass} placeholder="e.g. 2093-3" />
                </div>

                <div>
                    <label className={labelClass}>Category</label>
                    <select className={inputClass}>
                        <option value="">Select category</option>
                        <option value="laboratory">Laboratory</option>
                        <option value="vital-signs">Vital Signs</option>
                        <option value="exam">Exam</option>
                        <option value="imaging">Imaging</option>
                        <option value="social-history">Social History</option>
                        <option value="survey">Survey</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Status</label>
                    <select className={inputClass}>
                        <option value="">Select status</option>
                        <option value="registered">Registered</option>
                        <option value="preliminary">Preliminary</option>
                        <option value="final">Final</option>
                        <option value="amended">Amended</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Observation Date</label>
                    <input type="datetime-local" className={inputClass} />
                </div>

                <div>
                    <label className={labelClass}>Value</label>
                    <input type="number" step="any" className={inputClass} placeholder="Value" />
                </div>

                <div>
                    <label className={labelClass}>Unit</label>
                    <input type="text" className={inputClass} placeholder="mg/dL, kg, etc." />
                </div>

                <div>
                    <label className={labelClass}>Interpretation</label>
                    <select className={inputClass}>
                        <option value="">Select interpretation</option>
                        <option value="N">Normal</option>
                        <option value="L">Low</option>
                        <option value="H">High</option>
                        <option value="LL">Critical Low</option>
                        <option value="HH">Critical High</option>
                        <option value="A">Abnormal</option>
                    </select>
                </div>

                <div>
                    <label className={labelClass}>Reference Range Low</label>
                    <input type="number" step="any" className={inputClass} placeholder="Lower limit" />
                </div>

                <div>
                    <label className={labelClass}>Reference Range High</label>
                    <input type="number" step="any" className={inputClass} placeholder="Upper limit" />
                </div>

                <div className="sm:col-span-2">
                    <label className={labelClass}>Notes</label>
                    <textarea className={inputClass} rows="3" placeholder="Observation notes" />
                </div>
            </div>
        </>
    );

    const renderFields = () => {
        switch (resourceType) {
            case "Patient":
                return renderPatientFields();
            case "Practitioner":
                return renderPractitionerFields();
            case "Encounter":
                return renderEncounterFields();
            case "MedicationRequest":
                return renderMedicationRequestFields();
            case "Observation":
                return renderObservationFields();
            default:
                return <p className="text-sm text-slate-500">Unsupported resource type.</p>;
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            className="flex items-center justify-center p-4"
        >
            <Box className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl outline-none">
                <div className="border-b border-slate-200 px-6 py-5">
                    <h2 className="text-xl font-bold text-slate-900">
                        Edit {resourceType}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Resource ID: {resourceId}
                    </p>
                </div>

                <div className="p-6">
                    {renderFields()}
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Save Changes
                    </button>
                </div>
            </Box>
        </Modal>
    );
}

export default EditModal;

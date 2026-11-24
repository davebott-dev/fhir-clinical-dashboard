import {useState, useEffect} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function ObservationModal({open, handleClose, patientId, onObservationCreated}) {
    const [observationName, setObservationName] = useState('');
    const [loading, setLoading] = useState(false);
    const [loinc, setLoinc] = useState('');
    const [observationDate, setObservationDate] = useState('');
    const [observationValue, setObservationValue] = useState('');
    const [observationUnit, setObservationUnit] = useState('');
    const [observationInterpretation, setObservationInterpretation] = useState('');
    const [observationEncounter, setObservationEncounter] = useState('');
    const [options, setOptions] = useState([]);
    const [loincOptions, setLoincOptions] =useState([]);
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");
    const [referenceRangeLow, setReferenceRangeLow] = useState('');
    const [referenceRangeHigh, setReferenceRangeHigh] = useState('');
    const [referenceRangeUnit, setReferenceRangeUnit] = useState('');
    const [encounterOptions, setEncounterOptions] = useState([]);

     useEffect(()=> {
            const fetchData = async()=>{
                try{
                    const response = await fetch(`https://clinicaltables.nlm.nih.gov/api/loinc_items/v3/search?type=question&terms=${observationName}`)
                    if(!response.ok){
                        throw new Error(
                            'error fetching questions (medical tests)'
                        )
                    }
                    const data = await response.json();
                    //flatten array before setting options
                    setOptions(data[3].flat());
                    setLoincOptions(data[1].flat());
                    console.log(data[1].flat())
                    console.log(data[3].flat());
                }catch(error){
                    console.error('error fetching tests',error);
                }
            }
            fetchData();
        },[observationName]);

    useEffect(()=> {
            const fetchEncounters = async()=>{
                try{
                    const response = await fetch(`https://hapi.fhir.org/baseR4/Encounter?subject=${patientId}`)
                    if(!response.ok){
                        throw new Error(
                            'error fetching encounters'
                        )
                    }
                    const data = await response.json();
                    setEncounterOptions(data?.entry)
                    console.log(data.entry);
                }catch(error){
                    console.error('error fetching tests',error);
                }
            }
            fetchEncounters();
        },[patientId]);
 
    const createObservation = async (e) => {
        e.preventDefault(); //prevent default form submission;
        setLoading(true);

        try{
            const response = await fetch('https://hapi.fhir.org/baseR4/Observation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/fhir+json'
                },
                body: JSON.stringify({
                    resourceType: 'Observation',
                    status: 'final',
                    code: {
                        coding: [
                            {
                                system: 'http://loinc.org',
                                code: loinc,
                                display: observationName
                            }
                        ]
                    },
                    subject: {
                        reference: `Patient/${patientId}`
                    },
                    effectiveDateTime: observationDate,
                    issued: new Date().toISOString(),
                    valueQuantity: {
                        value: observationValue,
                        unit: observationUnit
                    },
                    ...(observationEncounter && { 
                        encounter: {
                        reference: `Encounter/${observationEncounter}`
                        }
                    }),
                    ...(observationInterpretation && {
                        interpretation: [
                        {
                            coding: [
                                {
                                    system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                                    code: observationInterpretation
                                }
                            ]
                        }
                    ]
                }),
                    ...((referenceRangeLow !=="" || referenceRangeHigh !=="") &&
                    {referenceRange: [
                        {
                            ...(referenceRangeLow !=="" && {
                                low: {
                                value: Number(referenceRangeLow),
                                unit: referenceRangeUnit
                            }
                        }),
                            ...(referenceRangeHigh !== "" && {
                                high: {
                                value:Number(referenceRangeHigh),
                                unit:referenceRangeUnit
                            }
                        })
                    }
                    ]
                })
            })
        })
            const data = await response.json();
            if(!response.ok) {
                throw new Error(`Failed to create observation: ${response.statusText}`);
            }
            onObservationCreated?.(data);
            handleClose();
        } catch(error){
            console.error('Error creating observation:', error);
        } finally {
            handleClose();
        }
    }

    // tailwind css generated with help of GenAI
    return (
        <Modal
            open={open}
            onClose={handleClose}
            className="flex items-center justify-center p-4"
        >
            <Box className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl outline-none">
            <div className="border-b border-gray-200 px-7 py-5">
                    <h2 id="observation-modal-title" className="text-xl font-semibold tracking-tight text-gray-900">
                        Create Observation
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                         Fill in the details for the new observation.
                    </p>
                </div>
      {/* Form for creating a new observation */}

       <form onSubmit={createObservation} className="space-y-7 p-7">

                    {/* Observation Details */}
                    <div className="mb-6">
                        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Observation Details
                        </h3>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="observation-name"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Observation Name
                                </label>
                                  {/* autocomplete component used with help from MUI docs */}
                                     <Autocomplete
                                        id="observation-name"
                                        freeSolo
                                        options={options}
                                        value={observationName}
                                        onInputChange={(event,newValue) => setObservationName(newValue)}
                                        onChange={(event,newValue)=>setLoinc(loincOptions[0])}
                                        className="border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                        renderInput={(params)=>(
                                        <TextField
                                        {...params}
                                         label="Observation Name"
                                         placeholder="e.g. Blood Glucose Test"
                                           sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "8px",
                                                fontSize: "14px",
                                                backgroundColor: "white",
                                                "& fieldset": {
                                                    borderColor: "#d1d5db",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#9ca3af",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#3b82f6",
                                                    borderWidth: "1px",
                                                },
                                            },
                                        }}
                                          />
                                      )}
                            />
                            </div>

                            <div>
                                <label
                                    htmlFor="loinc"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    LOINC Code
                                </label>
                                <input
                                    id="loinc"
                                    type="text"
                                    disabled
                                    placeholder="e.g. 4548-4"
                                    value={loinc}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="observation-date"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Observation Date
                                </label>
                                <input
                                    id="observation-date"
                                    type="date"
                                    value={observationDate}
                                    onChange={(e) => setObservationDate(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="observation-value"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Observation Value
                                </label>
                                <input
                                    id="observation-value"
                                    type="number"
                                    step="any"
                                    placeholder="Enter value"
                                    value={observationValue}
                                    onChange={(e) => setObservationValue(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="observation-unit"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Observation Unit
                                </label>
                                <input
                                    id="observation-unit"
                                    type="text"
                                    placeholder="e.g. mg/dL"
                                    value={observationUnit}
                                    onChange={(e) => setObservationUnit(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clinical Information */}
                    <div className="border-t border-gray-200 pt-7">
                        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Clinical Information
                        </h3>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="interpretation"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Interpretation
                                </label>
                                <select
                                    id="interpretation"
                                    value={observationInterpretation}
                                    onChange={(e) => setObservationInterpretation(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
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
                                <label
                                    htmlFor="encounter"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Encounter
                                </label>
                                <select
                                    id="encounter"
                                    value={observationEncounter}
                                    onChange={(e) => setObservationEncounter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select an encounter</option>
                                      {encounterOptions?.map((encounter)=> {
                                        const resource = encounter?.resource;
                                        return(
                                            <option key={resource?.id} value={resource?.id} >
                                                {resource?.serviceProvider?.display || "Service Provider name unavailable"} - {new Date(resource?.period?.start).toLocaleDateString()}
                                            </option>
                                        )
                                      })}
                                </select>
                            </div>
                            <div>
                               <label
                                    htmlFor="category"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"

                                >
                                      Category
                                </label> 
                                   <select
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select a Category</option>
                                    <option value="laboratory">Laboratory</option>
                                    <option value="vital-signs">Vital-Signs</option>
                                    <option value="exam">Exam</option>
                                    <option value="social-history">Social-History</option>
                                </select>
                            </div>
                            <div>
                               <label
                                    htmlFor="status"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"

                                >
                                      Status
                                </label> 
                                   <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select a Status</option>
                                    <option value="registered">Registered</option>
                                    <option value="preliminary">Preliminary</option>
                                    <option value="final">Final</option>
                                    <option value="amended">Amended</option>
                                    <option value="canceled">Canceled</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="reference-range-low"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Low Reference Range
                                </label>
                                <input
                                    id="reference-range-low"
                                    type="number"
                                    step="any"
                                    placeholder="Enter value"
                                    value={referenceRangeLow}
                                    onChange={(e) => setReferenceRangeLow(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="reference-range-high"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    High Reference Range
                                </label>
                                <input
                                    id="reference-range-high"
                                    type="number"
                                    step="any"
                                    placeholder="Enter value"
                                    value={referenceRangeHigh}
                                    onChange={(e) => setReferenceRangeHigh(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="reference-range-unit"
                                    className="mb-1.5 block text-sm font-medium text-gray-700"
                                >
                                    Reference Range Units
                                </label>
                                <input
                                    id="reference-range-unit"
                                    type="text"
                                    step="any"
                                    placeholder="e.g. mg/dL"
                                    value={referenceRangeUnit}
                                    onChange={(e) => setReferenceRangeUnit(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            color="inherit"
                            className="!rounded-lg !border-gray-300 !px-5 !py-2.5 !normal-case !text-gray-700 hover:!bg-gray-50"
                        >
                            Cancel
                        </Button>

                        <Button
                            disabled={loading}
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="!rounded-lg !bg-blue-600 !px-6 !py-2.5 !normal-case !shadow-sm hover:!bg-blue-700"
                        >
                            {loading ? "Creating..." : "Create Observation"}
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default ObservationModal;
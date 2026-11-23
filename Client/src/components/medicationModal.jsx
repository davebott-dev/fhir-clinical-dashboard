import {useState,useEffect} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function MedicationModal({open, handleClose, patientId, onMedicationCreated}) {
    const [medicationName, setMedicationName] = useState('');
    const [options,setOptions]=useState([]);
    const [loading, setLoading] = useState(false);
    const [loadPractitioners, setLoadPractitioners] = useState(false);
    const [status, setStatus] = useState('');
    const [authoredOnDate, setAuthoredOnDate] = useState('');
    const [dosageInstructions, setDosageInstructions] = useState('');
    const [orderedBy, setOrderedBy] = useState('');
    const [practitioners, setPractitioners] = useState([]);
    const [priority, setPriority] =useState("");
    const [dose,setDose]=useState('');
    const [doseUnit,setDoseUnit]=useState('');
    const [route,setRoute]=useState('');
    const [validFromDate, setValidFromDate]=useState('');
    const [validUntilDate, setValidUntilDate]=useState('');
    const [reasonCode, setReasonCode]=useState('');


    //fetch medicine options when creating a medication request
    useEffect(()=> {
        const fetchData = async()=>{
            try{
                const response = await fetch(`https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${medicationName}`)
                if(!response.ok){
                    throw new Error(
                        'error fetching medicine names'
                    )
                }
                const data = await response.json();
                setOptions(data?.[1]);
                console.log(data?.[1])

                const formattedData = data?.[1].map((el,index)=>({
                    id: index,
                    label: el
                }));
                setOptions(formattedData);
            }catch(error){
                console.error('error fetching medicines',error);
            }
        }
        fetchData();
    },[medicationName]);

        useEffect(()=> {
        setLoadPractitioners(true);
        const fetchProviders = async()=>{
            try{
                const response = await fetch('https://hapi.fhir.org/baseR4/Practitioner');
                if(!response.ok){
                    throw new Error (
                        'error fetching practitioners'
                    )
                }
                const data = await response.json();
                setPractitioners(data.entry)

                console.log(data)
            } catch(error) {
                console.error('error fetching providers', error);
            }finally{
                setLoadPractitioners(false);
            }
        }
        fetchProviders();
    },[])
        
    const createMedication = async (e) => {
        e.preventDefault(); //prevent default form submission;
        setLoading(true);

        try{
            const response = await fetch('https://hapi.fhir.org/baseR4/MedicationRequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/fhir+json'
                },
                body: JSON.stringify({
                    resourceType: 'MedicationRequest',
                        status: status,
                    intent: "order",
                    priority: priority,
                    subject: {
                        reference: `Patient/${patientId}`
                    },
                    medicationCodeableConcept: {
                        text: medicationName
                    },
                    dosageInstruction: [
                        {
                            text: dosageInstructions,
                            route: {
                                coding:[
                                    {
                                        system: "https://chartr.example/synthetic-workflow",
                                        code: route,
                                    }
                                ],
                                text: route
                            },
                            doseAndRate: [
                                {
                                    doseQuantity: {
                                        value: Number(dose),
                                        unit: doseUnit
                                    }
                                }
                            ],
                        }
                    ],
                    authoredOn: new Date(authoredOnDate).toISOString(),
                    dispenseRequest: {
                        validityPeriod: {
                            start: validFromDate,
                            end: validUntilDate
                        },
                    },
                    reasonCode: [
                        {
                            text: reasonCode
                        }
                    ],
                    requester: {
                        reference: `Practitioner/${orderedBy}`
                    }
                })
                })

            const data = await response.json();
            
            if(!response.ok) {
                throw new Error(`Failed to create medication request${response.statusText}`);
            }
            onMedicationCreated?.(data);
            handleClose();
        } catch(error){
            console.error('Error creating medication request:', error);
        } finally{
            setLoading(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            className="flex items-center justify-center p-4"
        >
            <Box className ="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl outline-none" >
                <div className="p-6">
                    <h2 id="medication-modal-title" className="text-xl font-semibold tracking-tight text-slate-900">Create Medication Request</h2>
                    <p className="mt-1 text-sm text-slate-500">Fill in the details for the new medication request.</p>
                </div>
      {/* Form for creating a new medication */}

       <form onSubmit={createMedication} className="flex min-h-0 flex-1 flex-col">

                    {/* Medication Details */}
                    <div className="flex-1 space-y-7 overflow-y-auto bg-slate-50/70 px-7 py-6">
                        
                        {/*medication details*/}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                <span>✚</span>
                            </div>
                            <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                            Medication Details
                        </h3>
                         <p className="text-xs text-slate-500">
                                    Select the medication and enter its prescription details.
                        </p>
                        </div>
                    </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Medication Name
                                </label>

                               {/*autocomplete component used with help from MUI docs*/}
                                <Autocomplete
                                    id="medication-name"
                                    freeSolo
                                    options={options}
                                    value={medicationName}
                                    onInputChange={(event,newValue) => setMedicationName(newValue)}
                                    className="border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    renderInput={(params)=>(
                                        <TextField
                                            {...params}
                                            label="Medication Name"
                                            placeholder="e.g. acetaminophen"
                                        />
                                    )}
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="reason-code"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Reason for Medication
                                </label>
                                <input
                                    id="reason-code"
                                    type="text"
                                    placeholder="e.g. patient recovering from surgery"
                                    value={reasonCode}
                                    onChange={(e) => setReasonCode(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="priority"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Priority
                                </label>
                                <select
                                    id="priority"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select an option</option>
                                    <option value="routine"> Routine</option>
                                    <option value="urgent"> Urgent</option>
                                    </select>
                            </div>
                             <div>
                                <label
                                    htmlFor="medication-date"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Date Prescribed
                                </label>
                                <input
                                    id="medication-date"
                                    type="date"
                                    value={authoredOnDate}
                                    onChange={(e) => setAuthoredOnDate(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                                <div>
                                <label
                                    htmlFor="dose"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Dose
                                </label>
                                <input
                                    id="dose"
                                    type="number"
                                    value={dose}
                                    min="0"
                                    step="any"
                                    placeholder="e.g 500"
                                    onChange={(e) => setDose(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                              <div>
                                <input
                                    id="dose-unit"
                                    type="text"
                                    placeholder= "Unit (mg)"
                                    value={doseUnit}
                                    onChange={(e) => setDoseUnit(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                                        <div>
                                <label
                                    htmlFor="route"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Route
                                </label>
                                <select
                                    id="route"
                                    value={route}
                                    onChange={(e) => setRoute(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value = "">Select a route</option>
                                    <option value="oral"> Oral</option>
                                    <option value="intravenous"> Intraveneous (IV)</option>
                                    <option value="intramuscular"> Intramuscular (IM)</option>
                                    <option value="subcutaneous"> Subcutaneous</option>
                                    <option value="topical"> Topical</option>
                                    <option value="inhalation"> Inhalation</option>
                                    <option value="rectal"> Rectal</option>
                                    <option value="sublingual"> Sublingual</option>
                                    </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="dosage-instructions"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Dosage Instructions
                                </label>
                                <textarea
                                    id="dosage-instructions"
                                    type="text"
                                    placeholder="e.g. take twice per day orally"
                                    value={dosageInstructions}
                                    onChange={(e) => setDosageInstructions(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            
                            <div>
                                <label
                                    htmlFor="valid-from"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Valid From
                                </label>
                                <input
                                    id="valid-from"
                                    type="date"
                                    value={validFromDate}
                                    onChange={(e) => setValidFromDate(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                               <div>
                                <label
                                    htmlFor="valid-until"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Valid Until
                                </label>
                                <input
                                    id="valid-until"
                                    type="date"
                                    value={validUntilDate}
                                    onChange={(e) => setValidUntilDate(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>
                        </section>
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    {/* Clinical Information */}
                        <div className="mb-5 flex items-center gap-3">
                         <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <span>✚</span>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">
                            Clinical Information
                        </h3>
                        <p className="text-xs text-slate-500">
                                    Specify the prescription status and ordering practitioner.
                                </p>
                        </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div>
                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Status
                                </label>
                                <select
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
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
                                <label
                                    htmlFor="ordered-by"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Ordered By
                                </label>
                                <select
                                    id="ordered-by"
                                    value={orderedBy}
                                    onChange={(e) => setOrderedBy(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select a prescriber</option>
                                    {practitioners.filter(el=>el.resource?.name?.[0]?.given[0]).map((practitioner)=>{
                                        const resource = practitioner?.resource;
                                        const name = `${resource?.name?.[0]?.given[0]} ${practitioner?.resource?.name?.[0]?.family}` || "" ;
                                        const qualification = resource?.qualification?.[0]?.code?.text
                                        return(
                                            <option key={resource.id} value = {resource.id}>{name} - {qualification || "N/A"}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>

                        </section>
                    </div>

                    

                    {/* Footer */}
                      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-7 py-4 sm:flex-row sm:justify-between">
                    <p className="self-center text-xs text-slate-400">
                        Please verify prescription details before submitting.
                    </p>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
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
                            {loading ? "Creating..." : "Create Medication Request"}
                        </Button>
                    </div>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default MedicationModal;
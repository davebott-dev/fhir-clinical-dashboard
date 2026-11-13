import {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function EncounterModal({open, handleClose, patientId, onMedicationCreated}) {
    const [serviceProvider, setServiceProvider] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [reasonCode, setReasonCode] = useState('');
    const [appointmentStartTime, setAppointmentStartTime] = useState('');
    const [appointmentEndTime, setAppointmentEndTime] = useState('');

        
    const createEncounter = async (e) => {
        e.preventDefault(); //prevent default form submission;
        setLoading(true);

        try{
            const response = await fetch('https://hapi.fhir.org/baseR4/Encounter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/fhir+json'
                },
                body: JSON.stringify({
                    resourceType: 'Encounter',
                    status: status,
                    class: {
                        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
                        code: code, 
                        display: type
                    },
                    type: [
                        {
                            coding:[
                                {
                                    text: description
                                }
                            ]
                        }
                    ],
                    subject: {
                        reference: `Patient/${patientId}`
                    },
                    period:{
                        start: appointmentStartTime,
                        end: appointmentEndTime
                    },
                    reasonCode: [
                        {
                            text: reasonCode
                        }
                    ],
                    serviceProvider: {
                        display: serviceProvider
                    }
                })

            });
            const data = await response.json();
            if(!response.ok) {
                throw new Error(`Failed to create encounter request${response.statusText}`);
            }
            onMedicationCreated?.(data);
            handleClose();
        } catch(error){
            console.error('Error creating encounter request:', error);
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
            <Box className ="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl outline-none" >
                <div className="p-6">
                    <h2 id="medication-modal-title" className="text-lg font-semibold mb-4">Create Encounter</h2>
                    <p className="text-sm text-gray-500 mb-4">Fill in the details for the new encounter.</p>
                </div>
      {/* Form for creating a new encounter */}

       <form onSubmit={createEncounter} className="p-6">

                    {/* Encounter Details */}
                    <div className="mb-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Encounter Details
                        </h3>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="medication-name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Encounter Description
                                </label>
                                <input
                                    id="encounter-description"
                                    type="text"
                                    placeholder="annual checkup"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="loinc"
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
                        </div>
                    </div>

                    {/* Clinical Information */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Clinical Information
                        </h3>

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
                                    <option value="">Select an encounter</option>
                                    <option value="encounter-1">Practitioner 1</option>
                                    <option value="encounter-2">Practitioner 2</option>
                                </select>
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
                            {loading ? "Creating..." : "Create Medication Request"}
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default EncounterModal;
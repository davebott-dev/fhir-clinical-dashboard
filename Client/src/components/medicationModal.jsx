import {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function MedicationModal({open, handleClose, patientId}) {
    const [medicationName, setMedicationName] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [authoredOnDate, setAuthoredOnDate] = useState('');
    const [dosageInstructions, setDosageInstructions] = useState('');
    const [orderedBy, setOrderedBy] = useState('');
        
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
                    subject: {
                        reference: `Patient/${patientId}`
                    },
                    medicationCodeableConcept:{
                        text: medicationName
                    },
                    dosageInstruction: [
                        {
                            text: dosageInstructions
                        }
                    ],
                    authoredOn: new Date(authoredOnDate).toISOString(),                 
                    // requester: {
                    //     reference: `Practitioner/${orderedBy}`
                    // }
                })

            });
            setLoading(false);
            handleClose();
            if(!response.ok) {
                throw new Error(`Failed to create medication request: ${response.statusText}`);
            }
        } catch(error){
            console.error('Error creating medication request:', error);
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
                    <h2 id="medication-modal-title" className="text-lg font-semibold mb-4">Create Medication Request</h2>
                    <p className="text-sm text-gray-500 mb-4">Fill in the details for the new medication.</p>
                </div>
      {/* Form for creating a new medication */}

       <form onSubmit={createMedication} className="p-6">

                    {/* Medication Details */}
                    <div className="mb-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Medication Details
                        </h3>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="medication-name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Medication Name
                                </label>
                                <input
                                    id="medication-name"
                                    type="text"
                                    placeholder="e.g. acetaminophen"
                                    value={medicationName}
                                    onChange={(e) => setMedicationName(e.target.value)}
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

export default MedicationModal;
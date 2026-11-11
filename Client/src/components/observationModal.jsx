import {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function ObservationModal({open, handleClose, patientId}) {
    const [observationName, setObservationName] = useState('');
    const [loading, setLoading] = useState(false);
    const [loinc, setLoinc] = useState('');
    const [observationDate, setObservationDate] = useState('');
    const [observationValue, setObservationValue] = useState('');
    const [observationUnit, setObservationUnit] = useState('');
    const [observationInterpretation, setObservationInterpretation] = useState('');
    const [observationEncounter, setObservationEncounter] = useState('');
    
 
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
                    }
                })

            });
            setLoading(false);
            handleClose();
            if(!response.ok) {
                throw new Error(`Failed to create observation: ${response.statusText}`);
            }
        } catch(error){
            console.error('Error creating observation:', error);
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
                    <h2 id="observation-modal-title" className="text-lg font-semibold mb-4">Create Observation</h2>
                    <p className="text-sm text-gray-500 mb-4">Fill in the details for the new observation.</p>
                </div>
      {/* Form for creating a new observation */}

       <form onSubmit={createObservation} className="p-6">

                    {/* Observation Details */}
                    <div className="mb-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Observation Details
                        </h3>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="observation-name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Observation Name
                                </label>
                                <input
                                    id="observation-name"
                                    type="text"
                                    placeholder="e.g. Hemoglobin A1c"
                                    value={observationName}
                                    onChange={(e) => setObservationName(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="loinc"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    LOINC Code
                                </label>
                                <input
                                    id="loinc"
                                    type="text"
                                    placeholder="e.g. 4548-4"
                                    value={loinc}
                                    onChange={(e) => setLoinc(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="observation-date"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Observation Date
                                </label>
                                <input
                                    id="observation-date"
                                    type="date"
                                    value={observationDate}
                                    onChange={(e) => setObservationDate(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="observation-value"
                                    className="mb-2 block text-sm font-medium text-gray-700"
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
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="observation-unit"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Observation Unit
                                </label>
                                <input
                                    id="observation-unit"
                                    type="text"
                                    placeholder="e.g. mg/dL"
                                    value={observationUnit}
                                    onChange={(e) => setObservationUnit(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                                    htmlFor="interpretation"
                                    className="mb-2 block text-sm font-medium text-gray-700"
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
                                    className="mb-2 block text-sm font-medium text-gray-700"
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
                                    <option value="encounter-1">Encounter 1</option>
                                    <option value="encounter-2">Encounter 2</option>
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
                            {loading ? "Creating..." : "Create Observation"}
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default ObservationModal;
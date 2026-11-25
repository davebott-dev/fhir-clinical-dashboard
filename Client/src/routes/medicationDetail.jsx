import {useState, useEffect} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


function MedicationDetail() {
    const {patientId,medicationRequestId} = useParams();
    const location = useLocation();
    const medicationData = location.state?.medication || {};
    const navigate = useNavigate();
    const [loadPractitioner,setLoadPractitioner]=useState(false);
    const [practitioner,setPractitioner]=useState({});

    console.log(medicationData)

    useEffect(()=> {
        setLoadPractitioner(true);
        const fetchProvider = async()=>{
            try{
                const response = await fetch(`https://hapi.fhir.org/baseR4/${medicationData?.requester?.reference}`);
                if(!response.ok){
                    throw new Error (
                        'error fetching practitioners'
                    )
                }
                const data = await response.json();
                setPractitioner(data)
            } catch(error) {
                console.error('error fetching providers', error);
            }finally{
                setLoadPractitioner(false);
            }
        }
        fetchProvider();
    },[]);

 // tailwind CSS generated with help of GenAI
 
   return (
        <div className="min-h-screen bg-slate-50 p-6">

            {/* Header */}
            <div className="mb-6">
        <div className="flex w-full items-center justify-between gap-4">
                <button
                    onClick={() => navigate(`/patient/${patientId}/medication-list`)}
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                    <ArrowBackIcon fontSize="small" />
                    Back to Medications Requests
                </button>
                {/*right side buttons*/}
        <div className = "flex items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
            <EditIcon fontSize="small"/>
            Edit Medication Request
            </button>

        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
            <DeleteIcon fontSize="small"/>
            Delete Medication Request</button>
        </div>
            </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Medication Request Details
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Medication Request ID: {medicationData.id}
                        </p>
                    </div>

                     {medicationData.status ? <span className = {medicationData.status?.toLowerCase()==="active"? 
                    "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700":
                    medicationData.status?.toLowerCase()==="in-progress"? "rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700":
                    medicationData.status?.toLowerCase()==="cancelled"?"rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700":
                    medicationData.status?.toLowerCase()==="planned" ?"rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700":
                    medicationData.status?.toLowerCase()==="on-hold" ?"rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700":
                    ""}>
                        {medicationData.status}
                    </span>: <span className="rounded-full bg-grey-100 px-3 py-1 text-sm font-medium text-grey-700">Unavailable</span>}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Medication</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {medicationData?.medicationCodeableConcept?.text}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {medicationData.intent || 'Intent unavailable'}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Date Prescribed</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {new Date(medicationData?.authoredOn).toLocaleDateString("en-us",{
                            day:"2-digit",
                            month:"long",
                            year:"numeric"
                        })}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Prescription date
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Dosage Instructions</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {medicationData?.dosageInstruction?.[0]?.text || 'Not specified'}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Administration instructions
                    </p>
                </div>

            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Left Column */}
                <div className="space-y-6 lg:col-span-2">

                    {/* Prescription Information */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-slate-900">
                            Prescription Information
                        </h2>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Medication Name
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                     {medicationData?.medicationCodeableConcept?.text}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Prescription Intent
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {medicationData.intent || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Authored Date
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {new Date(medicationData?.authoredOn).toLocaleDateString()}
                                  </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Priority
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {medicationData.priority || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Dosage Instructions */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-slate-900">
                            Dosage Instructions
                        </h2>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Instructions
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {medicationData?.dosageInstruction?.[0]?.text || 'Not specified'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Route
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {medicationData?.dosageInstruction?.[0]?.route?.text || 'N/A'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Dose
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {medicationData?.dosageInstruction?.[0]?.doseAndRate?.[0].doseQuantity
                                        ? `${medicationData.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity.value} ${medicationData.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity.unit}`
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Dispensing Information */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-slate-900">
                            Dispensing Information
                        </h2>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Valid From
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {medicationData?.dispenseRequest?.validityPeriod?.start ?? 'N/A'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Valid Until
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {medicationData.dispenseRequest?.validityPeriod?.end ?? "N/A"}
                                </p>
                            </div>

                        </div>
                    </section>

                </div>

                {/* Right Column */}
                <div className="space-y-6">

                    {/* Prescriber */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Prescriber
                        </h2>

                        <p className="text-sm font-medium text-slate-800">
                            {`${practitioner?.name?.[0]?.given[0]} ${practitioner?.name?.[0]?.family} - ${practitioner.qualification?.[0]?.code?.text}`}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            {medicationData.requester?.reference || 'No provider reference'}
                        </p>
                    </section>

                    {/* Patient */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Patient Information
                        </h2>

                        <p className="text-sm text-slate-500">Patient ID</p>
                        <p className="mt-1 break-all text-sm font-medium text-slate-800">
                            {medicationData.subject?.reference || `Patient/${patientId}`}
                        </p>
                    </section>

                    {/* Reason */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Reason for Medication
                        </h2>

                        <p className="text-sm text-slate-700">
                            {medicationData.reasonCode?.[0]?.text || 'No reason documented'}
                        </p>
                    </section>

                    {/* Resource Information */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Resource Information
                        </h2>

                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-slate-500">Resource Type</p>
                                <p className="font-medium text-slate-800">
                                    {medicationData.resourceType}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">Last Updated</p>
                                <p className="font-medium text-slate-800">
                                    {new Date(medicationData?.meta?.lastUpdated).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">Medication ID</p>
                                <p className="break-all font-medium text-slate-800">
                                    {medicationData.id}
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

export default MedicationDetail;
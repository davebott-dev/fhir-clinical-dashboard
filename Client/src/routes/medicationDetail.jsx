import {useState, useEffect} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function MedicationDetail() {
    const {patientId,medicationRequestId} = useParams();
    const location = useLocation();
    const medicationData = location.state?.medication || {};
    const navigate = useNavigate();


   return (
        <div className="min-h-screen bg-slate-50 p-6">

            {/* Header */}
            <div className="mb-6">

                <button
                    onClick={() => navigate(`/patient/${patientId}/medication-list`)}
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-700"
                >
                    <ArrowBackIcon fontSize="small" />
                    Back to Medications
                </button>

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Medication Details
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Medication Request ID: {medicationData.id}
                        </p>
                    </div>

                    <span className={`rounded-full px-3 py-1 text-sm font-medium 
                        'bg-gray-100 text-gray-700'
                    }`}>
                        {/* {medication.status || 'Unknown'} */}
                    </span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    {/* <p className="text-sm text-slate-500">Medication</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {medicationData.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {medication.intent || 'Intent unavailable'}
                    </p> */}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Date Prescribed</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {/* {formatDate(medication.authoredOn)} */}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Prescription date
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Dosage Instructions</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {/* {dosage?.text || 'Not specified'} */}
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
                                    {medicationData.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Prescription Intent
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {/* {medication.intent || 'N/A'} */}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Authored Date
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {/* {formatDate(medication.authoredOn)} */}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Priority
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {/* {medication.priority || 'N/A'} */}
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
                                    {/* {dosage?.text || 'N/A'} */}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Route
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {/* {dosage?.route?.coding?.[0]?.display || 'N/A'} */}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Dose
                                </p>
                                {/* <p className="mt-1 text-sm font-medium text-slate-800">
                                    {dosage?.doseAndRate?.[0]?.doseQuantity
                                        ? `${dosage.doseAndRate[0].doseQuantity.value} ${dosage.doseAndRate[0].doseQuantity.unit || ''}`
                                        : 'N/A'}
                                </p> */}
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Frequency
                                </p>
                                {/* <p className="mt-1 text-sm font-medium text-slate-800">
                                    {dosage?.timing?.code?.text ||
                                        (dosage?.timing?.repeat?.frequency
                                            ? `${dosage.timing.repeat.frequency} times per ${dosage.timing.repeat.period} ${dosage.timing.repeat.periodUnit}`
                                            : 'N/A')}
                                </p> */}
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
                                    Quantity
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {/* {medication.dispenseRequest?.quantity?.value ?? 'N/A'}
                                    {' '}
                                    {medication.dispenseRequest?.quantity?.unit || ''} */}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Refills Allowed
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {/* {medication.dispenseRequest?.numberOfRepeatsAllowed ?? 'N/A'} */}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Valid From
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {/* {formatDate(medication.dispenseRequest?.validityPeriod?.start)} */}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Valid Until
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {/* {formatDate(medication.dispenseRequest?.validityPeriod?.end)} */}
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
                            {/* {medication.requester?.display || 'Provider unavailable'} */}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            {/* {medication.requester?.reference || 'No provider reference'} */}
                        </p>
                    </section>

                    {/* Patient */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Patient Information
                        </h2>

                        <p className="text-sm text-slate-500">Patient ID</p>
                        <p className="mt-1 break-all text-sm font-medium text-slate-800">
                            {/* {medication.subject?.reference || `Patient/${patientId}`} */}
                        </p>
                    </section>

                    {/* Reason */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Reason for Medication
                        </h2>

                        <p className="text-sm text-slate-700">
                            {/* {medication.reasonCode?.[0]?.text || 'No reason documented'} */}
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
                                    {/* {medication.resourceType} */}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">Last Updated</p>
                                <p className="font-medium text-slate-800">
                                    {/* {formatDate(medication.meta?.lastUpdated)} */}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">Medication ID</p>
                                <p className="break-all font-medium text-slate-800">
                                    {/* {medicationId} */}
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
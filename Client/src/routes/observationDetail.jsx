import {useState, useEffect} from 'react';
import {useParams, useNavigate,useLocation} from 'react-router-dom';
import moment from 'moment'; // for easier date formatting
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

function ObservationDetail() {
    const {patientId,observationId} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const observationData = location.state?.observation || {};
    const [practitioner, setPractitioner] = useState([]);
    const [patient,setPatient] = useState([]);
    const [encounter,setEncounter]= useState([]);
    const [loadPractitioner, setLoadPractitioner] =useState(false);
    const [loadPatient, setLoadPatient] = useState(false);
    const [loadEncounter, setLoadEncounter] =useState(false);
    console.log(observationData)

        useEffect(()=> {
        setLoadPractitioner(true);
        const fetchProvider = async()=>{
            try{
                const response = await fetch(`https://hapi.fhir.org/baseR4/Practitioner/${observationData.id}`);
                if(!response.ok){
                    throw new Error (
                        'error fetching provider'
                    )
                }
                const data = await response.json();
                setPractitioner(data)
                console.log(data)
            } catch(error) {
                console.error('error fetching provider', error);
            }finally{
                setLoadPractitioner(false);
            }
        }
        fetchProvider();
    },[])

            useEffect(()=> {
        setLoadEncounter(true);
        const fetchEncounter = async()=>{
            try{
                const response = await fetch(`https://hapi.fhir.org/baseR4/${observationData.encounter?.reference}`);
                if(!response.ok){
                    throw new Error (
                        'error fetching encounter'
                    )
                }
                const data = await response.json();
                setEncounter(data)

                console.log(data.entry)
            } catch(error) {
                console.error('error fetching encounter', error);
            }finally{
                setLoadEncounter(false);
            }
        }
        fetchEncounter();
    },[])

            useEffect(()=> {
        setLoadPatient(true);
        const fetchPatient = async()=>{
            try{
                const response = await fetch(`https://hapi.fhir.org/baseR4/${observationData.subject?.reference}`);
                if(!response.ok){
                    throw new Error (
                        'error fetching patient'
                    )
                }
                const data = await response.json();
                setPatient(data)

                console.log(data)
            } catch(error) {
                console.error('error fetching patient', error);
            }finally{
                setLoadPatient(false);
            }
        }
        fetchPatient();
    },[])

// tailwind css generated with help from genAI
return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-10">

        {/* Back Button */}
        <button
            onClick={() => navigate(`/patient/${patientId}/observations`)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
            <ArrowBackIcon fontSize="small" />
            Back to Observations
        </button>

        {/* Header */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <ScienceOutlinedIcon fontSize="large" />
                    </div>

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Observation Detail
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-slate-900">
                            {observationData.code?.coding?.[0]?.display}
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Observation ID: {observationId}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                Laboratory
                            </span>
                            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                                Chemistry
                            </span>
                        </div>
                    </div>
                </div>

                <span className="w-fit rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                    {observationData.status}
                </span>
            </div>
        </div>

        {/* Main Result */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Result Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium text-slate-500">
                    Observation Result
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                    <h2 className="text-4xl font-bold text-slate-900">
                        {observationData.valueQuantity?.value}
                    </h2>
                    <span className="text-lg text-slate-500">{observationData.valueQuantity?.unit}</span>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    {observationData.interpretation?.[0]?.coding?.[0]?.code === "N" ? "Normal":
                    observationData.interpretation?.[0]?.coding?.[0]?.code === "L" ? "Low" :
                    observationData.interpretation?.[0]?.coding?.[0]?.code === "H" ? "High" :
                    observationData.interpretation?.[0]?.coding?.[0]?.code === "LL" ? "Critical Low" :
                    observationData.interpretation?.[0]?.coding?.[0]?.code === "HH" ? "Critical High" :
                    observationData.interpretation?.[0]?.coding?.[0]?.code === "A" ? "Abnormal" : "N/A"
                    }
                </div>
            </div>

            {/* Effective Date Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500">
                    <CalendarMonthOutlinedIcon fontSize="small" />
                    <p className="text-sm font-medium">Effective Date</p>
                </div>

                <h2 className="mt-3 text-xl font-semibold text-slate-900">
                    {moment(observationData.effectiveDateTime).format("MMMM DD, YYYY")}
                </h2>

                <p className="mt-3 text-xs text-slate-500">
                    Issued: {observationData.effectiveDateTime}
                </p>
            </div>
        </div>

        {/* Reference Ranges */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
                Reference Ranges
            </h2>

            <div className="mt-4 divide-y divide-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div>
                        <p className="text-sm font-medium text-slate-700">
                            High Range
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            High reference range
                        </p>
                    </div>

                    <p className="text-sm font-semibold text-slate-800">
                        {observationData.referenceRange?.[0]?.high?.value} {observationData.referenceRange?.[0]?.high?.unit}
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div>
                        <p className="text-sm font-medium text-slate-700">
                            Low Range
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                            Low reference range
                        </p>
                    </div>

                    <p className="text-sm font-semibold text-slate-800">
                        {observationData.referenceRange?.[0]?.low?.value} {observationData.referenceRange?.[0]?.low?.unit}
                    </p>
                </div>
            </div>
        </section>

        {/* Observation Components */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
                Observation Components
            </h2>

            <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
                            <th className="py-3 font-medium">Component</th>
                            <th className="py-3 font-medium">Result</th>
                            <th className="py-3 font-medium">Unit</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="py-4 font-medium text-slate-700">
                                Hemoglobin A1c
                            </td>
                            <td className="py-4 font-semibold text-slate-900">
                                5.7
                            </td>
                            <td className="py-4 text-slate-500">%</td>
                        </tr>

                        <tr>
                            <td className="py-4 font-medium text-slate-700">
                                Estimated Average Glucose
                            </td>
                            <td className="py-4 font-semibold text-slate-900">
                                117
                            </td>
                            <td className="py-4 text-slate-500">mg/dL</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        {/* Additional Information */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
                Additional Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Performer
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-800">
                        Jane Smith, MD
                    </p>
                </div>

       

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Patient
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-800">
                        {patient?.name?.[0]?.given[0]} {patient?.name?.[0]?.family}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Encounter
                    </p>
                    <p className="mt-2 text-sm font-medium text-slate-800">
                        {encounter.serviceProvider?.display} - {moment(encounter.period?.start).format("MMMM DD, YYYY")}
                    </p>
                </div>

      
            </div>

            {/* Notes */}
            <div className="mt-6 border-t border-slate-100 pt-5">
                <h3 className="text-sm font-semibold text-slate-800">
                    Notes
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Hemoglobin A1c result reviewed and documented as part
                    of the patient's routine laboratory evaluation.
                </p>
            </div>
        </section>

    </div>
);

}

export default ObservationDetail;
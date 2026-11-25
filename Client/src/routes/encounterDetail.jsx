import {useState, useEffect} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function EncounterDetail() {
    const {patientId, encounterId} = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const encounterData = location.state?.encounter || {};
    const [value, setValue] = useState('1');
    const [loading, setLoading] = useState(false);
    const [practitioner, setPractitioner] = useState({})

    console.log(encounterData);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(()=> {
        if(!encounterData?.participant) return;

        let primary_doc = encounterData?.participant?.find((el)=> {
            return el.type?.[0]?.coding?.[0]?.code === "PPRF"
        });
        
        const fetchData = async() => {
          setLoading(true);
      try{
          const response = await fetch(`https://hapi.fhir.org/baseR4/${primary_doc.individual?.reference}`);
        if(!response.ok)  {
          throw new Error (
            'unable to fetch provider'
          )
        }
        const data = await response.json();
        setPractitioner(data)
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch provider:', error);
      } finally { 
        setLoading(false);
      }
    };
    fetchData();
    },[]);

    const handleDeleteEncounter= async() => {
      if (window.confirm('Are you sure you want to delete this encounter?')) {
      try{
        const response = await fetch(`https://hapi.fhir.org/baseR4/Encounter/${encounterData.id}`, {
          method: 'DELETE',
        });
        if(!response.ok) {
            throw new Error(
                "server ran into an error deleting observation"
            )
        }
        navigate(`/patient/${patientId}/encounter-history`);
      } catch (error) {
        console.error('Error deleting observation:', error);
      }
    }
  };

    //Tailwind CSS generated with help of GenAI
    return(
        <div className="min-h-screen bg slate-50 p-6">
            <TabContext value={value}>
            {/*Header*/}
           <div className="mb-6">
    <TabList
        className="mb-4"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        onChange={handleChange}
    >
        <Tab label="Details" value="1" />
        <Tab label="Patient Chart" value="2" />
        <Tab label="Encounter History" value="3" />
    </TabList>

    <div className="flex flex-wrap items-end justify-between gap-4">

    <div className="w-full space-y-4">
        <div className="flex w-full items-center justify-between gap-4">
            {/* Back Navigation */}
            <button
                onClick={() => navigate(`/patient/${patientId}/encounter-history`)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <ArrowBackIcon fontSize="small" />
                Back to Encounters
            </button>
            <div className="ml-auto flex items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700">
            <EditIcon fontSize="small"/>
            Edit Encounter
            </button>

        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            onClick={handleDeleteEncounter}
        >
            <DeleteIcon fontSize="small"/>
            Delete Encounter</button>
        </div>
        </div>

            <div>
                <h1 className="text-2xl font-bold text-slate-900">
                    {value === "1" ? "Encounter Details" :
                     value === "2" ? "Patient Chart" :
                     value === "3" ? "Encounter History" : "N/A"}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Encounter ID: {encounterId}
                </p>
            </div>

        </div>
                    {encounterData.status ? <span className = {encounterData.status?.toLowerCase()==="finished"? 
                    "rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700":
                    encounterData.status?.toLowerCase()==="in-progress"? "rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700":
                    encounterData.status?.toLowerCase()==="cancelled"?"rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700":
                    encounterData.status?.toLowerCase()==="planned" ?"rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700":
                    ""}>
                        {encounterData.status}
                    </span>: <span className="rounded-full bg-grey-100 px-3 py-1 text-sm font-medium text-grey-700">Unavailable</span>}
                </div>
            </div>
            <TabPanel value = "1" tabIndex={0}>
            {/*Detail Summary*/}
             <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Encounter Date</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {new Date(encounterData.period?.start).toLocaleDateString()}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {`${new Date(encounterData.period?.start).toLocaleTimeString()} - 
                        ${new Date(encounterData.period?.end).toLocaleTimeString()}`}

                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Encounter Type</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        {encounterData.type?.[0]?.text}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {encounterData.class?.display || 'N/A'}
                    </p>
                </div>

            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Left Column */}
                <div className="space-y-6 lg:col-span-2">

                    {/* Visit Information */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-5 text-lg font-semibold text-slate-900">
                            Visit Information
                        </h2>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Start Date
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {new Date(encounterData.period?.start).toLocaleDateString('en-US',{
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}

                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    End Date
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {new Date(encounterData.period?.end).toLocaleDateString('en-US',{
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Encounter Class
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {encounterData.class?.display || 'N/A'}

                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    Location
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-800">
                                    {encounterData.serviceProvider?.display}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Diagnoses */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Diagnoses
                        </h2>

                        <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
                            <p className="font-medium text-slate-800">
                                {encounterData.diagnosis?.[0]?.condition?.display}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                rank: {encounterData.diagnosis?.[0]?.rank}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                reference: {encounterData.diagnosis?.[0]?.condition?.reference}
                            </p>
                        </div>
                    </section>

                    {/* Additional Information */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Additional Information
                        </h2>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Reason for Visit
                            </p>
                            <p className="mt-2 text-sm text-slate-700">
                                {encounterData.reasonCode?.[0]?.text || 'N/A'} 
                            </p>
                        </div>
                    </section>

                </div>

                {/* Right Column */}
                <div className="space-y-6">

                    {/* Provider */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Healthcare Provider
                        </h2>

                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <span className="text-lg font-semibold">
                                    {practitioner.name?.[0]?.given[0][0]+
                                    practitioner.name?.[0]?.family[0]}
                                </span>
                            </div>

                            <div>
                                <p className="font-medium text-slate-900">
                                    {practitioner.name?.[0]?.given[0] + ' ' +
                                    practitioner.name?.[0]?.family}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {practitioner.qualification?.[0]?.code?.text}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Participants */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900">
                            Participants
                        </h2>
                        {encounterData.participant?.length>0 ? encounterData.participant?.map((el)=>{
                            return(
                            <p><strong>{el.individual?.display}</strong>: 
                            {el.type?.[0]?.coding?.[0]?.code==="PPRF"?" Primary Performer":
                            el.type?.[0]?.coding?.[0]?.code==="SPRF"? " Secondary Performer":
                            el.type?.[0]?.coding?.[0]?.code==="ATND"? " Attender":
                            el.type?.[0]?.coding?.[0]?.code==="CON"? " Consultant":
                            el.type?.[0]?.coding?.[0]?.code==="PART"? " Participant":
                            el.type?.[0]?.coding?.[0]?.code==="REF"? " Referrer": "N/A"}</p>
                        )}): 
                        <p className="text-sm text-slate-500">
                            No additional participants available.
                        </p>
                        }
                        
                    </section>

                    {/* Resource Information */}
                    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-3 text-lg font-semibold text-slate-900">
                            Resource Information
                        </h2>

                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-slate-500">Patient ID</p>
                                <p className="break-all font-medium text-slate-800">
                                    {patientId}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">Encounter ID</p>
                                <p className="break-all font-medium text-slate-800">
                                    {encounterId}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500">Resource Type</p>
                                <p className="font-medium text-slate-800">
                                    {encounterData.resourceType ||'N/A'}
                                </p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
            </TabPanel>
            <TabPanel value = "2" tabIndex={0}>
                Patient Chart Tab
            </TabPanel>
            <TabPanel value = "3" tabIndex={0}>
                Encounter History Tab
            </TabPanel>
            </TabContext>
        </div>
    )
}

export default EncounterDetail;
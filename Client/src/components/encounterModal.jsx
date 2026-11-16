import {useState,useEffect} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

function EncounterModal({open, handleClose, patientId, onEncounterCreated}) {
    const [serviceProvider, setServiceProvider] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadHospitals, setLoadHospitals] = useState(false);
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [reasonCode, setReasonCode] = useState('');
    const [appointmentStartTime, setAppointmentStartTime] = useState('');
    const [appointmentEndTime, setAppointmentEndTime] = useState('');
    const [serviceProviderCity, setServiceProviderCity] = useState('');
    const [serviceProviderState, setServiceProviderState] = useState('');
    const [hospitalData, setHosptialData] = useState([]);
    const [hospitalRows, setHospitalRows] = useState([]);

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

//setting row and column for the hospital data grid
const columns = [
    {field: 'name', headerName: 'Hospital Name', flex: 1, rowHeader:true},
    {field: 'careType', headerName: 'Care Type', width: 150, rowHeader:true},
    {field: 'city', headerName: 'City', width: 150, rowHeader:true},
];
const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(()=> {
        setLoadHospitals(true);

        const fetchData = async() => {

        if(serviceProviderCity=="" && serviceProviderState==""){
            setHosptialData([]);
            setHospitalRows([]);
            return;
        }
            let queryString = '';
        
            if(serviceProviderCity!="") {
                queryString+=`city=`
                let splitString= serviceProviderCity.split(' ');
                for(let i =0;i<splitString.length;i++){
                    queryString+=splitString[i];
                    queryString+='%20';
                }
            }

            if(serviceProviderCity!="" && serviceProviderState!=""){
                queryString+="&";
            }

            if(serviceProviderState!=""){
                queryString+=`state=${serviceProviderState}`;
            }

            try{
                const response = await fetch(`https://api.api-ninjas.com/v1/hospitals?${queryString}`,
                    {
                        headers: {
                            'X-Api-Key': apiKey
                        }
                    }
                );
                if(!response.ok) {
                    throw new Error (
                        'unable to fetch hospitals'
                    )
                }
                const data = await response.json();
                setHosptialData(data ?? []);

                //create the data table rows
                const formattedRows = data?.map((el,index)=>({
                    id: el.id ||index,
                    name: el.name || 'N/A',
                    careType: el.care_type ||'N/A',
                    city: el.city ||'N/A',
        
                }));

                setHospitalRows(formattedRows);
            } catch(error) {
                console.error('failed to fetch hospitals', error);
            } finally{
                setLoadHospitals(false);
            }
        }
            fetchData();
    }, [serviceProviderCity,serviceProviderState]);
        
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
            onEncounterCreated?.(data);
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
            <Box className ="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl outline-none" >
                {/*Header*/}
                <div className="border-b border-gray-200 px-6 py-5">
                    <h2 id="encounter-modal-title" className="text-xl font-semibold text-gray-900">Create Encounter</h2>
                    <p className="mt-1 text-sm text-gray-500">Fill in the details for the new encounter.</p>
                </div>

      {/* Form for creating a new encounter */}
       <form onSubmit={createEncounter} className="space-y-6 p-6">

                    {/* Encounter Details */}
                    <div className="mb-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Encounter Details
                        </h3>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="encounter-name"
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

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="encounter-reason"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Encounter Reason
                                </label>
                                <textarea
                                    id="encounter-reason"
                                    type="text"
                                    placeholder="e.g. check up for annual physical"
                                    value={reasonCode}
                                    onChange={(e) => setReasonCode(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="appointment-start"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Appointment Start Time
                                </label>
                                <input
                                    id="appointment-start"
                                    type="datetime-local"
                                    value={appointmentStartTime}
                                    onChange={(e) => setAppointmentStartTime(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                             <div>
                                <label
                                    htmlFor="appointment-end"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Appointment End Time
                                </label>
                                <input
                                    id="appointment-end"
                                    type="datetime-local"
                                    value={appointmentEndTime}
                                    onChange={(e) => setAppointmentEndTime(e.target.value)}
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
                                    <option value="finished">Finished</option>

                                </select>
                            </div>


                          
                        </div>
                    </div>
                    
                    {/* Service Provider Table Data*/}
                    <div className="border-t border-gray-200 pt-6">
                        <div className = "mb-5">
                         <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Service Provider Details
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">Input a city or state and select a service provider from the table below.</p>
                            </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                                <label
                                    htmlFor="service-provider-city"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Service Provider City
                                </label>
                                <input
                                    id="service-provider-city"
                                    type="text"
                                    value={serviceProviderCity}
                                    onChange={(e) => setServiceProviderCity(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                </input>
                            </div>

                            <div>
                                <label
                                    htmlFor="service-provider-state"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Service Provider State
                                </label>
                                <select
                                    id="service-provider-state"
                                    value={serviceProviderState}
                                    onChange={(e) => setServiceProviderState(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value=""> Select a State</option>
                                    {usStates.map(state=>{
                                        return(
                                            <option value={state.abbreviation}>{state.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                              <div className="sm:col-span-2">
                                <label
                                    htmlFor="service-provider-name"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Selected Service Provider Name
                                </label>
                                <input
                                    id="service-provider-name"
                                    type="text"
                                    placeholder="select a service provider in the table below..."
                                    value={serviceProvider}
                                    disabled
                                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 placeholder-gray-400 cursor-not-allowed"
                                />
                            </div>
                            </div>
                      </div>

                            <Box className ="mt-6 w-full" sx={{height:400, width:'100%',mt:3}}>
                                <DataGrid rows={hospitalRows} 
                                columns={columns} 
                                pageSizeOptions={[5,10,25]}
                                initialState={{
                                    pagination:{
                                        paginationModel: {
                                            pageSize:5,
                                            page:0
                                        }
                                    }
                                }}
                                sx={{
                                    border:'1px solid #e5e73eb',
                                    borderRadius:'10px'
                                }}
                                onRowClick={(e)=>{setServiceProvider(e.row.name)}}
                                loading = {loadHospitals}
                                />
                            </Box>
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
                            {loading ? "Creating..." : "Create Encounter"}
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default EncounterModal;
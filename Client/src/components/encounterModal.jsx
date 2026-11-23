import {useState,useEffect} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid'; // implementation docs at https://mui.com/x/react-data-grid/
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function EncounterModal({open, handleClose, patientId, onEncounterCreated}) {
    const [serviceProvider, setServiceProvider] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadHospitals, setLoadHospitals] = useState(false);
    const [loadPractitioners, setLoadPractitioners] = useState(false);
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
    const [diagnosisSearch, setDiagnosisSearch] = useState('');
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const [options, setOptions] = useState([]);
    const [practitioners, setPractitioners] = useState([]);
    const [practitionerRows, setPractitionerRows] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const apiRef = useGridApiRef();

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

const encounterClasses = [
    { code: 'AMB', display: 'Ambulatory' },
    { code: 'IMP', display: 'Inpatient' },
    { code: 'OBSENC', display: 'Observation' },
    { code: 'EMER', display: 'Emergency' },
    { code: 'VR', display: 'Virtual' },
    { code: 'HH', display: 'Home Health' },
];

//setting row and column for the hospital data grid
const columns = [
    {field: 'name', headerName: 'Hospital Name', flex: 1, rowHeader:true},
    {field: 'careType', headerName: 'Care Type', width: 150, rowHeader:true},
    {field: 'city', headerName: 'City', width: 150, rowHeader:true},
];

//setting row and columns for the practitioner data grid
const participantColumns = [
    {
        field: 'name',
        headerName: 'Participant',
        flex: 1,
    },
    {
        field: 'qualification',
        headerName: 'Qualification',
        flex: 1,
    },
    {
        field: 'role',
        headerName: 'Participant Role',
        type: 'singleSelect',
        flex: 1, 
        editable: true,
        cellClassName: 'editable-role-cell',
        valueOptions: [
            { value: 'PPRF', label: 'Primary performer' },
            { value: 'SPRF', label: 'Secondary performer' },
            { value: 'ATND', label: 'Attender' },
            { value: 'CON', label: 'Consultant' },
            { value: 'PART', label: 'Participant' },
            { value: 'REF', label: 'Referrer' }
        ]
    }
];
const apiKey = import.meta.env.VITE_API_KEY;

// fetch hospital names
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

        //fetch different types of diagnoses for autocomplete component
    useEffect(()=> {
        if(!diagnosisSearch.trim()) {
            setOptions([]);
            return;
        }

        const fetchData = async()=>{
            try{
                const response = await fetch(`https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=${diagnosisSearch}`)
                if(!response.ok){
                    throw new Error(
                        'error fetching diagnosis names'
                    )
                }
                const data = await response.json();
                console.log(data?.[3])

                const formattedData = data?.[3].map((el,index)=>({
                    id: index,
                    code:el[0],
                    label: el[1]
                }));
                setOptions(formattedData);
            }catch(error){
                console.error('error fetching medicines',error);
            }
        }
        fetchData();
    },[diagnosisSearch]);

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

                 //create the data table rows
                const formattedRows = data?.entry?.filter((item)=>item.resource?.name?.[0]?.given[0]).map((el,index)=>({
                    id: el.resource.id ||index,
                    name: `${el.resource?.name?.[0]?.given[0]} ${el.resource?.name?.[0]?.family}` || 'N/A',
                    qualification: el.resource?.qualification?.[0]?.code?.coding?.[0]?.code ||'N/A'
                    
                }));
                console.log(data)
                console.log(formattedRows)
                setPractitionerRows(formattedRows)
            } catch(error) {
                console.error('error fetching providers', error);
            }finally{
                setLoadPractitioners(false);
            }
        }
        fetchProviders();
    },[])


    // create condition resource first
    const createCondition = async (diagnosisItem) => {

    // Search for an existing Condition for this patient and diagnosis
    const searchResponse = await fetch(
        `https://hapi.fhir.org/baseR4/Condition?code=${diagnosisItem.code}&patient=${patientId}`,
        {
            headers: {
                Accept: 'application/fhir+json'
            }
        }
    );

    if (!searchResponse.ok) {
        throw new Error('Failed to search existing Conditions');
    }

    const searchData = await searchResponse.json();
    console.log(searchData)

    // Reuse an existing Condition if found
    if (searchData.entry?.length > 0) {
        return searchData.entry[0].resource;
    }

    // otherwise post
    const response = await fetch(
        'https://hapi.fhir.org/baseR4/Condition',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/fhir+json',
                'Accept': 'application/fhir+json'
            },
            body: JSON.stringify({
                resourceType: 'Condition',
                clinicalStatus: {
                    coding: [{
                        system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                        code: 'active',
                        display: 'Active'
                    }]
                },
                code: {
                    coding: [{
                        system: 'http://hl7.org/fhir/sid/icd-10-cm',
                        code: diagnosisItem.code,
                        display: diagnosisItem.label
                    }],
                    text: diagnosisItem.label
                },
                subject: {
                    reference: `Patient/${patientId}`
                }
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.issue?.[0]?.diagnostics || 'Failed to create Condition'
        );
    }

    return data;
};
        
const createEncounter = async (e) => {
    e.preventDefault();
    // validation rules for form
    if (!patientId) {
        alert('Patient ID is missing.');
        return;
    }

    if (!status || !code || !appointmentStartTime || !appointmentEndTime) {
        alert('Please complete the required encounter fields.');
        return;
    }

    if (
        new Date(appointmentEndTime) <=
        new Date(appointmentStartTime)
    ) {
        alert('The encounter end time must be after the start time.');
        return;
    }

    setLoading(true);

    try {
        // Create the selected Condition resources (MDN Web Docs)
            let encounterDiagnosis = [];

            if (selectedDiagnosis) {
                const condition = await createCondition(selectedDiagnosis);

                encounterDiagnosis = [
                    {
                        condition: {
                            reference: `Condition/${condition.id}`,
                            display: selectedDiagnosis.label
                        },
                        rank: 1
                    }
                ];
            }

        // Create the Encounter
        const response = await fetch(
            'https://hapi.fhir.org/baseR4/Encounter',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/fhir+json',
                    'Accept': 'application/fhir+json'
                },
                body: JSON.stringify({
                    resourceType: 'Encounter',

                    status: status,

                    class: {
                        system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                        code: code,
                        display: type
                    },

                    type: [{
                        text: description
                    }],

                    subject: {
                        reference: `Patient/${patientId}`
                    },

                    period: {
                        start: new Date(appointmentStartTime).toISOString(),
                        end: new Date(appointmentEndTime).toISOString()
                    },

                    reasonCode: reasonCode
                        ? [{ text: reasonCode }]
                        : [],

                    serviceProvider: serviceProvider
                        ? { display: serviceProvider }
                        : undefined,

                    diagnosis: encounterDiagnosis,

                    participant: selectedParticipants.map((participant)=>({
                        type: [
                            {
                                coding:[
                                    {
                                        system: "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                                        code:participant.role
                                    }
                                ]
                            }
                        ],
                        individual: {
                            reference: `Practitioner/${participant.id}`,
                            display: participant.name
                        }
                    }))
                  
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.issue?.[0]?.diagnostics ||
                'Failed to create Encounter'
            );
        }

        console.log('Created Encounter:', data);

        onEncounterCreated?.(data);
        handleClose();

    } catch (error) {
        console.error('Error creating encounter:', error);
        alert(error.message);
    } finally {
        setLoading(false);
    }
};

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
                              <div>
                                <label
                                    htmlFor="type"
                                    className="mb-2 block text-sm font-medium text-gray-700"
                                >
                                    Type of Visit
                                </label>
                                <select
                                    id="type"
                                    value={code}
                                    onChange={(e) => {
                                        const selectedItem = encounterClasses.find(item=>item.code === e.target.value)
                                        setCode(selectedItem.code);
                                        setType(selectedItem.display);                                    
                                    }}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    {encounterClasses.map(encounter=>{
                                        return(
                                            <option value={encounter.code}>{encounter.display}</option>
                                        )
                                    })}
                                </select>
                            </div>
                               <div className="sm:col-span-2">
                               {/*autocomplete component used with help from MUI docs*/}
                           <Autocomplete
                                id="diagnosis-name"
                                options={options}
                                value={selectedDiagnosis}
                                getOptionLabel={(option) =>
                                    `${option.code} - ${option.label}`
                                }
                                isOptionEqualToValue={(option, value) =>
                                    option.code === value.code
                                }
                                onChange={(event, newValue) => {
                                    setSelectedDiagnosis(newValue);
                                }}
                                onInputChange={(event, newValue, reason) => {
                                    if (reason === 'input') {
                                        setDiagnosisSearch(newValue);
                                    }
                                }}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Diagnosis Name"
                                        placeholder="Search ICD-10-CM diagnoses"
                                    />
                                )}
                            />
                            </div>
                            <p className="mb-2 block text-sm font-medium text-gray-700">
                                    Participants
                                </p>
                            <div className="sm:col-span-2">
                            <Box className ="mt-6 w-full" sx={{height:300, width:'100%',mt:3}}>
                                <DataGrid rows={practitionerRows} 
                                apiRef={apiRef}
                                editMode="cell"
                                onCellClick={(params) => {
                                    if (params.field === 'role') {
                                        apiRef.current.startCellEditMode({
                                            id: params.id,
                                            field: 'role'
                                        });
                                    }
                                }}
                                columns={participantColumns} 
                                checkboxSelection
                                onRowSelectionModelChange={(newSelection) => {
                                const selectedRows = practitionerRows.filter((row) =>
                                    newSelection.ids.has(row.id)
                                );

                                setSelectedParticipants(selectedRows);
                                    }}
                                processRowUpdate={(updatedRow) => {
                                setPractitionerRows((previousRows) =>
                                    previousRows.map((row) =>
                                        row.id === updatedRow.id ? updatedRow : row
                                    )
                                 );
                                return updatedRow;
                                  }}
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
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '10px',

                                    '& .editable-role-cell': {
                                        backgroundColor: '#f8fafc',
                                        color: '#4338ca',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        borderBottom: '1px dashed #a5b4fc'
                                    },

                                    '& .editable-role-cell:hover': {
                                        backgroundColor: '#eef2ff'
                                    },

                                    '& .editable-role-cell:focus': {
                                        outline: '2px solid #6366f1',
                                        outlineOffset: '-2px'
                                    }
                                }}
                                loading = {loadPractitioners}
                                />
                            </Box>
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
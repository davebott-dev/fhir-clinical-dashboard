import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Chart, Title, YAxis } from '@highcharts/react';
import { GaugeSeries } from '@highcharts/react/series/Gauge';
import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import NotesModal from '../components/notesModal.jsx';
import { FileText, CalendarDays, UserRound, Trash2 } from 'lucide-react';

function PatientOverview() {
  const { patientId } = useParams();
  const [patient] = useOutletContext();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientObservations, setPatientObservations] =useState([]);
  const [notes, setNotes] = useState([]);
  const [loadNotes, setLoadNotes] = useState(false);
  const [practitionerNames, setPractitionerNames] =useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
        const fetchData = async () => {
        if(!patient?.id) return;
          setLoading(true);
        try{
          const response = await fetch(`https://hapi.fhir.org/baseR4/Observation?patient=${patient?.id}`);
          if(!response.ok) {
            throw new Error(`Failed to fetch patient observations: ${response.statusText}`);
          }
          const data = await response.json();
          setPatientObservations(data.entry ?? []);
      } catch(error){
        console.error('Error fetching patient observations:', error);
      } finally {
        setLoading(false);
      }
    };
      fetchData();
  }, [patient?.id]);

  // fetch notes using my api route
  useEffect(() => {
    const fetchNotes = async () => {
      setLoadNotes(true);

      try{
        const response = await fetch(`http://localhost:5000/api/notes/${patientId}`);
        if(!response.ok) {
          throw new Error("Failed to fetch notes for this patient.");
        }
        const data = await response.json();
        console.log("notes", data);
        setNotes(data);
      }catch(error) {
        console.error(error);
      } finally{
        setLoadNotes(false);
      }
    }
    fetchNotes();
  },[notes.length]);

// useEffect method refined with help of AI
useEffect(() => {
    const fetchPractitioners = async () => {
        const practitionerIds = [
            ...new Set(notes.map(note => note.practitionerId))
        ];

        try {
            const results = await Promise.all(
                practitionerIds.map(async (id) => {
                    const response = await fetch(
                        `https://hapi.fhir.org/baseR4/Practitioner/${id}`
                    );

                    if (!response.ok) {
                        throw new Error(`Failed to fetch practitioner ${id}`);
                    }

                    const data = await response.json();

                    return {
                        id,
                        name: data.name?.[0]
                            ? `${data.name[0].given?.join(' ') || ''} ${data.name[0].family || ''}`.trim()
                            : 'Unknown Practitioner'
                    };
                })
            );

            const names = Object.fromEntries(
                results.map(item => [item.id, item.name])
            );

            setPractitionerNames(names);

        } catch (error) {
            console.error('Error fetching practitioners:', error);
        }
    };

    if (notes.length > 0) {
        fetchPractitioners();
    }
}, [notes]);

  // storing data in varaibles for easier access 

  const cholesterolObservation = (patientObservations ?? []).find(
    observation =>
      observation.resource?.code?.coding?.some(
        coding => coding.code === '2093-3'
      )
  );

  const cholesterol =
    cholesterolObservation?.resource?.valueQuantity?.value;

  const address = patient?.address?.[0];

  const formattedAddress = address
    ? [
        address.line?.join(', '),
        address.city,
        address.state,
        address.postalCode,
        address.country,
      ].filter(Boolean).join(', ')
    : 'Not available';

  const phone = patient?.telecom?.find(
    t => t.system === 'phone'
  )?.value;

  const email = patient?.telecom?.find(
    t => t.system === 'email'
  )?.value;

  const language =
    patient?.communication?.find(
      c => c.preferred
    )?.language?.text ??
    patient?.communication?.[0]?.language?.coding?.[0]?.display;

  const ethnicity =
    patient?.extension?.find(extension =>
      extension.url?.toLowerCase().includes('us-core-ethnicity')
    )?.extension?.find(item => item.url === 'text')?.valueString;

  const firstName = patient?.name?.[0]?.given?.[0];
  const lastName = patient?.name?.[0]?.family;


  // created react components for card and detail to make the code more readable and reusable

  const Card = ({ title, subtitle, children, className = '', button}) => (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-800">
            {title}
          </h2>
          {button && (
            <div className="mt-2">
              <IconButton
                aria-label="add"
                onClick={handleOpen}
              >
                <AddIcon />
              </IconButton>
            </div>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );

  const Detail = ({ label, value }) => (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-800">
        {value || 'Not available'}
      </dd>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Loading patient information...
        </p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <h2 className="font-semibold text-slate-800">
          Patient not found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Unable to retrieve patient information.
        </p>
      </div>
    );
  }


// tailwind css generated with help of GenAI
  return (
    <main className="space-y-6">
      {/* Snapshot and Demographics */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <Card
          title="Patient Snapshot"
          subtitle="Patient contact and identifying information"
        >
          <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <Detail label="First Name" value={firstName} />
            <Detail label="Last Name" value={lastName} />
            <Detail label="Email" value={email} />
            <Detail label="Phone Number" value={phone} />
            <Detail label="Birth Date" value={patient.birthDate} />
          </dl>
        </Card>

        <Card
          title="Patient Demographics"
          subtitle="Address and demographic information"
        >
          <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <Detail label="Address" value={formattedAddress} />
            <Detail label="Ethnicity" value={ethnicity} />
            <Detail label="Legal Sex / Gender" value={patient.gender} />
            <Detail label="Preferred Language" value={language} />
          </dl>
        </Card>
      </div>

      {/* Laboratory Results */}
      <Card
        title="Laboratory Results"
        subtitle="Available patient laboratory observations"
      >
        {cholesterol == null ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No cholesterol result available.
          </p>
        ) : (
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Cholesterol
              </p>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tight text-slate-900">
                  {cholesterol}
                </span>
                <span className="text-sm text-slate-500">mg/dL</span>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Reference threshold shown: 200 mg/dL
              </p>

              <div className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {cholesterol < 200
                  ? 'Below 200 mg/dL'
                  : 'At or above 200 mg/dL'}
              </div>
            </div>

            <div className="min-w-0">
              <Chart>
                <Title text="Total Cholesterol (mg/dL)" />
                <YAxis
                  min={0}
                  max={300}
                  tickInterval={50}
                  plotBands={[
                    {
                      from: 0,
                      to: 200,
                      color: 'rgba(34, 197, 94, 0.15)',
                    },
                    {
                      from: 200,
                      to: 300,
                      color: 'rgba(239, 68, 68, 0.15)',
                    },
                  ]}
                />
                <GaugeSeries
                  options={{
                    name: 'Total Cholesterol',
                    data: [
                      {
                        name: 'Total Cholesterol',
                        y: Math.min(cholesterol, 300),
                      },
                    ],
                    dataLabels: {
                      enabled: true,
                      format: '{y} mg/dL',
                    },
                    tooltip: {
                      pointFormat: '<b>{point.y} mg/dL</b>',
                    },
                  }}
                />
              </Chart>
            </div>
          </div>
        )}

        {cholesterol > 300 && (
          <p className="mt-3 text-sm text-amber-700">
            Actual result exceeds the gauge scale of 300 mg/dL.
          </p>
        )}
      </Card>

      {/* Additional Observations */}
      <Card
        title="Additional Observations"
        subtitle="Other recorded patient measurements and laboratory results"
      >
        {(patientObservations ?? []).filter(
          observation =>
            observation.resource?.code?.coding?.[0]?.code !== '2093-3'
        ).length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-slate-600">
              No additional observations available.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Additional clinical measurements will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Observation</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(patientObservations ?? [])
                  .filter(
                    observation =>
                      observation.resource?.code?.coding?.[0]?.code !== '2093-3'
                  )
                  .map(observation => {
                    const resource = observation.resource;
                    return (
                      <tr key={resource.id}>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {resource.code?.text ||
                            resource.code?.coding?.[0]?.display ||
                            'Observation'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {resource.valueQuantity
                            ? `${resource.valueQuantity.value} ${resource.valueQuantity.unit || ''}`
                            : resource.valueString || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {resource.effectiveDateTime
                            ? new Date(resource.effectiveDateTime).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Patient Notes */}
      <Card
        title="Patient Notes"
        subtitle="Clinical documentation associated with this patient"
        button={
          <IconButton>
            <AddIcon />
          </IconButton>
        }
     > 

<div className="space-y-4 py-6">
    {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <FileText className="h-6 w-6 text-slate-400" />
            </div>

            <p className="text-sm font-semibold text-slate-700">
                No patient notes available
            </p>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                Patient documentation will appear here when notes are added.
            </p>
        </div>
    ) : (
        notes.map((note) => (
            <div
                key={note.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
               <div className="flex items-start justify-between gap-4">
    <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-4 w-4 text-blue-600" />
            </span>

            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Clinical Note
            </span>
        </div>

        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {note.message}
        </p>
    </div>

    <button
        onClick={() => handleDeleteNote(note.id)}
        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
        title="Delete note"
        aria-label="Delete note"
    >
        <Trash2 className="h-4 w-4" />
    </button>
</div>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {moment(note.createdAt).format("MMM DD, YYYY hh:mm A")}
                    </span>

                    <span className="flex items-center gap-1.5">
                        <UserRound className="h-3.5 w-3.5" />
                        Practitioner: {practitionerNames[note.practitionerId] || 'Loading...'}
                    </span>
                </div>
            </div>
        ))
    )}
</div>

      </Card>
      <NotesModal open={open} handleClose={handleClose} patientId={patientId} />

    </main>
    
  );
}

export default PatientOverview;

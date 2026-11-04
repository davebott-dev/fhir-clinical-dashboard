import { useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Chart, Title, YAxis } from '@highcharts/react';
import { GaugeSeries } from '@highcharts/react/series/Gauge';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import NotesModal from '../components/notesModal.jsx';

function PatientOverview() {
  const { patientId } = useParams();
  const [patient, loading, patientObservations] = useOutletContext();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            <Detail label="Legal Sex / Gender" value={patient.gender} />
            <Detail label="Birth Date" value={patient.birthDate} />
          </dl>
        </Card>

        <Card
          title="Patient Demographics"
          subtitle="Address and demographic information"
        >
          <dl className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <Detail label="Address" value={formattedAddress} />
            <Detail label="Phone Number" value={phone} />
            <Detail label="Ethnicity" value={ethnicity} />
            <Detail label="Email" value={email} />
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
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-slate-600">
            No patient notes available.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Patient documentation will appear here when available.
          </p>
        </div>
      </Card>
      <NotesModal open={open} handleClose={handleClose} patientId={patientId} />

    </main>
    
  );
}

export default PatientOverview;

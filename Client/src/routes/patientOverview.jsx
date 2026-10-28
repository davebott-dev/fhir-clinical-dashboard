import { useParams, useOutletContext } from 'react-router-dom';
import {Chart, Title, YAxis} from '@highcharts/react';
import {GaugeSeries} from '@highcharts/react/series/Gauge';

function PatientOverview() {
  const { patientId } = useParams();
  const [patient, loading, patientObservations] = useOutletContext();
  
  const cholesterolObservation = (patientObservations ?? []).filter(observation => observation.resource?.code?.coding?.[0]?.code === '2093-3')[0];

  return (
    <main className = "space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-4">Patient Overview</h1>
        <p className="text-sm text-slate-600">Displaying information for patient with ID: {patientId}</p>
        {loading && <p>Loading...</p>}
        {patient && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
            <p className="text-sm text-slate-600">First Name: </p>
              <p>{patient.name?.[0]?.given?.[0]}</p>
            <p className="text-sm text-slate-600">Last Name: </p>
              <p>{patient.name?.[0]?.family}</p>
            <p className="text-sm text-slate-600">Email: </p>
              <p>{patient.telecom?.find(t => t.system === 'email')?.value}</p>
            <p className="text-sm text-slate-600">Gender: </p>
              <p>{patient.gender}</p>
            <p className="text-sm text-slate-600">Birth Date: </p>
              <p>{patient.birthDate}</p>
          </div>
          </div>
        )}
        </section>
  
 {/* Cholesterol gauge */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-slate-800">
          Total Cholesterol
        </h2>

        {cholesterolObservation == null ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No cholesterol result available for this patient.
          </p>
        ) : (
          <>
            <p className="mb-2 text-center text-3xl font-bold text-slate-800">
              {cholesterolObservation?.resource?.valueQuantity?.value} mg/dL
            </p>

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
                    color: 'rgba(34, 197, 94, 0.18)',
                  },
                  {
                    from: 200,
                    to: 300,
                    color: 'rgba(239, 68, 68, 0.18)',
                  },
                ]}
              />

              <GaugeSeries
                options={{
                  name: 'Total Cholesterol',
                  data: [
                    {
                      name: 'Total Cholesterol',
                      y: Math.min(cholesterolObservation?.resource?.valueQuantity?.value, 300),
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
            {cholesterolObservation?.resource?.valueQuantity?.value > 300 && (
              <p className="mt-2 text-sm text-amber-700">
                The result exceeds the gauge scale. The displayed needle is
                capped at 300 mg/dL; the actual result is shown above.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default PatientOverview;
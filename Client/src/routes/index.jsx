function Index() {

  //tailwindcss classes create with help of generative AI

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-10">
      {/* Welcome section */}
      <div className="mb-10">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
          FHIR Clinical Dashboard
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Welcome to your dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
          Access patient information, review clinical observations, and
          explore medication records in one place.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl text-indigo-700">
            👤
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Patient Search
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Find a patient and review their demographic information.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-xl text-teal-700">
            ♥
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Clinical Observations
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Explore recorded clinical measurements and results.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-xl text-violet-700">
            +
          </div>

          <h2 className="text-lg font-semibold text-slate-900">
            Medications
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Review medication information associated with a patient.
          </p>
        </div>
      </div>

      {/* Getting started section */}
      <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-indigo-950">
          Get started
        </h2>

        <p className="mt-2 text-sm leading-6 text-indigo-800">
          Select Patient Search from the sidebar to look up a synthetic
          patient record from your FHIR server.
        </p>
      </div>
    </div>
  );
}

export default Index;
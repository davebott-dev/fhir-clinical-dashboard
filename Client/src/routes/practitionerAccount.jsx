import { useNavigate } from 'react-router-dom';
// basic account page with mock data generated...will edit next
export default function PractitionerAccount() {
    const navigate = useNavigate();

    // Mock Practitioner data
    const practitioner = {
        id: '12345',
        firstName: 'Jane',
        lastName: 'Smith',
        prefix: 'Dr.',
        suffix: 'MD',
        active: true,
        qualification: 'Internal Medicine',
        email: 'jane.smith@hospital.org',
        phone: '(919) 555-0123',
        gender: 'Female',
        identifier: 'PR-102938',
        address: {
            street: '123 Medical Center Drive',
            city: 'Chapel Hill',
            state: 'NC',
            zip: '27514'
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="mx-auto max-w-5xl space-y-6">

                {/* Page Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
                        >
                            ← Back
                        </button>

                        <h1 className="text-2xl font-bold text-slate-900">
                            Practitioner Account
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            View and manage practitioner information
                        </p>
                    </div>

                    <button
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Practitioner Profile */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center gap-5">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                            {practitioner.firstName[0]}
                            {practitioner.lastName[0]}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-900">
                                {practitioner.prefix} {practitioner.firstName} {practitioner.lastName}, {practitioner.suffix}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {practitioner.qualification}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Practitioner ID: {practitioner.identifier}
                            </p>
                        </div>

                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            practitioner.active
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                        }`}>
                            {practitioner.active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {/* Information Sections */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* Personal Information */}
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 border-b border-slate-100 pb-3">
                            <h3 className="font-semibold text-slate-900">
                                Personal Information
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Basic practitioner details
                            </p>
                        </div>

                        <div className="space-y-4">
                            <InfoField label="First Name" value={practitioner.firstName} />
                            <InfoField label="Last Name" value={practitioner.lastName} />
                            <InfoField label="Gender" value={practitioner.gender} />
                            <InfoField label="Practitioner ID" value={practitioner.identifier} />
                        </div>
                    </section>

                    {/* Contact Information */}
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5 border-b border-slate-100 pb-3">
                            <h3 className="font-semibold text-slate-900">
                                Contact Information
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Practitioner contact details
                            </p>
                        </div>

                        <div className="space-y-4">
                            <InfoField label="Email Address" value={practitioner.email} />
                            <InfoField label="Phone Number" value={practitioner.phone} />
                            <InfoField label="Street Address" value={practitioner.address.street} />
                            <InfoField
                                label="City, State ZIP"
                                value={`${practitioner.address.city}, ${practitioner.address.state} ${practitioner.address.zip}`}
                            />
                        </div>
                    </section>

                    {/* Professional Information */}
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
                        <div className="mb-5 border-b border-slate-100 pb-3">
                            <h3 className="font-semibold text-slate-900">
                                Professional Information
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Credentials and qualifications
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <InfoField label="Qualification" value={practitioner.qualification} />
                            <InfoField label="Professional Suffix" value={practitioner.suffix} />
                            <InfoField label="Professional Prefix" value={practitioner.prefix} />
                            <InfoField
                                label="Account Status"
                                value={practitioner.active ? 'Active' : 'Inactive'}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

function InfoField({ label, value }) {
    return (
        <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <p className="text-sm font-medium text-slate-800">
                {value || 'Not provided'}
            </p>
        </div>
    );
}

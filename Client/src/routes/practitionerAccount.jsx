import {useState, useAccount} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EditModal from '../components/editModal';

// basic account page with mock data generated...will edit next
function PractitionerAccount() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const practitioner = location.state?.practitioner || {};
    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit= () =>setOpenEdit(false);
    const [openEdit, setOpenEdit] = useState(false);

    console.log(practitioner);

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
                        onClick = {handleOpenEdit}
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Practitioner Profile */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-center gap-5">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                            {practitioner.name?.[0]?.given[0][0]}
                            {practitioner.name?.[0]?.family[0]}
                        </div>

                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-900">
                                {practitioner.name?.[0]?.given[0]} {practitioner.name?.[0]?.family}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {practitioner.qualification?.[0]?.code?.text ?? "N/A"} 
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                Practitioner ID: {practitioner.id}
                            </p>
                        </div>

                        <span className='rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700'>
                {practitioner.active ? "Active" : "Inactive"} 
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
        <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                First Name
            </p>
            <p className="text-sm font-medium text-slate-800">
                {practitioner.name?.[0]?.given[0] || 'Not Provided'}
            </p>
        </div>                            
        <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Last Name
            </p>
            <p className="text-sm font-medium text-slate-800">
                {practitioner.name?.[0]?.family || 'Not Provided'}
            </p>
        </div>                            
        <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Gender
            </p>
            <p className="text-sm font-medium text-slate-800">
                {practitioner.gender || 'Not Provided'}
            </p>
        </div>                                
        <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Practitioner ID
            </p>
            <p className="text-sm font-medium text-slate-800">
                {practitioner.id || 'Not Provided'}
            </p>
        </div> 
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
            <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                 Email
            </p>
            <p className="text-sm font-medium text-slate-800">
                {practitioner.telecom?.[0]?.value || 'Not Provided'}
            </p>
             </div> 
            <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                 Phone Number
            </p>
            <p className="text-sm font-medium text-slate-800">
                {practitioner.telecom?.[1]?.value || 'Not Provided'}
            </p>
        </div>                             
                           
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
            <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Qualification
            </p>
            <p className="text-sm font-medium text-slate-800">
                {practitioner.qualification?.[0]?.code?.text || "Not Provided"} 
            </p>
            </div>                             
                            <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Account Status
            </p>
            <p className="text-sm font-medium text-slate-800">
                {practitioner.active ? "Active" : "Inactive"} 
            </p>
            </div>         
                        </div>
                    </section>
                </div>
            </div>
                <EditModal open={openEdit} handleClose={handleCloseEdit} resourceType="Practitioner" resourceId={practitioner.id}/>

        </div>
    );
};

export default PractitionerAccount;
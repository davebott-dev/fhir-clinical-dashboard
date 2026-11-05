import {useState, useEffect} from "react";
import {Snackbar, Alert} from "@mui/material";
import { Download, Edit, Star, Delete } from "@mui/icons-material";
import { yellow } from "@mui/material/colors";
import { IconButton, Stack, Skeleton } from "@mui/material";


function PatientFiles() {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(''); // State to track which route to search for
    const [loading, setLoading] = useState(false); // State to track loading status
    const [patientFiles, setPatientFiles] = useState([]); // State to store patient files

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try{
               //add real API call here to fetch patient files when backend is set up
                setTimeout(() => {
                    console.log('Simulated API call completed');
                }, 3000); // Simulate a 3-second delay for demonstration purposes
                setLoading(false); // Set loading to false after data is fetched
            } catch(error){
                console.error('Error fetching patient files:', error);
                setLoading(false); // Set loading to false in case of error
            }
        };
        fetchData();
    }, []);

    const handleClose = (e, reason) => {
        if (reason === 'clickaway') {
            return;
        }       
        setOpen(false); 
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]; // change to document.forms[0].submit() when backend is set up to handle file uploads
        console.log(file);

        setOpen(true); // Show the success Snackbar
    };

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            {/*Page Header*/}
            <div className = "mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Patient Files</h1>
                    <p className="mt-2 text-sm text-gray-600">View, upload, and manage patient files.</p>
                </div>
            {/* File Upload */}
             <form action=""
                method="POST"
                encType="multipart/form-data"
            >
                <label className ="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    Upload File
                    <input
                        type="file"
                        className = "sr-only"
                        onChange={handleFileUpload}
                    >
                    </input>
                    </label>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
                    File uploaded successfully!
                </Alert>
            </Snackbar>
            </div>
            {/* Patient files section */}
            <div className = "rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Uploaded Files</h2>
                    <span className="text-sm text-gray-500">{patientFiles.length} files</span>
                </div>
            </div>
            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                            <Skeleton variant="text" width="60%" height={30} />
                            <Skeleton variant="rectangular" width="100%" height={100} className="mt-2" />
                            <div>
                                <Skeleton variant="circular" width={40} height={40} className="mt-2" />
                                <Skeleton variant="circular" width={40} height={40} className="mt-2" />
                                <Skeleton variant="circular" width={40} height={40} className="mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : patientFiles.length > 0 ? 
            (   
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {patientFiles.map((file, index) => {
                        const handleDownload = () => {
                            console.log(`Downloading file: ${file.name}`);
                            // Implement file download logic here when backend is set up
                        }
                        return (
                            <div key={index} className="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                                <div className ="flex-h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h3 className="truncate text-base font-semibold text-gray-800">{file.name}</h3>
                                <p className = "mt-1 text-sm text-gray-500">{file.size} KB</p>
                                <p className = "mt-1 text-sm text-gray-500">{file.uploadedAt}</p>
                                <p className = "mt-1 text-sm text-gray-500">{file.uploadedBy}</p>
                                <p className = "mt-1 text-sm text-gray-500">{file.description}</p>
                                <p className = "mt-1 text-sm text-gray-500">Patient Document</p>
                                {/* Action buttons for each file */}
                                <div className = "mt-4 flex items-center justify-between">
                                <Stack direction="row" spacing={1}>
                                    <IconButton onClick={handleDownload} color="primary" size="small">
                                        <Download fontSize="small" />
                                    </IconButton>
                                    <IconButton color="primary" size="small">
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton color="primary" size="small">
                                        <Star sx={{ color: yellow[500] }} />
                                    </IconButton>
                                    <IconButton color="primary" size="small">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                    </Stack>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )   : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                No patient files yet
                            </h3>

                            <p className="mt-2 max-w-sm text-sm text-gray-500">
                                Upload patient documents to make them available here.
                            </p>
                        </div>
            )
            }
        </main>
    );
}  

export default PatientFiles;
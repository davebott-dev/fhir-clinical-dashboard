import {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function NotesModal({ open, handleClose,patientId }) {
    const [note, setNote] = useState('');

    const handleSubmit = ()=> {
        // Handle note submission logic here
        console.log(`Note for patient ${patientId}: ${note}`);
        handleClose();
    }

    return(
        <Modal open={open} onClose={handleClose}>
            <Box className="absolute top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">Add Note for Patient {patientId}</h2>
                <p className="mb-4 text-sm text-gray-600">Please enter your note below:</p>
                <form>
                <textarea
                    className="w-full rounded border-gray-300 shadow-sm focus:ring-blue-500"
                    placeholder="Enter note..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
                </div>
                </form>
            </Box>
        </Modal>
     
    )
}

export default NotesModal;
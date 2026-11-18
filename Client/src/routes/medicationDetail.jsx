import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function MedicationDetail() {
    const {patientID} = useParams();
    const {medicationRequestID} =useParams();

    return(
        <div>
            medication detail page for {medicationRequestID}
        </div>
    )
}

export default MedicationDetail;
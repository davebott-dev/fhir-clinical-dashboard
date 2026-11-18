import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function MedicationDetail() {
    const {patientId,medicationRequestId} = useParams();

    return(
        <div>
            medication detail page for {medicationRequestId}
        </div>
    )
}

export default MedicationDetail;
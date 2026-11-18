import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function EncounterDetail() {
    const {patientId, encounterId} = useParams();

    return(
        <div>
            encounter detail page for {encounterId}
        </div>
    )
}

export default EncounterDetail;
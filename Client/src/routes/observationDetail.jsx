import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function ObservationDetail() {
    const {patientId,observationId} = useParams();

    return(
        <div>
            observation detail page for {observationId}
        </div>
    )
}

export default ObservationDetail;
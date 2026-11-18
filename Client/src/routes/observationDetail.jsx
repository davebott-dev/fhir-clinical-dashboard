import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function ObservationDetail() {
    const {patientID} = useParams();
    const {observationID} =useParams();

    return(
        <div>
            observation detail page for {observationID}
        </div>
    )
}

export default ObservationDetail;
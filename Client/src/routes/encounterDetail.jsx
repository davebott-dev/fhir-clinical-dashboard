import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function EncounterDetail() {
    const {patientID} = useParams();
    const {encounterID} =useParams();

    return(
        <div>
            observation detail page for {encounterID}
        </div>
    )
}

export default EncounterDetail;
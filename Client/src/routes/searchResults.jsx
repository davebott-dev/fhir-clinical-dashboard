import {useLocation} from 'react-router-dom';

function SearchResults(){
    const location = useLocation();
    const {patientData} = location.state || {}; // Access the passed patient data from the state
    console.log('Patient Data:', patientData); // Log the patient data to the console for debugging
    return(
        <div>
            <h1>Search Results</h1>
        </div>
    )
}

export default SearchResults;
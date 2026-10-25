import {useLocation} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function SearchResults(){
    const location = useLocation();
    const {patientData} = location.state || {}; // Access the passed patient data from the state
    const entries = patientData?.entry || []; // Safely access the entry array from patientData using optional chaining
  
    // use of optional chaining (?.) seen below is important to avoid errors in accessing and rendering patient data
    return(
        <div>
            {entries.map((patient, index) => (
                <Card key={index}>
                    <Avatar> {patient.resource?.name?.[0]?.given?.[0]?.[0]}</Avatar>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            Patient {index + 1}
                        </Typography>
                        <p>Name: {patient.resource?.name?.[0]?.given?.join(' ')} {patient.resource?.name?.[0]?.family}</p>
                        <p>Gender: {patient.resource?.gender}</p>
                        <p>Birth Date: {patient.resource?.birthDate}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default SearchResults;
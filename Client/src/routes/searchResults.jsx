import {useLocation} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

//fix error on rendering results 

function SearchResults(){
    const location = useLocation();
    const {patientData} = location.state || {}; // Access the passed patient data from the state
    
    return(
        <div>
            {patientData.entry?.forEach((patient, index) => (
                <Card key={index}>
                    <Avatar> {patient.name[0]?.given[0][0]}</Avatar>
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            Patient {index + 1}
                        </Typography>
                        <p>Name: {patient.name[0]?.given.join(' ')} {patient.name[0]?.family}</p>
                        <p>Gender: {patient.gender}</p>
                        <p>Birth Date: {patient.birthDate}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default SearchResults;
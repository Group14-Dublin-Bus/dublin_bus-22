import { Card, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {Button} from '@mui/material';
import Alert from '@mui/material/Alert';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

function InfoPannel(props) {

    let result = null;
    if(props.info !== null) {
        result = props.info
        console.log(result)
    } 
    if(props.prediction !== null) {
        console.log(props.prediction)
    }    
    return(
        <Card style={{
            padding: '2vh',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            }
        }
        >
            {result ? 
                <Box>
                    <Typography variant="h5" gutterBottom component="div">
                        To {result.request && result.request.destination.query.split(",")[0]}
                    </Typography>

                    <Typography variant="h6" 
                                gutterBottom component="div" 
                                align='right'>

                        From {result.request && result.request.origin.query.split(",")[0]}
                    </Typography>

                    {result.routes[0] && result.routes[0].legs[0].steps.map(({travel_mode, distance, duration, instructions, transit}) => (
                        <Typography 
                            key = {instructions} 
                            variant="subtitle1" 
                            gutterBottom component="div" 
                        >   
                            {travel_mode === 'WALKING' ?  <DirectionsWalkIcon /> : <DirectionsBusIcon />}
                            {" " + instructions}
                            <Typography
                                marginLeft={'40%'}
                                variant="subtitle1" 
                                gutterBottom component="div"
                            >
                                {transit && ' Route' + transit.line.short_name }
                                {transit && " Departure at: " + transit.departure_time.text }
                            </Typography>

                            <Typography 
                                variant="subtitle2" 
                                gutterBottom component="div"
                                align='right' 
                            >
                                {" " + distance.text + " "}
                                {/* extra modification required for mutiple transfer */}
                                {(props.prediction !== null && travel_mode === 'TRANSIT') ? Math.floor(props.prediction.data / 60) + " mins": " " + duration.text}
                            </Typography>
                        </Typography>
                        
                    ))}
                    <Button
                        sx={{
                            position:'relative',
                            left: '2vh',
                            bottom: '1vh',
                            zIndex: 'modal'
                        }}
                        onClick={props.switch}
                        endIcon={<AutorenewIcon fontSize="large" />}
                    >Switch</Button>
                </Box>
            :
                <Alert 
                    severity="error"
                    onClick={props.switch}
                >No Search Input Yet — check it out!</Alert>
            }
        </Card>
    );
}

export default InfoPannel;
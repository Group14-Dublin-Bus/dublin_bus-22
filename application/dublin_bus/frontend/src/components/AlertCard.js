import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { Container } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";

// Component used in the alerts page to display the latest results from user submitted bus service updates in the report page
const AlertCard = ({ alert }) => {
	return (
		<Container>
			<Card
				sx={{
					m: "10px",
				}}
				className="alert"
			>
				<CardHeader
					title={
						<Typography component="h6" variant="h6" sx={{ color: "white" }}>
							Route: {alert.route}
						</Typography>
					}
					subheader={
						<Typography
							component="div"
							variant="text.primary"
							sx={{ color: "white" }}
						>
							{alert.submission_type}
						</Typography>
					}
					style={{ backgroundColor: "#00b273" }}
				/>
				<CardContent style={{ backgroundColor: "#f5f5f5" }}>
					<Typography variant="body1" color="text.primary">
						Time of Incident: {alert.travel_time}
					</Typography>
					<Typography
						variant="body1"
						color="text.primary"
						sx={{
							marginTop: "5px",
						}}
					>
						Delay Reported: {alert.delay}
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							marginTop: "10px",
						}}
					>
						{alert.text}
					</Typography>
				</CardContent>
			</Card>
		</Container>
	);
};

export default AlertCard;

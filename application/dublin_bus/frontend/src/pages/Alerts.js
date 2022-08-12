import React, { useState } from "react";
import AlertCard from "../components/AlertCard";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Alerts = () => {
	const [alerts, setAlerts] = useState(null);

	// Fetch data of recent reports submitted by users to display form the django view
	if (alerts === null) {
		const url = "http://localhost:8000/api/get-report";
		fetchData(url, setAlerts);
	}

	async function fetchData(url, setFunction) {
		let data;
		let temp;

		await axios.get(url).then(
			(response) => {
				if (typeof response.data === "string") {
					temp = JSON.parse(response.data);
				} else {
					temp = response.data;
				}
				data = Object.values(temp);
				setFunction(data);
			},
			(error) => {
				console.log(error);
			}
		);
	}

	// Display the data retrieved using the AppCard component, allow two columns on larger screens and one on smaller ones
	return (
		<Grid sx={{ mx: "60px" }}>
			<Grid item xs={12} align="center" sx={{ m: "10px" }}>
				<Typography
					variant="h3"
					component="h3"
					sx={{
						marginTop: "20px",
					}}
				>
					Bus Service Alerts
				</Typography>
			</Grid>
			{alerts?.length > 0 ? (
				<Grid container spacing={2}>
					{alerts.map((alert) => (
						<Grid
							xs={12}
							item
							md={6}
							alignItems="center"
							justifyContent="center"
							key={alert.code}
						>
							<AlertCard alert={alert} />
						</Grid>
					))}
				</Grid>
			) : (
				<Grid item xs={12} align="center" sx={{ m: "10px" }} className="empty">
					<Typography variant="h3" component="h3">
						No alerts founds
					</Typography>
				</Grid>
			)}
		</Grid>
	);
};

export default Alerts;

import React, { useState } from "react";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Card, Grid } from "@mui/material";
import { Container } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import axios from "axios";

const ServiceUpdateForm = () => {
	const [routes, setRoutes] = useState(null);

	if (routes === null) {
		const url = "http://localhost:8000/api/line_number";
		fetchData(url, setRoutes);
	}

	async function fetchData(url, setFunction) {
		let data;
		let temp;

		await axios.get(url).then(
			(response) => {
				// convert dictionary to array
				// console.log(response)
				if (typeof response.data === "string") {
					temp = JSON.parse(response.data);
					//console.log(typeof(response.data))
					// console.log(temp)
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

	const [type, setType] = useState("");
	const [time, setTime] = useState("");
	const [route, setRoute] = useState("");
	const [text, setText] = useState("");
	const [delay, setDelay] = useState("");

	const handleTypeChange = (e) => {
		setType(e.target.value);
	};

	const handleRouteChange = (e) => {
		setRoute(e.target.value);
	};

	const handleTimeChange = (e) => {
		setTime(e.target.value);
	};

	const handleTextChange = (e) => {
		setText(e.target.value);
	};

	const handleDelayChange = (e) => {
		setDelay(e.target.value);
	};

	const handleSubmissionButtonPressed = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				submission_type: type,
				route: route,
				travel_time: time,
				delay: delay,
				text: text,
			}),
		};
		fetch("/api/create-report", requestOptions)
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((err) => {
				console.log(err.message);
			});
	};

	return (
		<Container maxWidth="md">
			<Card
				style={{
					marginTop: "20px",
					marginBottom: "10px",
				}}
			>
				<Typography
					component="h3"
					variant="h3"
					style={{
						textAlign: "center",
						margin: "10px",
					}}
				>
					Service Interruptions
				</Typography>
				<Typography
					component="p"
					variant="p"
					style={{
						textAlign: "center",
						margin: "10px",
					}}
				>
					Report bus service interruptions in Dublin. Re-submit form to update
					information.
				</Typography>
				<FormControl fullWidth>
					<InputLabel id="type">Report Type</InputLabel>
					<Select
						defaultValue=""
						style={{ margin: "10px" }}
						error={type === ""}
						labelId="select-issue-label"
						id="select-type"
						value={type}
						onChange={handleTypeChange}
						label="Type"
					>
						<MenuItem key="Bus Delayed" value="Bus Delayed">
							Bus Late
						</MenuItem>
						<MenuItem key="Bus Cancelled" value="Bus Cancelled">
							Bus Cancelled
						</MenuItem>
						<MenuItem key="Heavy Traffic" value="Heavy Traffic">
							Heavy Traffic
						</MenuItem>
						<MenuItem key="Bus Diverted" value="Bus Diverted">
							Bus Diverted
						</MenuItem>
						<MenuItem key="Anti-Social Behaviour" value="Anti-Social Behaviour">
							Anti-Social Behaviour
						</MenuItem>
						<MenuItem key="Other" value="Other">
							Other
						</MenuItem>
					</Select>
					<FormHelperText
						sx={{
							color: "red",
						}}
					>
						{type === "" ? "Complete to Submit" : " "}
					</FormHelperText>

					<FormControl fullWidth>
						<InputLabel id="route">Route Number</InputLabel>
						<Select
							defaultValue=""
							style={{ margin: "10px" }}
							error={route === ""}
							labelId="select-route-label"
							id="select-route"
							value={route}
							onChange={handleRouteChange}
							label="Route"
						>
							{routes &&
								routes.map((value) => (
									<MenuItem key={value} value={value}>
										{value}
									</MenuItem>
								))}
						</Select>
						<FormHelperText
							sx={{
								color: "red",
							}}
						>
							{route === "" ? "Complete to Submit" : " "}
						</FormHelperText>
					</FormControl>
				</FormControl>
				<FormControl fullWidth>
					<InputLabel id="select-time-type">When did this happen?</InputLabel>
					<Select
						defaultValue=""
						error={time === ""}
						style={{ margin: "10px" }}
						value={time}
						labelId="select-time-type"
						id="time-select"
						label="Incident Time"
						onChange={handleTimeChange}
					>
						<MenuItem value="Just Now">Just Now</MenuItem>
						<MenuItem value="Last Hour">Last Hour</MenuItem>
						<MenuItem value="Over an Hour">Over an Hour</MenuItem>
					</Select>
					<FormHelperText
						sx={{
							color: "red",
						}}
					>
						{time === "" ? "Complete to Submit" : " "}
					</FormHelperText>
				</FormControl>
				<FormControl fullWidth>
					<InputLabel id="select-delay-type">
						How long was the delay?
					</InputLabel>
					<Select
						defaultValue={delay}
						error={delay === ""}
						style={{ margin: "10px" }}
						value={delay}
						labelId="select-delay-type"
						id="delay-select"
						label="Delay Length"
						onChange={handleDelayChange}
					>
						<MenuItem value="No Delay">No Delay</MenuItem>
						<MenuItem value="Under 5 Minutes">Under 5 Minutes</MenuItem>
						<MenuItem value="Under 15 Minutes">Under 15 Minutes</MenuItem>
						<MenuItem value="Under 30 Minutes">Under 30 Minutes</MenuItem>
						<MenuItem value="Over 30 Minutes">Over 30 Minutes</MenuItem>
					</Select>
					<FormHelperText
						sx={{
							color: "red",
						}}
					>
						{delay === "" ? "Complete to Submit" : " "}
					</FormHelperText>
				</FormControl>
				<FormControl fullWidth>
					<TextField
						fullWidth
						error={text === ""}
						style={{ margin: "10px" }}
						id="text"
						label="Details of Report"
						margin="normal"
						onChange={handleTextChange}
						defaultValue={text}
					/>
					<FormHelperText
						sx={{
							color: "red",
						}}
					>
						{text === "" ? "Complete to Submit" : " "}
					</FormHelperText>

					<Grid
						style={{
							justifyContent: "center",
						}}
					>
						<Button
							type={"submit"}
							color="success"
							sx={{
								margin: "10px 0px ",
								minWidth: "36vh",
								display: "flex",
								gap: "1rem",
							}}
							variant="contained"
							onClick={handleSubmissionButtonPressed}
						>
							Submit
						</Button>
					</Grid>
				</FormControl>
			</Card>
		</Container>
	);
};

export default ServiceUpdateForm;

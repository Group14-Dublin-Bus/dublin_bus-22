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

const FeedbackForm = () => {
	const [type, setType] = useState("");
	const [os, setOS] = useState("");
	const [text, setText] = useState("");

	// Source stack overflow for this function, check if input is complete
	const checkIsValid = (fieldName, value) => {
		// Here you probably what to check this to some regex validation
		if (isValidData[fieldName] === !"") {
			return true;
		}
		return false;
	};

	const handleTypeChange = (e) => {
		setType(e.target.value);
	};

	const handleOsChange = (e) => {
		setOS(e.target.value);
	};

	const handleTextChange = (e) => {
		setText(e.target.value);
	};

	const handleSubmissionButtonPressed = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				feedback_type: type,
				os: os,
				text: text,
			}),
		};
		fetch("/api/create-feedback", requestOptions)
			.then((response) => response.json())
			.then((data) => console.log(data))
			.catch((err) => {
				console.log(err.message);
			});
	};

	return (
		<Container maxWidth="md">
			<Card
				sx={{
					marginTop: "20px",
					marginBottom: "10px",
				}}
			>
				<Typography
					component="h3"
					variant="h3"
					sx={{
						textAlign: "center",
						margin: "10px",
					}}
				>
					Developer Feedback
				</Typography>
				<Typography
					component="p"
					variant="p"
					sx={{
						textAlign: "center",
						margin: "10px",
					}}
				>
					Submit feedback to the developers on your user experience. Re-submit
					form to update information.
				</Typography>
				<FormControl fullWidth>
					<InputLabel id="select-issue-type">Feedback Type</InputLabel>
					<Select
						defaultValue=""
						error={type === ""}
						sx={{ margin: "10px" }}
						value={type}
						labelId="select-issue-type"
						id="type-select"
						label="Type"
						onChange={handleTypeChange}
					>
						<MenuItem value="Visual Design and Usability">
							Visual Design and Usability
						</MenuItem>
						<MenuItem value="Journey Time Prediction Accuracy">
							Journey Time Prediction Accuracy
						</MenuItem>
						<MenuItem value="Website Performance Issue">
							Website Performance Issue
						</MenuItem>
						<MenuItem value="Other">Other</MenuItem>
					</Select>
					<FormHelperText
						sx={{
							color: "red",
						}}
					>
						{type === "" ? "Complete to Submit" : " "}
					</FormHelperText>
				</FormControl>
				<FormControl fullWidth>
					<InputLabel id="select-os-type">Your Operating System</InputLabel>
					<Select
						defaultValue=""
						error={os === ""}
						sx={{ margin: "10px" }}
						value={os}
						labelId="select-os-type"
						id="os-select"
						label="Operating System"
						onChange={handleOsChange}
					>
						<MenuItem value="Android">Android</MenuItem>
						<MenuItem value="iOS">iOS</MenuItem>
						<MenuItem value="Windows">Windows</MenuItem>
						<MenuItem value="macOS">macOS</MenuItem>
						<MenuItem value="Linux">Linux</MenuItem>
						<MenuItem value="Other">Other</MenuItem>
					</Select>
					<FormHelperText
						sx={{
							color: "red",
						}}
					>
						{os === "" ? "Complete to Submit" : " "}
					</FormHelperText>
				</FormControl>
				<FormControl fullWidth>
					<TextField
						fullWidth
						error={text === ""}
						sx={{ margin: "10px" }}
						id="text"
						label="Message to Developers"
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

export default FeedbackForm;

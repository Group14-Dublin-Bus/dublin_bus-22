import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FeedbackForm from "../components/FeedbackForm";
import ServiceUpdateForm from "../components/ServiceUpdateForm";

// Component to allow users to submit 2 types of reports, either website feedback to developers or bus service feedback to be displayed in the alerts feature
const Reports = () => {
	const [toDisplay, setToDisplay] = useState(true);
	const [buttonText, setButtonText] = useState("Submit Website Feedback");

	// Create grid to display one of the two forms users can submit, button allows users to swap between forms if required
	return (
		<Grid
			container
			spacing={0}
			direction="column"
			alignItems="center"
			justifyContent="center"
		>
			<Grid item xs={12} align="center" sx={{ m: "10px", minWidth: "75%" }}>
				{toDisplay ? <ServiceUpdateForm /> : <FeedbackForm />}
			</Grid>
			<Grid item xs={6} sx={{ m: "10px", display: "flex", gap: "1rem" }}>
				<Button
					sx={{
						margin: "10px 0px ",
						minWidth: "20vh",
						display: "flex",
						gap: "1rem",
					}}
					color="primary"
					variant="contained"
					onClick={() => {
						setToDisplay(!toDisplay);
						setButtonText(
							buttonText === "Submit Website Feedback"
								? "Submit service alert"
								: "Submit Website Feedback"
						);
					}}
				>
					{buttonText}
				</Button>
			</Grid>
		</Grid>
	);
};

export default Reports;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { Card } from "@mui/material";
import { Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";

// Feature de-scoped
// Allow users to save and view their favourite bus stops for later use.

const Favourites = () => {
	const [favourite, setFavourite] = useState("");
	const { favouriteCode } = useParams();

	// Fetch data on users stops based on their session key
	fetch("/api/get-favourite?code=" + favouriteCode)
		.then((response) => response.json())
		.then((data) => {
			setFavourite(data.route);
		});

	// Handle users submissions
	const handleFavouriteChange = (e) => {
		setFavourite(e.target.value);
	};

	// Send post request to django model when user makes a submission
	const handleFavouriteButtonPressed = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				route: favourite,
			}),
		};
		fetch("/api/create-favourite", requestOptions)
			.then((response) => response.json())
			.then((data) => console.log(data));
	};

	// Crate a form for the suers to submit and call function on submit
	return (
		<Container maxWidth="md">
			<Card sx={{ marginTop: "40px" }}>
				<Typography
					component="h3"
					variant="h3"
					style={{
						textAlign: "center",
						marginTop: "20px",
						marginBottom: "20px",
					}}
				>
					Save Favourites
				</Typography>
				<FormControl fullWidth>
					<TextField
						fullWidth
						required={true}
						style={{ margin: "10px 0px " }}
						id="route"
						label="Route"
						margin="normal"
						onChange={handleFavouriteChange}
						defaultValue={favourite}
					/>
					<Button
						fullWidth
						type={"submit"}
						style={{ margin: "10px 0px " }}
						variant="contained"
						onClick={handleFavouriteButtonPressed}
					>
						Submit
					</Button>

					<Button
						fullWidth
						style={{ margin: "10px 0px " }}
						color="secondary"
						variant="contained"
						to="/"
						component={Link}
					>
						Back
					</Button>
				</FormControl>
			</Card>
			<Card>
				<h1>User Favourites</h1>

				<h3>{favouriteCode}</h3>

				<p>Favourite routes: {String(route)}</p>
			</Card>
		</Container>
	);
};

export default Favourites;

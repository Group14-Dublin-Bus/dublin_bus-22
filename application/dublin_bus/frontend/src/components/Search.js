import Card from "@mui/material/Card";
import { TextField, Button, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import moment from "moment";

const Search = (props) => {
	const startRef = useRef();
	const endRef = useRef();
	const dateRef = useRef();
	// store the user report as a ref

	// Times to set limit for date picker
	// const moment = require("moment-timezone");
	// const minDate = moment().tz("Europe/Dublin").format("YYYY-MM-DDTHH:MM:SS");
	// const maxDate = minDate.add(5, "days");

	function submitHandler(event) {
		// handler user input
		event.preventDefault(); // prevent deafult

		const data = {
			start: startRef.current.value,
			end: endRef.current.value,
			time: dateRef.current.value,
		};

		props.addData(data);
	}

	return (
		<Card style={{ marginTop: "30px", marginRight: "30px" }}>
			<form onSubmit={submitHandler}>
				<h3
					style={{
						textAlign: "center",
						marginTop: "10px",
						marginBottom: "10px",
					}}
				>
					Plan Your Journey
				</h3>

				<Grid container spacing={2} style={{ margin: "10px" }}>
					<Grid item xs={12} style={{ marginRight: "70px" }}>
						<Autocomplete>
							<TextField
								fullWidth
								style={{ margin: "10px" }}
								required={true}
								id="Start"
								label="Start"
								margin="normal"
								inputRef={startRef}
							/>
						</Autocomplete>
					</Grid>
					<Grid item xs={12} style={{ marginRight: "70px" }}>
						<Autocomplete>
							<TextField
								fullWidth
								style={{ margin: "10px" }}
								required={true}
								id="End"
								label="End"
								margin="normal"
								inputRef={endRef}
							/>
						</Autocomplete>
					</Grid>
					<Grid item xs={12} style={{ marginRight: "70px" }}>
						<TextField
							fullWidth
							type="datetime-local"
							style={{ margin: "10px" }}
							id="Time"
							label="When will you travel?"
							margin="normal"
							// InputProps={{
							// 	inputProps: { min: minDate, max: minDate },
							// }}
							InputLabelProps={{ shrink: true }}
							inputRef={dateRef}
						/>
					</Grid>
				</Grid>
				<Grid
					item
					xs={12}
					container
					spacing={2}
					style={{ marginLeft: "10px", marginBottom: "20px" }}
				>
					<Grid item width={"45%"}>
						<Button
							type={"submit"}
							color="success"
							fullWidth
							variant="contained"
							endIcon={<SearchIcon />}
						>
							Search
						</Button>
					</Grid>
					<Grid item width={"45%"}>
						<Button
							type={"reset"}
							color="primary"
							fullWidth
							variant="contained"
							onClick={props.clear}
							endIcon={<ClearIcon />}
						>
							clear
						</Button>
					</Grid>
				</Grid>
			</form>
		</Card>
	);
};
export default Search;

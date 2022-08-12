import axios from "axios";
import Map from "../components/Map";
import { useState, useEffect } from "react";
import { Box, Container, Card } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

const Lines = () => {
	const [selectRoute, setSelectRoute] = useState(
		"46A Outside Train Station - Phoenix Park Gate"
	);

	const handleChange = (event) => {
		setSelectRoute(event.target.value);
	};

	let marker = [];
	const [routes, setRoutes] = useState(null);

	if (routes === null) {
		const url = "http://localhost:8000/api/line_number";
		fetchData(url, setRoutes);
		//console.log(routes)
	}

	const [route, setRoute] = useState(null);

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
				data = Object.values(temp).sort();
				setFunction(data);
			},
			(error) => {
				console.log(error);
			}
		);
	}

	// Coding algorithm
	// _P10_ == '('
	// _P01  == ')'
	// _D01_ == '-'
	// _ == " "
	// _Q01_ == "\'""

	useEffect(() => {
		let modified_string = selectRoute.replace(/ /g, "_");
		modified_string = modified_string.replace(/\(/g, "_P10_");
		modified_string = modified_string.replace(/\)/g, "_P01_");
		modified_string = modified_string.replace(/-/g, "_D01_");
		modified_string = modified_string.replace(/'/g, "_Q01_");
		console.log(modified_string);
		const jsonUrl = `http://localhost:8000/api/routes/${modified_string}?format=json`;
		fetchData(jsonUrl, setRoute);
		// console.log(selectRoute)
	}, [selectRoute]);

	if (route !== null) {
		//console.log(route)
		for (let key in route) {
			let temp = route[key];
			let stop = {};
			stop["id"] = key;
			stop["name"] = temp.STOPNAME.slice(2, -2);
			stop["position"] = {
				lat: parseFloat(temp.STOPLAT.slice(1, -1)),
				lng: parseFloat(temp.STOPLON.slice(1, -1)),
			};
			marker.push(stop);
		}
		console.log(marker);
	}

	// test the fetch function and display every stop on the screen

	return (
		<Container sx={{ position: "relative", height: "100vh" }}>
			<Box
				sx={{
					position: "relative",
					height: "95vh",
					zIndex: 1000,
				}}
			>
				<Map marker={marker} />
			</Box>
			<Card
				variant="outlined"
				sx={{
					m: 1,
					p: 1,
					boxShadow: "base",
					borderRadius: "lg",
					backgroundColor: "white",
					zIndex: "modal",
					position: "absolute",
					top: "1px",
				}}
			>
				{" "}
				<Typography
					component="div"
					variant="subtitle1"
					style={{
						textAlign: "left",
						marginLeft: "8px",
					}}
				>
					Choose a different route to view on the map
				</Typography>
				<FormControl variant="standard" sx={{ m: 1, minWidth: "50vh" }}>
					<InputLabel id="route">Select Route</InputLabel>
					<Select
						labelId="select-route-label"
						id="select-route"
						value={selectRoute}
						onChange={handleChange}
						label="Route"
					>
						<MenuItem value="46A Outside Train Station - Phoenix Park Gate">
							<em>46A Outside Train Station - Phoenix Park Gate</em>
						</MenuItem>
						{routes &&
							routes.map((value) => (
								<MenuItem key={value} value={value}>
									{value}
								</MenuItem>
							))}
					</Select>
				</FormControl>
			</Card>
		</Container>
	);
};
export default Lines;

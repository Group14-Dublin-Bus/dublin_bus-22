import { Card, Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import WeatherIcon from "./WeatherIcon";
import AutorenewIcon from "@mui/icons-material/Autorenew";

function WeatherBox(props) {
	let location = "";
	let current = null;

	// check weather the state has successfully update, instead of empty state
	if (props.weather && Object.keys(props.weather).length !== 0) {
		// console.log(props.weather);
		location = props.weather.city.name + " " + props.weather.city.country;
		// console.log(location);
		current = props.weather.list[0]["weather"][0];
		// console.log(current)
	}

	return (
		<Card
			variant="outilined"
			sx={{
				background: "linear-gradient(to right bottom, #09C6F9, #045DE9)",
				opacity: [0.9, 0.8, 0.7],
				marginRight: "30px",
			}}
		>
			<Box paddingX={2}>
				<WeatherIcon
					icon={current && current.weather[0].icon}
					width="110"
					height="110"
				/>
			</Box>
			<Box
				sx={{
					position: "relative",
					top: "14.5vh",
					left: "3vh",
				}}
			>
				<Button
					sx={{
						color: "white",
						zIndex: "modal",
						paddingBottom: "30px",
					}}
					onClick={props.switch}
					endIcon={<AutorenewIcon fontSize="large" />}
				>
					Switch
				</Button>
			</Box>
			<Box paddingX={2} textAlign={"right"}>
				<Typography variant="h6" component="h6" color="white">
					{location}
				</Typography>

				<Typography variant="h3" component="h3" color="white">
					{current && current.main.temp}°C
				</Typography>

				<Typography variant="overline" color="white">
					{current && current.weather[0].description}
				</Typography>
			</Box>
		</Card>
	);
}

export default WeatherBox;

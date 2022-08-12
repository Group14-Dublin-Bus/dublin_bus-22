import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import WeatherIcon from "../components/WeatherIcon";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Grid } from "@mui/material";
import { Redirect } from "react-router-dom";

const Weather = (props) => {
	// check whether this component obtain the latest state change
	let weatherMap = null;
	let location = null;
	let currentTime = "";

	// state = {
	// 	redirect: false,
	// };
	//   setRedirect = () => {
	// 		this.setState({
	// 			redirect: true,
	// 		});
	// 	};
	// 	renderRedirect = () => {
	// 		if (this.state.redirect) {
	// 			return <Redirect to="/target" />;
	// 		}
	// 	};

	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	// console.log(props.currentWeather)

	// put the weather data in a table format

	if (props.currentWeather.list != null) {
		weatherMap = props.currentWeather.list;
		currentTime = weatherMap[0].date;
	}
	if (props.currentWeather.city != null) {
		location =
			props.currentWeather.city.name + ", " + props.currentWeather.city.country;
	}
	return (
		<Container spacing={2}>
			<Box sx={{ height: "100vh" }}>
				<Box>
					<Typography
						variant="h3"
						component="h3"
						sx={{
							margin: "10px",
							textAlign: "center",
						}}
					>
						Forecasted Weather for Dublin
					</Typography>
					<Typography
						component="p"
						variant="p"
						style={{
							textAlign: "center",
							margin: "10px",
						}}
					>
						5 day forecast, click on ribbons to view{" "}
					</Typography>
				</Box>

				{weatherMap &&
					weatherMap.map(({ dt, date, weather }) => (
						<Accordion
							key={date}
							defaultExpanded={date === currentTime}
							style={{ backgroundColor: "#00b273" }}
						>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography component="h6" variant="h6" sx={{ color: "white" }}>
									{date === currentTime
										? "Today"
										: days[new Date(weather[0].dt * 1000).getDay()] +
										  ": " +
										  new Date(date).toLocaleDateString("uk-Uk")}
								</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<TableContainer component={Paper}>
									<Table sx={{ minWidth: 650 }} aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell align="center">Hour</TableCell>
												<TableCell align="center">Wind Speed (km/h)</TableCell>
												<TableCell align="center">Wind Direction</TableCell>
												<TableCell align="center">Temp (°C)</TableCell>
												<TableCell align="center">Description</TableCell>
												<TableCell align="center">Icon</TableCell>
												<TableCell align="center">Clouds (%)</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{weather &&
												weather.map(
													({ dt_txt, main, weather, wind, clouds, index }) => (
														<TableRow
															key={dt_txt}
															sx={{
																"&:last-child td, &:last-child th": {
																	border: 0,
																},
															}}
														>
															<TableCell align="center">
																{dt_txt.split(" ")[1].split(":")[0] +
																	":" +
																	dt_txt.split(" ")[1].split(":")[1]}
															</TableCell>
															<TableCell align="center">
																<ArrowRightAltIcon
																	style={{
																		transform: `rotateZ(${wind.deg - 90}deg)`,
																	}}
																/>
															</TableCell>
															<TableCell align="center">{wind.speed}</TableCell>
															<TableCell align="center">{main.temp}</TableCell>
															<TableCell align="center">
																{weather[0].main}
															</TableCell>
															<TableCell align="center">
																<WeatherIcon
																	icon={weather[0].icon}
																	width="35"
																	height="35"
																/>
															</TableCell>
															<TableCell align="center">{clouds.all}</TableCell>
														</TableRow>
													)
												)}
										</TableBody>
									</Table>
								</TableContainer>
							</AccordionDetails>
						</Accordion>
					))}
			</Box>
		</Container>
	);
};
export default Weather;

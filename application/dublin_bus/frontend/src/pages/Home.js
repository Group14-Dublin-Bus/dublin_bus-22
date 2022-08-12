import Map from "../components/Map";
import Search from "../components/Search";
import WeatherBox from "../components/WeatherBox";
import { Grid, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import InfoPannel from "../components/InfoPannel";

const Home = (props) => {
	// check whether the component successfuly accept state changes
	// console.log(props.currentWeather)

	// store the search input from search box component as state and pass it to map component
	const [data, updateData] = useState(null);
	const [switchItem, setSwitchItem] = useState(true);
	const [directionsResponse, setDirectionsResponse] = useState(null);
	const [prediction, setPrediction] = useState(null);

	// console.log(directionsResponse)

	function switchHandler() {
		setSwitchItem(!switchItem);
	}

	// state to control map loaded

	// const[mapIsLoaded, setMapIsLoaded] = useState(false);

	function searchHandler(input) {
		updateData(input);
		setSwitchItem(false);
	}

	// clear function, not yet being used
	function clearSearch() {
		console.log("clear");
		setSwitchItem(true);
		updateData(null);
		setDirectionsResponse(null);
		setPrediction(null);
	}

	return (
		<Grid item xs={12} container spacing={2}>
			<Grid item xs={12} md={8} style={{ height: "94vh" }}>
				{/*set 1 == 2 to block rendering map to avoid uncessary charge when debuging the UI*/}
				{1 == 1 && (
					<Map
						navigation={data}
						result={setDirectionsResponse}
						prediction={setPrediction}
					/>
				)}
			</Grid>
			<Grid container item xs={12} md={4}>
				<Grid item xs={12}>
					<Search addData={searchHandler} clear={clearSearch} />
				</Grid>
				<Grid item xs={12}>
					{switchItem ? (
						<WeatherBox weather={props.currentWeather} switch={switchHandler} />
					) : (
						<InfoPannel
							info={directionsResponse}
							switch={switchHandler}
							prediction={prediction}
						/>
					)}
				</Grid>
			</Grid>
		</Grid>
	);
};
export default Home;

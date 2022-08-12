import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import Favourites from "./pages/Favourites";
import Reports from "./pages/Reports";
import Lines from "./pages/Lines";
import Weather from "./pages/Weather";
import { HashRouter } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "../static/css/App.css";
import ResponsiveAppBar from "./components/AppBar";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places"];

const App = () => {
	const [weather, setWeather] = useState(null);

	// fetch from the REST API in the componentDidMount() hook

	const { isLoaded } = useJsApiLoader({
		// Paste the google map api key into the string
		googleMapsApiKey: "AIzaSyB7iQjnxEJ-bnEgtj8HBMRkbBvt0fyLB1k",
		// this may be use for autocomplete function, but may need to load the package inside root component
		libraries,
	});

	if (!isLoaded) {
		return (
			<Box sx={{ display: "flex" }}>
				<CircularProgress />
			</Box>
		);
	}

	async function fetchWeather() {
		// Test fetch weather data in root because it may be used in multiple child component
		const jsonUrl = "http://localhost:8000/api/weather";

		let data;

		await axios.get(jsonUrl).then(
			(response) => {
				data = response.data;
				// data = Object.values(response.data);
				setWeather(data);
			},
			(error) => {
				console.log(error);
			}
		);
	}

	if (weather === null) {
		fetchWeather();
	}

	// Router to allow navigation within the application, hashrouter used to allow reload of pages on the website by the browser
	return (
		<div className="app">
			<HashRouter>
				<ResponsiveAppBar />
				<Routes>
					<Route path="/" element={<Home currentWeather={weather} />} />
					<Route path="/Lines" element={<Lines />} />
					<Route path="/Alerts" element={<Alerts />} />
					<Route path="/Favourites/:favouriteCode" element={<Favourites />} />
					<Route path="/Reports" element={<Reports />} />
					<Route
						path="/Weather"
						element={<Weather currentWeather={weather} />}
					/>
				</Routes>
			</HashRouter>
		</div>
	);
};

export default App;

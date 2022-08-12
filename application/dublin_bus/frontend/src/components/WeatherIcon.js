// reference the code: https://codesandbox.io/s/github/IgnacioCastro0713/react-weather-app?file=/src/components/WeatherComponent.jsx

import React, { useEffect, useState } from "react";

// take the icon id as input and return the according svg

function WeatherIcon(props) {
	let icon = props.icon;
	let width = props.width;
	let height = props.height;

	let [svg, setSvg] = useState("cloudy-day-1.svg");

	useEffect(() => {
		const setIcon = () => {
			if (icon === "01d") {
				setSvg("day.svg");
			}
			if (icon === "01n") {
				setSvg("night.svg");
			}
			if (icon === "02d") {
				setSvg("cloudy-day-1.svg");
			}
			if (icon === "02n") {
				setSvg("cloudy-night-1.svg");
			}
			if (icon === "03d") {
				setSvg("cloudy-day-2.svg");
			}
			if (icon === "03n") {
				setSvg("cloudy-night-2.svg");
			}
			if (icon === "04d") {
				setSvg("cloudy-day-3.svg");
			}
			if (icon === "04n") {
				setSvg("cloudy-night-3.svg");
			}
			if (icon === "09d") {
				setSvg("rainy-3.svg");
			}
			if (icon === "09n") {
				setSvg("rainy-5.svg");
			}
			if (icon === "10d" || icon === "10n") {
				setSvg("rainy-7.svg");
			}
			if (icon === "11d" || icon === "11n") {
				setSvg("thunder.svg");
			}
			if (icon === "13d" || icon === "13n") {
				setSvg("snowy-6.svg");
			}
			if (icon === "50d" || icon === "50n") {
				setSvg("cloudy.svg");
			}
		};
		setIcon();
	}, [icon]);

	return (
		// be careful with the path
		<div>
			<img
				src={`../../static/images/weather_svg/${svg}`}
				width={width}
				height={height}
				alt=""
			/>
		</div>
	);
}

export default WeatherIcon;

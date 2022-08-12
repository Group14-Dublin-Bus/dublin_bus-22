// import necessary library
import {
	GoogleMap,
	Marker,
	DirectionsRenderer,
	InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";
import axios from "axios";

// store a temporay markers to display on the map for testing

/*
let markers = [

    {
      id: 1,
      name: "UCD ",
      position: { lat: 53.3065, lng: -6.2255 }
    },

    {
      id: 2,
      name: "TCD",
      position: { lat: 53.3438, lng: -6.2546 }
    }
  ];
*/

let markers = null;

/* main rendering function, currently accept navigation as the input data from search box, 
and clear function to clear the result, this function haven't been implemented yet */

function Map(props) {
	const [center, setCenter] = useState({ lat: 53.35014, lng: -6.266155 }); // store the center of dublin

	if (props.marker != null) {
		markers = props.marker;
	}
	// state to store the direction response
	const [directionsResponse, setDirectionsResponse] = useState(null);

	// state to control the marker info window
	const [activeMarker, setActiveMarker] = useState(null);

	// Handler function to update the current activate marker
	const handleActiveMarker = (marker) => {
		if (marker === activeMarker) {
			return;
		}
		setActiveMarker(marker);
	};

	// return the start and end bus stop within the route provide by google map api, as an array
	function findStart(steps) {
		let details = [];

		for (const step in steps) {
			let current = steps[step];

			if (current.travel_mode === "TRANSIT") {
				details.push(current.transit);
			}
		}

		/* the deatils is an array of steps need from start to end using transit, 
        each element is a dictionary contains infomation include start, stop, estimate time and etc */

		return details;
	}

	async function getDirection() {
		// condition to prevent mutiple re-rendering

		if (props.navigation === null) {
			if (directionsResponse) {
				setDirectionsResponse(null);
			}
			// console.log("No search input yet!")
			return;
		} else if (
			// condition to prevent mutiple re-rendering
			directionsResponse === null ||
			directionsResponse.request.origin.query !== props.navigation.start ||
			directionsResponse.request.destination.query !== props.navigation.end
		) {
			let date = null;
			console.log(props.navigation);

			if (props.navigation && props.navigation.time) {
				date = new Date(props.navigation.time);
				console.log(props.navigation.time);
				console.log(typeof date);
			}

			const directionService = new window.google.maps.DirectionsService();
			const results = await directionService.route({
				origin: props.navigation.start,
				destination: props.navigation.end,
				travelMode: window.google.maps.TravelMode.TRANSIT,
				transitOptions: {
					departureTime: date,
					modes: ["BUS"],
				},
				// provideRouteAlternatives: true
			});
			console.log(results);
			setDirectionsResponse(results);
			props.result(results);
			// update the direction response state
			let steps = results.routes[0].legs[0].steps;

			let busResult = findStart(steps);
			// console log to see the results
			console.log(busResult);

			let url = "http://localhost:8000/api/prediction";
			let postData = [];

			for (const element in busResult) {
				let temp = busResult[element];

				let time = 6;
				if (temp.departure_time.value.getDay() !== 0) {
					time = temp.departure_time.value.getDay() - 1;
				}
				let step = {
					name: temp.line.name,
					headsign: temp.headsign,
					HOUROFDAY: temp.departure_time.value.getHours(),
					// need extra condition check
					DAYOFWEEK: time,
					MONTHOFYEAR: temp.departure_time.value.getMonth(),
					stopNumber: temp.num_stops,
					routeNumber: temp.line.short_name,
					start: temp.departure_stop.name,
					end: temp.arrival_stop.name,
				};

				postData.push(step);
			}

			console.log(postData);

			axios
				.post(url, postData)
				.then((response) => {
					props.prediction(response);
					console.log(response);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}

	if (!props.marker) {
		getDirection();
	} else {
		/*
        var bounds = new window.google.maps.LatLngBounds();

        for(var i = 0; i < markers.length; i++) {
            bounds.extend( new window.google.maps.LatLng(markers[i].lat, markers[i].lng));
        }

        window.google.map.fitBounds(bounds)
        */
		// setCenter(props.marker[])
		if (props.marker && props.marker.length) {
			const mid_stop = Math.floor(props.marker.length / 4);

			console.log(mid_stop);

			const new_center = props.marker[mid_stop];

			console.log(new_center);
			if (new_center.position) {
				if (new_center.position !== center) {
					setCenter(new_center.position);
				}
			}
		}
	}

	return (
		<GoogleMap
			onClick={() => setActiveMarker(null)}
			center={center}
			zoom={12}
			mapContainerStyle={{ width: "100%", height: "100%" }}
			options={{
				streetViewControl: false,
				mapTypeControl: false,
			}}
		>
			{markers &&
				markers.map(({ id, name, position }) => (
					<Marker
						key={id}
						position={position}
						onClick={() => handleActiveMarker(id)}
					>
						{activeMarker === id ? (
							<InfoWindow onCloseClick={() => setActiveMarker(null)}>
								<div>{name}</div>
							</InfoWindow>
						) : null}
					</Marker>
				))}

			{directionsResponse && (
				<DirectionsRenderer directions={directionsResponse} />
			)}
		</GoogleMap>
	);
}

export default Map;

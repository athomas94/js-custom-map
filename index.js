
//map
const myMap = {
    coordinates: [],
    map: [],
    markers: [],
    businesses: [],
    
    // build leaflet map
	buildMap() {
		myMap.map = L.map('map', {
		center: myMap.coordinates,
		zoom: 11,
		});
		// add openstreetmap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(myMap.map)
		// create and add geolocation marker
		const marker = L.marker(myMap.coordinates)
		marker
		.addTo(myMap.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	},
    // add business markers
	addMarkers() {
		for (var i = 0; i < myMap.businesses.length; i++) {
		    myMap.markers = L.marker([
			myMap.businesses[i].lat,
			myMap.businesses[i].long,
		])
			.bindPopup(`<p1>${myMap.businesses[i].name}</p1>`)
			.addTo(myMap.map)
		}
	},
};

// Get the user's coords:                                                              
async function getCoords(){
     position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    return [position.coords.latitude, position.coords.longitude]
}

// get foursquare businesses
async function getFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq39S1qyCYQ68E8O6fT6CaOs1PiEWO/YpPXvjsxj+5PAt0='
		}
	}
	let limit = 5
	let lat = myMap.coordinates[0]
	let long = myMap.coordinates[1]
	let response = await fetch(`https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${long}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}
// process foursquare array
function processBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

// window load
window.onload = async () => {
	const coords = await getCoords()
	myMap.coordinates = coords
	myMap.buildMap()
}

// business submit button
document.getElementById('submit').addEventListener('click', async (event) => {
	event.preventDefault()
	let business = document.getElementById('business').value
	let data = await getFoursquare(business)
	myMap.businesses = processBusinesses(data)
	myMap.addMarkers()
})
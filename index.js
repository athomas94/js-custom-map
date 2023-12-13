
//get Position

var latitude = position.coords.latitude;
var longitude = position.coords.longitude;

//map
const myMap = L.map('map', {
    center: [latitude, longitude],
    zoom: 15,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '15',
    }).addTo(myMap)
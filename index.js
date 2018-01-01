/*

Given:
* Landing point (lat, long, altitude?)
* Direction vector of desired landing flight path (landing strip azimuth, landing incline angle)
* Current location of the plane (lat, long, altitude)

Calculate:
* The distance and direction from the desired landing flight path

Display:
* Indicator for how to correct towards the desired flight path.

====



*/




var output;

function outputText(text) {
    var prevHtml = output.innerHTML;
    output.innerHTML = '<p>' + text + '</p>' + prevHtml;
}

function geoSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var altitude = position.coords.longitude;
    var timestamp = new Date().toISOString();

    outputText('Latitude is ' + latitude
        + ' <br/>Longitude is ' + longitude
        + ' <br/>Altitude is ' + altitude
        + ' <br/>Time is ' + timestamp
    );

    /*var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
    output.appendChild(img);*/
}

function geoError(err) {
    output.innerHTML = "Unable to retrieve your location";
    showAlert('Geo error - ' + err.code + ' - ' + err.message);
}

function setupLog() {
    output = document.getElementById("log");
}

function watchPosition() {
    if (!navigator.geolocation){
        outputText("Geolocation is not supported by your browser");
        return;
    }

    outputText("Locating...123");
    var geoOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5000,
    };

    navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
}

function setupButtons() {
    document.getElementById('start-button').onclick = watchPosition;
}

function main() {
    setupLog();
    setupButtons();
}

if (document.readyState === 'complete' || document.readyState !== 'loading') {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}

function geoFindMe() {
    var output = document.getElementById("out");

    function outputText(text) {
        var prevHtml = output.innerHTML;
        output.innerHTML = '<p>' + text + '</p>' + prevHtml;
    }

    function geo_success(position) {
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

    function geo_error(err) {
        output.innerHTML = "Unable to retrieve your location";
        showAlert('Geo error - ' + err.code + ' - ' + err.message);
    }

    function geoToXyz() {
        // https://en.wikipedia.org/wiki/Geographic_coordinate_conversion#From_geodetic_to_ECEF_coordinates        
    }

    function main() {
        if (!navigator.geolocation){
            outputText("Geolocation is not supported by your browser");
            return;
        }

        outputText("Locating...123");
        var geo_options = {
            enableHighAccuracy: false,
            timeout: 1000,
            maximumAge: 1000,
        };

        navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
    }

    main();
}


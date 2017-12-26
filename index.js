function geoFindMe() {
    var output = document.getElementById("out");

    if (!navigator.geolocation){
        output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
        return;
    }

    function geo_success(position) {
        var latitude    = position.coords.latitude;
        var longitude = position.coords.longitude;

        output.innerHTML = '<p>Latitude is ' + latitude + ' <br>Longitude is ' + longitude + '</p>';

        /*var img = new Image();
        img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
        output.appendChild(img);*/
    }

    function geo_error(err) {
        output.innerHTML = "Unable to retrieve your location";
        showAlert('geoError ' + err.code + ' - ' + err.message);
    }

    output.innerHTML = "<p>Locating...123</p>";
    
    var geo_options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    };


    navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
}


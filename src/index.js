//import { setTimeout } from 'core-js/library/web/timers';
//import { setInterval } from 'core-js/library/web/timers';

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

var geo = require('./geo');
var testData = require('./test-data');

var outputElem;
var paramsData = null;
var runwayElem;
var isStarted = false;

function outputText(text) {
    var prevHtml = outputElem.innerHTML;
    outputElem.innerHTML = '<p>' + text + '</p>' + prevHtml;
}

function getParamsFromUrl() {
    var query = location.search.substr(1);
    var result = {};
    query.split("&").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}

function setRunwayPos(x, y) {
    // 50, 50 is the middle
    // 0, 0 is top left
    // 100, 100 is bottom right
    runwayElem.style.top = y + '%';
    runwayElem.style.left = x + '%';
}

function limit(min, val, max) {
    if (val < min) {
        return min;
    }
    if (val > max) {
        return max;
    }
    return val;
}

function geoSuccess(position) {
    var currentLla = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        altitude: position.coords.altitude,
    };
    var currentPoint = geo.geoToXyz(currentLla);

    var landingPoint = geo.geoToXyz({
        lat: paramsData.lat,
        lon: paramsData.lon,
        altitude: paramsData.altitude,
    });

    var descentVec = geo.getDescentVec(landingPoint, paramsData.azimuth, paramsData.descentAngle);
    var correction = geo.correctLanding(landingPoint, descentVec, currentPoint);

    outputText(JSON.stringify(currentLla, null, 4));
    outputText(JSON.stringify(correction, null, 4));

    // Convert to screen coordinates
    // goLeft and goDown are (-500, 500)
    // but the screen is (0, 100)
    var goLeft = limit(-500, correction.goLeft, 500);
    var goDown = limit(-500, correction.goDown, 500);
    var runwayX = Math.floor(-goLeft / 10.0) + 50;
    var runwayY = Math.floor(goDown / 10.0) + 50;
    setRunwayPos(runwayX, runwayY);

    /*
    var timestamp = new Date().toISOString();
    outputText('Latitude is ' + currentLla.lat
        + ' <br/>Longitude is ' + currentLla.lon
        + ' <br/>Altitude is ' + currentLla.altitude
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
    outputElem = document.getElementById("log");
}

function startWatchPosition() {
    if (isStarted) {
        return;
    } else {
        isStarted = true;
    }

    if (!navigator.geolocation){
        outputText("Geolocation is not supported by your browser");
        return;
    }

    if (!paramsData) {
        outputText("Define a landing strip first");
        return;
    } else {
        outputText(JSON.stringify(paramsData, null, 4));
    }

    outputText("Locating...123");
    var geoOptions = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5000,
    };
    /*
    function getPos() {
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    }
    setInterval(getPos, 3000);
    getPos();*/

    navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);

}

function llaToCoord(lla) {
    return {
        coords: {
            longitude: lla.lon,
            latitude: lla.lat,
            altitude: lla.altitude,
        },
    };
}

function oneTest(testCase) {
    const landingPoint = geo.parseLlaToXyz(testCase.llaText);
    const descentVec = geo.getDescentVec(landingPoint, testCase.azimuth, testCase.descentAngle);
    
    //const notBadPoint = geo.parseLlaToXyz(testCase.tests.notBad);
    //const correction = geo.correctLanding(landingPoint, descentVec, notBadPoint);
    //console.log(notBadLla);
    //console.log(geo.geoToXyz(notBadLla));
    var points = [
        testCase.tests.notBad,
        testCase.tests.tooLow,
        testCase.tests.tooHigh,
        testCase.tests.turnLeft,
        testCase.tests.turnRight,
    ];
    var i = 0;
    function next() {
        if (i >= points.length) {
            return;
        }
        geoSuccess(llaToCoord(geo.parseLatLonAltitude(points[i])));
        i += 1;
        setTimeout(next, 1000);
    }
    next();

    
    /*geoSuccess(llaToCoord(geo.parseLatLonAltitude(testCase.tests.notBad)));
    geoSuccess(llaToCoord(geo.parseLatLonAltitude(testCase.tests.tooLow)));
    geoSuccess(llaToCoord(geo.parseLatLonAltitude(testCase.tests.tooHigh)));
    geoSuccess(llaToCoord(geo.parseLatLonAltitude(testCase.tests.turnLeft)));
    geoSuccess(llaToCoord(geo.parseLatLonAltitude(testCase.tests.turnRight)));
    /*
    console.log('not bad', correction);

    const tooLowPoint = geo.parseLlaToXyz(testCase.tests.tooLow);
    const correctionLow = geo.correctLanding(landingPoint, descentVec, tooLowPoint);
    console.log('too low', correctionLow);

    const tooHighPoint = geo.parseLlaToXyz(testCase.tests.tooHigh);
    const correction2 = geo.correctLanding(landingPoint, descentVec, tooHighPoint);
    console.log('too high', correction2);

    const turnLeftPoint = geo.parseLlaToXyz(testCase.tests.turnLeft);
    const correction3 = geo.correctLanding(landingPoint, descentVec, turnLeftPoint);
    console.log('turn left', correction3);

    const turnRightPoint = geo.parseLlaToXyz(testCase.tests.turnRight);
    const correction4 = geo.correctLanding(landingPoint, descentVec, turnRightPoint);
    console.log('turn right', correction4);
    */
}

function runTests() {
    paramsData = geo.parseLatLonAltitude(testData.exampleRishon.llaText);
    paramsData.azimuth = testData.exampleRishon.azimuth;
    paramsData.descentAngle = testData.exampleRishon.descentAngle;

    oneTest(testData.exampleRishon);
}

function setupButtons() {
    document.getElementById('start-button').onclick = startWatchPosition;
    document.getElementById('test-button').onclick = runTests;
    runwayElem = document.getElementById('runway-icon');
}

function main() {
    setupLog();
    setupButtons();
    
    var paramsObj = getParamsFromUrl();
    var paramsBox = document.getElementById('parameters');
    var paramsLine = paramsObj.q || '';
    paramsBox.value = paramsLine;
    
    // query parameter should be
    // lat,lon,altitude,azimuth,descent-angle
    if (paramsLine) {
        var parts = paramsLine.split(',');
        paramsData = {
            lat: +parts[0],
            lon: +parts[1],
            altitude: +parts[2],
            azimuth: +parts[3],
            descentAngle: +parts[4],
        }
    }
    var paramNames = ["lat", "lon", "altitude", "azimuth", "descentAngle"];
    for (var i = 0; i < paramNames.length; i++) {
        var param = paramsData[paramNames[i]];
        if (typeof param !== "number" || isNaN(param)) {
            outputText("Invalid parameter: " + paramNames[i] + " = " + param);
        }
    }
    //outputText("Main");
    //alert(geo);
}

if (document.readyState === 'complete' || document.readyState !== 'loading') {
    main();
} else {
    document.addEventListener('DOMContentLoaded', main);
}

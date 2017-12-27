const earthRadiusMeters = 6378137.0;

exports.geoToXyz = function({lat, lon, altitude}) {
    // https://en.wikipedia.org/wiki/Geographic_coordinate_conversion#From_geodetic_to_ECEF_coordinates        
    // https://stackoverflow.com/questions/8981943/lat-long-to-x-y-z-position-in-js-not-working
    var cosLat = Math.cos(lat * Math.PI / 180.0);
    var sinLat = Math.sin(lat * Math.PI / 180.0);
    var cosLon = Math.cos(lon * Math.PI / 180.0);
    var sinLon = Math.sin(lon * Math.PI / 180.0);
    var rad = earthRadiusMeters;
    var f = 1.0 / 298.257224;
    var C = 1.0 / Math.sqrt(cosLat * cosLat + (1 - f) * (1 - f) * sinLat * sinLat);
    var S = (1.0 - f) * (1.0 - f) * C;
    var h = altitude; // 0.0
    // [0, 0, rad] = North pole
    // [0, 0, -rad] = South Pole
    return {
        x: (rad * C + h) * cosLat * cosLon,
        y: (rad * C + h) * cosLat * sinLon,
        z: (rad * S + h) * sinLat,
    }
}

exports.parseLatLonAltitude = function(text) {
    const parts = text.split(',');
    if (parts.length !== 3) {
        throw new Error("Invalid LatLonAltitude string: " + text);
    }
    return {
        lat: +parts[0],
        lon: +parts[1],
        altitude: +parts[2],
    }
}

exports.getDescentVec = function(landingPoint, azimuthAngleDeg, descentAngleDeg) {
    const northPole = vec(0, 0, earthRadiusMeters);
    const westAtLanding = vecNormalize(vecCross(landingPoint, northPole));
    const upAtLanding = vecNormalize(landingPoint);
    const southAtLanding = vecCross(upAtLanding, westAtLanding);
    const azimuthAngleRad = azimuthAngleDeg * Math.PI / 180;
    // Imagine a circle, the top is north, a triangle drawn from the center to the azimuth,
    // then to the circle vertical axis and back to the center.
    const northAmount = Math.cos(azimuthAngleRad);
    const eastAmount = Math.sin(azimuthAngleRad);
    const northProjection = vecScale(southAtLanding, -northAmount);
    const eastProjection = vecScale(westAtLanding, -eastAmount);
    const azimuthDirectionVec = vecNormalize(vecAdd(northProjection, eastProjection));

    // Combining the azimuth direction with the up direction and incline
    // This might be a bug - if the earth is round - the "upAtLanding" is the wrong vector to use
    // but rather a round curve alongside earth with linearly rising altitude should be used.
    // Or more simply - using the LLA coordinates for this math instead.
    const inclineFactor = Math.tan(descentAngleDeg * Math.PI / 180);
    const climbForOne = vecScale(upAtLanding, inclineFactor);
    return vecNormalize(vecAdd(climbForOne, azimuthDirectionVec));
}

function vecDot({x: x1, y: y1, z: z1}, {x: x2, y: y2, z:z2}) {
    return x1 * x2 + y1 * y2 + z1 * z2;
}

function vecSub({x: x1, y: y1, z: z1}, {x: x2, y: y2, z:z2}) {
    // vecSub(a, b) = `a` - `b` = from `b` to `a`
    // Because when you add `b` you get to `a`.
    return {
        x: x1 - x2,
        y: y1 - y2,
        z: z1 - z2,
    };
}

function vecAdd({x: x1, y: y1, z: z1}, {x: x2, y: y2, z:z2}) {
    return {
        x: x1 + x2,
        y: y1 + y2,
        z: z1 + z2,
    };
}

function vecSize({x, y, z}) {
    return Math.sqrt(x * x + y * y + z * z);
}

function vecScale({x, y, z}, factor) {
    return {
        x: x * factor,
        y: y * factor,
        z: z * factor,
    }
}

function vecCross({x: x1, y: y1, z: z1}, {x: x2, y: y2, z:z2}) {
    return {
        x: y1 * z2 - z1 * y2,
        y: z1 * x2 - x1 * z2,
        z: x1 * y2 - y1 * x2,
    }
}

function vecNormalize(vector) {
    return vecScale(vector, 1.0 / vecSize(vector));
}

function vecEquals({x: x1, y: y1, z: z1}, {x: x2, y: y2, z:z2}) {
    return x1 === x2 && y1 === y2 && z1 === z2;
}

function xyzToAltitude(vector) {
    return vecSize(vector) - earthRadiusMeters;
}

exports.parseLlaToXyz = function(text) {
    return exports.geoToXyz(exports.parseLatLonAltitude(text));
}

exports.correctLanding = function(landingPoint, descentDirection, jetPoint) {
    const jetToTarget = vecSub(landingPoint, jetPoint);
    const targetToJet = vecSub(jetPoint, landingPoint);
    const targetToJetDirection = vecNormalize(targetToJet);
    
    const sizeDescentVector = vecDot(descentDirection, targetToJet);
    const landingToClosestDescentPoint = vecScale(descentDirection, sizeDescentVector);
    const closestDescentPoint = vecAdd(landingToClosestDescentPoint, landingPoint);
    
    // Where is the descent point as viewed from a camera in the cockpit
    // goDown is positive when the jet is too high.
    const goDown = xyzToAltitude(jetPoint) - xyzToAltitude(closestDescentPoint);

    // thinking here that "jetPoint" points to the sky above the jet,
    // then the cross between that and the target is the left (right hand rule).
    const leftOfJet = vecNormalize(vecCross(jetPoint, jetToTarget));
    const jetToClosestDescentPoint = vecSub(closestDescentPoint, jetPoint);
    const goLeft = vecDot(leftOfJet, jetToClosestDescentPoint);
    return {
        goDown,
        goLeft,
    }
}

function assert(val, reason) {
    if (!val) {
        throw new Error(reason);
    }
}

function vec(x, y, z) {
    return {x, y, z};
}

exports.test = function() {
    assert(vecSize(vec(0, 1, 0)) === 1.0);
    assert(vecSize(vec(1, 0, 0)) === 1.0);
    assert(vecSize(vec(0, 0, 1)) === 1.0);
    assert(vecSize(vec(1, 1, 1)) === 1.7320508075688772935274463415059);
    assert(vecEquals(vecNormalize(vec(6, 0, 0)), vec(1, 0, 0)));
    assert(vecDot(vec(1, 0, 0), vec(0, 1, 0)) === 0.0);
    assert(vecEquals(vecCross(vec(1, 0, 0), vec(0, 1, 0)), vec(0, 0, 1)));
}

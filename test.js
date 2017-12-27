const geo = require('./geo.js');

//  31.96750000, 34.75361111
const example = {
    lat: 31.96750000,
    lon: 34.75361111,
    altitude: 21.0,
    azimuth: 1,
    descentAngle: 3,
    tests: {
        tooLow: '31.97950000,34.75391111,21',
        tooHigh: '31.97950000,34.75391111,2100',
        notBad: '31.97950000,34.75391111,89', // ~1300 meters north, at 3° = 21m+68m
        turnRight: '31.97950000,34.75991111,89', // too east for a northern approach
        turnLeft: '31.97950000,34.74891111,89', // too west for a northern approach
    }
}

function main() {
    console.log('testing');
    console.log(geo.geoToXyz(example));

    geo.test();

    const descentVec = geo.getDescentVec(example, example.azimuth, example.descentAngle);

    const notTooBadLla = geo.parseLatLonAltitude(example.tests.notBad);
    const correction = geo.correctLanding(example, descentVec, notTooBadLla);
    console.log(correction);
    console.log(notTooBadLla);
    console.log(geo.geoToXyz(notTooBadLla));

    const tooHighLla = geo.parseLatLonAltitude(example.tests.tooHigh);
    const correction2 = geo.correctLanding(example, descentVec, tooHighLla);
    console.log(correction2);

    const turnLeftLla = geo.parseLatLonAltitude(example.tests.turnLeft);
    const correction3 = geo.correctLanding(example, descentVec, turnLeftLla);
    console.log(correction3);

    const turnRightLla = geo.parseLatLonAltitude(example.tests.turnRight);
    const correction4 = geo.correctLanding(example, descentVec, turnRightLla);
    console.log(correction4);

}


main();


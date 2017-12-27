const geo = require('./geo.js');

//  31.96750000, 34.75361111
const exampleRishon = {
    llaText: '31.96750000, 34.75361111, 21',
    azimuth: 359.84,
    descentAngle: 3,
    tests: {
        notBad:    '31.979500, 34.75391111, 89', // ~1300 meters north, at 3° = 21m+68m
        tooLow:    '31.979500, 34.75391111, 21',
        tooHigh:   '31.979500, 34.75391111, 2100',
        turnLeft:  '31.979500, 34.74891111, 89', // too west for a northern approach
        turnRight: '31.979500, 34.75991111, 89', // too east for a northern approach
        farther:   '31.993439, 34.75526400, 161', // 21m + 140m (about 3,000 m away from landing at 3°)
    }
}

const exampleTlv = {
    llaText: '32.000169,34.893603,40',
    azimuth: 121.7,
    descentAngle: 3,
    tests: {
        notBad:    '31.980072, 34.932144, 264.7', // 4288 m away south east, tan(3 deg) * 4288 = 224.7, +40 = 264.7
        tooLow:    '31.980072, 34.932144, 64.7',
        tooHigh:   '31.980072, 34.932144, 464.7',
        turnLeft:  '32.010072, 34.932144, 264.7',
        turnRight: '31.950072, 34.932144, 264.7',
    }
}

function testExample(testCase) {
    const landingPoint = geo.parseLlaToXyz(testCase.llaText);
    const descentVec = geo.getDescentVec(landingPoint, testCase.azimuth, testCase.descentAngle);
    
    const notBadPoint = geo.parseLlaToXyz(testCase.tests.notBad);
    const correction = geo.correctLanding(landingPoint, descentVec, notBadPoint);
    //console.log(notBadLla);
    //console.log(geo.geoToXyz(notBadLla));
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

    //const fartherPoint = geo.parseLatLonAltitude(testCase.tests.farther);
    //const correctionFar = geo.correctLanding(landingPoint, descentVec, fartherLla);
    //console.log('farther', correctionFar);

    //const correctionZero = geo.correctLanding(landingPoint, descentVec, landingPoint);
    //console.log('zero', correctionZero);

}

function main() {
    console.log('testing');
    const rishonLla = geo.parseLatLonAltitude(exampleRishon.llaText)
    console.log(geo.geoToXyz(rishonLla));

    geo.test();

    console.log('--- Tlv ---');
    testExample(exampleTlv);
    console.log('--- Rishon ---');
    testExample(exampleRishon);
}


main();


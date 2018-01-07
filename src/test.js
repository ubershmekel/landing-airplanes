const geo = require('./geo.js');
const testData = require('./test-data');

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
    const rishonLla = geo.parseLatLonAltitude(testData.exampleRishon.llaText)
    console.log(geo.geoToXyz(rishonLla));

    geo.test();

    console.log('--- Tlv ---');
    testExample(testData.exampleTlv);
    console.log('--- Rishon ---');
    testExample(testData.exampleRishon);
}


main();


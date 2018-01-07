
//  31.96750000, 34.75361111
export const exampleRishon = {
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

export const exampleTlv = {
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
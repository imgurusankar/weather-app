const http = require('http')

const geocode = (address, callback) => {
    let options = {
        host: 'api.mapbox.com',
        path: `/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiaWFtZ3VydXNhbmthciIsImEiOiJja3Rpbm0zYmoxM3dkMm5tdXp1ODJ1M2VuIn0.3t5AxqFwVe0uRm3w-GO5fA&limit=1`
    }
    http.get(options, (response) => {
        const { statusCode } = response
        let error;
        if (statusCode !== 200) {
            error = Error('Request Failed\n' + `Status Code ${statusCode}`)
        }
        if (error) {
            callback('Check your internet connection', undefined);
        }
        var data = '';
        response.on('data', function (chunk) {
            data += chunk;
        });
        response.on('end', function () {
            var parsedData = JSON.parse(data);
            var features = parsedData.features[0];
            if (features === undefined || features.center === undefined) {
                console.log('Check the input properly');
            } else {
                callback(undefined, {
                    longtitude: parsedData.features[0].center[0],
                    latitude: parsedData.features[0].center[1],
                    location: parsedData.features[0].place_name
                })
            }
        })
    })
}

module.exports = geocode;
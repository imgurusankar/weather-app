const http = require('http');

const forecast = (latitude, longtitude, callback) => {
    let options = {
        host: 'api.weatherstack.com',
        path: `/current?access_key=081b8f190683892527926c9344af2772&query=${latitude},${longtitude}&units=f`
    }
    http.get(options, (response) => {
        const { statusCode } = response;
        let error;
        if (statusCode !== 200) {
            error = new Error(`Request failed \n Status Code :: ${statusCode}`)
        }
        if (error) {
            callback(error.message, undefined)
        }
        var data = "";
        response.on("data", (chunk) => {
            data += chunk;
        })
        response.on("end", () => {
            const parsedData = JSON.parse(data);
            var formattedData = parsedData.current;
            if (formattedData != undefined) {
                callback(undefined, `It is currently ${formattedData.temperature} farenhit out. It feels like ${formattedData.feelslike} farenhit out.`);
            } else {
                callback('Incorrect location co-ordinates', undefined);
            }
        })
    })
}

module.exports = forecast;
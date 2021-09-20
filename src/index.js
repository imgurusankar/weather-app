const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../pages/views')
const partialsPath = path.join(__dirname, '../pages/partials')

//Handle bars view section config
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Serves static pages to the server
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        credits: 'Ung Minds'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        credits: 'Ung Minds'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'For any queries contact on +91 7904020584',
        title: 'Help',
        credits: 'Ung Minds'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Provide the address to get weather details'
        })
    }
    geocode(req.query.address, (error, { latitude, longtitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
        forecast(latitude, longtitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }
            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('pagenotfound', {
        title: '404',
        message: 'Help article not found',
        credits: 'Ung Minds'
    })
})

app.get('*', (req, res) => {
    res.render('pagenotfound', {
        title: '404',
        message: 'Page not found',
        credits: 'Ung Minds'
    })
})

app.listen(3000, () => {
    console.log('Server is running..!!')
})
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

//rover 
app.get('/rovers/:rover_name', async (req, res) => {
    let rover_name = req.params.rover_name
    try {
        const rovers = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover_name}/photos?sol=1000&api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ rovers })
    }
    catch (err) {
        console.log('/rovers error:', err)
    }
})
//mission manifest
app.get('/manifest/:rover_name', async (req, res) => {
    let rover_name = req.params.rover_name
    try {
        const rover_photos = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${rover_name}&api_key=${process.env.API_KEY}`)
            .then(res => {
                return res.json()
            })
        res.send({ rover_photos })
    }
    catch (err) {
        console.log('/mission manifest error', err)

    }
})

// today image
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })

    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
const express = require('express')
const mbgl = require('@mapbox/mapbox-gl-native')
const tilebelt = require('@mapbox/tilebelt')
const request = require('request')
const sharp = require('sharp')
const fs = require('fs')

const app = express()

let map = new mbgl.Map({
  request: (req, cb) => {
    request({
      url: req.url, encoding: null, gzip: true
    }, (err, res, body) => {
      if (err) {
        cb(err)
      } else if (res.statusCode === 200) {
        let response = {}
        if (res.headers.modified) {
          response.modified = new Date(res.headers.modified)
        }
        if (res.headers.expires) {
          response.expires = new Date(res.headers.expires)
        }
        if (res.headers.etag) {
          response.etag = res.headers.etag
        }
        response.data = body
        cb(null, response)
      } else {
        cb(new Error(res.statusCode))
      }
    })
  }
})

map.load(JSON.parse(fs.readFileSync('../onyx-tapioca/style.json')))

app.get('/:z/:x/:y', (req, res) => {
  const bbox = tilebelt.tileToBBOX([
    parseInt(req.params.x),
    parseInt(req.params.y),
    parseInt(req.params.z)
  ])
  const center = [
    (bbox[0] + bbox[2]) / 2,
    (bbox[1] + bbox[3]) / 2
  ]

  map.render({
    zoom: req.params.z,
    center: center
  }, (err, buffer) => {
    if (err) {
      console.error(err)
      res.send(err)
    } else {
      let image = sharp(buffer, {
        raw: { width: 512, height: 512, channels: 4 }
      })
      res.set('content-type', 'image/png')
      image.png().toBuffer()
        .then((result) => {
          res.send(result)
        })
    }
  })
})

app.listen(8888, () => {
  console.log(`the server is ready.`)
})


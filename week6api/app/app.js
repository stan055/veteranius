const express = require('express');
const path = require('path');
const request = require("request");
const app = express();
const axios = require('axios');
var PastebinAPI = require('pastebin-js');
var HTMLParser = require('node-html-parser');

process.env.PWD = process.cwd()
app.use(express.static(process.env.PWD + '/client'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.get('/medium', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'medium.html'))
})

app.get('/hard', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'hard.html'))
})

app.use(express.json())

app.post('/api-aviationstack', (req, res) => {
  url = 'http://api.aviationstack.com/v1/flights'
  const aviaKey = 'cc3ff46cc95ac84190601c134ef11f6b'
  let params = req.body
  params.access_key = aviaKey
  axios.get('http://api.aviationstack.com/v1/flights', {params})
  .then(response => {
    const apiResponse = response.data;
    res.status(200).json(apiResponse)
  }).catch(error => {
    console.log(error);
  });
})

app.post('/apiiss', (req, res) => {
  const apiIss = 'http://api.open-notify.org/iss-now.json'

  request.get(apiIss, (error, response, body) => {
    if (JSON.parse(body).message == 'success')
      res.status(200).json(JSON.parse(body))
    else
      res.status(501).json(JSON.parse(body))
  });
})

app.post('/apiiss-pass', (req, res) => {

  const apiIss = `http://api.open-notify.org/iss-pass.json?lat=50.4&lon=30.5&n=1`

  request.get(apiIss, (error, response, body) => {
    var resolve = JSON.parse(body)
    if(resolve.message == 'success') {
      res.status(200).json(resolve)
    }
    else
      res.status(501).json(body)
  });
})

app.post('/api-serpstack', (req, res) => {

  const url = 'https://www.google.com/search?q=trident&start=10'

  request.get(url, (error, response, body) => {
    if(body) {
      var root = HTMLParser.parse(body)
      res.status(200).json(root.querySelectorAll('#main div').toString())
    } else {
      res.status(501)
    }
  });
})

app.post('/api', (req, res) => {
  const pasteKey = 'ie3KHhGNGAJb5olL38grQp9JM_FbeKJl'
  pastebin = new PastebinAPI({
      'api_dev_key' : pasteKey,
     });
  pastebin
      .createPaste({
          text: req.body.body,
          title: req.body.title,
          format: null,
          privacy: 0,
          expiration: '1D'
      })
      .then(function (data) {
  // paste succesfully created, data contains the id
  res.status(200).json(data)
})
.fail(function (err) {
  // Something went wrong
  res.status(501).json(err.message)
})
})


const PORT = process.env.PORT || 80
app.listen(PORT, () => console.log('Server has been started on port 80...'))
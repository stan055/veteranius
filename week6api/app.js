const express = require('express');
const path = require('path');
const request = require("request");
const app = express();
const axios = require('axios');
var PastebinAPI = require('pastebin-js');

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
  const lat = 50.4
  const lon = 30.5
  const alt = 100
  const apiIss = `http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}&alt=${alt}&n=1`

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
  const key = '013dbcc35e77eb38d08a0b88c4e22cfd' 
  const q = 'trident'
  const url = 'http://api.serpstack.com/search?access_key='+key+'&type=web'+'&query='+q+'&page=2'+'&num=10'+'&gl=ua'+'&hl=uk'
  request.get(url, (error, response, body) => {
    if(body) {
      var resolve = JSON.parse(body)
      res.status(200).json(resolve)
    } else {
      res.status(501)
    }
    
  })
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
app.listen(PORT, () => console.log('Server has been started on port 3000...'))
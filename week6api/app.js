const express = require('express')
const path = require('path')
const app = express()
var PastebinAPI = require('pastebin-js')

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
const pasteKey = 'ie3KHhGNGAJb5olL38grQp9JM_FbeKJl'
app.post('/api', (req, res) => {
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



app.listen(3000, () => console.log('Server has been started on port 3000...'))
const Crawler = require("js-crawler");
const express = require('express');  
const app = express();  
const server = require('http').Server(app);  
const io = require('socket.io')(server); 
const bodyParser = require('body-parser')
const cors = require('cors')
const jobs = [];


app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

/*
io.on('connection', function(socket) {  
  console.log('Un cliente se ha conectado');
  socket.emit('messages', {type: 'connected'});

  socket.on('new-message', (data) => {
    console.log(data);
  })
});
*/

app.get('/getsite', (req, res) => {
  const crawler = new Crawler().configure({depth: 2});
  const { url } = req.query;
  if (!url) {
    res.json({error: true, message: "You need an url to crawling"});
    return;
  }
  crawler.crawl({
    url, 
    success: page => {
      console.log(`Crawling: ${url}`);
    },
    finished: urls => {
      console.log("finished!")
      res.json(urls)
    }
  });
})

server.listen(8080, () => console.log('Server running on http://localhost:8080'));

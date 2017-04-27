const Crawler = require("js-crawler");
const request = require("request");
const cheerio = require("cheerio");
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

const getLinks = page => {
  const $ = cheerio.load(page);
  const links = $('a');
  let result = [];
  $(links).each((i, link) => result.push($(link).attr('href')));
  result = result.filter(x => /^(http|https)/.test(x)); 
  return result;
}

const getPage = url => new Promise ((resolve, reject) => {
  request(url, (err, response, body) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(getLinks(body));
  })
})

const done = {};
const theResult = {};
function buildRes (url, level, n) {
  return new Promise((resolve, reject) => {
    if (level < 3) {
      level++;
      if (done[url]) {
        resolve();
        return;
      }

      n.url = url;
      getPage(url).then((links) => {
        n.childs = links.map(x => ({url: x}));
        done[url] = true;
        const qs = links.map((x, idx) => buildRes(x, level, n.childs[idx]));
        Promise.all(qs).then(() => {
          resolve()
        })
      }, err => reject(err));
    } else {
      resolve();
    }
  });
}

app.get('/rec', (req, res) => {
  const { url } = req.query;
  if (!url) {
    res.json({error: true, message: "You need an url to crawling"});
    return;
  }
 
  buildRes(url, 0, theResult)
    .then(
      () => res.json(theResult), 
      err => res.status(500).json({err: err})
    );
})

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

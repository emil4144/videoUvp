const express = require('express');
const app = express();
const server = require('https').Server(app);
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./configs/config');
const fs=require("fs")
var request = require('request');
const NodeMediaServer = require('node-media-server'); 
app.use(express.static('public'));
var mkdirp = require('mkdirp');
require('./configs/db')
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(function (req, res, next) {
//     if (!req.headers.authorization) {
//         return res.status(403).json({ error: 'No credentials sent!' });
//     }
//     next();
// });

app.get('/record1/:userId',function(req, res) {
    var videos = fs.readdirSync(`./public/live/${req.params.userId}`);
    links=""
    for(let video of videos){
      links+=`<a href="/record1/${req.params.userId}/${video}" style="display:block">${video}</a>`
    }
    res.send(links.toString()+" ");
  })  
  app.get("/record1/:userId/:record",function(req, res) {
    let h=`
      <script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.min.js"></script>
      <video id="videoElement" controls></video>
      <script>
        if (flvjs.isSupported()) {
          var videoElement = document.getElementById('videoElement');
            var flvPlayer = flvjs.createPlayer({
                type: 'flv',
                url: '/live/${req.params.userId}/${req.params.record}'
            });
            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
            flvPlayer.play();
        }
      </script> 
    `
    res.send(h)
  })
  app.get('/records/:userId',function(req, res) {
    var videos = fs.readdirSync(`./public/live/${req.params.userId}`);    
    res.send(videos);
  })
require('./configs/routes')(app);

app.listen(config.port, () => {
    console.log(`app listen on port: ${config.port}`)
})

// app.listen(config.port, () => {
//     console.log(`app listen on port: ${config.port}`)
// })



process.on('uncoughtExeption', (err) => {
    console.log(`uncoughtExeption ${err.message}`);
    process.exit(1);
})






const msConfig = {
    rtmp: {
      port: 1935,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: 8000,
      mediaroot: './media',
      allow_origin: '*'
    },
    /*trans: {
      ffmpeg: './ffmpeg/ffmpeg.exe',
      tasks: [
        {
          app: 'live',
          mp4: true,
          mp4Flags: '[movflags=faststart]',
        }
      ],
    }*/
  };
   
  var nms = new NodeMediaServer(msConfig)
  nms.run();

 nms.on('preConnect', (id, args) => {
    console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
    // let session = nms.getSession(id);
    // session.reject();
  });
   
  nms.on('postConnect', (id, args) => {
    console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
  });
   
  nms.on('doneConnect', (id, args) => {
    console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
  });
   
  nms.on('prePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // let session = nms.getSession(id);
    // session.reject();
  });
   
  nms.on('postPublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`); 
    let session = nms.getSession(id); 
    let str=StreamPath.split("/")
    let pt=str[str.length-1]  ;
    mkdirp(`./public/live/${pt}`, function(err) {
        request(`http://128.199.247.46:8000/live/${pt}.flv`).pipe(fs.createWriteStream(`public/live/${pt}/${session.startTimestamp}.flv`));    
    });
    
  
  });
   
  nms.on('donePublish', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    let session = nms.getSession(id);
  });
   
  nms.on('prePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
    // let session = nms.getSession(id);
    // session.reject();
  });
   
  nms.on('postPlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  });
   
  nms.on('donePlay', (id, StreamPath, args) => {
    console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  });
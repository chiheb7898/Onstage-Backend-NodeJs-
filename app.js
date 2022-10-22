const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const saltRounds = 10;
const socketio = require('socket.io');
const http = require('http');
//const formatMessage = require('./models/Message');
const app = express()
var multer, storage, path, crypto;
multer = require('multer')
path = require('path');
crypto = require('crypto');

const hostname = 'localhost';
const port = 8000;
const {mongoUrl} = require('./keys')

require('./models/Chat');  
require('./models/User')
require('./models/Post')
require('./models/Todo')
require('./models/Startup')
app.use(express.json())
app.use(require('./routes/authRoutes'))
app.use(require('./routes/postRoutes'))
app.use(require('./routes/userRoutes'))
app.use(require('./routes/chatRoutes'))
app.use(require('./routes/todoRoutes'))
app.use(require('./routes/startupRoutes'))
app.use(express.static('public'));
const Chat =  mongoose.model("Chat")

const SocketServer = require('websocket').server
const server = http.createServer((req, res) => {})
server.listen(3000, ()=>{
  console.log("Listening on port 3000...")
})
var fs = require('fs');

storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb) {
      return crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) {
          return cb(err);
        }
        return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
      });
    }
  });


// Post files
app.post(
  "/upload",
  multer({
    storage: storage
  }).single('upload'), function(req, res) {
    console.log(req.file);
    console.log(req.body);
    res.redirect("/uploads/" + req.file.filename);
    console.log(req.file.filename.split(".")[0]);
    return res.status(200).end();
  });

app.get('/uploads/:upload', function (req, res){
  file = req.params.upload;
  console.log(req.params.upload);
  var img = fs.readFileSync(__dirname + "/uploads/" + file);
  res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(img, 'binary');

});

wsServer = new SocketServer({httpServer:server})

const connections = []

wsServer.on('request', (req) => {
    const connection = req.accept()
    console.log('new connection')
    connections.push(connection)

    connection.on('message', (mes) => {
        connections.forEach(element => {
            if (element != connection){
                element.sendUTF(mes.utf8Data)
            
            }
          
               
        })
        var msg = JSON.parse(mes.utf8Data);
        const chat = new Chat({
          sender:msg.sender,
          receiver:msg.receiver,
          message:msg.message,
        })
         chat.save()
          console.log(chat)
    })

    connection.on('close', (resCode, des) => {
        console.log('connection closed')
        connections.splice(connections.indexOf(connection), 1)
    })

})

mongoose.connect(mongoUrl,{
    useFindAndModify: false,
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
    console.log("connected to mongo yeahhh")
})
mongoose.connection.on("error",(err)=>{
    console.log("error",err)
})

    
app.listen(port,hostname,() =>{
console.log("server running"+port)
})

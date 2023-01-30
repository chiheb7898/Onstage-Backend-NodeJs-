const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const saltRounds = 10;
//const socketio = require('socket.io');
//const http = require('http');
//const formatMessage = require('./models/Message');
//const app = express()
var multer, storage, path, crypto;
multer = require('multer')
path = require('path');
crypto = require('crypto');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const hostname = 'localhost';
const port = 8000;
const {mongoUrl} = require('./keys')

var clients = {}; 

app.get('/', function(req, res){
  res.send('server is running');
});

require('./models/Chat');  
require('./models/Story');  
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
app.use(require('./routes/storyRoutes'))
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const Chat =  mongoose.model("Chat")

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

//wsServer = new SocketServer({httpServer:server})

const connections = []

/*wsServer.on('request', (req) => {
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

})*/
var io = require('socket.io')(http);

io.on("connection", function (client) {  
  client.on("currentAmount", function(){
    client.emit("Eiii", "You have connected to the server.");
  })
  client.on("join", function(name){
    console.log("Joined: " + name);
      clients[client.id] = name;
      client.emit("joined", true);
      client.emit("update", "You have connected to the server.");
      client.broadcast.emit("update", name + " has joined the server.")
  });

  client.on("send", function(msg){
    console.log("Message: " + msg);
      client.emit("chat", clients[client.id], msg);
      client.broadcast.emit("chat", clients[client.id], msg);
  });

  client.on("disconnect", function(){
    console.log("Disconnect");
      io.emit("update", clients[client.id] + " has left the server.");
      delete clients[client.id];
  });

  client.on("getconnected",function(){
    io.emit(clients)
  })
});

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

    
/*app.listen(port,hostname,() =>{
console.log("server running"+port)
})*/

http.listen(process.env.PORT || port, function(){
  console.log('listening...');
});

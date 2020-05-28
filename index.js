const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ws = require("ws");
const { addUser, addMessage, getUsers, getMessages, updateMessage, deleteMessage } = require("./state");
const { events } = require("./events");

const PORT = process.env.PORT || 80;

const app = express();
const httpServer = http.createServer(app);
const webSocketServer = new ws.Server({
    server: httpServer,
});

app.use(cors());
app.use(bodyParser.json());

// const handler = (callback)=>{
//     return (req,res,next)=>{
//         try{
//             callback(req,res,next);
//         }
//         catch(error){
//             next(error);
//         }
//     }

// }           

webSocketServer.on("connection", (connection)=>{
    // console.log(connection);
    connection.on("message",(message)=>{
        console.log(message);
        const payload = JSON.parse(message).payload;
        console.log(payload);
        const event = JSON.parse(message).type;
        console.log(event);
        if(event === "ADD_MESSAGE"){
            addMessage(payload.userName,payload.text);
        }
        else if(event === "UPDATE_MESSAGE"){
            updateMessage(payload.userName, payload.id, payload.updText);
        }
        else if(event === "DELETE_MESSAGE"){
            deleteMessage(payload.userName, payload.id)
        }
        else if(event === "GET_MESSAGES"){
            connection.send(JSON.stringify({
                type: "RECEIVE_MESSAGES",
                payload:{
                    messages: getMessages(),
                }
            }));
        }else if(event === "GET_USERS"){
            connection.send(JSON.stringify({
                type: "RECEIVE_USERS",
                payload:{
                    users:getUsers(),
                }
            }));
        }else if(event === "ADD_USER"){
            console.log("дошло");
            addUser(payload.userName)
        }
    });
    events.on("change",(evt)=>{
        connection.send(JSON.stringify(evt));
    });
});

app.use((error, res, req, next) => {
    console.error(error);
  
    req.status(500);
    req.end();
});

httpServer.listen(PORT,()=>{console.log("app started")});
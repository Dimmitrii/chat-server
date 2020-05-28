const { events } = require("./events");

let messages = [];

const users = [];

let id = 0;

const findUser = (userName)=>{
    return users.find((u)=> u === userName);
}

const addUser = (userName)=>{
    console.log(users);
    const user = findUser(userName);

    if(user){
        return;
    }

    users.push(userName);

    events.emit("change", { type: "USER_ADDED", payload: { userName } });
    console.log(users);
}

const addMessage = (userName,text)=>{
    const user = findUser(userName);

    if(!user){
        return;
    }

    id++

    messages.push({
        from: userName,
        text,
        id,
    });

    events.emit("change",{
        type: "MESSAGE_ADDED",
        payload:{
            from: userName,
            text,
            id,
        }
    });
}

const deleteMessage = (userName,msgId)=>{
    // console.log(userName);
    // console.log(msgId);
    const user = findUser(userName);

    if(!user){
        return;
    }
    console.log(messages);
    messages = messages.filter(msg=>{
        console.log(msg.id);
        console.log(msgId);
        return msg.id !== msgId
    });

    events.emit("change",{
        type: "MESSAGE_DELETED",
        payload: {
            id:msgId
        }
    });
}

const updateMessage = (userName,msgId,updText)=>{
    const user = findUser(userName);

    if(!user){
        return;
    }

    messages = messages.map(msg=>{
        if(msg.id === msgId){
            msg.text=updText;
            console.log(msg);
            return msg;
        }
        return msg;
    });

    events.emit("change",{
        type: "MESSAGE_UPDATED",
        payload: {
            id: msgId,
            text: updText,
            from: userName,
        }
    });
}

module.exports = {
    updateMessage,
    addUser,
    addMessage,
    deleteMessage,
    getMessages: ()=> [...messages],
    getUsers: ()=> [...users],
}
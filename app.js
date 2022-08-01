const express = require('express');
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const cookieParser = require('cookie-parser');
const cors = require("cors")
const app = express();
require('dotenv').config();

app.use(cors({credentials: true,origin : "http://localhost:3000"}))
app.use(cookieParser())
app.use(express.json())

app.use("/api", router);

console.log("MONOGPASSWORD\n",process.env.MONGODB)


mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB}@cluster0.esrra.mongodb.net/auth?retryWrites=true&w=majority`)
.then(()=> {
    app.listen(5000,()=> {  
        console.log("data base is connected Listendi to 5000")
    })
}
).catch((err)=> {
    console.log(err);
})
// qjGmpAssfaGILuCB


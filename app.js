const express = require('express');
const mongoose = require("mongoose");
const router = require("./routes/user-routes");
const cookieParser = require('cookie-parser')
const app = express();
app.use(cookieParser())
app.use(express.json())

app.use("/api", router);


mongoose.connect("mongodb+srv://admin:qjGmpAssfaGILuCB@cluster0.esrra.mongodb.net/auth?retryWrites=true&w=majority")
.then(()=> {
    app.listen(5000,()=> {
        console.log("data base is connected Listendi to 5000")
    })
}
).catch((err)=> {
    console.log(err);
})
// qjGmpAssfaGILuCB


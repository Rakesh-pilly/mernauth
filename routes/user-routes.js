 const express = require("express");
const { signup, login, verifyToken, getUser } = require("../controllers/user-controller");

 const router = express.Router();


 router.get("/", (req,res,next)=> {
    res.send("Hello world api is running")
 });


 router.post("/singup", signup)
 router.post("/login", login);
 router.get("/user",verifyToken, getUser)


 module.exports = router;
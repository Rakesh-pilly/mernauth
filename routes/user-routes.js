 const express = require("express");
const { signup, login, verifyToken, getUser, refreshToken, logout } = require("../controllers/user-controller");

 const router = express.Router();


 router.get("/", (req,res,next)=> {
    res.send("Hello world api is running")
 });


 router.post("/singup", signup)
 router.post("/login", login);
 router.get("/user",verifyToken, getUser)
router.get('/refresh',refreshToken,verifyToken,getUser);
router.post('/logout',verifyToken,logout)

 module.exports = router;
var express=require("express");
var app=express()
var admin = require("firebase-admin");
const { getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    ignoreUndefinedProperties: true, 
});
app.use(express.static("public"));
const db = getFirestore();
app.get('/',function(req,res){
    res.sendFile(__dirname + "/public/" + "home.html");
})
app.get('/signupLocation',function(req,res){
    db.collection('Users').add({
        Usesrname:req.query.Username ,
        Email: req.query.Email,
        Password:req.query.Password
    }).then(()=>{
        res.sendFile(__dirname + "/public/" + "login.html");
    })
})
app.get('/loginLocation',function(req,res){
    db.collection('Users')
    .where("Email","==",req.query.Email)
    .where("Password","==",req.query.Password)
    .get()
    .then((docs)=>{
        if(docs.size>0){
            res.sendFile(__dirname + "/public/" + "dashboard.html");
        }else{
            res.send("That didn't work. Try Again");
        }
    })
});
app.listen(3000,function(){
    console.log("Server Started");
})
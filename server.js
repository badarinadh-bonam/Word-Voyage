var express=require("express");
var app=express()
var passwordHash = require('password-hash');
const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));

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
app.post('/signupLocation', function (req, res) {
    const password = req.body.Password;
    if (!password) {
        return res.send("Password is required");
    }
    db.collection('Users')
    .where("Email","==",req.body.Email)
    .get()
    .then((docs)=>{
        if(docs.size>0){
            res.sendFile(__dirname + "/public/" + "exist.html");
        }
        else{
            db.collection('Users').add({
                Usesrname:req.body.Username ,
                Email: req.body.Email,
                Password:passwordHash.generate(password)
            }).then(()=>{
                res.sendFile(__dirname + "/public/" + "login.html");
            })
        }
    });
})
app.get('/loginLocation', function (req, res) {
    res.sendFile(__dirname + "/public/" + "login.html");
});
app.post('/loginLocation',function(req,res){
    db.collection('Users')
    .where("Email","==",req.body.Email)
    .get()
    .then((docs)=>{
        let verified=false;
        docs.forEach((doc)=>{
            verified=passwordHash.verify(req.body.Password,doc.data().Password);
        });
        if(verified){
            res.sendFile(__dirname + "/public/" + "dashboard.html");
        }else{
            res.send("That didn't work. Try Again");
        }
    })
});
app.listen(3000,function(){
    console.log("Server Started listening....");
})
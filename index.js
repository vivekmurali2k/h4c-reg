var express=require("express"); 
var bodyParser=require("body-parser"); 
const MongoClient = require("mongodb").MongoClient;
const dotenv=require("dotenv");
require('dotenv').config()

dotenv.config({path: 'ENV_FILENAME'});

const mongoose = require('mongoose'); 
mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true, useUnifiedTopology: true}); 
var DB=mongoose.connection; 
DB.on('error', console.log.bind(console, "connection error")); 
DB.once('open', function(callback){ 
	console.log("connection succeeded"); 
}) 

let port = process.env.PORT || 3000

var app=express() 

app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
	extended: true
})); 


app.use(express.static(__dirname + "/../public"));



app.post('/sign_up', function(req,res){ 
	var name = req.body.name; 
	var email =req.body.email; 
	var reg = req.body.reg; 
    var phone =req.body.phone; 
    var add1 = req.body.add1;
    var add2 = req.body.add2;
    var city = req.body.add3;

	var data = { 
		"name": name, 
		"email":email, 
		"regno":reg, 
        "phone":phone,
        "add1": add1,
        "add2": add2,
        "city": city
    }
    
    MongoClient.connect(process.env.DB_CONNECT,{useNewUrlParser: true, useUnifiedTopology: true}, (err, db)=>{
        if (err) throw err;
        var dbo = db.db('h4c');
        var collection = dbo.collection('registration');
        collection.findOne({"regno": reg}, (err, result)=>{
            // if (err) throw err;
            console.log(`result is ${result}`);
            if(result == null){
                DB.collection('registration').insertOne(data,function(err, collection){ 
                if (err) throw err; 
                console.log("Record inserted Successfully"); 
                
		    }); 
            }
            else{
                console.log('Duplicate record found');
            }
        });
    });
    




    	
	
		
	return res.redirect('signup_success.html'); 
}) 


app.get('/',function(req,res){ 
    res.render('index2.html');
    
}).listen(port) 



// var user = db.model('user', regSchema);

app.get('/register', (req,res)=>{
    
});
console.log("server listening at port 3000"); 

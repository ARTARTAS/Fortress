const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;

const app = express();
const jsonParser = express.json();

const url = "mongodb+srv://Admin:Admin@cluster0.iq0ox.mongodb.net";
const mongoClient = new MongoClient(url);
  
 
let dbClient;
 
app.use(express.static(__dirname + "/public"));
 
mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db("fortressdb").collection("fortress");
    app.listen(3000, function(){
        console.log("Сервер ожидает подключения...");
    });
});
 
app.get("/api/fortress", function(req, res){
        
    const collection = req.app.locals.collection;
    collection.find({}).toArray(function(err, fortress){
         
        if(err) return console.log(err);
        res.send(fortress)
    });
     
});

// app.get("/api/fortress/:id", function(req, res){
        
//     const id = new objectId(req.params.id);
//     const collection = req.app.locals.collection;
//     collection.findOne({_id: id}, function(err, fortress){
               
//         if(err) return console.log(err);
//         res.send(fortress);
//     });
// });
   
app.post("/api/fortress", jsonParser, function (req, res) {
       
    if(!req.body) return res.sendStatus(400);
       
    const fortressName = req.body.name;
    const fortressData = req.body.data ;
    const fortress = {name: fortressName, data: fortressData };
       
    const collection = req.app.locals.collection;
    collection.insertOne(fortress, function(err, result){               
        if(err) return console.log(err);
        res.send(fortress);
    });
});
    
// app.delete("/api/fortress/:id", function(req, res){
        
//     const id = new objectId(req.params.id);
//     const collection = req.app.locals.collection;
//     collection.findOneAndDelete({_id: id}, function(err, result){
               
//         if(err) return console.log(err);    
//         let fortress = result.value;
//         res.send(fortress);
//     });
// });

app.put("/api/fortress", jsonParser, function(req, res){
        
    if(!req.body) return res.sendStatus(400);
    const id = new objectId(req.body.id);
    const fortressName = req.body.name;
    const fortressData  = req.body.data ;
       
    const collection = req.app.locals.collection;
    collection.findOneAndUpdate({_id: id}, { $set: {data : fortressData , name: fortressName}},
         {returnDocument: "after" },function(err, result){
               
        if(err) return console.log(err);     
        const fortress = result.value;
        res.send(fortress);
    });
});
 
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
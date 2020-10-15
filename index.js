const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = 5000

const app = express()
app.use(cors());
app.use(bodyParser.json());
console.log()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2qyt.mongodb.net/agencyDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("agencyDB").collection("orderlist");
  const collectionReview = client.db("agencyDB").collection("reviewlist");
  const collectionAdmin = client.db("agencyDB").collection("adminpanel");
  const collectionService = client.db("agencyDB").collection("servicelist");

  app.get('/getAllData',(req, res)=>{
    collection.find()
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  app.get('/getData', (req, res) =>{
    collection.find({email: req.query.email})
    .toArray((err, documents)=>{
        res.send(documents);
    })
  })

  app.get('/admin', (req, res) =>{
    collectionAdmin.find({email: req.query.email})
    .toArray((err, documents)=>{
      res.send(documents.length > 0);
    })
  })
  
  app.post('/addReview', (req, res) =>{
    collectionReview.insertOne(req.body)
    .then(result =>{
      res.send(result.insertedCount > 0);
    })
  })

  app.get('/getReview', (req, res) =>{
    collectionReview.find()
    .toArray((err, documents)=>{
      res.send(documents);
    })

  })

  app.get('/getService', (req, res) =>{
    collectionService.find()
    .toArray((err, documents)=>{
      res.send(documents);
    })

  })

  app.post('/addOrder', (req, res) =>{
    collection.insertOne(req.body)
    .then(result =>{
      res.send(result.insertedCount > 0);
  })
  })

  app.post('/addAdmin', (req, res)=>{
    collectionAdmin.insertOne(req.body)
    .then(result =>{
      res.send(result.insertedCount > 0);
    })
  })
  app.post('/addService', (req, res)=>{
    collectionService.insertOne(req.body)
    .then(result =>{
      res.send(result.insertedCount > 0);
    })
  })
  
  app.patch('/update/:id', (req, res)=>{
    collection.updateOne(
      {_id: ObjectId(req.params.id)},
      { $set: {status: req.body.status}}
      )
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })
  
});


app.get('/', (req, res) => {
  res.send('Creative Agency Server')
})

app.listen( process.env.PORT || port)
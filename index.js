const express = require('express')
const app = express()
const cors=require('cors')
const bodyParser = require('body-parser')
const { MongoClient , ObjectId } = require('mongodb');

const port = process.env.PORT || 5000
require('dotenv').config();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1msfu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello, from Autoparts !')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("autoParts").collection("products");
  const orderCollection = client.db("autoParts").collection("orders");

  //---upload product--//
app.post('/addProduct', (req, res)=>{
    const products= req.body;
    console.log(products);
    productsCollection.insertOne(products)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
})
//--get all products--//
app.get('/products' , (req, res)=>{
  productsCollection.find({})
  .toArray((err, documents)=>{
      res.send(documents)
  })
})

//----find single product by id ---//
app.get('/product/:id',(req,res) => {
  const id = ObjectId(req.params.id)
  // console.log('id',id);
  productsCollection.find({_id: id})
  .toArray((err, documents) => {
  
      res.send(documents[0])
  })
})

//----post for order --- //
app.post('/addOrder' , (req,res)=>{
  const orderDetails = req.body;
  // console.log(orderDetails);
  orderCollection.insertOne(orderDetails)
  .then( result => {
    res.send(result.insertedCount  > 0)
  })

})

//---show orders products---//
app.get('/showOrderProduct/:email', (req,res) => {
  const email = req.params.email;
  console.log('email',email);
  orderCollection.find({email: email})
  .toArray((err,documents) => {
      res.send(documents)
  })
})


// delete product
app.delete('/deleteProduct/:id',(req,res) => {
  const id = ObjectId(req.params.id)
  productsCollection?.deleteOne({
      _id: id
  })
  .then( result => {
      console.log('delete',result)
      res.send(result.deletedCount > 0)
  })
})
  console.log('mongodb working');
//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3worizk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});





async function run() {
  try {
    await client.connect();
    ProductsCollection = client.db('emajhonDB').collection('products')


    // main oparations
    app.get('/products', async (req,res)=> {
      const page = parseInt(req.query.page)
      const size = parseInt(req.query.size)
      console.log(req.query)
      
      const find = ProductsCollection.find().skip(page*size).limit(size)
      const result = await find.toArray();
       res.send(result)
    })


    app.post('/productByIds', async (req,res)=>{
      const ids = req.body;
      const idWithObjectId = ids.map(id => new ObjectId(id))
      const query = { _id: { $in: idWithObjectId}};
      const result = await ProductsCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/productscount', async (req,res)=> {
      const count = await ProductsCollection.estimatedDocumentCount();
       res.send({count})
    })



   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) =>{
    res.send('john is busy shopping')
})

app.listen(port, () =>{
    console.log(`ema john server is running on port: ${port}`);
})

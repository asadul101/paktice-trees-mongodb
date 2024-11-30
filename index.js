const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PROT || 5000

//midlewere
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_tree}:${process.env.US_Pass}@cluster0.g9i8u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a Mongo
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

      const database = client.db("treeDB");
      const treeCollection = database.collection("trees");

      const userCollection = client.db("treeDB").collection("users")

      app.get('/trees', async (req, res) => {
         const corcus = treeCollection.find()
         const result = await corcus.toArray()
         res.send(result)
      })
      app.get('/trees/:id', async (req, res) => {
         const id = req.params.id;
         const qurey = { _id: new ObjectId(id) }
         const result = await treeCollection.findOne(qurey)
         res.send(result)
      })
      app.post('/trees', async (req, res) => {
         const newtree = req.body;
         console.log(newtree);
         const result = await treeCollection.insertOne(newtree)
         res.send(result)
      })
      app.put('/trees/:id', async (req, res) => {
         const id = req.params.id;
         const filter = { _id: new ObjectId(id) }
         const qurey = req.body;
         const options = { upsert: true };
         const updateDoc = {
            $set: {
               name: qurey.name,
               quantity: qurey.quantity,
               supplir: qurey.supplir,
               taste: qurey.taste,
               category: qurey.category,
               detalis: qurey.detalis,
               photo: qurey.photo
            }
         }
         const result = await treeCollection.updateOne(filter, updateDoc, options)
         res.send(result)
      })
      app.delete('/trees/:id', async (req, res) => {
         const id = req.params.id;
         const qurey = { _id: new ObjectId(id) }
         const result = await treeCollection.deleteOne(qurey)
         res.send(result)
      })

      //USers collection
      app.get('/users', async (req, res) => {
         const result = await userCollection.find().toArray()
         res.send(result)
      })
      app.post('/users', async (req, res) => {
         const newUsers = req.body;
         const result = await userCollection.insertOne(newUsers)
         res.send(result)
      })

      app.patch('/users', async (req, res) => {
         const email = req.body.email;
         const filter = { email }
         const updateDoc = {
            $set: {
               lastSignInTime: req.body.lastSignInTime
            },
         };
         const result=await userCollection.updateOne(filter,updateDoc)
         res.send(result)
      })

      app.delete('/users/:id', async (req, res) => {
         const id = req.params.id;
         const qurey = { _id: new ObjectId(id) }
         const result = await userCollection.deleteOne(qurey)
         res.send(result)
      })

      // Send a ping 
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      //  await client.close();
   }
}
run().catch(console.dir);


app.get('/', (req, res) => {
   res.send('This is trees projects')
})
app.listen(port, () => {
   console.log(`My project Trees ${port}`);
})
const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT ||
    5000

// middleware

app.use(cors());

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v2bif.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        const databse = client.db('tourism');
        const spotsCollection = databse.collection('spots');
        const touristCollection = databse.collection('tourist');

        // Get API
        app.get('/spots', async (req, res) => {
            const cursor = spotsCollection.find({});
            const spots = await cursor.toArray();
            res.send(spots)
        })
        app.get('/tourist', async (req, res) => {
            const cursor = touristCollection.find({});
            const tourist = await cursor.toArray();
            res.send(tourist)
        })

        //POST Spot API

        app.post('/spots', async (req, res) => {
            const spot = req.body;
            console.log('hit the post', spot)
            const result = await spotsCollection.insertOne(spot);
            console.log(result);
            res.json(result);
        })
        // POST tourist API
        app.post('/tourist', async (req, res) => {
            const tourist = req.body;
            console.log('hit the post', tourist)
            const result = await touristCollection.insertOne(tourist);
            console.log(result);
            res.json(result);
        })

        // Delete API 
        app.delete('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = spotsCollection.deleteOne(query);
            console.log('deleting id', result);
            res.json(result);
        })

    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/', (req, res) => {
    res.send('tourism server is running');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ppta4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        
        const database = client.db('hogwart_world');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        //POST API
        app.post('/services', async(req, res) =>{
            const service = req.body;
            console.log("hit the post api", service);

            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });s

    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Running hogwart");
});

app.listen(port, () => {
    console.log("Running hogwart on", port);
})

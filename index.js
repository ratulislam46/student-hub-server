import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ibgq1ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {


    try {


        const usercollection = client.db('studen-hub').collection('users');

        app.post('/users', async (req, res) => {
            const user = req.body;
            if (!user) {
                return res.send({ message: 'users not find' })
            }
            const result = await usercollection.insertOne(user);
            res.send(result)
        });

        app.patch('/users-last-login/:email', async (req, res) => {
            const email = req.params.email;
            const filter = { email: email };
            if (!email) {
                return res.status(400).send({ message: 'user email not found' });
            }
            const updateDoc = {
                $set: {
                    last_login: new Date().toISOString()
                }
            }
            const update = await usercollection.updateOne(filter, updateDoc);
            res.send(update)
        })

        app.get('/users', async (req, res) => {
            const userinfo = await usercollection.find().toArray();
            res.send(userinfo)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            res.send(query);
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}
run().catch(console.dir);


// Routes
app.get("/", (req, res) => {
    res.send("Student hub project is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

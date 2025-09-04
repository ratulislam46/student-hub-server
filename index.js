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
        const noticeCollection = client.db('studen-hub').collection('notices')
        const forumCollection = client.db('studen-hub').collection('forums')


        // update user last login time 
        app.patch('/users-last-login/:email', async (req, res) => {
            const email = req.params.email;

            if (!email) {
                return res.status(400).send({ message: 'user email not found' });
            }

            const filter = { email: email };
            const updateDoc = {
                $set: { last_login: new Date().toISOString() }
            }
            const update = await usercollection.updateOne(filter, updateDoc);
            if (!update.matchedCount === 0) {
                return res.send({ message: 'No user found with this email' })
            }
            res.send(update)
        })
        // post new user info 
        app.post('/users', async (req, res) => {
            const data = req.body;
            if (!data) {
                return res.send({ message: 'users not find' })
            }
            const result = await usercollection.insertOne(data);
            res.send(result)
        });
        // get all user 
        app.get('/users', async (req, res) => {
            const userinfo = await usercollection.find().toArray();
            res.send(userinfo)
        })
        // get single user
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            res.send(query);
        })
        // post new notice data
        app.post('/add-notice', async (req, res) => {
            const data = req.body;
            const addNewNotice = await noticeCollection.insertOne(data);
            res.send(addNewNotice)
        })
        // get all notice 
        app.get('/all-notice', async (req, res) => {
            const allNotice = await noticeCollection.find().toArray();
            if (!allNotice) {
                return res.json({ message: 'Notice not found' })
            }
            res.send(allNotice);
        })
        // post forum data 
        app.post('/add-forum', async (req, res) => {
            const body = req.body;
            if (!body) {
                return res.send({ message: "Form data not found" })
            }
            const addForum = await forumCollection.insertOne(body);
            res.send(addForum)
        })
        // get all forum 
        app.get('/all-forums',async(req,res)=>{
            const AllForum = await forumCollection.find().toArray();
            if(!AllForum) {
                return res.send({message:'Forum not found'})
            }
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

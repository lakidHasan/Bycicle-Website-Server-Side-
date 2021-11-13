const express = require ('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ofy9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        
        const database = client.db('rider');
        const byciclesCollection = database.collection('bycicles');
        const totalCollection = database.collection('bycicles2');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');

       //GET API
        app.get('/bycicles', async(req, res) => {
            const cursor = byciclesCollection.find({});
            const bycicles = await cursor.toArray();
            res.send(bycicles)

        })

        // POST API 
        app.post('/bycicles', async(req, res)=>{
            const bycicle = req.body;
           console.log('hit the post api', bycicle);

           const result = await byciclesCollection.insertOne(bycicle); 
           res.json(result)
        })

        //get api
           app.get('/bycicle2', async(req, res) =>{
               const cursor = totalCollection.find({});
               const bycicle2 = await cursor.toArray();
               res.send(bycicle2);
           })
        // post api 
        app.post('/bycicle2', async(req, res)=>{
            const bycicle2 = req.body;
         console.log('hit the api', bycicle2);

            const result = await totalCollection.insertOne(bycicle2); 
            console.log(result);
            res.json(result);
        });
        // GET API FOR ORDER
        
         app.get('/orders', async(req, res) =>{
             const email = req.query.email;
             const query = {email: email}
            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
         })

         //get api for reviews
         app.get('/reviews', async(req, res) => {
             const cursor = reviewsCollection.find({});
             const reviews = await cursor.toArray();
             res.send(reviews);
         })

         //post api for reviews
         app.post('/reviews', async(req, res) =>{
             
             const review = req.body;
             console.log('hit the post', review)

             const result = await reviewsCollection.insertOne(review);
            res.json(result);
         });

        //POST API for order
        app.post('/orders', async(req, res) =>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });
       
        app.get('/users/:email', async(req, res)=>{
           const email = req.params.email;
           const query = {email: email};
           const user = await usersCollection.findOne(query);
           let isAdmin = false;
           if(user?.role === "admin"){
                isAdmin= true;
           }
           res.json({admin: isAdmin});
        })

       app.post('/users', async(req, res) =>{
           const user = req.body;
           const result = await usersCollection.insertOne(user);
           res.json(result);
       });

       app.put('/users/admin', async(req, res)=>{
           const user = req.body;
           console.log('put', user);
           const filter = {email:user.email};
           const updateDoc= {$set: {role: 'admin'}};
           const result = await usersCollection.updateOne(filter, updateDoc);
           res.json(result);
       })

    }
    finally{
        // await client.close();
    }
}
        run().catch(console.dir);

        app.get('/', (req, res) =>{
            res.send('Running Bicycle Server');
        });

        app.listen(port, ()=>{
            console.log('Running Bicycle Server on port', port);
        });
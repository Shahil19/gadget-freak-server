const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = 5000;

app.use(cors())
app.use(express.json())
// shahil
// esP4VSY2bXsclPaL


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://shahil:esP4VSY2bXsclPaL@cluster0.63ras.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const productCollection = client.db('Gadget-collections').collection('products')

        // ------------ POST Products to database
        app.post('/product', async (req, res) => {
            const product = req.body;
            const tokenInfo = req.headers.authorization;
            const [email, accessToken] = tokenInfo?.split(' ')

            // const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const decoded = verifyToken(accessToken);
            console.log(decoded);

            if (email === decoded.email) {
                const result = await productCollection.insertOne(product)
                res.send(result)
            } else {
                res.send({ user: 'Unauthorized User' })
            }
        })

        // JWT -----------------------------
        app.post('/login', (req, res) => {
            const email = req.body.email;
            const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET);
            res.send({ token })
            // console.log(token);
        })

    } finally {

    }
}

run().catch(console.dir)

//ACCESS_TOKEN_SECRET=

function verifyToken(token) {
    let email;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            email = 'invalid email';
        }
        if (decoded) {
            email = decoded
        }
    });
    return email;
};

app.get('/', (req, res) => {
    res.send({ name: "kader ali" })
})

app.listen(port, () => {
    console.log(`listening ${port}`);
})
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//mongodb
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sogjf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db('emaJohn').collection('product');

    app.get('/product', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = productCollection.find(query);
      let product;
      if (page || size) {
        //   0--> skip: 0, limit: (1-10) 10
        //   1--> skip: 1-10, limit: (11-20) 10
        //   2--> skip: 2-10, limit: (21-30) 10
        product = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        product = await cursor.toArray();
      }
      res.send(product);
    });

    // data count
    app.get('/productCount', async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });
  } finally {
    //   await client.close()
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('John is running and waiting for Ema');
});

app.listen(port, () => {
  console.log(`John is Running on port: ${port}`);
});

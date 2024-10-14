const express = require('express')
const app = express()

app.use(express.json())

const rimStoreProducts = [
    {
      "id": 1,
      "productName": "Lipstick",
      "price": "9.99",
      "description": "Best lipstick ever"
    },
    {
      "id": 2,
      "productName": "Shampoo Extra",
      "price": "19.99",
      "description": "Best Shampoo ever"
    },
    {
      "id": 3,
      "productName": "Lipstick 2",
      "price": "18.99",
      "description": "Best lipstick ever 2"
    },
  ]

// Endpoints to Home Page
app.get('/', function (req, res) {
  res.send('Welcome to Rim Store')
})

// Endpoint to Get Products
app.get('/products', function (req, res) {
    res.send(rimStoreProducts)
})


// Endpoint to Create Product
app.post('/products', function (req, res) {
  const requestBody = req.body
  console.log('Received Create Product request: ', requestBody)
  // INSERT INTO PRODUCT(name, price, description) VALUES (requestBody.productName, requestBody.productName, requestBody.description)
  res.send("Product Created")
})

// Endpoint to get single product
app.get('/products/:product_id', function (req, res) {
  // Get products by ID.
  console.log('Getting product with id: ', req.params.product_id)
  const requestProductId = Number(req.params.product_id)

  // SELECT * FROM products WHERE id = requestProductId;

  // First method to get products
  // for (let i = 0; i< rimStoreProducts.length; i++) {
  //   if (rimStoreProducts[i].id === requestProductId) {
  //     res.send(rimStoreProducts[i])
  //   }
  // }

  // Similar to for loop, but faster
  const requestProduct = rimStoreProducts.find((product) => product.id === requestProductId)
  if (requestProduct) {
    res.send(requestProduct)
  }
  res.send("Product Not Found!")
})


// Create Endpoint to Delete Single Product
// Create Endpoint to Update Single Product
// Create Endpoint to Create a user
// Create Endpoint to Get a user

app.listen(3000)
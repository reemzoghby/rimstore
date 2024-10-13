const express = require('express')
const app = express()


// Endpoint to Home Page
app.get('/', function (req, res) {
  res.send('Hello World 3')
})


const rimStoreProducts = {
  products: [
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
    }
    {
      "id": 3,
      "productName": "Lipstick 2",
      "price": "18.99",
      "description": "Best lipstick ever 2"
    },
  ]
}

// Endpoint to Get Products
app.get('/products', function (req, res) {
    res.send(rimStoreProducts)
})

app.listen(3000)
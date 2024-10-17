const express = require('express');
const app = express();

app.use(express.json());

const rimStoreProducts = [
  {
    id: 1,
    productName: "Lipstick",
    price: "9.99",
    description: "Best lipstick ever"
  },
  {
    id: 2,
    productName: "Shampoo Extra",
    price: "19.99",
    description: "Best Shampoo ever"
  },
  {
    id: 3,
    productName: "Lipstick 2",
    price: "18.99",
    description: "Best lipstick ever 2"
  }
];

const rimStoreUsers = [
  {
    id: 1,
    firstname: "assaad",
    lastname: "najjar",
    email: "assaadnajjar@gmail.com",
    password: "ramroumelove"
  }
];

// Home Page Endpoint
app.get('/', function (req, res) {
  res.send('Welcome to Rim Store');
});

// Get All Products
app.get('/products', (req, res) => {
  res.send(rimStoreProducts);
});

// Get All Users
app.get('/users', function (req, res) {
  res.send(rimStoreUsers);
});

// Create Product
app.post('/products', function (req, res) {
  const requestBody = req.body;
  console.log('Received Create Product request:', requestBody);
  res.send('Product Created');
});

// Get Single Product by ID
app.get('/products/:product_id', function (req, res) {
  console.log('Getting product with id:', req.params.product_id);
  const requestProductId = Number(req.params.product_id);

  const requestProduct = rimStoreProducts.find(
    (product) => product.id === requestProductId
  );

  if (requestProduct) {
    return res.send(requestProduct);
  }

  res.send('Product Not Found!');
});

// Delete a Product by ID
app.delete('/products/:product_id', function (req, res) {
  console.log('Deleting product with id:', req.params.product_id);
  const productId = Number(req.params.product_id);
  const requestProduct = rimStoreProducts.find(
    (product) => product.id === productId
  );

  if (requestProduct) {
    console.log('Product found, ready for deletion.');
    return res.send('Product Deleted');
  }

  res.send('Product Not Found');
});

// Update a Product by ID
app.put('/products/:product_id', function (req, res) {
  console.log('Updating product with id:', req.params.product_id);
  const productId = Number(req.params.product_id);
  const requestProduct = rimStoreProducts.find(
    (product) => product.id === productId
  );

  if (requestProduct) {
    Object.assign(requestProduct, req.body);
    console.log('Product updated:', requestProduct);
    return res.send('Product Updated');
  }

  res.send('Product Not Found');
});

// Create a User
app.post('/users', function (req, res) {
  const requestBody = req.body;
  console.log('Request received:', requestBody);
  res.send('User Created');
});

// Get a Single User by ID
app.get('/users/:user_id', function (req, res) {
  console.log('Getting user with id:', req.params.user_id);
  const requestUserId = Number(req.params.user_id);
  const requestUser = rimStoreUsers.find(
    (user) => user.id === requestUserId
  );

  if (requestUser) {
    return res.send(requestUser);
  }

  console.log('User not found');
  res.send('User Not Found');
});

// Start the Server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

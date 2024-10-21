const express = require('express');
const { Sequelize, DataTypes } = require('@sequelize/core'); // Correct import for DataTypes
const { MySqlDialect } = require('@sequelize/mysql');

// Initialize Sequelize with database configuration
const sequelize = new Sequelize({
  database: 'RimStore',
  user: 'test_user',
  password: 'test_password',
  host: 'localhost',
  port: 3306,
  dialect: MySqlDialect,
  logging: false, // Optional: Disable SQL logging
});

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Define Product Model
const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING(100),
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'product',
  timestamps: false,
});

// Define User Model
const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Test database connection and sync models
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Routes

// Home Page Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to Rim Store');
});

// Get All Products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// Get Single Product by ID
app.get('/products/:product_id', async (req, res) => {
  const productId = req.params.product_id;
  try {
    const product = await Product.findByPk(productId);
    if (product) res.json(product);
    else res.status(404).send('Product Not Found');
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error fetching product');
  }
});

// Create New Product
app.post('/products', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send('Error creating product');
  }
});

// Update Product by ID
app.put('/products/:product_id', async (req, res) => {
  const productId = req.params.product_id;
  try {
    const [updated] = await Product.update(req.body, { where: { product_id: productId } });
    if (updated) {
      const updatedProduct = await Product.findByPk(productId);
      res.json(updatedProduct);
    } else {
      res.status(404).send('Product Not Found');
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).send('Error updating product');
  }
});

// Delete Product by ID
app.delete('/products/:product_id', async (req, res) => {
  const productId = req.params.product_id;
  try {
    const deleted = await Product.destroy({ where: { product_id: productId } });
    if (deleted) res.send('Product Deleted');
    else res.status(404).send('Product Not Found');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).send('Error deleting product');
  }
});

// Get All Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
});

// Get User by ID
app.get('/users/:user_id', async (req, res) => {
  const userId = req.params.user_id;
  try {
    const user = await User.findByPk(userId);
    if (user) res.json(user);
    else res.status(404).send('User Not Found');
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Error fetching user');
  }
});

// Create New User
app.post('/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});

// Start Server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});


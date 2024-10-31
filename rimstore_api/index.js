require('dotenv').config(); // Load environment variables
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('@sequelize/core');

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Log the database port
console.log('Database port:', process.env.DATABASE_PORT);

// Initialize Sequelize with an options object
const sequelize = new Sequelize({
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10), // Ensure port is a number
  dialect: 'mysql',
  logging: false,
});

// Test the connection
sequelize.authenticate() 
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
// Use the port from environment variables or default to 3001
const PORT = process.env.PORT || 3001;

// Product Model
const Product = sequelize.define('Product', {
  product_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_name: { type: DataTypes.STRING(255), allowNull: false },
  description: DataTypes.TEXT,
  category: DataTypes.STRING(100),
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'product',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// User Model
const User = sequelize.define('User', {
  user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  first_name: { type: DataTypes.STRING(100), allowNull: false },
  last_name: { type: DataTypes.STRING(100), allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Order and OrderItem Models
const Order = sequelize.define('Order', {
  order_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, references: { model: User, key: 'user_id' } },
  total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  order_status: { type: DataTypes.STRING(50), defaultValue: 'pending' },
}, {
  tableName: 'order',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  order_id: { type: DataTypes.INTEGER, references: { model: Order, key: 'order_id' } },
  product_id: { type: DataTypes.INTEGER, references: { model: Product, key: 'product_id' } },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'orderitems',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Define Relationships
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Helper Functions
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function generateToken(user) {
  return jwt.sign(
    { user_id: user.user_id, is_admin: user.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Access Denied');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
};

// Admin Authorization Middleware
const requireAdmin = (req, res, next) => {
  if (!req.user.is_admin) return res.status(403).send('Admin Access Required');
  next();
};

// Routes

// Home Page Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to Rim Store');
});

// Product Routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).send('Error fetching products');
  }
});

app.get('/products/:product_id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.product_id);
    if (product) res.json(product);
    else res.status(404).send('Product Not Found');
  } catch (error) {
    res.status(500).send('Error fetching product');
  }
});

app.post('/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send('Error creating product');
  }
});

app.put('/products/:product_id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, { where: { product_id: req.params.product_id } });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.product_id);
      res.json(updatedProduct);
    } else {
      res.status(404).send('Product Not Found');
    }
  } catch (error) {
    res.status(500).send('Error updating product');
  }
});

app.delete('/products/:product_id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { product_id: req.params.product_id } });
    if (deleted) res.send('Product Deleted');
    else res.status(404).send('Product Not Found');
  } catch (error) {
    res.status(500).send('Error deleting product');
  }
});

// User Routes
app.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).send('Error fetching users');
  }
});

app.get('/users/:user_id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.user_id);
    if (user) res.json(user);
    else res.status(404).send('User Not Found');
  } catch (error) {
    res.status(500).send('Error fetching user');
  }
});

app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    const newUser = await User.create({ ...req.body, password: hashedPassword });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).send('Error signing up');
  }
});
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).send('User not found');

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(401).send('Invalid password');

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).send('Error logging in');
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(404).send('User not found');

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(401).send('Invalid password');

    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

// Order Route
app.post('/orders', authenticateToken, async (req, res) => {
  try {
    let totalAmount = 0;
    for (const item of req.body.items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) return res.status(404).send(`Product ID ${item.product_id} not found`);
      totalAmount += product.price * item.quantity;
    }

    const newOrder = await Order.create({ user_id: req.user.user_id, total_amount: totalAmount });

    const orderItems = req.body.items.map(item => ({
      order_id: newOrder.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));
    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ order: newOrder, items: orderItems });
  } catch (error) {
    res.status(500).send('Error creating order');
  }
});

// Sync Database and Start Server
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});


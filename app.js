const path = require('path');
const express = require('express');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const PRODUCTS_FILE = process.env.PRODUCTS_FILE || path.join(__dirname, 'products.json');
const USERS_FILE = process.env.USERS_FILE || path.join(__dirname, 'users.json');

let products = [];
let users = [];

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Загрузка товаров
async function loadProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    products = JSON.parse(data);
    console.log('Товары загружены из файла');
  } catch {
    console.error('Не удалось загрузить products.json, стартуем с пустым массивом');
    products = [];
  }
}

async function saveProducts() {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (err) {
    console.error('Ошибка сохранения товаров:', err);
  }
}

// Загрузка пользователей
async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    users = JSON.parse(data);
    console.log('Пользователи загружены из файла');
  } catch {
    console.error('Не удалось загрузить users.json, стартуем с пустым массивом');
    users = [];
  }
}

async function saveUsers() {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Ошибка сохранения пользователей:', err);
  }
}

// Swagger настройка
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API магазина "Токийский дрифт"',
      version: '1.0.0',
      description: 'Документация для управления товарами и пользователями',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Локальный сервер',
      },
    ],
  },
  apis: [__filename],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Маршруты для товаров ---
app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Товар не найден :(' });
  }
});

app.post('/products',
  body('name').isString().notEmpty(),
  body('price').isFloat({ gt: 0 }),
  body('category').isString().notEmpty(),
  body('amount').isInt({ min: 0 }),
  body('description').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, description, category, amount } = req.body;
    const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newProduct = {
      id: maxId + 1,
      name,
      price,
      description: description || '',
      category,
      amount
    };

    products.push(newProduct);
    await saveProducts();
    res.status(201).json(newProduct);
  }
);

app.patch('/products/:id',
  body('name').optional().isString(),
  body('price').optional().isFloat({ gt: 0 }),
  body('category').optional().isString(),
  body('amount').optional().isInt({ min: 0 }),
  body('description').optional().isString(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    const { name, price, description, category, amount } = req.body;
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (description !== undefined) product.description = description;
    if (category !== undefined) product.category = category;
    if (amount !== undefined) product.amount = amount;

    await saveProducts();
    res.json(product);
  }
);

app.delete('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = products.length;
  products = products.filter(p => p.id !== id);

  if (products.length < initialLength) {
    await saveProducts();
    res.json({ message: 'Товар удалён' });
  } else {
    res.status(404).json({ error: 'Товар не найден' });
  }
});

// --- Маршруты для пользователей ---
app.get('/users', (req, res) => {
  const usersWithoutPassword = users.map(({ password, ...rest }) => rest);
  res.json(usersWithoutPassword);
});

app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

app.post('/users',
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const maxId = users.reduce((max, u) => (u.id > max ? u.id : max), 0);
    const newUser = {
      id: maxId + 1,
      name,
      email,
      password
    };

    users.push(newUser);
    await saveUsers();

    const { password: _, ...createdUser } = newUser;
    res.status(201).json(createdUser);
  }
);

app.patch('/users/:id',
  body('name').optional().isString(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const { name, email, password } = req.body;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (password !== undefined) user.password = password;

    await saveUsers();

    const { password: _, ...updatedUser } = user;
    res.json(updatedUser);
  }
);

app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = users.length;
  users = users.filter(u => u.id !== id);

  if (users.length < initialLength) {
    await saveUsers();
    res.json({ message: 'Пользователь удалён' });
  } else {
    res.status(404).json({ error: 'Пользователь не найден' });
  }
});

// Стартовая страница (если есть index.html в public)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Что-то пошло не так' });
});

// Запуск
Promise.all([loadProducts(), loadUsers()]).then(() => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Swagger документация: http://localhost:${PORT}/api-docs`);
  });
});
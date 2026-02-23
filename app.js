const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

let products = [
    { id: 1, name: "Пельмени Ева-01", price: 832, description: "Японские пельмени в коллаборации с авторами аниме 'Евангелион'." },
    { id: 2, name: "Пельмени Ева-02", price: 854, description: "Японские пельмени в коллаборации с авторами аниме 'Евангелион'." },
    { id: 3, name: "Пельмени Ева-00", price: 811, description: "Японские пельмени в коллаборации с авторами аниме 'Евангелион'." },
    { id: 4, name: "Палочки Pocky лесные ягоды", price: 380, description: "Бисквитные палочки в глазури со вкусом лесных ягод." },
    { id: 5, name: "Палочки Pocky клубника", price: 380, description: "Бисквитные палочки в глазури со вкусом клубники." },
    { id: 6, name: "Моти", price: 230, description: "Мягкое, эластичное рисовое пирожное с черничной начинкой." },
    { id: 7, name: "Нори Темпура с чили", price: 723, description: "Это острые водоросли нори, обжаренные в темпуре, приготовленные в соответствии с японскими традициями." },
];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // раздача статических файлов

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

app.post('/products', (req, res) => {
    const { name, price, description } = req.body;

    if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Название обязательно и должно быть строкой!' });
    }
    if (price === undefined || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ error: 'Цена обязательна и должна быть положительным числом!' });
    }
    
    if (description !== undefined && typeof description !== 'string') {
        return res.status(400).json({ error: 'Описание должно быть строкой!' });
    }

    const newProduct = {
        id: Date.now(), 
        name,
        price,
        description: description || ''
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);
    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    const { name, price, description } = req.body;

    if (name !== undefined) {
        if (typeof name !== 'string') {
            return res.status(400).json({ error: 'Поле "name" должно быть строкой' });
        }
        product.name = name;
    }
    if (price !== undefined) {
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: 'Поле "price" должно быть положительным числом' });
        }
        product.price = price;
    }
    if (description !== undefined) {
        if (typeof description !== 'string') {
            return res.status(400).json({ error: 'Поле "description" должно быть строкой' });
        }
        product.description = description;
    }

    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length < initialLength) {
        res.json({ message: 'Товар удалён' });
    } else {
        res.status(404).json({ error: 'Товар не найден' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
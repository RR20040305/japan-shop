# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




# Отчет по КР1  
## Выполненные работы

В ходе выполнения практических занятий №1–5 были реализованы:

- **Практическое занятие №1** – использование CSS-препроцессора SASS для стилизации интернет-магазина.
- **Практическое занятие №2** – разработка серверной части на Node.js + Express с CRUD операциями для товаров.
- **Практическое занятие №3** - использование Postman.
- **Практическое занятие №4** – интеграция фронтенда (React/HTML) с бэкендом, взаимодействие через API.
- **Практическое занятие №5** – подключение Swagger для документирования REST API.

## Используемые технологии

- **Frontend**: HTML5, CSS3, SASS (SCSS), React (частично), Fetch API.
- **Backend**: Node.js, Express.js, express-validator, CORS, Swagger (swagger-jsdoc, swagger-ui-express).
- **Инструменты**: npm, Git.

## Реализация
### 1. CSS-препроцессор SASS (Практическое занятие №1)

В файле [`styles.scss`](./styles.scss) применены основные возможности SASS:

- **Переменные** – для хранения цветовой схемы, отступов, радиусов:
  ```scss
  $primary-color: #7d5a5a;
  $bg1-color: #fff3f3;
  $border-color: #efb1c3;
  $space-md: 1rem;
  $border-radius: 16px;
  ```

- **Миксины** – для переиспользования стилей (например, тени карточек):
  ```scss
  @mixin card-shadow($color, $blur: 20px) {
    box-shadow: 0 4px $blur rgba($color, 0.08);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    &:hover {
      box-shadow: 0 8px $blur * 1.5 rgba($color, 0.12);
      transform: translateY(-2px);
    }
  }
  ```

- **Вложенность** – иерархическая структура селекторов, повторяющая HTML:
  ```scss
  .site-header {
    background: linear-gradient(...);
    &::after { ... }
  }
  .title {
    .title-text { ... }
    .title-des { ... }
  }
  ```

Эти возможности позволили упростить поддержку стилей и сделать код более читаемым.

---

### 2. Сервер на Node.js + Express (Практическое занятие №2)

Сервер реализован в файле [`app.js`](./app.js). Основные моменты:

- **Подключение необходимых модулей**:
  ```js
  const express = require('express');
  const { body, validationResult } = require('express-validator');
  const cors = require('cors');
  ```

- **Middleware**:
  - `express.json()` – парсинг JSON тела запроса.
  - `cors` – разрешение запросов с фронтенда (`http://localhost:3001`).
  - Статические файлы из папки `public`.

- **CRUD для товаров** (массив `products` загружается из `products.json` и сохраняется обратно):
  - **GET /products** – получение всех товаров.
  - **GET /products/:id** – получение товара по id.
  - **POST /products** – создание нового товара с валидацией полей (name, price, category, amount, description).
  - **PATCH /products/:id** – частичное обновление товара.
  - **DELETE /products/:id** – удаление товара.

  Пример маршрута создания товара:
  ```js
  app.post('/products',
    body('name').isString().notEmpty(),
    body('price').isFloat({ gt: 0 }),
    // ...
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // создание и сохранение товара
    }
  );
  ```

- **Валидация** выполнена с помощью `express-validator`, что обеспечивает корректность входных данных.

- **Хранение данных** – в JSON-файлах (`products.json`, `users.json`), чтение и запись асинхронны.

---

### 3. Интеграция фронтенда и бэкенда (Практическое занятие №4)

#### Клиентская часть на чистом HTML/JavaScript

В файле [`public/index.html`](./public/index.html) реализован интерфейс для управления товарами:

- **Загрузка товаров** при загрузке страницы через `fetch`:
  ```js
  async function loadProducts() {
    const response = await fetch('/products');
    const products = await response.json();
    renderProducts(products);
  }
  ```

- **Отображение товаров** в виде карточек с кнопками «Редактировать» и «Удалить».

- **Добавление товара** через форму – отправка POST-запроса с JSON.

- **Редактирование** – через PATCH-запрос с обновлёнными полями.

- **Удаление** – DELETE-запрос с подтверждением.

Пример обработчика удаления:
```js
const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
if (!response.ok) throw new Error('Ошибка при удалении');
loadProducts(); // обновить список
```

#### React-версия

Клиентская часть на React находится в папке src. Основной компонент – ProductsPage.jsx. Он использует хуки для управления состоянием и загрузки данных.
Загрузка товаров при монтировании
```jsx
useEffect(() => {
  loadProducts();
}, []);

const loadProducts = async () => {
  setLoading(true);
  const data = await api.getProducts();
  setProducts(data);
  setLoading(false);
};
```

Управление модальным окном (создание/редактирование)
```jsx
const [modalOpen, setModalOpen] = useState(false);
const [modalMode, setModalMode] = useState('create');
const [editingProduct, setEditingProduct] = useState(null);

const openCreate = () => {
  setModalMode('create');
  setEditingProduct(null);
  setModalOpen(true);
};

const openEdit = (product) => {
  setModalMode('edit');
  setEditingProduct(product);
  setModalOpen(true);
};
```

Обработка удаления
```jsx
const handleDelete = async (id) => {
  if (!window.confirm('Удалить товар?')) return;
  await api.deleteProduct(id);
  setProducts(prev => prev.filter(p => p.id !== id));
};
```

Отправка данных в API
```jsx
const handleSubmitModal = async (payload) => {
  if (modalMode === 'create') {
    const newProduct = await api.createProduct(payload);
    setProducts(prev => [...prev, newProduct]);
  } else {
    const updated = await api.updateProduct(payload.id, payload);
    setProducts(prev => prev.map(p => p.id === payload.id ? updated : p));
  }
  closeModal();
};
```

Компоненты-помощники
ProductList – отображает список карточек товаров, передаёт события редактирования/удаления.

ProductModal – универсальное модальное окно для создания и редактирования товара.

### 4. Документирование API с помощью Swagger (Практическое занятие №5)

В серверное приложение добавлена поддержка Swagger:

- Установлены пакеты `swagger-jsdoc` и `swagger-ui-express`.
- В `app.js` настроена генерация спецификации:
  ```js
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API магазина "Токийский дрифт"',
        version: '1.0.0',
        description: 'Документация для управления товарами и пользователями',
      },
      servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: [__filename], // файлы с JSDoc-комментариями
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  ```

- Для каждого маршрута добавлены JSDoc-комментарии с описанием параметров, тела запроса и ответов.  
  *Пример (в коде комментарии не приведены, но предполагается их наличие):*
  ```js
  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Возвращает список всех товаров
   *     responses:
   *       200:
   *         description: Успешный ответ
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Product'
   */
  ```

После запуска сервера документация доступна по адресу:  
[http://localhost:3000/api-docs](http://localhost:3000/api-docs) (интерактивный интерфейс).

---

## Запуск проекта

1. **Клонировать репозиторий**:
   ```bash
   git clone <URL репозитория>
   cd <папка проекта>
   ```

2. **Установить зависимости** (для сервера):
   ```bash
   npm install
   ```

3. **Запустить сервер**:
   ```bash
   node app.js
   ```
   Сервер будет доступен на `http://localhost:3000`.

4. **Открыть клиентскую часть**:
   - Простая HTML-версия: перейти по `http://localhost:3000` (файлы из папки `public` обслуживаются статически).
   - React-версия: требуется отдельный запуск (например, `npm start` в папке клиента на порту 3001).

---

## Выводы

В результате выполнения практических работ был создан полноценный интернет-магазин с тематикой японских товаров «Токийский дрифт»:

- Применён **SASS** для современной, модульной стилизации.
- Разработано **REST API** на Express с полным набором CRUD операций.
- Реализована **связка клиента и сервера** через Fetch API.
- Добавлена **документация Swagger**, упрощающая тестирование и взаимодействие с API.

Все исходные коды находятся в данном репозитории.

---

**Ссылка на репозиторий:** [https://github.com/RR20040305/japan-shop](https://github.com/RR20040305/japan-shop)

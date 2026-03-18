import React, { useState, useEffect } from 'react';
import './ProductsPage.scss';
import ProductList from '../../components/ProductList';
import ProductModal from '../../components/ProductModal';
import { api } from '../../api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

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

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить товар?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Ошибка удаления');
    }
  };

  const handleSubmitModal = async (payload) => {
    try {
      if (modalMode === 'create') {
        const newProduct = await api.createProduct(payload);
        setProducts(prev => [...prev, newProduct]);
      } else {
        const updated = await api.updateProduct(payload.id, payload);
        setProducts(prev => prev.map(p => p.id === payload.id ? updated : p));
      }
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Ошибка сохранения');
    }
  };

  return (
    <div className="page">
      <header className="site-header">
        <div className="title">
          <h1 className="title-text">Магазин "Токийский дрифт"</h1>
          <p className="title-des">Магазин японских вкусняшек.</p>
        </div>
      </header>

      <main>
        <section className="add-product-form">
          <h3>Добавить новый товар</h3>
          <form id="addProductForm" onSubmit={e => e.preventDefault()}>
            {/* Форма добавления временно заменена модальным окном,
                но можно оставить как есть, если хотите две формы.
                По заданию форма есть вверху, а мы используем модалку.
                Для простоты скроем эту секцию или оставим как кнопку. */}
            <button type="button" className="btn btn--primary" onClick={openCreate}>
              + Добавить товар (модалка)
            </button>
          </form>
        </section>

        <section className="products-area">
          <div className="card-header">
            <h3 className="card-title">Наш ассортимент товаров</h3>
          </div>
          <div className="product-container" id="product-container">
            {loading ? (
              <div className="loading-spinner">Загрузка...</div>
            ) : (
              <ProductList
                products={products}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__container">
          <nav className="footer-nav">
            <ul className="footer-nav__list">
              <li className="footer-nav__item">
                <a href="contacts.html" className="footer-nav__link">Контакты</a>
              </li>
              <li className="footer-nav__item">
                <a href="#" className="footer-nav__link">Политика конфиденциальности</a>
              </li>
            </ul>
          </nav>
          <p className="site-footer__copyright">© 2026, Магазин «Токийский дрифт»</p>
        </div>
      </footer>

      <ProductModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}
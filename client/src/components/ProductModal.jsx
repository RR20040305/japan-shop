import React, { useEffect, useState } from 'react';

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (open && initialProduct) {
      setName(initialProduct.name || '');
      setPrice(initialProduct.price?.toString() || '');
      setDescription(initialProduct.description || '');
      setCategory(initialProduct.category || '');
      setAmount(initialProduct.amount?.toString() || '');
    } else if (open) {
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setAmount('');
    }
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === 'edit' ? 'Редактировать товар' : 'Добавить товар';

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedPrice = Number(price);
    const parsedAmount = Number(amount);

    if (!trimmedName) {
      alert('Введите название');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      alert('Цена должна быть положительным числом');
      return;
    }
    if (!category.trim()) {
      alert('Введите категорию');
      return;
    }
    if (!Number.isInteger(parsedAmount) || parsedAmount < 0) {
      alert('Количество должно быть целым неотрицательным числом');
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      name: trimmedName,
      price: parsedPrice,
      description: description.trim(),
      category: category.trim(),
      amount: parsedAmount
    });
  };

  return (
    <div className="backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose}>×</button>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Название
            <input
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              required
            />
          </label>
          <label className="label">
            Цена (₽)
            <input
              className="input"
              type="number"
              step="1"
              min="1"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </label>
          <label className="label">
            Описание
            <textarea
              className="input"
              rows="3"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </label>
          <label className="label">
            Категория
            <input
              className="input"
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
            />
          </label>
          <label className="label">
            Количество на складе
            <input
              className="input"
              type="number"
              step="1"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </label>
          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>Отмена</button>
            <button type="submit" className="btn btn--primary">
              {mode === 'edit' ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
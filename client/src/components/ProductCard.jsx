import React from 'react';

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card" data-id={product.id}>
      <div className="product-card__image">
        <img
          src={`/img/${product.id}.jpg`}
          alt={product.name}
          className="card-img-top card-image"
        />
      </div>
      <div className="product-card__content">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        <p className="product-card__price">Цена: {product.price} ₽</p>
        <p className="product-card__category">{product.category}</p>
        <p className="product-card__amount">{product.amount}</p>
        <div className="product-card__actions">
          <button className="edit-btn" onClick={() => onEdit(product)}>Редактировать</button>
          <button className="delete-btn" onClick={() => onDelete(product.id)}>Удалить</button>
        </div>
      </div>
    </div>
  );
}
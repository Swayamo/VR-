import { useEffect } from 'react';

const ProductModal = ({ product, onClose, isOpen }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="product-modal">
        <button className="close-button" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          position: 'relative'
        }}>
          <img src={product.image} alt={product.name} style={{width: '200px', height: 'auto'}} />
          <h2 style={{color: '#2196F3', margin: '10px 0'}}>{product.name}</h2>
          <p style={{color: '#666', marginBottom: '15px'}}>{product.description}</p>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px'}}>
            <span style={{fontSize: '24px', fontWeight: 'bold', color: '#2196F3'}}>{product.price}</span>
            <span style={{color: '#666'}}>⭐ {product.rating}</span>
          </div>
          <button style={{
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            width: '100%'
          }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;

import React, { useEffect } from 'react';
import { AlertCircle, AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Xác nhận', 
  cancelText = 'Hủy',
  type = 'confirm' // 'confirm' or 'alert'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isAlert = type === 'alert';

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onCancel}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          <div className={`modal-icon ${isAlert ? 'alert' : 'confirm'}`}>
            {isAlert ? <AlertCircle size={28} /> : <AlertTriangle size={28} />}
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>
        
        <div className="modal-body">
          <p>{message}</p>
        </div>
        
        <div className="modal-footer">
          {!isAlert && (
            <button className="modal-btn modal-btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button 
            className={`modal-btn modal-btn-confirm ${isAlert ? 'modal-btn-full' : ''}`} 
            onClick={onConfirm || onCancel}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

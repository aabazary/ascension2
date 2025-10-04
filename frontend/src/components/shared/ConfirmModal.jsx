import React from 'react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  confirmText = "CONFIRM", 
  cancelText = "CANCEL",
  variant = "danger" // "danger", "warning", "info"
}) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          confirmButton: 'bg-red-600 hover:bg-red-700 border-red-600',
          titleColor: 'text-red-400'
        };
      case 'warning':
        return {
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 border-yellow-600',
          titleColor: 'text-yellow-400'
        };
      case 'info':
        return {
          confirmButton: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
          titleColor: 'text-blue-400'
        };
      default:
        return {
          confirmButton: 'bg-red-600 hover:bg-red-700 border-red-600',
          titleColor: 'text-red-400'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="arcade-panel max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`font-arcade text-xl ${styles.titleColor}`}>{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 text-center">{message}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white hover:border-gray-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 border rounded-lg text-white transition-colors ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiExclamation } from 'react-icons/hi';

const iconMap = {
  success: HiCheckCircle,
  error: HiExclamationCircle,
  warning: HiExclamation,
  info: HiInformationCircle,
};

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const Icon = iconMap[type];

  return (
    <div className={`alert alert--${type}`}>
      <Icon size={20} />
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ marginLeft: '8px', opacity: 0.7, cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.1rem' }}>
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;

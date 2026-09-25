const Loader = ({ size = 'md', text = '' }) => {
  return (
    <div className="loader-container">
      <div style={{ textAlign: 'center' }}>
        <div className={`loader ${size === 'sm' ? 'loader--sm' : ''}`}></div>
        {text && <p style={{ marginTop: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{text}</p>}
      </div>
    </div>
  );
};

export default Loader;

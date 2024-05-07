import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#f0f0f0', padding: '20px', textAlign: 'center' }}>
      <div>
        <p style={{ margin: '0' }}>Powered by Finakon</p>
        <p style={{ margin: '0', fontSize: '14px' }}>© {new Date().getFullYear()} Your Website</p>
      </div>
      <div style={{ marginTop: '10px' }}>
        <a href="#" style={{ marginRight: '10px', color: '#333' }}>Link 1</a>
        <a href="#" style={{ marginRight: '10px', color: '#333' }}>Link 2</a>
        <a href="#" style={{ color: '#333' }}>Link 3</a>
      </div>
    </footer>
  );
};

export default Footer;

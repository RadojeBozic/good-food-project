import { useState } from 'react';
import api from '../api';

function ImportProducts() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/import-products', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (err) {
      console.error('Greška pri uvozu:', err);
      setMessage('Greška pri uvozu fajla.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>📥 Import proizvoda iz Excel fajla</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control my-3" />
      <button className="btn btn-success" onClick={handleUpload} disabled={!file}>Pošalji fajl</button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}

export default ImportProducts;

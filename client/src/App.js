import React, { useState } from 'react';
import './App.css';

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:4000/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.path;
}

async function validateCard(path) {
  const response = await fetch(`http://don100.pythonanywhere.com/predict?image_url=${path}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  const data = await response.json();
  console.log(data);
  return data;
}

function App() {
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setError(null);

    try {
      setLoading(true);
      const url = await uploadImage(file);
      setImagePreview(url);
      await validateCard(url);
    } catch (error) {
      setError('Error processing image. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="heading-container">
            <h1 className="main-heading">Check if your card is a PAN card</h1>
          </div>
      <div className="container">
        <form id="form">
          <div className="input-container">
            <label className="input-label" htmlFor="image">
              Upload PAN Card Image:
            </label>
            <br />
            <input
              type="file"
              id="image"
              name="image"
              className="input-field"
              accept="image/*"
              required
              onChange={handleImageChange}
            />
          </div>

          <div className="image-preview">
            {loading && <p>Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {imagePreview && !loading && !error && (
              <img id="preview" src={imagePreview} alt="image_error" />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import api from '../api';

function ContentManager() {
  const [content, setContent] = useState({
    categories: [],
    products: [],
    features: []
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await api.get('/content');
      // Ensure complex fields are at least empty arrays if undefined
      const data = response.data;
      if (!data.categories) data.categories = [];
      if (!data.products) data.products = [];
      if (!data.features) data.features = [];
      setContent(data);
    } catch (err) {
      console.error('Failed to fetch content');
    }
  };

  const handleSave = async (e) => {
    if(e) e.preventDefault();
    try {
      await api.put('/content', content);
      setMessage('Content updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error updating content.');
    }
  };

  const handleChange = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  // Generic List Handlers
  const handleItemChange = (listKey, index, field, value) => {
    const updatedList = [...content[listKey]];
    updatedList[index][field] = value;
    setContent(prev => ({ ...prev, [listKey]: updatedList }));
  };

  const handleAddItem = (listKey, emptyItem) => {
    setContent(prev => ({ ...prev, [listKey]: [...prev[listKey], { id: Date.now(), ...emptyItem }] }));
  };

  const handleRemoveItem = (listKey, index) => {
    const updatedList = [...content[listKey]];
    updatedList.splice(index, 1);
    setContent(prev => ({ ...prev, [listKey]: updatedList }));
  };

  const handleImageUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleItemChange('products', index, 'image', response.data.url);
      setMessage('Image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error uploading image.');
    }
  };

  return (
    <div>
      <h2>Content Manager</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* General Text Settings */}
        <div style={{ flex: '1', minWidth: '300px', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <h3>General Settings</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Site Title</label>
            <input type="text" value={content.siteTitle || ''} onChange={e => handleChange('siteTitle', e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Hero Title</label>
            <input type="text" value={content.heroTitle || ''} onChange={e => handleChange('heroTitle', e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Hero Subtitle</label>
            <input type="text" value={content.heroSubtitle || ''} onChange={e => handleChange('heroSubtitle', e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Footer Text</label>
            <input type="text" value={content.footerText || ''} onChange={e => handleChange('footerText', e.target.value)} style={{ width: '100%', padding: '0.5rem' }} />
          </div>
        </div>

        {/* Categories */}
        <div style={{ flex: '1', minWidth: '300px', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <h3>Categories</h3>
          {content.categories.map((cat, i) => (
            <div key={cat.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input type="text" value={cat.name} onChange={e => handleItemChange('categories', i, 'name', e.target.value)} style={{ flex: 1, padding: '0.5rem' }} />
              <button onClick={() => handleRemoveItem('categories', i)} style={{ color: 'red' }}>Remove</button>
            </div>
          ))}
          <button onClick={() => handleAddItem('categories', { name: 'New Category' })} style={{ padding: '0.5rem' }}>Add Category</button>
        </div>

        {/* Products */}
        <div style={{ flex: '1', minWidth: '300px', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <h3>Featured Products</h3>
          {content.products.map((prod, i) => (
            <div key={prod.id} style={{ border: '1px solid #ccc', padding: '0.5rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Title" value={prod.title} onChange={e => handleItemChange('products', i, 'title', e.target.value)} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }} />
              <input type="text" placeholder="Price" value={prod.price} onChange={e => handleItemChange('products', i, 'price', e.target.value)} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }} />
              <input type="text" placeholder="Image Name/URL" value={prod.image} onChange={e => handleItemChange('products', i, 'image', e.target.value)} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }} />
              <input type="file" accept="image/*" onChange={e => handleImageUpload(i, e)} style={{ width: '100%', marginBottom: '0.5rem' }} />
              <button onClick={() => handleRemoveItem('products', i)} style={{ color: 'red' }}>Remove Product</button>
            </div>
          ))}
          <button onClick={() => handleAddItem('products', { title: 'New Product', price: 'MWK 0', image: 'placeholder.jpeg', link: '#' })} style={{ padding: '0.5rem' }}>Add Product</button>
        </div>

        {/* Features */}
        <div style={{ flex: '1', minWidth: '300px', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <h3>Why Choose Us Features</h3>
          {content.features.map((feat, i) => (
            <div key={feat.id} style={{ border: '1px solid #ccc', padding: '0.5rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Title" value={feat.title} onChange={e => handleItemChange('features', i, 'title', e.target.value)} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }} />
              <textarea placeholder="Description" value={feat.description} onChange={e => handleItemChange('features', i, 'description', e.target.value)} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }} />
              <button onClick={() => handleRemoveItem('features', i)} style={{ color: 'red' }}>Remove Feature</button>
            </div>
          ))}
          <button onClick={() => handleAddItem('features', { title: 'New Feature', description: 'Description' })} style={{ padding: '0.5rem' }}>Add Feature</button>
        </div>
      </div>
      
      <button onClick={handleSave} style={{ marginTop: '2rem', padding: '1rem 2rem', background: '#28A745', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1.2rem', width: '100%' }}>
        Save All Changes
      </button>
    </div>
  );
}

export default ContentManager;

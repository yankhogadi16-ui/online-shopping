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
      <div className="page-header">
        <h2>Content Manager</h2>
      </div>
      
      {message && <div className="alert-success">{message}</div>}
      
      <div className="card-grid">
        {/* General Text Settings */}
        <div className="card">
          <h3>General Settings</h3>
          <div className="form-group">
            <label className="form-label">Site Title</label>
            <input type="text" className="form-control" value={content.siteTitle || ''} onChange={e => handleChange('siteTitle', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Hero Title</label>
            <input type="text" className="form-control" value={content.heroTitle || ''} onChange={e => handleChange('heroTitle', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Hero Subtitle</label>
            <input type="text" className="form-control" value={content.heroSubtitle || ''} onChange={e => handleChange('heroSubtitle', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Footer Text</label>
            <input type="text" className="form-control" value={content.footerText || ''} onChange={e => handleChange('footerText', e.target.value)} />
          </div>
        </div>

        {/* Categories */}
        <div className="card">
          <h3>Categories</h3>
          {content.categories.map((cat, i) => (
            <div key={cat.id} className="list-item-row" style={{ marginBottom: '1rem' }}>
              <input type="text" className="form-control" value={cat.name} onChange={e => handleItemChange('categories', i, 'name', e.target.value)} />
              <button onClick={() => handleRemoveItem('categories', i)} className="btn btn-danger">Remove</button>
            </div>
          ))}
          <button onClick={() => handleAddItem('categories', { name: 'New Category' })} className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Category</button>
        </div>

        {/* Products */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3>Featured Products</h3>
          <div className="card-grid">
            {content.products.map((prod, i) => (
              <div key={prod.id} className="list-item">
                <input type="text" className="form-control" placeholder="Title" value={prod.title || ''} onChange={e => handleItemChange('products', i, 'title', e.target.value)} />
                
                <div className="list-item-row">
                  <input type="text" className="form-control" placeholder="Price" value={prod.price || ''} onChange={e => handleItemChange('products', i, 'price', e.target.value)} />
                  <select className="form-control" value={prod.category || ''} onChange={e => handleItemChange('products', i, 'category', e.target.value)}>
                    <option value="">Select Category...</option>
                    {content.categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Image (URL or Upload)</label>
                  <div className="list-item-row">
                    <input type="text" className="form-control" placeholder="Image URL" value={prod.image || ''} onChange={e => handleItemChange('products', i, 'image', e.target.value)} />
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(i, e)} style={{ width: '120px' }} />
                  </div>
                </div>

                <button onClick={() => handleRemoveItem('products', i)} className="btn btn-danger" style={{ alignSelf: 'flex-end', marginTop: '0.5rem' }}>Remove Product</button>
              </div>
            ))}
          </div>
          <button onClick={() => handleAddItem('products', { title: 'New Product', price: 'MWK 0', image: 'placeholder.jpeg', link: '#', category: '' })} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Add Product</button>
        </div>

        {/* Features */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h3>Why Choose Us Features</h3>
          {content.features.map((feat, i) => (
            <div key={feat.id} className="list-item">
              <input type="text" className="form-control" placeholder="Title" value={feat.title || ''} onChange={e => handleItemChange('features', i, 'title', e.target.value)} />
              <textarea className="form-control" placeholder="Description" value={feat.description || ''} onChange={e => handleItemChange('features', i, 'description', e.target.value)} />
              <button onClick={() => handleRemoveItem('features', i)} className="btn btn-danger" style={{ alignSelf: 'flex-end' }}>Remove Feature</button>
            </div>
          ))}
          <button onClick={() => handleAddItem('features', { title: 'New Feature', description: 'Description' })} className="btn btn-primary" style={{ marginTop: '1rem' }}>Add Feature</button>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <button onClick={handleSave} className="btn btn-success" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
          Save All Changes
        </button>
      </div>
    </div>
  );
}

export default ContentManager;

import React, { useState, useEffect } from 'react';
import { partsApi } from '../../services/api';

const PartsPage = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPart, setEditingPart] = useState(null);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const data = await partsApi.getAll();
      setParts(data);
    } catch (err) {
      setError('Failed to fetch parts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = async (partData) => {
    try {
      await partsApi.create(partData);
      fetchParts();
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add part');
    }
  };

  const handleUpdatePart = async (id, partData) => {
    try {
      await partsApi.update(id, partData);
      fetchParts();
      setEditingPart(null);
    } catch (err) {
      setError('Failed to update part');
    }
  };

  const handleDeletePart = async (id) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      try {
        await partsApi.delete(id);
        fetchParts();
      } catch (err) {
        setError('Failed to delete part');
      }
    }
  };

  const filteredParts = parts.filter(part =>
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.partNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="parts-page">
      <div className="page-header">
        <h1>Parts Management</h1>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add New Part
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search parts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="parts-table">
          <table>
            <thead>
              <tr>
                <th>Part Number</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map(part => (
                <tr key={part.id}>
                  <td>{part.partNumber}</td>
                  <td>{part.name}</td>
                  <td>{part.category}</td>
                  <td>${part.price}</td>
                  <td>{part.stockQuantity}</td>
                  <td>
                    <button 
                      onClick={() => setEditingPart(part)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeletePart(part.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAddForm || editingPart) && (
        <PartForm
          part={editingPart}
          onSubmit={editingPart ? handleUpdatePart : handleAddPart}
          onCancel={() => {
            setShowAddForm(false);
            setEditingPart(null);
          }}
        />
      )}
    </div>
  );
};

const PartForm = ({ part, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    partNumber: part?.partNumber || '',
    name: part?.name || '',
    category: part?.category || '',
    price: part?.price || '',
    stockQuantity: part?.stockQuantity || '',
    description: part?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(part?.id, formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{part ? 'Edit Part' : 'Add New Part'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Part Number"
            value={formData.partNumber}
            onChange={(e) => setFormData({...formData, partNumber: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Stock Quantity"
            value={formData.stockQuantity}
            onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartsPage;

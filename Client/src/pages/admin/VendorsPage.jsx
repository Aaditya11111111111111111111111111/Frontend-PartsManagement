import React, { useState, useEffect } from 'react';
import { vendorsApi } from '../../services/api';

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await vendorsApi.getAll();
      setVendors(data);
    } catch (err) {
      setError('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async (vendorData) => {
    try {
      await vendorsApi.create(vendorData);
      fetchVendors();
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add vendor');
    }
  };

  const handleUpdateVendor = async (id, vendorData) => {
    try {
      await vendorsApi.update(id, vendorData);
      fetchVendors();
      setEditingVendor(null);
    } catch (err) {
      setError('Failed to update vendor');
    }
  };

  const handleDeleteVendor = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await vendorsApi.delete(id);
        fetchVendors();
      } catch (err) {
        setError('Failed to delete vendor');
      }
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.phone.includes(searchTerm)
  );

  return (
    <div className="vendors-page">
      <div className="page-header">
        <h1>Vendors Management</h1>
        <button 
          className="add-btn"
          onClick={() => setShowAddForm(true)}
        >
          Add New Vendor
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search vendors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="vendors-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map(vendor => (
                <tr key={vendor.id}>
                  <td>{vendor.name}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.phone}</td>
                  <td>{vendor.address}</td>
                  <td>
                    <span className={`status ${vendor.status.toLowerCase()}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => setEditingVendor(vendor)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteVendor(vendor.id)}
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

      {(showAddForm || editingVendor) && (
        <VendorForm
          vendor={editingVendor}
          onSubmit={editingVendor ? handleUpdateVendor : handleAddVendor}
          onCancel={() => {
            setShowAddForm(false);
            setEditingVendor(null);
          }}
        />
      )}
    </div>
  );
};

const VendorForm = ({ vendor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    address: vendor?.address || '',
    status: vendor?.status || 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(vendor?.id, formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{vendor ? 'Edit Vendor' : 'Add New Vendor'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Vendor Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
          <textarea
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorsPage;

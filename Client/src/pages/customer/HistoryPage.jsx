import React, { useState, useEffect } from 'react';
import { customersApi } from '../../services/api';

const HistoryPage = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    setLoading(true);
    try {
      const data = await customersApi.getOrders();
      setOrderHistory(data);
    } catch (error) {
      console.error('Error fetching order history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orderHistory.filter(order => {
    const matchesFilter = filter === 'all' || order.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = order.id.toString().includes(searchTerm) || 
                         new Date(order.orderDate).toLocaleDateString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#28a745';
      case 'processing': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>Order History</h1>
        <button className="back-btn">
          ← Back to Dashboard
        </button>
      </div>

      <div className="history-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by order ID or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
          <button
            className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
            onClick={() => setFilter('processing')}
          >
            Processing
          </button>
          <button
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="orders-container">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found matching your criteria.</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">{new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div className="order-summary">
                  <span className="order-total">${order.totalAmount}</span>
                  <span 
                    className="order-status"
                    style={{ color: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                <ul>
                  {order.orderItems?.map((item, index) => (
                    <li key={index} className="order-item">
                      <span className="item-name">{item.partName}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">${item.unitPrice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="order-actions">
                <button className="view-details-btn">
                  View Details
                </button>
                {order.status === 'Delivered' && (
                  <button className="review-btn">
                    Write Review
                  </button>
                )}
                {order.status === 'Processing' && (
                  <button className="track-btn">
                    Track Order
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPage;

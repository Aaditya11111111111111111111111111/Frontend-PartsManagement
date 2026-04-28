import React, { useState, useEffect } from 'react';
import { customersApi } from '../../services/api';

const CustomerDashboard = () => {
  const [customerData, setCustomerData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    setLoading(true);
    try {
      const data = await customersApi.getMe();
      setCustomerData({
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        memberSince: data.createdAt
      });
      
      // Fetch recent orders
      const orders = await customersApi.getOrders();
      setRecentOrders(orders.slice(0, 5)); // Show last 5 orders
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>Customer Dashboard</h1>
        <p>Welcome back, {customerData?.name}!</p>
      </div>

      <div className="dashboard-content">
        <div className="customer-info-card">
          <h2>Profile Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{customerData?.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{customerData?.email}</span>
            </div>
            <div className="info-item">
              <label>Phone:</label>
              <span>{customerData?.phone}</span>
            </div>
            <div className="info-item">
              <label>Member Since:</label>
              <span>{new Date(customerData?.memberSince).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="recent-orders-card">
          <h2>Recent Orders</h2>
          <div className="orders-list">
            {recentOrders.length === 0 ? (
              <p>No recent orders</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="order-item">
                  <div className="order-info">
                    <span className="order-id">Order #{order.id}</span>
                    <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                    <span className="order-total">${order.totalAmount}</span>
                    <span className={`order-status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="view-all-btn">
            View All Orders
          </button>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card">
              <h3>AI Parts Predictor</h3>
              <p>Find the right parts for your vehicle</p>
            </div>
            <div className="action-card">
              <h3>Order History</h3>
              <p>View your past orders</p>
            </div>
            <div className="action-card">
              <h3>Book Appointment</h3>
              <p>Schedule a service appointment</p>
            </div>
            <div className="action-card">
              <h3>Write Review</h3>
              <p>Share your experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

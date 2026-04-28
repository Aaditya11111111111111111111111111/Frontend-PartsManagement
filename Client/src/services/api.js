// Mock API service - replace with actual API calls

const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authApi = {
  login: async (email, password) => {
    // Mock login - replace with actual API call
    return { success: true, user: { id: 1, name: 'John Doe', email, role: 'Admin' } };
  },
  
  register: async (userData) => {
    // Mock registration - replace with actual API call
    return { success: true, user: { id: 1, name: userData.fullName, email: userData.email, role: 'Customer' } };
  }
};

// Customers API
export const customersApi = {
  getMe: async () => {
    // Mock customer data - replace with actual API call
    return {
      id: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      createdAt: '2024-01-15',
      Vehicles: [
        { id: 1, make: 'Toyota', model: 'Camry', year: 2020, vehicleNumber: 'ABC123' },
        { id: 2, make: 'Honda', model: 'Civic', year: 2021, vehicleNumber: 'XYZ789' }
      ]
    };
  },

  getOrders: async () => {
    // Mock orders - replace with actual API call
    return [
      {
        id: 1,
        orderDate: '2024-04-20',
        totalAmount: 250.00,
        status: 'Delivered',
        orderItems: [
          { partName: 'Brake Pads', quantity: 2, unitPrice: 45.00 },
          { partName: 'Oil Filter', quantity: 1, unitPrice: 25.00 }
        ]
      },
      {
        id: 2,
        orderDate: '2024-04-18',
        totalAmount: 180.50,
        status: 'Processing',
        orderItems: [
          { partName: 'Air Filter', quantity: 1, unitPrice: 30.00 },
          { partName: 'Wiper Blades', quantity: 2, unitPrice: 25.00 }
        ]
      }
    ];
  }
};

// AI API
export const aiApi = {
  predict: async (vehicleId) => {
    // Mock AI prediction - replace with actual API call
    return [
      {
        name: 'Brake Pads',
        probability: 85,
        price: 45.00,
        description: 'High-quality brake pads for optimal stopping performance'
      },
      {
        name: 'Oil Filter',
        probability: 75,
        price: 25.00,
        description: 'Premium oil filter for engine protection'
      },
      {
        name: 'Spark Plugs',
        probability: 60,
        price: 35.00,
        description: 'Iridium spark plugs for better fuel efficiency'
      }
    ];
  }
};

// Parts API
export const partsApi = {
  getAll: async () => {
    // Mock parts data - replace with actual API call
    return [
      {
        id: 1,
        partNumber: 'BP001',
        name: 'Brake Pads',
        category: 'Brakes',
        price: 45.00,
        stockQuantity: 50,
        description: 'High-quality brake pads'
      },
      {
        id: 2,
        partNumber: 'OF001',
        name: 'Oil Filter',
        category: 'Filters',
        price: 25.00,
        stockQuantity: 100,
        description: 'Premium oil filter'
      }
    ];
  },

  create: async (partData) => {
    // Mock create - replace with actual API call
    return { id: Date.now(), ...partData };
  },

  update: async (id, partData) => {
    // Mock update - replace with actual API call
    return { id, ...partData };
  },

  delete: async (id) => {
    // Mock delete - replace with actual API call
    return { success: true };
  }
};

// Vendors API
export const vendorsApi = {
  getAll: async () => {
    // Mock vendors data - replace with actual API call
    return [
      {
        id: 1,
        name: 'AutoParts Supplier',
        email: 'info@autoparts.com',
        phone: '+1234567890',
        address: '123 Main St, City, State',
        status: 'Active'
      },
      {
        id: 2,
        name: 'Quality Parts Inc',
        email: 'sales@qualityparts.com',
        phone: '+0987654321',
        address: '456 Oak Ave, Town, State',
        status: 'Active'
      }
    ];
  },

  create: async (vendorData) => {
    // Mock create - replace with actual API call
    return { id: Date.now(), ...vendorData };
  },

  update: async (id, vendorData) => {
    // Mock update - replace with actual API call
    return { id, ...vendorData };
  },

  delete: async (id) => {
    // Mock delete - replace with actual API call
    return { success: true };
  }
};

// Appointments API
export const appointmentsApi = {
  getAll: async () => {
    // Mock appointments - replace with actual API call
    return [
      {
        id: 1,
        date: '2024-04-25',
        time: '10:00 AM',
        customerName: 'John Doe',
        vehicleInfo: 'Toyota Camry 2020',
        service: 'Oil Change',
        status: 'Scheduled',
        notes: 'Customer requested synthetic oil'
      },
      {
        id: 2,
        date: '2024-04-26',
        time: '2:00 PM',
        customerName: 'Jane Smith',
        vehicleInfo: 'Honda Civic 2021',
        service: 'Brake Inspection',
        status: 'Confirmed',
        notes: 'Check brake pads and rotors'
      }
    ];
  },

  create: async (appointmentData) => {
    // Mock create - replace with actual API call
    return { id: Date.now(), ...appointmentData };
  },

  update: async (id, appointmentData) => {
    // Mock update - replace with actual API call
    return { id, ...appointmentData };
  },

  delete: async (id) => {
    // Mock delete - replace with actual API call
    return { success: true };
  }
};

// Part Requests API
export const partRequestsApi = {
  getAll: async () => {
    // Mock part requests - replace with actual API call
    return [
      {
        id: 1,
        customerName: 'John Doe',
        partName: 'Brake Pads',
        vehicleInfo: 'Toyota Camry 2020',
        requestDate: '2024-04-20',
        status: 'Pending',
        quantity: 2,
        notes: 'Urgent - customer needs for safety inspection'
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        partName: 'Oil Filter',
        vehicleInfo: 'Honda Civic 2021',
        requestDate: '2024-04-19',
        status: 'Approved',
        quantity: 1,
        notes: 'Regular maintenance'
      }
    ];
  },

  create: async (requestData) => {
    // Mock create - replace with actual API call
    return { id: Date.now(), ...requestData };
  },

  update: async (id, requestData) => {
    // Mock update - replace with actual API call
    return { id, ...requestData };
  },

  delete: async (id) => {
    // Mock delete - replace with actual API call
    return { success: true };
  }
};

// Notifications API
export const notificationsApi = {
  getAll: async () => {
    // Mock notifications - replace with actual API call
    return [
      {
        id: 1,
        title: 'New Appointment Scheduled',
        message: 'John Doe scheduled an appointment for tomorrow at 10 AM',
        type: 'info',
        date: '2024-04-24T10:30:00Z',
        read: false
      },
      {
        id: 2,
        title: 'Low Stock Alert',
        message: 'Brake Pads are running low (5 units remaining)',
        type: 'warning',
        date: '2024-04-24T09:15:00Z',
        read: false
      },
      {
        id: 3,
        title: 'New Customer Registration',
        message: 'Jane Smith has registered as a new customer',
        type: 'success',
        date: '2024-04-23T15:45:00Z',
        read: true
      },
      {
        id: 4,
        title: 'System Maintenance',
        message: 'Scheduled maintenance tonight at 11 PM',
        type: 'info',
        date: '2024-04-23T14:20:00Z',
        read: true
      }
    ];
  },

  markAsRead: async (id) => {
    // Mock mark as read - replace with actual API call
    return { success: true, id, read: true };
  },

  markAllAsRead: async () => {
    // Mock mark all as read - replace with actual API call
    return { success: true };
  },

  delete: async (id) => {
    // Mock delete - replace with actual API call
    return { success: true };
  },

  create: async (notificationData) => {
    // Mock create - replace with actual API call
    return { id: Date.now(), ...notificationData, read: false };
  }
};

// Reports API
export const reportsApi = {
  getSalesReport: async (dateRange) => {
    // Mock sales report - replace with actual API call
    return {
      totalSales: 15420.50,
      totalOrders: 45,
      averageOrderValue: 342.68,
      topSellingParts: [
        { name: 'Brake Pads', quantity: 23, revenue: 1035.00 },
        { name: 'Oil Filter', quantity: 45, revenue: 1125.00 },
        { name: 'Spark Plugs', quantity: 18, revenue: 630.00 }
      ],
      dailySales: [
        { date: '2024-04-20', sales: 1250.00 },
        { date: '2024-04-21', sales: 980.00 },
        { date: '2024-04-22', sales: 1450.00 },
        { date: '2024-04-23', sales: 1670.00 },
        { date: '2024-04-24', sales: 890.00 }
      ]
    };
  },

  getInventoryReport: async () => {
    // Mock inventory report - replace with actual API call
    return {
      totalParts: 156,
      lowStockItems: 8,
      outOfStockItems: 2,
      totalValue: 45780.00,
      categories: [
        { name: 'Brakes', count: 23, value: 12500.00 },
        { name: 'Filters', count: 45, value: 8900.00 },
        { name: 'Engine Parts', count: 34, value: 15600.00 },
        { name: 'Electrical', count: 28, value: 8780.00 }
      ]
    };
  },

  getCustomerReport: async () => {
    // Mock customer report - replace with actual API call
    return {
      totalCustomers: 234,
      newCustomersThisMonth: 18,
      activeCustomers: 189,
      topCustomers: [
        { name: 'John Doe', orders: 12, totalSpent: 2340.00 },
        { name: 'Jane Smith', orders: 8, totalSpent: 1890.00 },
        { name: 'Bob Johnson', orders: 6, totalSpent: 1450.00 }
      ],
      customerRetention: 87.5
    };
  },

  getStaffPerformanceReport: async () => {
    // Mock staff performance report - replace with actual API call
    return {
      totalStaff: 8,
      averagePerformance: 4.2,
      topPerformers: [
        { name: 'Alice Wilson', sales: 8900.00, customers: 45, rating: 4.8 },
        { name: 'Bob Brown', sales: 7650.00, customers: 38, rating: 4.6 },
        { name: 'Carol Davis', sales: 6780.00, customers: 32, rating: 4.4 }
      ]
    };
  }
};

// Reviews API
export const reviewsApi = {
  getAll: async () => {
    // Mock reviews - replace with actual API call
    return [
      {
        id: 1,
        customerName: 'John Doe',
        rating: 5,
        comment: 'Excellent service! Very professional and quick.',
        date: '2024-04-15',
        serviceName: 'Oil Change'
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        rating: 4,
        comment: 'Good service, but a bit expensive.',
        date: '2024-04-10',
        serviceName: 'Brake Inspection'
      }
    ];
  },

  create: async (reviewData) => {
    // Mock create - replace with actual API call
    return { id: Date.now(), ...reviewData };
  },

  update: async (id, reviewData) => {
    // Mock update - replace with actual API call
    return { id, ...reviewData };
  },

  delete: async (id) => {
    // Mock delete - replace with actual API call
    return { success: true };
  }
};

export default {
  authApi,
  customersApi,
  aiApi,
  partsApi,
  vendorsApi,
  appointmentsApi,
  partRequestsApi,
  reviewsApi,
  notificationsApi,
  reportsApi
};

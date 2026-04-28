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

export default {
  authApi,
  customersApi,
  aiApi,
  partsApi,
  vendorsApi
};

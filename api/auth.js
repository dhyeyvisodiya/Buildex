import bcrypt from 'bcryptjs';

// Mock database for development
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', // 'password123'
    full_name: 'Admin User',
    phone: '+919999999999',
    role: 'admin',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    username: 'builder',
    email: 'builder@example.com',
    password: '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', // 'password123'
    full_name: 'Builder User',
    phone: '+919999999998',
    role: 'builder',
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    username: 'user',
    email: 'user@example.com',
    password: '$2a$10$8K1p/a0dhrxiowP.dnkgNORTWgdEDHn5L2/xjpEWuC.QQv4rKO9jO', // 'password123'
    full_name: 'Regular User',
    phone: '+919999999997',
    role: 'user',
    created_at: new Date().toISOString()
  }
];

// Register a new user
export async function registerUser({ username, email, password, fullName, phone, role = 'user' }) {
  try {
    // Validate input
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email || u.username === username);

    if (existingUser) {
      throw new Error('User already exists with this email or username');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      username,
      email,
      password: hashedPassword,
      full_name: fullName || null,
      phone: phone || null,
      role,
      created_at: new Date().toISOString()
    };

    // Add to mock users (in real app, this would be saved to database)
    mockUsers.push(newUser);

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.created_at
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

// Login user
export async function loginUser({ email, password }) {
  try {
    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user by email
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Return user data (without password)
    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
        role: user.role
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(userId) {
  try {
    const user = mockUsers.find(u => u.id == userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
      role: user.role,
      createdAt: user.created_at
    };
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}

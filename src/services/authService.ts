// Mock Authentication Service

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 mins

let attempts = 0;
let lockoutUntil: number | null = null;

export interface AuthUser {
  id: number;
  role: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
  // 1. Rate Limiting Check
  if (lockoutUntil && Date.now() < lockoutUntil) {
    const minutesLeft = Math.ceil((lockoutUntil - Date.now()) / 60000);
    throw new Error(`Too many attempts. Please try again in ${minutesLeft} minutes.`);
  }

  // 2. Simulate Network Delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // 3. Credential Check
  // In production, NEVER hardcode credentials on the frontend.
  // We use environment variables as a slight improvement for this demo.
  const validUser = import.meta.env.VITE_ADMIN_USER || 'admin';
  const validPass = import.meta.env.VITE_ADMIN_PASS || 'fifa2026';

  // Basic sanitization
  const cleanUser = String(username).trim();
  const cleanPass = String(password).trim();

  if (cleanUser === validUser && cleanPass === validPass) {
    // Reset attempts on success
    attempts = 0;
    lockoutUntil = null;
    
    // Return a mock JWT token
    return {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_token_payload.signature',
      user: {
        id: 1,
        role: 'operator',
        name: 'Admin'
      }
    };
  } else {
    attempts += 1;
    if (attempts >= MAX_ATTEMPTS) {
      lockoutUntil = Date.now() + LOCKOUT_TIME;
      throw new Error('Account locked due to too many failed attempts.');
    }
    throw new Error('Invalid credentials.');
  }
};

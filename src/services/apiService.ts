import loginData from '../mocks/login.json';
import signupData from '../mocks/signup.json';

// Fake delay to simulate network
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async credentials => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // fake delay

  if (credentials.email === loginData.user.email) {
    return loginData;
  } else {
    throw new Error('Invalid credentials');
  }
};

export const mockSignup = async data => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // pretend success response
  return {
    loggedIn: true,
    user: {
      id: Math.floor(Math.random() * 1000),
      name: data.name,
      email: data.email,
    },
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // expires in 1 day
  };
};

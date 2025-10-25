import loginData from '../mocks/login.json';
import signupData from '../mocks/signup.json';

// Fake delay to simulate network
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async credentials => {
  await delay(1000); // simulate network
  return loginData; // returns the JSON mock
};

export const mockSignup = async data => {
  await delay(1000); // simulate network
  return signupData; // returns the JSON mock
};

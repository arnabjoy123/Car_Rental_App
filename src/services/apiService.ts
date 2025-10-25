import loginData from '../mocks/login.json';
import signupData from '../mocks/signup.json';

const delay = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export const mockLogin = async credentials => {
  await delay(1000);
  return loginData;
};

export const mockSignup = async data => {
  await delay(1000);
  return signupData;
};

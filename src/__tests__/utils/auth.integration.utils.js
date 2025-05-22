import Cookies from 'js-cookie';
import * as userService from '../../api/userService';

export const mockApi = (mockImplementation = {}) => {
  if (mockImplementation.mockLoginUser) {
    jest.spyOn(userService, 'loginUser').mockImplementation(mockImplementation.mockLoginUser);
  }
  if (mockImplementation.mockRegisterUser) {
    jest.spyOn(userService, 'registerUser').mockImplementation(mockImplementation.mockRegisterUser);
  }
  if (mockImplementation.mockUpdateUser) {
    jest.spyOn(userService, 'updateUser').mockImplementation(mockImplementation.mockUpdateUser);
  }
};

export const mockCookies = (cookieMap = {}) => {
  jest.spyOn(Cookies, 'get').mockImplementation((key) => cookieMap[key]);
  jest.spyOn(Cookies, 'set').mockImplementation(() => {});
  jest.spyOn(Cookies, 'remove').mockImplementation(() => {});
};

export const restoreMocks = () => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
};
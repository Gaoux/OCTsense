// Mock manual para apiClient usado en tests de integración
export default {
  post: jest.fn(),
  get: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn()
};
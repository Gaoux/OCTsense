export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  UPLOAD: '/upload',
  ANALYSIS: '/analysis',
  SETTINGS: '/settings',

  REPORTS: '/reports',
  REPORT_DETAILS: (id = ':id') => `/reports/${id}`,

  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_CREATE: '/admin/users/create',
  ADMIN_USER_EDIT: (id = ':id') => `/admin/users/edit/${id}`,
  ADMIN_KPIS: '/admin/kpis',
};

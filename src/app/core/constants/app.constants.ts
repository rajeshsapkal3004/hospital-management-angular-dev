export const APP_CONSTANTS = {
  API_ENDPOINTS: {
    LOGIN: '/auth/signin',
    LOGOUT: '/auth/signout',
    REFRESH_TOKEN: '/auth/refresh',
    ADMIN_PROFILE: '/admin/profile',
    DASHBOARD_STATS: '/admin/dashboard/stats',
    USERS: '/admin/users',
    SYSTEM_SETTINGS: '/admin/settings'
  },
  STORAGE_KEYS: {
    TOKEN: 'hms_token',
    REFRESH_TOKEN: 'hms_refresh_token',
    USER: 'hms_user'
  },
  ROUTES: {
    LOGIN: '/auth/login',
    ADMIN_DASHBOARD: '/admin/dashboard',
    DOCTOR_DASHBOARD: '/doctor/dashboard',
    PATIENT_DASHBOARD: '/patient/dashboard'
  },
  PERMISSIONS: {
    VIEW_USERS: 'VIEW_USERS',
    MANAGE_USERS: 'MANAGE_USERS',
    VIEW_REPORTS: 'VIEW_REPORTS',
    SYSTEM_SETTINGS: 'SYSTEM_SETTINGS'
  }
};

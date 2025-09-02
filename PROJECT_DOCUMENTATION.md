# Hospital Management System (HMS) - Project Documentation

## Project Overview

The Hospital Management System is a comprehensive web application built with **Angular 20** that provides a complete solution for managing hospital operations, patient care, and administrative tasks. The system is designed with a modular architecture that supports multiple user roles and provides secure access to different functionalities.

## Technology Stack

- **Frontend Framework**: Angular 20.1.0
- **UI Components**: Angular Material 20.2.0
- **State Management**: RxJS with BehaviorSubject
- **Routing**: Angular Router with Lazy Loading
- **Testing**: Jasmine + Karma
- **Package Manager**: npm
- **Language**: TypeScript 5.8.2

## Project Architecture

### 1. Core Architecture Pattern
The project follows a **Feature-Based Modular Architecture** with clear separation of concerns:

```
src/
├── app/
│   ├── core/           # Shared services, guards, models, constants
│   ├── features/       # Feature modules (admin, auth, patient, doctor, etc.)
│   ├── shared/         # Reusable components and utilities
│   └── styles/         # Global styles and themes
```

### 2. Module Structure

#### Core Module (`src/app/core/`)
- **Services**: Authentication, Token management, Notifications, Loading states
- **Guards**: Route protection, Role-based access control
- **Models**: Data interfaces and enums
- **Constants**: Application-wide constants and configuration
- **Interceptors**: HTTP request/response handling

#### Feature Modules
Each feature is a self-contained module with its own routing and components:

1. **Admin Module** (`/admin`)
   - Dashboard
   - User Management
   - System Settings
   - Reports

2. **Authentication Module** (`/auth`)
   - Login
   - Forgot Password
   - Reset Password

3. **Patient Module** (`/patient`)
   - Patient-specific features and layouts

4. **Doctor Module** (`/doctor`)
   - Doctor-specific features and layouts

5. **Nurse Module** (`/nurse`)
   - Nurse-specific features and layouts

6. **Receptionist Module** (`/receptionist`)
   - Receptionist-specific features and layouts

7. **Medical Records Module** (`/medical-records`)
   - Patient medical history management

8. **Appointments Module** (`/appointments`)
   - Appointment scheduling and management

9. **Pharmacy Module** (`/pharmacy`)
   - Medication and prescription management

10. **Medical Lab Module** (`/medical-lab`)
    - Laboratory test management

## User Roles and Permissions

The system supports multiple user roles with different access levels:

```typescript
enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',      // Full system access
  ADMIN = 'ROLE_ADMIN',             // Administrative access
  STAFF = 'STAFF',                  // General staff access
  DOCTOR = 'DOCTOR',                // Medical staff access
  NURSE = 'NURSE',                  // Nursing staff access
  PATIENT = 'PATIENT',              // Patient access
  RECEPTIONIST = 'RECEPTIONIST',    // Front desk access
  LAB_TECHNICIAN = 'LAB_TECHNICIAN', // Laboratory access
  PHARMACIST = 'PHARMACIST'         // Pharmacy access
}
```

## Security Features

### 1. Authentication Guard
- Protects routes requiring authentication
- Redirects unauthenticated users to login
- Preserves return URL for post-login navigation

### 2. Role-Based Access Control
- `roleGuard` ensures users can only access features for their role
- Route-level permission checking
- Component-level access control

### 3. Token Management
- JWT token storage and validation
- Automatic token refresh
- Secure token storage in localStorage

## Key Features

### 1. Dashboard
- Real-time hospital statistics
- Patient count, doctor availability
- Appointment scheduling
- Revenue tracking
- Emergency case monitoring

### 2. User Management
- User registration and profile management
- Role assignment and permission management
- User activity monitoring

### 3. Patient Management
- Patient registration and profiles
- Medical history tracking
- Appointment scheduling
- Treatment plans

### 4. Appointment System
- Doctor availability checking
- Patient appointment booking
- Appointment reminders
- Schedule management

### 5. Medical Records
- Electronic Health Records (EHR)
- Treatment history
- Prescription management
- Lab results integration

## Data Models

### Core Models
- **AdminUser**: User profile with role and permissions
- **LoginRequest/Response**: Authentication data
- **DashboardStats**: System statistics
- **ApiResponse**: Standardized API response format

## Routing Strategy

### 1. Lazy Loading
- Feature modules are loaded on-demand
- Improves initial application load time
- Better code splitting and performance

### 2. Route Guards
- `authGuard`: Protects authenticated routes
- `roleGuard`: Ensures role-based access
- `noAuthGuard`: Prevents authenticated users from accessing auth pages

### 3. Default Routes
- Root redirects to admin dashboard
- 404 routes redirect to dashboard
- Nested routing for feature modules

## State Management

The application uses **RxJS BehaviorSubject** for state management:

- **Authentication State**: User login status and current user
- **Loading States**: Global and component-specific loading indicators
- **Notifications**: User feedback and system messages

## Development Workflow

### 1. Local Development
```bash
npm install          # Install dependencies
ng serve            # Start development server
```

### 2. Building
```bash
ng build            # Production build
ng build --watch    # Development build with watch mode
```

### 3. Testing
```bash
ng test             # Run unit tests
ng e2e              # Run end-to-end tests
```

## Project Structure Benefits

1. **Scalability**: Easy to add new features and modules
2. **Maintainability**: Clear separation of concerns
3. **Reusability**: Shared components and services
4. **Security**: Role-based access control
5. **Performance**: Lazy loading and code splitting
6. **Testing**: Comprehensive test coverage

## Future Enhancements

1. **Real-time Communication**: WebSocket integration for live updates
2. **Mobile Application**: React Native or Flutter mobile app
3. **Advanced Analytics**: Business intelligence and reporting
4. **Integration**: Third-party medical systems and APIs
5. **AI Features**: Predictive analytics and decision support
6. **Multi-language Support**: Internationalization (i18n)
7. **Offline Support**: Progressive Web App (PWA) features
8. **Advanced Security**: Two-factor authentication, audit logs

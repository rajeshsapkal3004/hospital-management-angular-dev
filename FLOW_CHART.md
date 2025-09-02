# Hospital Management System - Flow Charts & System Flow

## 1. System Architecture Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │    │  Angular App    │    │  Backend API    │
│                 │    │                 │    │                 │
│  - HTML/CSS/JS  │◄──►│  - Components   │◄──►│  - REST API     │
│  - User Input   │    │  - Services     │    │  - Database     │
│  - Navigation   │    │  - Guards       │    │  - Business     │
└─────────────────┘    └─────────────────┘    │    Logic        │
                                              └─────────────────┘
```

## 2. Application Initialization Flow

```
┌─────────────────┐
│   App Startup   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Load Core      │
│  Module         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Initialize     │
│  Auth Service   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Check Token    │
│  & User Data    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Route to       │
│  Dashboard or   │
│  Login          │
└─────────────────┘
```

## 3. Authentication Flow

```
┌─────────────────┐
│   User Login    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Validate       │
│  Credentials    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Backend        │
│  Authentication │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Generate JWT   │
│  Token          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Store Token    │
│  & User Data    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Redirect to    │
│  Dashboard      │
└─────────────────┘
```

## 4. Route Protection Flow

```
┌─────────────────┐
│  Route Request  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Auth Guard     │
│  Check          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Is User        │
│  Authenticated? │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────┐
│   Yes   │ │    No   │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Role    │ │Redirect │
│ Guard   │ │ to Login│
└────┬────┘ └─────────┘
     │
     ▼
┌─────────┐
│ Has     │
│ Required│
│ Role?   │
└────┬────┘
     │
┌────┴────┐
│         │
▼         ▼
┌─────────┐ ┌─────────┐
│   Yes   │ │    No   │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Load    │ │ Access  │
│ Route   │ │ Denied  │
└─────────┘ └─────────┘
```

## 5. User Role-Based Access Flow

```
┌─────────────────┐
│  User Login     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Determine      │
│  User Role      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Load Role-     │
│  Specific       │
│  Module         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Show Role-     │
│  Specific       │
│  Navigation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Enable Role-   │
│  Specific       │
│  Features       │
└─────────────────┘
```

## 6. Feature Module Loading Flow

```
┌─────────────────┐
│  Route Request  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Check if       │
│  Module Loaded  │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────┐
│   Yes   │ │    No   │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Render  │ │ Lazy    │
│ Module  │ │ Load    │
└─────────┘ └────┬────┘
                  │
                  ▼
┌─────────────────┐
│  Download       │
│  Module Bundle  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Initialize     │
│  Module         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Render Module  │
└─────────────────┘
```

## 7. Data Flow in Components

```
┌─────────────────┐
│   Component     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Service Call   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  HTTP Request   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Backend API    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Database Query │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Response Data  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Transform      │
│  Data           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Update UI      │
└─────────────────┘
```

## 8. Error Handling Flow

```
┌─────────────────┐
│  Error Occurs   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Error Type     │
│  Classification │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Handle Error   │
│  Based on Type  │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────┐
│ Network │ │  Auth   │
│ Error   │ │  Error  │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Retry   │ │Redirect │
│ Request │ │ to Login│
└────┬────┘ └─────────┘
     │
     ▼
┌─────────┐
│ Show    │
│ Error   │
│ Message │
└─────────┘
```

## 9. State Management Flow

```
┌─────────────────┐
│  Component      │
│  State Change   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Update         │
│  BehaviorSubject│
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Notify         │
│  Subscribers    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Components     │
│  React to       │
│  State Change   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Update UI      │
└─────────────────┘
```

## 10. Complete User Journey Flow

```
┌─────────────────┐
│  User Visits    │
│  Application    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Check          │
│  Authentication │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────┐
│ Logged  │ │ Not     │
│ In      │ │ Logged  │
└────┬────┘ │ In      │
     │      └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Load    │ │ Show    │
│ Dashboard│ │ Login   │
└────┬────┘ │ Form    │
     │      └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Navigate│ │ User    │
│ Features│ │ Enters  │
└────┬────┘ │ Creds   │
     │      └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Perform │ │ Validate│
│ Actions │ │ & Login │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Update  │ │ Redirect│
│ Data    │ │ to      │
└────┬────┘ │ Dashboard│
     │      └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Show    │ │ Load    │
│ Results │ │ Features│
└─────────┘ └─────────┘
```

## 11. Security Flow

```
┌─────────────────┐
│  Request        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Token          │
│  Validation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Role           │
│  Verification   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Permission     │
│  Check          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Access         │
│  Granted/Denied │
└─────────────────┘
```

## 12. Performance Optimization Flow

```
┌─────────────────┐
│  Route Request  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Check Module   │
│  Cache          │
└─────────┬───────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌─────────┐ ┌─────────┐
│ Cached  │ │ Not     │
│ Module  │ │ Cached  │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Load    │ │ Download│
│ from    │ │ Module  │
│ Cache   │ │ Bundle  │
└────┬────┘ └────┬────┘
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Render  │ │ Cache   │
│ Module  │ │ Module  │
└─────────┘ └────┬────┘
                  │
                  ▼
┌─────────────────┐
│  Render Module  │
└─────────────────┘
```

These flow charts provide a comprehensive understanding of how the Hospital Management System operates, from user authentication to feature access and data management. Each flow demonstrates the system's security, performance, and user experience considerations.

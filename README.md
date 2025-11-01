# API Key Management Dashboard

A modern, responsive web application for managing API keys and their associated fields with a clean, intuitive interface.

## Features

### 🔐 Authentication

-   Secure login system with mock authentication
-   Protected routes and session management
-   User profile management

### 🗝️ API Key Management

-   **Create, Read, Update, Delete** API keys
-   **Custom Field Management** - Add unlimited custom fields to each API key
-   **Field Masking** - Toggle visibility of sensitive information
-   **Copy to Clipboard** - One-click copying of API keys and field values
-   **Search and Filter** - Find API keys quickly
-   **Bulk Operations** - Manage multiple keys efficiently

### 🏷️ Global Field Registry

-   **Centralized Field Definitions** - Manage field templates globally
-   **Usage Tracking** - See which API keys use each field
-   **Bulk Field Updates** - Update field names across all API keys
-   **Field Validation** - Ensure consistent field naming

### ⚙️ User Settings

-   **Profile Management** - Update username and email
-   **Security Settings** - Change passwords and manage account security
-   **Theme Customization** - Light/Dark mode toggle
-   **Account Management** - Delete account with confirmation

### 🎨 Modern UI/UX

-   **Responsive Design** - Works on desktop, tablet, and mobile
-   **Dark Mode Support** - System preference detection with manual toggle
-   **Accessible Interface** - WCAG compliant with proper ARIA labels
-   **Toast Notifications** - Real-time feedback for user actions
-   **Loading States** - Smooth user experience with proper loading indicators

## Technologies Used

-   **Frontend Framework**: React 18 with TypeScript
-   **Build Tool**: Vite
-   **Routing**: React Router DOM v6
-   **Styling**: Tailwind CSS v4
-   **UI Components**: Custom components built with Radix UI primitives
-   **Icons**: Lucide React
-   **State Management**: React Context API
-   **Form Handling**: Controlled components with validation
-   **Theme Management**: CSS custom properties with system preference detection

## Installation

### Prerequisites

-   Node.js 18+
-   npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd api-key-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install

    # or

    yarn install
    \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev

    # or

    yarn dev
    \`\`\`

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

\`\`\`bash
npm run build

# or

yarn build
\`\`\`

The built files will be in the `dist` directory.

## Usage Guide

### Getting Started

1. **Login**: Use any email/password combination (mock authentication)
2. **Dashboard**: View and manage your API keys from the main dashboard
3. **Add API Key**: Click "Add API Key" to create a new key with custom fields
4. **Manage Fields**: Use the Field Registry to create reusable field templates
5. **Settings**: Customize your profile and app preferences

### API Key Management

-   **Adding Keys**: Click "Add API Key" and fill in the required information
-   **Custom Fields**: Add unlimited custom fields with different types (text, password, etc.)
-   **Field Masking**: Click the eye icon to toggle visibility of sensitive fields
-   **Copying Values**: Click the copy icon next to any field to copy to clipboard
-   **Editing**: Click "Edit" on any API key to modify its details
-   **Deleting**: Click "Delete" with confirmation dialog for safety

### Field Registry

-   **Global Fields**: Create field templates that can be reused across API keys
-   **Usage Tracking**: See how many API keys use each field definition
-   **Bulk Updates**: Rename fields globally to update all associated API keys
-   **Field Management**: Add, edit, or delete field definitions with impact warnings

## Project Structure

\`\`\`
src/
├── components/ # Reusable UI components
│ ├── ui/ # Base UI components (Button, Input, etc.)
│ ├── AddFieldDropdown.tsx
│ ├── ConfirmationDialog.tsx
│ ├── CopyableKeyCard.tsx
│ ├── DashboardLayout.tsx
│ ├── FieldRegistryManager.tsx
│ ├── ThemeToggle.tsx
│ └── theme-provider.tsx
├── contexts/ # React Context providers
│ ├── ApiKeyContext.tsx
│ └── AuthContext.tsx
├── hooks/ # Custom React hooks
│ └── use-toast.ts
├── lib/ # Utility functions
│ └── utils.ts
├── pages/ # Page components
│ ├── DashboardPage.tsx
│ ├── FieldRegistryPage.tsx
│ ├── LoginPage.tsx
│ └── SettingsPage.tsx
├── types/ # TypeScript type definitions
│ └── index.ts
├── App.tsx # Main application component
├── main.tsx # Application entry point
└── index.css # Global styles
\`\`\`

## Development

### Code Style

-   TypeScript for type safety
-   Functional components with hooks
-   Context API for state management
-   Tailwind CSS for styling
-   ESLint and Prettier for code formatting

### Key Design Patterns

-   **Context Providers**: Centralized state management
-   **Custom Hooks**: Reusable logic extraction
-   **Component Composition**: Flexible, reusable components
-   **Controlled Components**: Predictable form handling
-   **Error Boundaries**: Graceful error handling

### Adding New Features

1. **Components**: Add to `src/components/` with proper TypeScript types
2. **Pages**: Add to `src/pages/` and update routing in `App.tsx`
3. **State**: Extend existing contexts or create new ones in `src/contexts/`
4. **Types**: Update `src/types/index.ts` for new data structures

## Testing

This project uses Vitest and Testing Library.

-   Run all tests with coverage:

```bash
pnpm test
```

-   Watch mode during development:

```bash
pnpm test:watch
```

Tests are colocated next to source files using `*.test.ts` or `*.test.tsx`. The test environment is JSDOM with matchers from `@testing-library/jest-dom` configured in `vitest.setup.ts`.

## Browser Support

-   Chrome 90+
-   Firefox 88+
-   Safari 14+
-   Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

# Email Editor Client

A well-structured, maintainable React application for email template editing using easy-email library.

## 📁 File Structure

```
clients/
├── components/           # Reusable UI components
│   ├── EditorToolbar.tsx      # Toolbar with save/template buttons
│   ├── TemplateCard.tsx       # Individual template card component
│   ├── TemplateSelectionModal.tsx  # Template selection modal
│   └── index.ts               # Component exports
├── constants/           # Application constants
│   └── index.ts              # Editor config, templates, categories
├── data/               # Template JSON files
│   ├── template1.json        # Template data files
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useEmailEditor.ts     # Main editor logic hook
│   └── index.ts              # Hook exports
├── types/              # TypeScript type definitions
│   └── index.ts              # All interface definitions
├── utils/              # Utility functions
│   ├── sdk.ts               # PayloadSDK utilities
│   ├── template.ts          # Template manipulation utils
│   ├── url.ts               # URL parameter utilities
│   └── index.ts             # Utility exports
├── EmailEditor.tsx     # Main application component
├── editor.css         # Application styles
└── README.md          # This file
```

## 🏗️ Architecture

### Component Structure
- **EmailEditor.tsx**: Main application component that orchestrates everything
- **Components**: Modular, reusable UI components with clear props interfaces
- **Hooks**: Custom hooks containing business logic, separated from UI concerns

### Data Flow
1. URL parameters determine template loading strategy
2. `useEmailEditor` hook manages all state and operations
3. Components receive data and callbacks via props
4. Template changes are tracked and saved via PayloadSDK

### Key Features
- ✅ **Modular Architecture**: Each concern separated into its own file
- ✅ **Type Safety**: Full TypeScript support with proper interfaces
- ✅ **Reusable Components**: UI components can be easily reused
- ✅ **Custom Hooks**: Business logic separated from UI
- ✅ **Clean Imports**: Organized import structure with barrel exports
- ✅ **Error Handling**: Comprehensive error handling throughout
- ✅ **Responsive Design**: Adapts to different screen sizes

## 🚀 Usage

### Main Component
```tsx
import EmailEditor from './EmailEditor';

function App() {
  return <EmailEditor />;
}
```

### Using Components Individually
```tsx
import { EditorToolbar, TemplateSelectionModal } from './components';
import { useEmailEditor } from './hooks';

function CustomEditor() {
  const { openTemplateModal, handleTemplateSave } = useEmailEditor();
  
  return (
    <EditorToolbar 
      onOpenTemplateModal={openTemplateModal}
      onSaveTemplate={handleTemplateSave}
      hasUnsavedChanges={true}
    />
  );
}
```

### Using Utilities
```tsx
import { createPayloadSDK, checkForTemplateChanges } from './utils';
import { TemplateData } from './types';

const sdk = createPayloadSDK('your-token');
const hasChanges = checkForTemplateChanges(current, initial);
```

## 🛠️ Development

### Adding New Templates
1. Add template JSON file to `data/` directory
2. Import in `constants/index.ts`
3. Add to `AVAILABLE_TEMPLATES` array

### Adding New Components
1. Create component file in `components/`
2. Define props interface in `types/index.ts`
3. Export from `components/index.ts`

### Adding Utilities
1. Create utility file in `utils/`
2. Export functions from the file
3. Re-export from `utils/index.ts`

## 📦 Dependencies

- **easy-email-core**: Email template core functionality
- **easy-email-editor**: Email editor components
- **easy-email-extensions**: Additional editor extensions  
- **@arco-design/web-react**: UI component library
- **@shopnex/payload-sdk**: Backend API integration
- **react-use**: React utility hooks
- **mjml-browser**: MJML to HTML conversion

## 🎯 Benefits

1. **Maintainability**: Easy to locate and modify specific functionality
2. **Scalability**: Simple to add new features without breaking existing code
3. **Testability**: Each function/component can be tested independently
4. **Reusability**: Components and utilities can be reused across projects
5. **Type Safety**: Comprehensive TypeScript coverage prevents runtime errors
6. **Developer Experience**: Clear structure makes onboarding new developers easier
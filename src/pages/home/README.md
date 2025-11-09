# Home Page Refactoring Structure

This document outlines the refactored structure for the home page (previously my-files-page).

## Folder Structure

```
src/pages/home/
├── index.tsx                    # Main page entry point
├── store/
│   └── useHomeStore.ts         # Zustand state management
├── hooks/
│   ├── useFileLoading.ts       # File loading logic
│   ├── useFileSelection.ts     # File selection and filtering
│   └── useOrganize.ts          # Organization preview logic
├── watcher/
│   ├── WatcherBanner.tsx       # Watching folder banner UI
│   ├── ChangeWatcherDialog.tsx # Change folder dialog
│   └── useWatcher.ts           # Watcher logic
├── destination/
│   ├── DestinationBanner.tsx        # Destination folders banner UI
│   ├── ManageDestinationsDialog.tsx # Manage destinations dialog
│   └── useDestinations.ts           # Destination management logic
├── organize/
│   ├── OrganizeDialog.tsx           # Initial organize options dialog
│   ├── OrganizePreviewDialog.tsx    # Preview and approve changes
│   └── useOrganizeFlow.ts           # (can merge with useOrganize)
├── file-list/
│   ├── FileListView.tsx        # List view of files
│   ├── FileToolbar.tsx         # Search, filters, view toggle
│   └── useFileDisplay.ts       # File display utilities
└── onboarding/
    ├── FirstTimeSetupDialog.tsx # Complete setup wizard
    └── useOnboarding.ts         # Setup flow logic
```

## State Management (useHomeStore)

All state has been moved to Zustand store in `store/useHomeStore.ts`:
- Folder management (watched folder, destinations)
- File list and loading states
- Organize previews
- Dialog open/close states
- First-time setup flow

## Component Breakdown

### index.tsx
Main page that composes all sub-features together.

### Hooks
- `useFileLoading`: Initial load, reload files
- `useFileSelection`: Search, filter, select files
- `useOrganize`: Generate previews, approve/reject, edit

### Sub-Features
Each folder contains related UI components and logic:
- **watcher**: Watch folder banner and change dialog
- **destination**: Destination folders banner and manage dialog
- **organize**: Organize dialogs and preview list
- **file-list**: File display components (list/grid views)
- **onboarding**: First-time setup wizard

## Benefits of This Structure

1. **Separation of Concerns**: UI and logic are separated
2. **Reusability**: Hooks can be used in multiple components
3. **Testability**: Individual hooks and components can be tested
4. **Maintainability**: Easy to find and modify specific features
5. **Performance**: Can optimize individual components
6. **Scalability**: Easy to add new features

## Migration Notes

To complete the migration:
1. ✅ Created folder structure
2. ✅ Created Zustand store
3. ✅ Created core hooks
4. ✅ Created watcher components
5. ✅ Created destination components  
6. ✅ Created onboarding hook
7. ⏳ Need to create remaining UI components
8. ⏳ Need to create main index.tsx
9. ⏳ Update App.tsx routing to use new path

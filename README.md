# Test Data Web Application - React

A comprehensive React testing application for various web components and interactions. Currently includes file upload testing scenarios, with more test types coming soon.

## Features

- 🏠 **Home Page** - Navigate between different test categories
- 📁 **File Upload Tests** - 15 complex file upload scenarios
- 🔄 **Easy Navigation** - Simple routing between test pages
- 📊 **Status Tracking** - Real-time upload status monitoring
- 🔍 **XPath Display** - Visual XPath generation and copying

## File Upload Test Scenarios

The file upload tests cover various complex DOM structures including:

- Hidden inputs behind overlays
- Heavy DOM trees (deep nesting and wide branching)
- iframe scenarios
- Shadow DOM scenarios
- Nested Shadow DOM
- React multi-root scenarios
- Virtualized DOM
- Slot elements
- Portal rendering
- Cross-origin iframes
- Ultimate combination scenarios

## Features

- ✅ All 15 scenarios replicated
- ✅ Upload status tracking with visual badges
- ✅ XPath display and copying
- ✅ Visual markers for input locations
- ✅ Real-time status updates
- ✅ Comprehensive test panel with assertions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── pages/              # Page components
│   ├── HomePage.jsx           # Home page with test categories
│   └── FileUploadTestPage.jsx # File upload test page
├── components/          # Reusable components
│   ├── XPathNavBar.jsx
│   ├── UploadStatusNavBar.jsx
│   ├── StatusDisplayPanel.jsx
│   ├── ScenarioCard.jsx
│   └── ErrorBoundary.jsx
├── contexts/           # React contexts
│   ├── UploadStatusContext.jsx
│   └── XPathContext.jsx
├── hooks/              # Custom React hooks
│   └── useFileUpload.js
├── scenarios/          # All 15 scenario components
│   ├── Scenario1.jsx
│   ├── Scenario2.jsx
│   └── ... (through Scenario15.jsx)
├── utils/              # Utility functions
│   ├── fileUtils.js
│   └── uploadStatus.js
├── App.jsx             # Main app component with routing
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Scenarios

1. **Hidden Behind Single Div** - File input covered by a div with higher z-index
2. **Hidden Behind Multiple Overlapping Divs** - Multiple overlapping divs with different z-indexes
3. **Heavy DOM - Deep Nesting (50 levels)** - File input nested 50 levels deep
4. **Heavy DOM - Wide Branching (1000+ elements)** - File input with 1000+ sibling elements
5. **Heavy DOM + Hidden Behind Divs** - Combination of heavy DOM and hidden input
6. **iframe + Heavy DOM + Hidden** - File input in iframe with heavy DOM
7. **Shadow DOM + Heavy DOM + Hidden** - File input in Shadow DOM
8. **Nested Shadow DOM + Heavy DOM + Hidden** - Nested Shadow DOMs
9. **iframe + Shadow DOM + Heavy DOM + Hidden** - All complexities in iframe
10. **React Multi-root + Heavy DOM + Hidden** - Multiple React roots
11. **Virtualized DOM + Hidden** - Lazy-loaded DOM
12. **Slot + Heavy DOM + Hidden** - Web Components with slots
13. **Portal + Heavy DOM + Hidden** - Portal rendering
14. **Cross-origin iframe + Heavy DOM + Hidden** - Cross-origin scenarios
15. **ALL COMBINATIONS - ULTIMATE TEST** - All complexities combined

## Technologies

- React 18
- React Router DOM (for navigation)
- Vite (build tool)
- Modern JavaScript (ES6+)

## Adding New Test Types

To add a new test category:

1. Create a new page component in `src/pages/` (e.g., `FormInputTestPage.jsx`)
2. Add a route in `src/App.jsx`
3. Add a new card in `src/pages/HomePage.jsx` with the test category details
4. Remove the `comingSoon: true` flag when ready

## License

MIT


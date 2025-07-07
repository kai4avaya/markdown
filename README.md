# AI Textbook Editor

A modern, modular AI-powered textbook editor built with vanilla JavaScript, featuring a markdown editor, file management, document outline, and AI assistance.

## Features

- **Markdown Editor**: Powered by Toast UI Editor with live preview
- **File Management**: Open and edit markdown files from your local file system
- **Document Outline**: Interactive tree-based outline with expand/collapse functionality
- **AI Assistant**: Chat with AI to help with textbook writing
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Project Structure

The application has been modularized for better maintainability and code organization:

```
ownCourse2/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Custom CSS styles
├── js/
│   ├── config.js           # Configuration constants
│   ├── state.js            # Global state management
│   ├── ui.js               # UI utilities and panel management
│   ├── fileSystem.js       # File system operations
│   ├── aiChat.js           # AI chat functionality
│   ├── editor.js           # Toast UI Editor management
│   ├── outlineTree.js      # FancyTree outline implementation
│   ├── outlineTreeSimple.js # jsTree outline implementation (alternative)
│   └── app.js              # Main application initialization
└── README.md               # This file
```

## Module Descriptions

### `config.js`
Contains all configuration constants including:
- Editor settings
- File system settings
- AI API configuration
- UI settings
- Panel and message types

### `state.js`
Global state management using a singleton pattern:
- Editor instance
- Directory and file handles
- Active file element
- Outline update timeouts

### `ui.js`
UI utilities and management:
- Panel switching logic
- Toast notifications
- Status updates
- Outline generation and management

### `fileSystem.js`
File system operations:
- Opening folders using File System Access API
- Reading and writing markdown files
- File list population
- Save button state management

### `aiChat.js`
AI chat functionality:
- Chat message handling
- API communication with Gemini
- Message display and updates

### `editor.js`
Toast UI Editor management:
- Editor initialization
- Event listener setup
- Editor state management

### `outlineTree.js`
FancyTree outline implementation:
- Hierarchical document outline
- Interactive tree navigation
- Real-time outline updates
- Expand/collapse functionality
- Line number indicators

### `outlineTreeSimple.js`
jsTree outline implementation (alternative):
- Lighter tree component
- Simple hierarchical display
- Basic navigation features

### `app.js`
Main application coordination:
- Module initialization
- Event listener setup
- Application lifecycle management

## Setup

1. **Clone or download** the project files
2. **Add your AI API key** in `js/config.js`:
   ```javascript
   AI_CHAT: {
       API_KEY: 'your-gemini-api-key-here',
       // ... other settings
   }
   ```
3. **Open `index.html`** in a modern browser (Chrome, Firefox, Safari, Edge)

## Usage

1. **Open a folder** containing markdown files using the folder button
2. **Select a file** from the files panel to start editing
3. **Use the outline panel** to navigate through document headings
4. **Chat with AI** in the AI panel for writing assistance
5. **Save your changes** using the save button

### Direct File Access via URL

You can open specific files directly by adding a query parameter to the URL:

- **Local files**: `?file=my-document.md`
- **Bundled documents**: `?file=quick-start.md` or `?file=about-kai-kleinbard.md`
- **External files**: `?file=https://example.com/document.md`

#### Examples:
- `https://kai4avaya.github.io/markdown/?file=my-notes.md` - Opens a local markdown file
- `https://kai4avaya.github.io/markdown/?file=quick-start.md` - Opens the quick start guide
- `https://kai4avaya.github.io/markdown/?file=about-kai-kleinbard.md` - Opens the Kai profile
- `https://kai4avaya.github.io/markdown/?file=https://raw.githubusercontent.com/user/repo/main/README.md` - Opens an external markdown file

**Note**: When accessing files via URL, the editor automatically loads in WYSIWYG mode for the best viewing experience.

**Try it now**: [View Kai Kleinbard's portfolio](https://kai4avaya.github.io/markdown/?file=about-kai-kleinbard.md)

## Browser Compatibility

This application uses modern web APIs:
- **File System Access API**: For file operations (Chrome 86+, Edge 86+)
- **ES6 Modules**: For JavaScript modularity
- **Toast UI Editor**: For markdown editing

## Development

The modular structure makes it easy to:
- **Add new features** by creating new modules
- **Modify existing functionality** by updating specific modules
- **Test individual components** in isolation
- **Maintain clean separation** of concerns

## Notes

- The application requires a modern browser with File System Access API support
- AI functionality requires a valid Gemini API key
- All file operations are performed locally in the browser
- The editor automatically saves changes to the original files

## Troubleshooting

- **"showDirectoryPicker" errors**: This is expected in sandboxed environments and doesn't affect functionality
- **"ResizeObserver loop" warnings**: These are benign warnings from the Toast UI library
- **AI not responding**: Check your API key configuration in `config.js`

## Customization

### Making It Your Own

Want to create your own personal portfolio site? Here's how to customize the editor:

#### 1. Replace the Profile Content
Edit `js/kaiProfile.js` to add your own content:

```javascript
// Replace with your own profile markdown
const KAI_PROFILE_MARKDOWN = `# About [Your Name]

![Your Photo](https://your-image-url.com/photo.jpg)

Your bio and introduction here...

## Your Projects

### Project 1
*Description of your project*
![Project Image](https://your-image-url.com/project1.jpg)
Your project description and links.

// Add more sections as needed
`;
```

#### 2. Update Configuration
Modify `js/config.js` to change:
- Default file names
- Editor settings
- AI API configuration

#### 3. Customize Styling
Edit `css/styles.css` to match your brand:
- Colors and themes
- Fonts and typography
- Layout adjustments

#### 4. Update Metadata
Change `index.html` to update:
- Page title
- Meta descriptions
- Favicon

### Deployment

1. **GitHub Pages**: Push to a GitHub repo and enable Pages
2. **Netlify**: Drag and drop your folder to Netlify
3. **Vercel**: Connect your GitHub repo to Vercel
4. **Any static host**: Upload the files to any web server

## License & Attribution

This project is licensed under the **Creative Commons Attribution-ShareAlike 4.0 International License**.

**You are free to:**
- ✅ Use this code for personal or commercial projects
- ✅ Modify and adapt the code
- ✅ Share and redistribute

**Under these conditions:**
- 📝 **Attribution**: You must give appropriate credit to the original author (Kai Kleinbard)
- 🔄 **ShareAlike**: If you remix or build upon this work, you must distribute under the same license
- 🌐 **Open Source**: Any derivative work must remain open source

### Required Attribution
Include this notice in your project:
```
Based on AI Textbook Editor by Kai Kleinbard
Original: https://github.com/kai4avaya/portfolio-kai-kleinbard-2025
License: CC BY-SA 4.0
```

## Contribute

I’d love your help making this project even better!  

Check out the repo on GitHub and give it a star ⭐:  
https://github.com/kai4avaya/portfolio-kai-kleinbard-2025  

Feel free to open issues, share feedback, or submit pull requests—every bit helps!
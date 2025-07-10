// Import CSS dependencies
// import '../css/styles.css';

// Import the main app
import { ui } from '../js/ui.js';
import { fileSystem } from '../js/fileSystem.js';
import { aiChat } from '../js/aiChat.js';
import { editor } from '../js/editor.js';
import { indexedDBService } from '../js/indexedDB.js';
import { appState } from '../js/state.js';
import { CONFIG } from '../js/config.js';
import { initSearchPanel } from '../js/searchPanel.js';

// Main application class for the AI Textbook Editor
export class App {
    constructor() {
        this.initialized = false;
    }

    // Initialize the application
    async initialize() {
        if (this.initialized) return;

        try {
            // Initialize all modules
            await this.initializeModules();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize AI chat
            aiChat.initializeChat();
            
            this.initialized = true;
            console.log('Mark↓ Editor initialized successfully');
            // Hide loader overlay
            const loader = document.getElementById('app-loader');
            if (loader) loader.style.display = 'none';
        } catch (error) {
            console.error('Failed to initialize application:', error);
        }
    }

    // Initialize all application modules
    async initializeModules() {
        // Initialize IndexedDB first
        await indexedDBService.initialize();
        
        // Small delay to ensure IndexedDB is fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Initialize the editor first
        await editor.initialize();
        
        // Initialize file system event listeners
        fileSystem.initializeEventListeners();
        
        // Initialize search panel
        initSearchPanel();
        
        // Load last edited file or handle first-time user
        await fileSystem.loadLastEditedFile();
    }

    // Set up global event listeners
    setupEventListeners() {
        // Panel switching event listeners
        document.getElementById('files-tool-btn').addEventListener('click', () => 
            ui.switchPanel(CONFIG.PANELS.FILES)
        );
        
        document.getElementById('search-tool-btn').addEventListener('click', () => 
            ui.switchPanel(CONFIG.PANELS.SEARCH)
        );
        
        document.getElementById('outline-tool-btn').addEventListener('click', () => 
            ui.switchPanel(CONFIG.PANELS.OUTLINE)
        );
        
        document.getElementById('ai-tool-btn').addEventListener('click', () => 
            ui.switchPanel(CONFIG.PANELS.AI)
        );
    }

    // Get application status
    getStatus() {
        return {
            initialized: this.initialized,
            hasEditor: editor.getEditor() !== null,
            hasDirectory: appState.hasDirectory(),
            hasCurrentFile: appState.hasCurrentFile()
        };
    }
}

// Create and export the main application instance
export const app = new App();

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.initialize();
});
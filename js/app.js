import '../lib/js/toastui-editor-all.min.js';

import { ui } from './ui.js';
import { fileSystem } from './fileSystem.js';
import { aiChat } from './aiChat.js';
import { editor } from './editor.js';
import { indexedDBService } from './indexedDB.js';
import { appState } from './state.js';
import { CONFIG } from './config.js';
import { initSearchPanel } from './searchPanel.js';
// In your main.js or a vendor bundle


// Main application class for the AI Textbook Editor
export class App {
    constructor() {
        this.initialized = false;
    }

    // Initialize the application
    async initialize() {
        if (this.initialized) return;

        try {
            console.time('App: Total Initialization');
            // Initialize all modules
            await this.initializeModules();
            console.timeEnd('App: Total Initialization');
            
            // Set up event listeners
            console.time('App: setupEventListeners');
            this.setupEventListeners();
            console.timeEnd('App: setupEventListeners');
            
            // Initialize AI chat
            console.time('App: aiChat.initializeChat');
            aiChat.initializeChat();
            console.timeEnd('App: aiChat.initializeChat');
            
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
        console.time('App: IndexedDB Initialization');
        await indexedDBService.initialize();
        console.timeEnd('App: IndexedDB Initialization');
        
        // Small delay to ensure IndexedDB is fully ready
        console.time('App: IndexedDB Delay');
        await new Promise(resolve => setTimeout(resolve, 100));
        console.timeEnd('App: IndexedDB Delay');
        
        console.time('App: Editor Initialization');
        await editor.initialize();
        console.timeEnd('App: Editor Initialization');
        
        console.time('App: FileSystem Event Listeners');
        fileSystem.initializeEventListeners();
        console.timeEnd('App: FileSystem Event Listeners');
        
        console.time('App: Search Panel Initialization');
        initSearchPanel();
        console.timeEnd('App: Search Panel Initialization');
        
        console.time('App: Load Last Edited File');
        await fileSystem.loadLastEditedFile();
        console.timeEnd('App: Load Last Edited File');
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
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedFile = urlParams.get('file');
    if (requestedFile === CONFIG.EDITOR.KAI_PROFILE_FILE) {
        // Fast path: hide loader and show editor immediately
        const loader = document.getElementById('app-loader');
        if (loader) loader.style.display = 'none';
        // Initialize just the editor immediately
        await editor.initialize();
        // Let the rest of the app initialize in the background (don't await)
        app.initializeModules();
        app.setupEventListeners();
        aiChat.initializeChat();
        app.initialized = true;
        console.log('Mark↓ Editor (profile fast-path) initialized successfully');
        return;
    }
    app.initialize();
}); 
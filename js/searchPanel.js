// Search panel management
import { indexedDBService } from './indexedDB.js';

let searchInput;
let searchResultsList;
let fileList;

export function initSearchPanel() {
    console.log('[SearchPanel] Initializing search panel');
    searchInput = document.getElementById('search-input');
    searchResultsList = document.getElementById('search-results-list');
    fileList = document.getElementById('file-list');

    console.log('[SearchPanel] Elements found:', {
        searchInput: !!searchInput,
        searchResultsList: !!searchResultsList,
        fileList: !!fileList
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterSearchResults);
        console.log('[SearchPanel] Search input event listener added');
    }
    populateSearchResults();
}

export function populateSearchResults() {
    console.log('[SearchPanel] Populating search results');
    if (!fileList || !searchResultsList) {
        console.log('[SearchPanel] Missing elements:', { fileList: !!fileList, searchResultsList: !!searchResultsList });
        return;
    }
    
    searchResultsList.innerHTML = '';
    const fileCount = fileList.children.length;
    console.log('[SearchPanel] Found', fileCount, 'files to clone');
    
    Array.from(fileList.children).forEach(fileNode => {
        const clone = fileNode.cloneNode(true);
        // Re-bind click events for cloned elements
        clone.addEventListener('click', () => {
            const fileName = clone.dataset.fileName;
            if (fileName) {
                import('./fileSystem.js').then(({ fileSystem }) => {
                    fileSystem.openFile(fileName, clone);
                });
            }
        });
        searchResultsList.appendChild(clone);
    });
    
    console.log('[SearchPanel] Added', searchResultsList.children.length, 'items to search results');
}

async function filterSearchResults(e) {
    const query = e.target.value.toLowerCase();
    if (!query) {
        Array.from(searchResultsList.children).forEach(item => {
            item.classList.remove('hidden');
        });
        return;
    }
    
    for (const item of searchResultsList.children) {
        const fileName = item.textContent.toLowerCase();
        let isVisible = fileName.includes(query);
        
        // Also search file content if filename doesn't match
        if (!isVisible && item.dataset.fileName) {
            try {
                const file = await indexedDBService.getFile(item.dataset.fileName);
                if (file && file.content.toLowerCase().includes(query)) {
                    isVisible = true;
                }
            } catch (err) {
                console.error('Error searching file content:', err);
            }
        }
        
        item.classList.toggle('hidden', !isVisible);
    }
}
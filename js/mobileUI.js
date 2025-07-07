// Mobile UI logic for slide-up panel with tabs
let mobilePanel = null;
let sidebarWasVisible = false;
let sidebarObserver = null;

function observeSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  if (sidebarObserver) sidebarObserver.disconnect();
  sidebarObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        console.log(`[MobileUI] Sidebar style changed: ${sidebar.getAttribute('style')}`);
      }
    }
  });
  sidebarObserver.observe(sidebar, { attributes: true, attributeFilter: ['style'] });
}

function activateMobileUI() {
  console.log('[MobileUI] Activating mobile UI');
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebarWasVisible = sidebar.style.display !== 'none';
    sidebar.style.display = 'none';
    console.log('[MobileUI] Sidebar hidden');
    observeSidebar();
  }
  
  // Limit editor height to prevent stretching into slide panel area
  const editorContainer = document.getElementById('editor');
  if (editorContainer) {
    const vh = window.innerHeight;
    const maxHeight = vh * 0.90; // 85% minus small buffer
    editorContainer.style.maxHeight = `${maxHeight}px`;
    editorContainer.style.height = `${maxHeight}px`;
  }
  if (document.getElementById('mobile-slideup-panel')) {
    console.log('[MobileUI] Mobile panel already exists');
    return;
  }

  // Create slide-up panel
  mobilePanel = document.createElement('div');
  mobilePanel.id = 'mobile-slideup-panel';
  mobilePanel.innerHTML = `
    <div id="mobile-slideup-handle" style="width:100%;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
      <div style="width:48px;height:6px;background:#a3a3a3;border-radius:3px;margin:8px 0;"></div>
    </div>
    <div id="mobile-tabs" style="display:flex;justify-content:space-around;border-bottom:1px solid #e5e7eb;background:#fff;">
      <button class="mobile-tab" data-tab="files" style="flex:1;padding:12px 0;font-weight:500;">Files</button>
      <button class="mobile-tab" data-tab="search" style="flex:1;padding:12px 0;font-weight:500;">Search</button>
      <button class="mobile-tab" data-tab="outline" style="flex:1;padding:12px 0;font-weight:500;">Outline</button>
      <button class="mobile-tab" data-tab="ai" style="flex:1;padding:12px 0;font-weight:500;">AI</button>
    </div>
    <div id="mobile-tab-content" style="flex:1;overflow-y:auto;background:#fff;"></div>
  `;
  Object.assign(mobilePanel.style, {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60vh',
    minHeight: '200px',
    maxHeight: '90vh',
    background: '#fff',
    boxShadow: '0 -2px 16px rgba(0,0,0,0.12)',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    zIndex: 100,
    display: 'flex',
    flexDirection: 'column',
    transform: 'translateY(85%)',
    transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
    touchAction: 'pan-y',
  });
  document.body.appendChild(mobilePanel);
  console.log('[MobileUI] Mobile panel created and appended');

  // Slide-up logic
  let startY = 0, startTransform = 0, dragging = false;
  const handle = document.getElementById('mobile-slideup-handle');
  handle.addEventListener('touchstart', e => {
    e.preventDefault();
    dragging = true;
    startY = e.touches[0].clientY;
    // Get current transform value instead of getBoundingClientRect
    const transform = mobilePanel.style.transform;
    const match = transform.match(/translateY\(([\d.]+)%\)/);
    startTransform = match ? parseFloat(match[1]) : 85;
    mobilePanel.style.transition = 'none';
  }, { passive: false });
  window.addEventListener('touchmove', e => {
    if (!dragging) return;
    e.preventDefault();
    const dy = e.touches[0].clientY - startY;
    const vh = window.innerHeight;
    // Calculate new transform percentage directly
    const deltaPercent = (dy / vh) * 100;
    let newTransform = startTransform + deltaPercent;
    newTransform = Math.max(5, Math.min(newTransform, 90));
    mobilePanel.style.transform = `translateY(${newTransform}%)`;
  }, { passive: false });
  window.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    mobilePanel.style.transition = '';
    // Snap to open/close based on position
    const rect = mobilePanel.getBoundingClientRect();
    const vh = window.innerHeight;
    const currentPercent = (rect.top / vh) * 100;
    
    if (currentPercent > 60) {
      mobilePanel.style.transform = 'translateY(85%)';
    } else {
      mobilePanel.style.transform = 'translateY(5%)';
    }
  });

  // Tab switching
  const tabContent = document.getElementById('mobile-tab-content');
  function showTab(tab) {
    let content = '';
    if (tab === 'files') {
      const filesPanel = document.getElementById('files-panel');
      content = filesPanel ? filesPanel.innerHTML : '<div>Files not available</div>';
      tabContent.innerHTML = content;
      // Rebind file click handlers for mobile
      tabContent.querySelectorAll('.list-item').forEach(fileItem => {
        fileItem.addEventListener('click', () => {
          const fileName = fileItem.dataset.fileName;
          if (fileName) {
            import('./fileSystem.js').then(({ fileSystem }) => {
              fileSystem.openFile(fileName, fileItem);
            });
            showMobileToast(`Opening: ${fileName}`);
          }
        });
      });
    } else if (tab === 'search') {
      const searchPanel = document.getElementById('search-panel');
      content = searchPanel ? searchPanel.innerHTML : '<div>Search not available</div>';
      tabContent.innerHTML = content;
      // Rebind search functionality for mobile
      const searchInput = tabContent.querySelector('#search-input');
      const searchResultsList = tabContent.querySelector('#search-results-list');
      if (searchInput && searchResultsList) {
        import('./searchPanel.js').then(({ populateSearchResults }) => {
          populateSearchResults();
        });
        searchInput.addEventListener('input', async (e) => {
          const query = e.target.value.toLowerCase();
          Array.from(searchResultsList.children).forEach(item => {
            const fileName = item.textContent.toLowerCase();
            const isVisible = fileName.includes(query);
            item.classList.toggle('hidden', !isVisible);
          });
        });
        // Rebind file click handlers for mobile search
        tabContent.querySelectorAll('.list-item').forEach(fileItem => {
          fileItem.addEventListener('click', () => {
            const fileName = fileItem.dataset.fileName;
            if (fileName) {
              import('./fileSystem.js').then(({ fileSystem }) => {
                fileSystem.openFile(fileName, fileItem);
              });
              showMobileToast(`Opening: ${fileName}`);
            }
          });
        });
      }
    } else if (tab === 'outline') {
      const outlinePanel = document.getElementById('outline-panel');
      content = outlinePanel ? outlinePanel.innerHTML : '<div>Outline not available</div>';
      tabContent.innerHTML = content;
      // Rebind outline click handlers for mobile
      import('./outlineTree.js').then(({ outlineTree }) => {
        if (outlineTree && outlineTree.rebindMobileEvents) {
          outlineTree.rebindMobileEvents(tabContent);
        }
      });
    } else if (tab === 'ai') {
      const aiPanel = document.getElementById('ai-panel');
      content = aiPanel ? aiPanel.innerHTML : '<div>AI not available</div>';
      tabContent.innerHTML = content;
      // Wire up AI functionality for mobile
      import('./aiChat.js').then(({ aiChat }) => {
        // Update DOM references
        aiChat.chatInput = tabContent.querySelector('#chat-input');
        aiChat.chatSendBtn = tabContent.querySelector('#chat-send-btn');
        aiChat.chatMessages = tabContent.querySelector('#chat-messages');
        aiChat.apiKeyInput = tabContent.querySelector('#api-key-input');
        aiChat.saveApiKeyBtn = tabContent.querySelector('#save-api-key-btn');
        aiChat.apiKeySection = tabContent.querySelector('#api-key-section');
        aiChat.aiSettingsBtn = tabContent.querySelector('#ai-settings-btn');
        aiChat.newChatBtn = tabContent.querySelector('#new-chat-btn');
        aiChat.saveLocallyCheckbox = tabContent.querySelector('#save-locally-checkbox');
        aiChat.knowledgeBaseCheckbox = tabContent.querySelector('#knowledge-base-checkbox');
        aiChat.promptDropdown = tabContent.querySelector('#prompt-dropdown');
        aiChat.customPromptSection = tabContent.querySelector('#custom-prompt-section');
        aiChat.customPromptInput = tabContent.querySelector('#custom-prompt-input');
        aiChat.defaultPromptSection = tabContent.querySelector('#default-prompt-section');
        aiChat.defaultPromptDisplay = tabContent.querySelector('#default-prompt-display');
        
        // Rebind event listeners to mobile elements
        aiChat.chatSendBtn?.addEventListener('click', () => aiChat.handleAIChat());
        aiChat.chatInput?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            aiChat.handleAIChat();
          }
        });
        aiChat.saveApiKeyBtn?.addEventListener('click', () => aiChat.saveApiKey());
        aiChat.aiSettingsBtn?.addEventListener('click', () => aiChat.toggleSettings());
        aiChat.newChatBtn?.addEventListener('click', () => aiChat.newChat());
        aiChat.promptDropdown?.addEventListener('change', () => aiChat.handlePromptChange());
        aiChat.customPromptInput?.addEventListener('input', () => aiChat.saveCustomPrompt());
        aiChat.knowledgeBaseCheckbox?.addEventListener('change', () => aiChat.saveKnowledgeBaseSetting());
        
        // Load settings and check API key for mobile
        aiChat.loadSettings();
        aiChat.checkApiKey();
        aiChat.onAIPanelOpened();
      });
    }
    console.log(`[MobileUI] Switched to tab: ${tab}`);
  }

  // Mobile-specific toast notification
  function showMobileToast(message, type = 'success') {
    let toast = document.getElementById('mobile-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mobile-toast';
      document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = 'fixed top-5 left-1/2 transform -translate-x-1/2 text-white py-2 px-4 rounded-lg shadow-xl z-[200] transition-opacity duration-300';
    
    if (type === 'error') {
      toast.classList.add('bg-red-500');
    } else {
      toast.classList.add('bg-green-500');
    }
    
    toast.style.opacity = '1';
    
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 3000);
  }
  mobilePanel.querySelectorAll('.mobile-tab').forEach(btn => {
    btn.addEventListener('click', e => {
      mobilePanel.querySelectorAll('.mobile-tab').forEach(b => b.style.fontWeight = '500');
      btn.style.fontWeight = '700';
      showTab(btn.dataset.tab);
    });
  });
  showTab('files');
  console.log('[MobileUI] Defaulted to Files tab');
}

function deactivateMobileUI() {
  console.log(`[MobileUI] Deactivating mobile UI at width: ${window.innerWidth}`);
  if (mobilePanel && mobilePanel.parentNode) {
    mobilePanel.parentNode.removeChild(mobilePanel);
    mobilePanel = null;
    console.log('[MobileUI] Mobile panel removed');
  }
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebarWasVisible) {
    sidebar.style.display = '';
    console.log('[MobileUI] Sidebar restored');
  }
  
  // Remove height restrictions from editor
  const editorContainer = document.getElementById('editor');
  if (editorContainer) {
    editorContainer.style.maxHeight = '';
    editorContainer.style.height = '100%';
  }
  
  if (sidebarObserver) sidebarObserver.disconnect();
}

export function initMobileUI() {
  function checkMobile() {
    console.log(`[MobileUI] Checking mobile: window.innerWidth=${window.innerWidth}`);
    if (window.innerWidth <= 768) {
      activateMobileUI();
    } else {
      deactivateMobileUI();
    }
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);
  console.log('[MobileUI] Mobile UI initialized');
} 
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
    transform: 'translateY(55%)',
    transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)',
    touchAction: 'none',
  });
  document.body.appendChild(mobilePanel);
  console.log('[MobileUI] Mobile panel created and appended');

  // Slide-up logic
  let startY = 0, startTop = 0, dragging = false;
  const handle = document.getElementById('mobile-slideup-handle');
  handle.addEventListener('touchstart', e => {
    dragging = true;
    startY = e.touches[0].clientY;
    startTop = mobilePanel.getBoundingClientRect().top;
    mobilePanel.style.transition = 'none';
  });
  window.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dy = e.touches[0].clientY - startY;
    let newTop = startTop + dy;
    const vh = window.innerHeight;
    newTop = Math.max(vh * 0.1, Math.min(newTop, vh * 0.7));
    mobilePanel.style.transform = `translateY(${((newTop / vh) * 100)}%)`;
  });
  window.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    mobilePanel.style.transition = '';
    // Snap to open/close
    const rect = mobilePanel.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.5) {
      mobilePanel.style.transform = 'translateY(55%)';
    } else {
      mobilePanel.style.transform = 'translateY(0)';
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
    } else if (tab === 'outline') {
      const outlinePanel = document.getElementById('outline-panel');
      content = outlinePanel ? outlinePanel.innerHTML : '<div>Outline not available</div>';
      tabContent.innerHTML = content;
    } else if (tab === 'ai') {
      const aiPanel = document.getElementById('ai-panel');
      content = aiPanel ? aiPanel.innerHTML : '<div>AI not available</div>';
      tabContent.innerHTML = content;
      // Patch: update aiChat DOM references to the new elements in the mobile panel
      if (window.aiChat) {
        window.aiChat.chatInput = tabContent.querySelector('#chat-input');
        window.aiChat.chatSendBtn = tabContent.querySelector('#chat-send-btn');
        window.aiChat.chatMessages = tabContent.querySelector('#chat-messages');
        window.aiChat.apiKeyInput = tabContent.querySelector('#api-key-input');
        window.aiChat.saveApiKeyBtn = tabContent.querySelector('#save-api-key-btn');
        window.aiChat.apiKeySection = tabContent.querySelector('#api-key-section');
        window.aiChat.aiSettingsBtn = tabContent.querySelector('#ai-settings-btn');
        window.aiChat.newChatBtn = tabContent.querySelector('#new-chat-btn');
        window.aiChat.saveLocallyCheckbox = tabContent.querySelector('#save-locally-checkbox');
        window.aiChat.knowledgeBaseCheckbox = tabContent.querySelector('#knowledge-base-checkbox');
        window.aiChat.promptDropdown = tabContent.querySelector('#prompt-dropdown');
        window.aiChat.customPromptSection = tabContent.querySelector('#custom-prompt-section');
        window.aiChat.customPromptInput = tabContent.querySelector('#custom-prompt-input');
        window.aiChat.defaultPromptSection = tabContent.querySelector('#default-prompt-section');
        window.aiChat.defaultPromptDisplay = tabContent.querySelector('#default-prompt-display');
        window.aiChat.initializeEventListeners();
      }
    }
    console.log(`[MobileUI] Switched to tab: ${tab}`);
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
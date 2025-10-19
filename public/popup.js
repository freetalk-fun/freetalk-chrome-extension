/* global chrome */

function showPopup() {
  const popup = document.getElementById('popup-container');
  if (popup) {
    popup.style.opacity = '1';
  }
}

function initializePopup() {
  const toggle = document.getElementById('dictionary-toggle');
  const container = document.querySelector('.toggle-container');
  
  if (!toggle || !container) {
    console.error('Required elements not found');
    showPopup();
    return;
  }

  // Load saved state and set toggle
  chrome.storage.local.get(['dictionaryEnabled'], function(result) {
    const isEnabled = result.dictionaryEnabled !== false;
    toggle.checked = isEnabled;
    
    // Show toggle and popup with correct state
    container.classList.add('ready');
    showPopup();
    
    console.log('Dictionary state loaded:', isEnabled);
  });
  
  // Handle toggle changes
  toggle.addEventListener('change', function() {
    const isEnabled = toggle.checked;
    
    chrome.storage.local.set({ dictionaryEnabled: isEnabled }, function() {
      console.log('Dictionary state saved:', isEnabled ? 'enabled' : 'disabled');
      
      // Notify background script
      chrome.runtime.sendMessage({
        type: 'UPDATE_DICTIONARY_STATE',
        enabled: isEnabled
      });
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePopup);
} else {
  initializePopup();
}
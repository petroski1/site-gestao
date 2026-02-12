// Remove Emergent badges
(function() {
  function removeBadges() {
    // Remove all elements containing emergent links
    const selectors = [
      'a[href*="emergent"]',
      'div[style*="Made with"]',
      'div[style*="z-index: 2147483647"]',
      '[data-emergent]',
      '.emergent-badge'
    ];
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.remove();
      });
    });
    
    // Remove last element if it's a badge
    const lastDiv = document.body.lastElementChild;
    if (lastDiv && lastDiv.tagName === 'DIV' && lastDiv.querySelector('a[href*="emergent"]')) {
      lastDiv.remove();
    }
  }
  
  // Run immediately
  removeBadges();
  
  // Run after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeBadges);
  }
  
  // Run periodically to catch dynamically added badges
  setInterval(removeBadges, 1000);
  
  // Use MutationObserver to catch badges added later
  const observer = new MutationObserver(removeBadges);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

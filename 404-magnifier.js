    const overlay = document.getElementById('flashlight-overlay');
    const portal = document.getElementById('escape-portal');

    // Get current viewport dimensions
    function getViewportDimensions() {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }

    // Dynamically randomize the button location on page load
    function randomizePortalLocation() {
      const { width, height } = getViewportDimensions();
      
      // On very small screens, keep the button more centered for better UX
      const isSmallScreen = width < 481 || height < 600;
      
      let randomX, randomY;
      
      if (isSmallScreen) {
        // More constrained area for better findability on mobile
        randomX = Math.floor(Math.random() * 40) + 30; // 30% to 70%
        randomY = Math.floor(Math.random() * 40) + 30; // 30% to 70%
      } else {
        // Full range on desktop
        randomX = Math.floor(Math.random() * 65) + 15; // 15% to 80%
        randomY = Math.floor(Math.random() * 55) + 25; // 25% to 80%
      }
      
      portal.style.left = `${randomX}%`;
      portal.style.top = `${randomY}%`;
    }

    // Update flashlight position
    function updateFlashlight(x, y) {
      const radius = window.innerWidth < 769 ? 
        (window.innerWidth < 360 ? 50 : 60) : 120;
      
      overlay.style.background = `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 100%, rgba(3, 3, 3, 0.98) 100%)`;
    }

    // Mouse movement handler
    document.addEventListener('mousemove', (e) => {
      updateFlashlight(e.clientX, e.clientY);
    });

    // Touch movement handler for mobile
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateFlashlight(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    // Touch start - also update position
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateFlashlight(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        randomizePortalLocation();
      }, 250);
    });

    // Initialize
    randomizePortalLocation();
    
    // Initial flashlight position at center
    updateFlashlight(window.innerWidth / 2, window.innerHeight / 2);
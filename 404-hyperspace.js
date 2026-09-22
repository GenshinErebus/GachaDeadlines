    const canvas = document.getElementById('starfieldCanvas');
    const ctx = canvas.getContext('2d');

    function resizeContainer() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeContainer();
    window.addEventListener('resize', resizeContainer);

    const totalStars = 150;
    let starsList = [];
    let speedFactor = 1;
    let targetSpeedFactor = 1;
    let animationActive = true;

    function initStarfieldGrid() {
      starsList = [];
      for (let i = 0; i < totalStars; i++) {
        starsList.push({
          x: Math.random() * canvas.width - canvas.width / 2,
          y: Math.random() * canvas.height - canvas.height / 2,
          z: Math.random() * canvas.width,
          color: "rgba(255, 255, 255, " + (Math.random() * 0.5 + 0.5) + ")"
        });
      }
    }

    function activateWarpSpeed() {
      targetSpeedFactor = 25;
    }

    function deactivateWarpSpeed() {
      targetSpeedFactor = 1;
    }

    window.addEventListener('mousedown', activateWarpSpeed);
    window.addEventListener('mouseup', deactivateWarpSpeed);
    window.addEventListener('mouseenter', activateWarpSpeed);
    window.addEventListener('mouseleave', deactivateWarpSpeed);

    window.addEventListener('touchstart', function(e) {
      if (e.target.tagName !== 'A') {
        activateWarpSpeed();
      }
    }, { passive: true });

    window.addEventListener('touchend', deactivateWarpSpeed);

    function renderCosmicMotion() {
      if (!animationActive) return;

      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      speedFactor += (targetSpeedFactor - speedFactor) * 0.08;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < starsList.length; i++) {
        let s = starsList[i];
        
        s.z -= speedFactor;

        if (s.z <= 0) {
          s.x = Math.random() * canvas.width - centerX;
          s.y = Math.random() * canvas.height - centerY;
          s.z = canvas.width;
        }

        const px = (s.x / s.z) * centerX + centerX;
        const py = (s.y / s.z) * centerY + centerY;

        const tailZ = s.z + speedFactor * 2;
        const tx = (s.x / tailZ) * centerX + centerX;
        const ty = (s.y / tailZ) * centerY + centerY;

        ctx.strokeStyle = s.color;
        ctx.lineWidth = Math.max(1, (1 - s.z / canvas.width) * 3);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.stroke();
      }

      requestAnimationFrame(renderCosmicMotion);
    }

    initStarfieldGrid();
    renderCosmicMotion();
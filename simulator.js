function startSimulation() {
    const mass = parseFloat(document.getElementById("massInput").value);
    const velocity = parseFloat(document.getElementById("velocityInput").value);
    const canvas = document.getElementById("simCanvas");
    const ctx = canvas.getContext("2d");
  
    // 初期化
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    let x = 50;
    const y = canvas.height / 2;
    const radius = 10;
    const dt = 0.016; // 秒
    const pxPerMeter = 20;
  
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "blue";
      ctx.fill();
  
      x += velocity * dt * pxPerMeter;
  
      if (x < canvas.width) {
        requestAnimationFrame(draw);
      }
    }
  
    draw();
  }
  
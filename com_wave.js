const numParticles = 100;
    const particles = new Array(numParticles).fill(0);
    const positions = new Array(numParticles);
    const spacing = 8;
    const amplitude = 15;
    const freq = 2;
    let waveSpeed = 1.5;
    let time = 0;

    const longCanvas = document.getElementById("longitudinalCanvas");
    const longCtx = longCanvas.getContext("2d");

    const densityCanvas = document.getElementById("densityCanvas");
    const densityCtx = densityCanvas.getContext("2d");

    for (let i = 0; i < numParticles; i++) {
      positions[i] = i * spacing;
    }

    function animate() {
      requestAnimationFrame(animate);
      time += 0.02;

      longCtx.clearRect(0, 0, longCanvas.width, longCanvas.height);
      densityCtx.clearRect(0, 0, densityCanvas.width, densityCanvas.height);

      const centerY = longCanvas.height / 2;
      const graphCenterY = densityCanvas.height / 2;

      // 疎密波の表示（粒子の横方向振動）
      for (let i = 0; i < numParticles; i++) {
        const phase = (i / numParticles) * 2 * Math.PI;
        const dx = amplitude * Math.sin(2 * Math.PI * freq * time - phase * waveSpeed);
        const x = positions[i] + dx;

        longCtx.beginPath();
        longCtx.arc(x, centerY, 3, 0, Math.PI * 2);
        longCtx.fillStyle = "blue";
        longCtx.fill();
      }

      // 密度プロット（粗密を2Dグラフ化）
      densityCtx.beginPath();
      for (let i = 1; i < numParticles; i++) {
        const phase1 = (i / numParticles) * 2 * Math.PI;
        const dx1 = amplitude * Math.sin(2 * Math.PI * freq * time - phase1 * waveSpeed);
        const x1 = positions[i] + dx1;

        const phase0 = ((i - 1) / numParticles) * 2 * Math.PI;
        const dx0 = amplitude * Math.sin(2 * Math.PI * freq * time - phase0 * waveSpeed);
        const x0 = positions[i - 1] + dx0;

        const density = spacing / (x1 - x0); // 間隔の逆数が密度に相当
        const y = graphCenterY - (density - 1) * 80; 
        densityCtx.lineTo(i * spacing, y);
      }
      densityCtx.strokeStyle = "red";
      densityCtx.lineWidth = 2;
      densityCtx.stroke();
    }

animate();

const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");

// スライダーのイベントで速度変更
speedSlider.addEventListener("input", () => {
  waveSpeed = parseFloat(speedSlider.value);
  speedValue.textContent = waveSpeed.toFixed(1);
});
const canvas = document.getElementById("waveCanvas");
const ctx = canvas.getContext("2d");

const freqSlider = document.getElementById("frequency");
const ampSlider = document.getElementById("amplitude");
const freqVal = document.getElementById("freqVal");
const ampVal = document.getElementById("ampVal");
const resetBtn = document.getElementById("resetBtn");

const numPoints = 100;
const points = new Array(numPoints).fill(0);
const spacing = canvas.width / (numPoints - 1);
let time = 0;
let sourceIndex = null;

// 各点に波が届いた時刻を記録
const waveStartTimes = new Array(numPoints).fill(Infinity);
const waveSpeed = 5; // 高いほど速く広がる

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numPoints; i++) {
    const x = i * spacing;
    const y = canvas.height / 2 + points[i];
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = i === sourceIndex ? 'red' : 'blue';
    ctx.fill();
  }
}

function animate() {
  requestAnimationFrame(animate);
  const freq = parseFloat(freqSlider.value);
  const amp = parseFloat(ampSlider.value);
  freqVal.textContent = freq;
  ampVal.textContent = amp;

  for (let i = 0; i < numPoints; i++) {
    const startTime = waveStartTimes[i];
    if (time >= startTime) {
      const localTime = time - startTime;
      points[i] = amp * Math.sin(2 * Math.PI * freq * localTime);
    } else {
      points[i] = 0;
    }
  }

  draw();
  time += 0.02;
}

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const clickedIndex = Math.round(x / spacing);

  if (clickedIndex >= 0 && clickedIndex < numPoints) {
    sourceIndex = clickedIndex;
    const now = time;

    // 波が各点に届く時刻を計算（距離 / 速度）
    for (let i = 0; i < numPoints; i++) {
      const distance = Math.abs(i - sourceIndex);
      waveStartTimes[i] = now + distance / waveSpeed;
    }
  }
});

resetBtn.addEventListener("click", () => {
  sourceIndex = null;
  time = 0;
  for (let i = 0; i < numPoints; i++) {
    points[i] = 0;
    waveStartTimes[i] = Infinity;
  }
});

animate();


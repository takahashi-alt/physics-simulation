const canvas = document.getElementById("waveCanvas");
    const ctx = canvas.getContext("2d");

    const N = 200; // 空間分割数
    const c = 10;   // 波の速度（単位調整済）
    const dt = 0.1;
    const dx = 1;
    const damping = 0.999;

    let u = new Array(N).fill(0);
    let u_prev = new Array(N).fill(0);
    let u_next = new Array(N).fill(0);
    let running = false; // シミュレーションが実行中かどうか

    // 初期波形（中央にガウス波）
    function initializeWave() {
      for (let i = 0; i < N; i++) {
        let x = i - N / 2;
        u[i] = Math.exp(-x * x / 100);
        u_prev[i] = u[i];
      }
    }

    // 波の更新処理
    function updateWave() {
      if (!running) return; // シミュレーションが実行中の場合のみ更新

      const leftType = document.querySelector('input[name="left"]:checked').value;
      const rightType = document.querySelector('input[name="right"]:checked').value;

      for (let i = 1; i < N - 1; i++) {
        u_next[i] = (2 * u[i] - u_prev[i] + (c * c * dt * dt / (dx * dx)) * (u[i + 1] - 2 * u[i] + u[i - 1])) * damping;
      }

      // 左端の反射条件
      if (leftType === "fixed") {
        u_next[0] = 0;
      } else {
        u_next[0] = u_next[1]; // 自由端（∂u/∂x = 0）
      }

      // 右端の反射条件
      if (rightType === "fixed") {
        u_next[N - 1] = 0;
      } else {
        u_next[N - 1] = u_next[N - 2]; // 自由端（∂u/∂x = 0）
      }

      // 状態の更新
      [u_prev, u, u_next] = [u, u_next, u_prev];
    }

    // 波の描画
    function drawWave() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        let x = (i / (N - 1)) * canvas.width;
        let y = canvas.height / 2 - u[i] * 100;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // アニメーションの更新処理
    function animate() {
      updateWave();
      drawWave();
      requestAnimationFrame(animate);
    }

    // スタートボタンの処理
    document.getElementById("startButton").addEventListener("click", function() {
      running = true;
    });

    // リセットボタンの処理
    document.getElementById("resetButton").addEventListener("click", function() {
      running = false;
      initializeWave(); // 初期波形を再設定
      drawWave(); // 初期状態を描画
    });

    // 初期化
    initializeWave();
    animate(); // アニメーション開始


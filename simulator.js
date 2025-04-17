const canvas = document.getElementById("waveCanvas");
    const ctx = canvas.getContext("2d");

    const numPoints = 400;
    const points = new Array(numPoints).fill(0);
    const positions = Array.from({ length: numPoints }, (_, i) => i * (canvas.width / numPoints));
    let time = 0;

    function getSliderValue(id) {
      return parseFloat(document.getElementById(id).value);
    }

    function getDirection(id) {
      return document.getElementById(id).value === "right" ? 1 : -1;
    }

    // リアルタイムでスライダー値を表示する関数
    function updateValue(slider) {
      const spanId = slider.id + "_val";
      document.getElementById(spanId).textContent = slider.value;
    }

    function animate() {
      requestAnimationFrame(animate);
      time += 0.02;

      const source1 = {
        position: 50,
        amplitude: getSliderValue("amp1"),
        frequency: getSliderValue("freq1"),
        speed: getSliderValue("speed1"),
        phase: getSliderValue("phase1"),
        direction: getDirection("dir1")
      };

      const source2 = {
        position: numPoints - 50,
        amplitude: getSliderValue("amp2"),
        frequency: getSliderValue("freq2"),
        speed: getSliderValue("speed2"),
        phase: getSliderValue("phase2"),
        direction: getDirection("dir2")
      };

      const sources = [source1, source2];

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerY = canvas.height / 2;

      for (let i = 0; i < numPoints; i++) {
        let u = 0;
        for (let source of sources) {
          const dx = i - source.position;
          const delay = dx * source.direction / source.speed;
          u += source.amplitude * Math.sin(2 * Math.PI * source.frequency * (time - delay) + source.phase);
        }
        points[i] = u;
      }

      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const x = positions[i];
        const y = centerY - points[i];
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    animate();
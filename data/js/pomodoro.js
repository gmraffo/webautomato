//checa elementos
const minutesInput = document.getElementById("minutes");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");

let timer;
let remaining = 0;

function startTimer() {
 //valida entrada
  if (!minutesInput || !timerDisplay) return;
  const minutes = parseInt(minutesInput.value);
  if (isNaN(minutes) || minutes <= 0) {
    alert("Por favor, insira um valor de minutos válido.");
    return;
  }

  clearInterval(timer);
  remaining = minutes * 60;

//tira o botão de ínicio enquanto roda
  if (startBtn) startBtn.disabled = true;

//enviar tempo ao esp
  fetch("/tempo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ minutos: minutes })
  })
    .then(res => res.json())
    .then(data => console.log("Tempo enviado ao ESP:", data))
    .catch(err => {
      console.error("Erro ao enviar tempo ao ESP:", err);
      alert("Erro ao comunicar com o dispositivo.");
    });

  updateTimer();
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (remaining <= 0) {
    clearInterval(timer);
    if (startBtn) startBtn.disabled = false;
    window.location.href = "pos-questionario.html"; //redirecionamento automático
    return;
  }

  // evita manipulação sem checagem
  if (timerDisplay) {
    let mins = Math.floor(remaining / 60);
    let secs = remaining % 60;
    timerDisplay.innerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  remaining--;
}

function resetTimer() {
  if (!minutesInput || !timerDisplay) return;
  clearInterval(timer);
  const minutes = parseInt(minutesInput.value);
  if (isNaN(minutes) || minutes <= 0) {
    alert("Por favor, insira um valor de minutos válido.");
    return;
  }
  remaining = minutes * 60;
  timerDisplay.innerText = `${String(minutes).padStart(2, "0")}:00`;
  if (startBtn) startBtn.disabled = false;
}

// Melhoria: Separação de lógica - exemplo simples de função isolada
function getMinutesValue() {
  if (!minutesInput) return 0;
  return parseInt(minutesInput.value) || 0;
}

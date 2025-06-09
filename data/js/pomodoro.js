import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase config (automato-marco3)
const firebaseConfig = {
  apiKey: "AIzaSyAQQJBZmwE3kWoL-F_RJPVb8dM513g07iw",
  authDomain: "automato-marco3.firebaseapp.com",
  databaseURL: "https://automato-marco3-default-rtdb.firebaseio.com",
  projectId: "automato-marco3",
  storageBucket: "automato-marco3.firebasestorage.app",
  messagingSenderId: "1033586154997",
  appId: "1:1033586154997:web:80fbefe52b67c5cf3054bc"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Checa elementos
const minutesInput = document.getElementById("minutes");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");

let timer;
let remaining = 0;

function startTimer() {
  const minutes = getMinutesValue();
  if (minutes <= 0) {
    alert("Por favor, insira um valor de minutos válido.");
    return;
  }

  clearInterval(timer);
  remaining = minutes * 60;

  if (startBtn) startBtn.disabled = true;

  // Envia tempo ao Firebase (será lido pelo ESP32)
  set(ref(db, 'commands/start_pomodoro'), { duration: remaining })
    .then(() => console.log("Tempo enviado ao Firebase com sucesso"))
    .catch(err => {
      console.error("Erro ao enviar tempo ao Firebase:", err);
      alert("Erro ao comunicar com o dispositivo.");
    });

  updateTimer();
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (remaining <= 0) {
    clearInterval(timer);
    if (startBtn) startBtn.disabled = false;
    window.location.href = "pos-questionario.html";
    return;
  }

  if (timerDisplay) {
    let mins = Math.floor(remaining / 60);
    let secs = remaining % 60;
    timerDisplay.innerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  remaining--;
}

function resetTimer() {
  clearInterval(timer);
  const minutes = getMinutesValue();
  if (minutes <= 0) {
    alert("Por favor, insira um valor de minutos válido.");
    return;
  }
  remaining = minutes * 60;
  timerDisplay.innerText = `${String(minutes).padStart(2, "0")}:00`;
  if (startBtn) startBtn.disabled = false;
}

// Utilitário: valor do input de minutos
function getMinutesValue() {
  if (!minutesInput) return 0;
  return parseInt(minutesInput.value) || 0;
}

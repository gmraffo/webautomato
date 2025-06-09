const preForm = document.getElementById("pre-form");
const sendOnlyBtn = document.getElementById("send-only-btn");


const PRE_QUEUE_KEY = "preQueue";

async function enviarFilaArmazenada() {
  const fila = JSON.parse(localStorage.getItem(PRE_QUEUE_KEY) || "[]");
  if (!fila.length) return;

  const restantes = [];
  for (const dados of fila) {
    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbyf4K3u5_Jg3LeEQr41e3W8JWjBo5wKKpEsjBcnmy1H6-ain0iIgIFreFg6k32JK6GZuA/exec",
        {
          method: "POST",
          body: JSON.stringify(dados),
          headers: { "Content-Type": "application/json" },
          mode: "no-cors",
        }
      );
    } catch (_) {
      restantes.push(dados);
    }
  }

  if (restantes.length) {
    localStorage.setItem(PRE_QUEUE_KEY, JSON.stringify(restantes));
  } else {
    localStorage.removeItem(PRE_QUEUE_KEY);
  }
}

// tenta enviar dados armazenados sempre que a página carregar
window.addEventListener("load", enviarFilaArmazenada);

async function enviarDados(redirecionarPara) {
  // seleção dos botões
  const fatigue = document.querySelector('input[name="fatigue"]:checked');
  const motivation = document.querySelector('input[name="motivation"]:checked');
  const productivity = document.querySelector('input[name="productivity"]:checked');

  if (!fatigue || !motivation || !productivity) {
    alert("Por favor, responda todas as perguntas antes de seguir em frente!");
    return;
  }

  const payload = {
    fatigue: fatigue.value,
    motivation: motivation.value,
    productivity: productivity.value,
  };

  try {
    await fetch(
      "https://script.google.com/macros/s/AKfycbyf4K3u5_Jg3LeEQr41e3W8JWjBo5wKKpEsjBcnmy1H6-ain0iIgIFreFg6k32JK6GZuA/exec",
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
      }
    );
    alert("Dados enviados com sucesso! Redirecionando...");
  } catch (err) {
    // salva localmente caso esteja sem conexão
    const fila = JSON.parse(localStorage.getItem(PRE_QUEUE_KEY) || "[]");
    fila.push(payload);
    localStorage.setItem(PRE_QUEUE_KEY, JSON.stringify(fila));
    alert(
      "Sem conexão. Respostas salvas e serão enviadas automaticamente depois."
    );
  }

  setTimeout(() => {
    window.location.href = redirecionarPara;
  }, 1200);
}

if (preForm) {
  preForm.addEventListener("submit", function (e) {
    e.preventDefault();
    enviarDados("pomodoro.html");
  });
}

if (sendOnlyBtn) {
  sendOnlyBtn.addEventListener("click", function () {
    enviarDados("obrigado.html");
  });
}

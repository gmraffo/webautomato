const preForm = document.getElementById("pre-form");
const sendOnlyBtn = document.getElementById("send-only-btn");

async function enviarDados(redirecionarPara) {
  // seleção dos botões
  const fatigue = document.querySelector('input[name="fatigue"]:checked');
  const motivation = document.querySelector('input[name="motivation"]:checked');
  const productivity = document.querySelector('input[name="productivity"]:checked');

  if (!fatigue || !motivation || !productivity) {
    alert("Por favor, responda todas as perguntas antes de seguir em frente!");
    return;
  }

  try {
    const resposta = await fetch("https://script.google.com/macros/s/AKfycbyf4K3u5_Jg3LeEQr41e3W8JWjBo5wKKpEsjBcnmy1H6-ain0iIgIFreFg6k32JK6GZuA/exec", {
      method: "POST",
      body: JSON.stringify({
        fatigue: fatigue.value,
        motivation: motivation.value,
        productivity: productivity.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resposta.ok) {
      alert("Dados enviados com sucesso! Redirecionando...");
      setTimeout(() => {
        window.location.href = redirecionarPara;
      }, 1200);
    } else {
      alert("Erro ao enviar dados.");
    }
  } catch (err) {
    alert("Erro de conexão. Tente novamente.");
    console.error(err);
  }
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

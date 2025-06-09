const wifiForm = document.getElementById("wifi-form");
const statusDiv = document.getElementById("status");

if (wifiForm) {
  wifiForm.addEventListener("submit", async function (e) {
    e.preventDefault();

//validação dos campos
    const ssid = document.getElementById("ssid").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!ssid || !password) {
      statusDiv.innerText = "Os campos conectados não conferem! Tente novamente.";
      return;
    }

//feedback visual de conexão
    statusDiv.innerText = "Conectando...";

    try {
      const response = await fetch("/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssid, password })
      });

      const result = await response.json();

      if (result.success) {
        statusDiv.innerText = "Conectado com sucesso!";
        setTimeout(() => {
          window.location.href = "pre.html"; //passa para próxima página
        }, 1000);
      } else {
        statusDiv.innerText = "Falha ao conectar.";
      }
    } catch (err) {
      statusDiv.innerText = "Erro de conexão. Tente novamente.";
      console.error(err);
    }
  });
}

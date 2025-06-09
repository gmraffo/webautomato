const form = document.getElementById("pos-form");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    //validação de campos obrigatórios p pesquisa
    const focoFinal = document.getElementById("focoFinal").value.trim();
    const comentarios = document.getElementById("comentarios").value.trim();

    if (!focoFinal || !comentarios) {
      alert("Por favor, preencha todos os campos obrigatórios antes de continuar.");
      return;
    }

    //coleta das tasks usando vetor
    const tasks = [];
    for (let i = 1; i <= 8; i++) {
      tasks.push(document.getElementById(`task${i}`).value.trim());
    }

    //tratamento de erros usando try/catch
    try {
      const resposta = await fetch("https://script.google.com/macros/s/AKfycbxQmSl1qUDc3QCYeoJCkorbKjYJ9RM7-XptwYOw_z9BW0mQ4fOr3E8-TqQZLh07fDnX/exec", { //envia os dados
        method: "POST",
        body: JSON.stringify({
          focoFinal,
          comentarios,
          ...tasks.reduce((acc, task, idx) => ({ ...acc, [`task${idx + 1}`]: task }), {})
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (resposta.ok) {
        alert("Dados enviados com sucesso!");
        form.reset(); //limpa o formulário após sucesso
        window.location.href = "obrigado.html"; // vai p página final
      } else {
        alert("Erro ao enviar os dados.");
      }
    } catch (err) {
      alert("Erro de conexão. Tente novamente.");
      console.error(err);
    }
  });
}

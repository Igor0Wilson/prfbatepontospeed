// ==========================
// FUNÇÕES ÚTEIS
// ==========================

// Retorna hora atual formatada HH:MM:SS
function getHoraAtual() {
  const agora = new Date();
  return agora.toLocaleTimeString("pt-BR", { hour12: false });
}

// Atualiza a data e hora no header
function atualizarDataHora() {
  const now = new Date();
  const options = {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formato = now.toLocaleDateString("pt-BR", options);
  document.getElementById("dataHora").textContent = formato;
}
atualizarDataHora();
setInterval(atualizarDataHora, 60000); // Atualiza a cada minuto

// ==========================
// ELEMENTOS DO FORMULÁRIO
// ==========================
const qraInput = document.getElementById("qraPonto");
const patenteSelect = document.getElementById("patentePonto");
const inicioInput = document.getElementById("inicio");
const fimInput = document.getElementById("fim");

const outQra = document.getElementById("outQraPonto");
const outPatente = document.getElementById("outPatentePonto");
const outVeiculo = document.getElementById("outVeiculoPonto");
const outInicio = document.getElementById("outInicio");
const outFim = document.getElementById("outFim");

const btnIniciar = document.getElementById("btnIniciar");
const btnFinalizar = document.getElementById("btnFinalizar");
const btnFoto = document.getElementById("btnFoto");
const veiculoBtns = document.querySelectorAll(".veiculo-btn");

let veiculoSelecionado = null;

// ==========================
// FUNÇÕES DE INTERAÇÃO
// ==========================

// Atualiza preview do QRA e Patente em tempo real
qraInput.addEventListener("input", () => {
  outQra.textContent = qraInput.value || "-";
});

patenteSelect.addEventListener("change", () => {
  outPatente.textContent = patenteSelect.value || "-";
});

// Seleção de veículo
function selecionarVeiculo(botao, nome) {
  veiculoBtns.forEach((b) => b.classList.remove("border-[#FFD200]"));
  botao.classList.add("border-[#FFD200]");
  veiculoSelecionado = nome;
  outVeiculo.textContent = veiculoSelecionado;
}

// Iniciar expediente
btnIniciar.addEventListener("click", () => {
  if (!qraInput.value || !patenteSelect.value || !veiculoSelecionado) {
    document.getElementById("modalAviso").classList.remove("hidden");
    return;
  }
  const hora = getHoraAtual();
  inicioInput.value = hora;
  outInicio.textContent = hora;
});

// Finalizar expediente
btnFinalizar.addEventListener("click", () => {
  const hora = getHoraAtual();
  fimInput.value = hora;
  outFim.textContent = hora;
});

// Fechar modal
function fecharModal() {
  document.getElementById("modalAviso").classList.add("hidden");
}

// Botão de tirar print apenas do relatório
btnFoto.addEventListener("click", async () => {
  const element = document.getElementById("reportPonto");

  // 1️⃣ Gerar a imagem com html2canvas
  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // 2️⃣ Baixar a imagem localmente
  const link = document.createElement("a");
  link.href = imgData;
  link.download = "relatorio_ponto.png";
  link.click();

  // 3️⃣ Preparar dados do formulário para enviar ao Firebase
  const ponto = {
    qra: document.getElementById("qraPonto").value,
    patente: document.getElementById("patentePonto").value,
    veiculo: document.getElementById("outVeiculoPonto").textContent || "",
    inicio: document.getElementById("outInicio").textContent || "",
    fim: document.getElementById("outFim").textContent || "",
    timestamp: new Date().toISOString(),
  };

  // 4️⃣ Enviar para sua API Fastify (porta 3000)
  try {
    const response = await fetch(
      "https://apipontospeeds.vercel.app/api/ponto",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ponto),
      }
    );

    const data = await response.json();
    console.log("Ponto salvo:", data);
    alert("Ponto enviado com sucesso!");
  } catch (err) {
    console.error("Erro ao salvar ponto:", err);
    alert("Erro ao enviar ponto!");
  }
});

// ==========================
// EXPOSIÇÃO GLOBAL (para onclick no HTML)
// ==========================
window.selecionarVeiculo = selecionarVeiculo;
window.fecharModal = fecharModal;

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
btnIniciar.addEventListener("click", async () => {
  if (!qraInput.value || !patenteSelect.value || !veiculoSelecionado) {
    document.getElementById("modalAviso").classList.remove("hidden");
    return;
  }
  const hora = getHoraAtual();
  inicioInput.value = hora;
  outInicio.textContent = hora;

  // 3️⃣ Preparar dados do formulário para enviar ao Firebase
  const ponto = {
    divisao: "Speed",
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
  } catch (err) {
    console.error("Erro ao salvar ponto:", err);
  }
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
});

// Variável global para armazenar pontos ativos
let pontosAtivos = [];

// Função para buscar pontos abertos da API e preencher select
async function carregarPontosAbertos() {
  try {
    const response = await fetch("https://apipontospeeds.vercel.app/api/ponto");
    const data = await response.json();

    // Filtra apenas os pontos abertos (fim = "-")
    pontosAbertos = data.pontos.filter((p) => p.fim === "-");

    const select = document.getElementById("selectPonto");
    select.innerHTML = `<option value="">Selecione um ponto</option>`; // limpa opções anteriores

    pontosAbertos.forEach((p) => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.qra; // mostra o nome do agente
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar pontos abertos:", err);
  }
}

// Preencher o select com os pontos ativos
function preencherSelectPontos(pontos) {
  const select = document.getElementById("selectPonto");
  select.innerHTML = '<option value="">Escolha seu ponto</option>'; // limpa opções

  pontos.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.id; // id do documento
    option.textContent = `${p.qra} - ${p.patente} - ${p.veiculo} - ${p.inicio}`;
    select.appendChild(option);
  });
}

document.getElementById("selectPonto").addEventListener("change", (e) => {
  const pontoId = e.target.value;
  if (!pontoId) return;

  const pontoSelecionado = pontosAbertos.find((p) => p.id === pontoId);
  if (!pontoSelecionado) return;

  // Preenche campos do formulário
  const qraInput = document.getElementById("qraPonto");
  const patenteInput = document.getElementById("patentePonto");
  const inicioInput = document.getElementById("inicio");
  const fimInput = document.getElementById("fim");

  qraInput.value = pontoSelecionado.qra;
  patenteInput.value = pontoSelecionado.patente;
  inicioInput.value = pontoSelecionado.inicio;
  fimInput.value = ""; // limpar

  // Bloquear edição
  qraInput.readOnly = true;
  patenteInput.disabled = true;
  inicioInput.readOnly = true;

  // Atualiza relatório
  document.getElementById("outQraPonto").textContent = pontoSelecionado.qra;
  document.getElementById("outPatentePonto").textContent =
    pontoSelecionado.patente;
  document.getElementById("outVeiculoPonto").textContent =
    pontoSelecionado.veiculo;
  document.getElementById("outInicio").textContent = pontoSelecionado.inicio;
  document.getElementById("outFim").textContent = "-";
});

document.getElementById("btnFinalizar").addEventListener("click", async () => {
  const pontoId = document.getElementById("selectPonto").value;

  if (!pontoId) {
    alert("Selecione um ponto para finalizar!");

    // Limpa campos de ponto final
    document.getElementById("fim").value = "";
    document.getElementById("outFim").textContent = "-";

    return;
  }

  const fimHora = new Date().toLocaleTimeString("pt-BR", { hour12: false });

  try {
    const response = await fetch(
      `https://apipontospeeds.vercel.app/api/ponto/${pontoId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fim: fimHora }),
      }
    );

    const data = await response.json();
    console.log("Ponto finalizado:", data);

    // Atualiza relatório
    document.getElementById("outFim").textContent = fimHora;
    document.getElementById("fim").value = fimHora;

    carregarPontosAbertos();
  } catch (err) {
    console.error("Erro ao finalizar ponto:", err);
  }
});

const selectQra = document.getElementById("qraPonto");
const inputPatente = document.getElementById("patentePonto");

let usuarios = [];

// Função para carregar os agentes
async function carregarAgentes() {
  try {
    const res = await fetch("https://apipontospeeds.vercel.app/api/usuario");
    const data = await res.json();

    usuarios = data.usuarios; // salva os dados para uso posterior

    selectQra.innerHTML = '<option value="">Selecione um agente</option>';

    data.usuarios.forEach((usuario) => {
      const option = document.createElement("option");
      option.value = usuario.qra;
      option.textContent = usuario.qra; // Só o QRA/nome, sem patente
      selectQra.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar agentes:", err);
    selectQra.innerHTML =
      '<option value="">Não foi possível carregar agentes</option>';
  }
}

// Ao selecionar um agente, atualiza a patente
selectQra.addEventListener("change", () => {
  const qraSelecionado = selectQra.value;
  const usuario = usuarios.find((u) => u.qra === qraSelecionado);
  if (usuario) {
    inputPatente.value = usuario.patente;

    // Atualiza o relatório
    document.getElementById("outQraPonto").textContent = usuario.qra;
    document.getElementById("outPatentePonto").textContent = usuario.patente;
  } else {
    inputPatente.value = "";
    document.getElementById("outQraPonto").textContent = "-";
    document.getElementById("outPatentePonto").textContent = "-";
  }
});

// Chama ao carregar a página
window.addEventListener("DOMContentLoaded", carregarAgentes);

// Chama a função assim que a página carregar
carregarPontosAbertos();
// ==========================
// EXPOSIÇÃO GLOBAL (para onclick no HTML)
// ==========================
window.selecionarVeiculo = selecionarVeiculo;
window.fecharModal = fecharModal;

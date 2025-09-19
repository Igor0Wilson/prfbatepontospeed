// Motivos disponíveis
const motivos = [
  "Art. 121 - Atirou contra a guarnição",
  "Art. 121 - O mesmo atirou contra a guarnição",
  "Art. 121 - Atirou contra a PRF",
  "Art. 330 - Tentou fuga contra a guarnição",
  "Art. 330 - Tentativa de fuga",
  "Art. 330 - Desobedeceu ordem de parada e atirou contra a guarnição",
  "Art. 175 - Veículo ilegalmente estacionado, desregularizado",
  "Art. 175 - Mal estacionado",
  "Art. 175 - Veículo irregular",
  "Art. 175 - Parado em lugar proibido",
  "Art. 175 - Parado em meio da via de transação pública",
  "Art. 232 - Veículo abandonado",
  "Art. 232 - Veículo abandonado no meio da pista",
  "Art. 232 - Abandonado na pista",
  "Art. 232 - Veículo abandonado na rua",
  "Art. 232 - Abandonado na rua",
  "Art. 232 - Abandonado",
  "Art. 232 - Abandonado em frente à PRF",
  "Art. 121 - Estava em QRU de disparo",
  "Art. 121 - QRU de disparo",
];

// Injetar lista de motivos
const motivosList = document.getElementById("motivosList");
const motivosSelect = document.getElementById("motivosSelect");
const motivosToggle = document.getElementById("motivosToggle");
const motivosDropdown = document.getElementById("motivosDropdown");
const motivosPlaceholder = document.getElementById("motivosPlaceholder");
const clearMotivos = document.getElementById("clearMotivos");

motivos.forEach((m, i) => {
  const id = `motivo-${i}`;
  const wrapper = document.createElement("div");
  wrapper.className = "flex items-center gap-2";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  checkbox.value = m;
  checkbox.className = "rounded text-[#071f4b]";
  checkbox.addEventListener("change", syncMotivos);

  const label = document.createElement("label");
  label.htmlFor = id;
  label.textContent = m;
  label.className = "text-sm text-gray-700";

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);
  motivosList.appendChild(wrapper);
});

function syncMotivos() {
  motivosSelect.innerHTML = "";
  const selected = [];
  document.querySelectorAll("#motivosList input:checked").forEach((chk) => {
    selected.push(chk.value);
    const opt = document.createElement("option");
    opt.value = chk.value;
    opt.text = chk.value;
    opt.selected = true;
    motivosSelect.appendChild(opt);
  });

  motivosPlaceholder.textContent =
    selected.length > 0
      ? `${selected.length} motivo(s) selecionado(s)`
      : "Clique para selecionar motivos";
}

motivosToggle.addEventListener("click", () => {
  motivosDropdown.classList.toggle("hidden");
});

clearMotivos.addEventListener("click", () => {
  document
    .querySelectorAll("#motivosList input")
    .forEach((chk) => (chk.checked = false));
  syncMotivos();
});

// --- MULTIPLOS QRA ---
document.addEventListener("DOMContentLoaded", () => {
  const qraContainer = document.getElementById("qraContainer");
  const addQraBtn = document.getElementById("addQra");
  const btnGenerate = document.getElementById("btnGenerate");
  const btnPrint = document.getElementById("btnPrint");

  function createQraField() {
    const wrapper = document.createElement("div");
    wrapper.className = "flex items-center gap-2";

    const input = document.createElement("input");
    input.name = "qra[]";
    input.placeholder = "Digite um QRA";
    input.className = "input-modern flex-1";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-qra text-red-500 text-lg font-bold px-2 py-1";
    removeBtn.textContent = "❌";

    removeBtn.addEventListener("click", () => {
      wrapper.remove();
    });

    wrapper.appendChild(input);
    wrapper.appendChild(removeBtn);

    return wrapper;
  }

  // campo inicial
  qraContainer.appendChild(createQraField());

  addQraBtn.addEventListener("click", () => {
    qraContainer.appendChild(createQraField());
  });

  // GERAR RELATÓRIO
  btnGenerate.addEventListener("click", () => {
    const qras = Array.from(document.querySelectorAll("input[name='qra[]']"))
      .map((i) => i.value.trim())
      .filter((v) => v);

    const nome = document.getElementById("nomeProprietario").value.trim();
    const rg = document.getElementById("rgProprietario").value.trim();
    const placa = document.getElementById("placaVeiculo").value.trim();
    const modelo = document.getElementById("nomeModelo").value.trim();
    const multa = document.getElementById("multaAplicada").value.trim();
    const motivos = Array.from(
      document.getElementById("motivosSelect").selectedOptions
    ).map((o) => o.value);

    const foto1 = document.getElementById("foto1").files[0];
    const foto2 = document.getElementById("foto2").files[0];

    if (qras.length === 0 || !nome || !rg || !placa || !modelo || !multa) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    if (motivos.length === 0) {
      alert("Selecione pelo menos 1 motivo.");
      return;
    }
    if (!foto1) {
      alert("A Foto 1 é obrigatória.");
      return;
    }

    // Mostrar múltiplos QRA no relatório
    const outQra = document.getElementById("outQra");
    outQra.innerHTML = "";
    qras.forEach((q) => {
      const p = document.createElement("p");
      p.textContent = q;
      outQra.appendChild(p);
    });

    document.getElementById("outNomeProprietario").textContent = nome;
    document.getElementById("outRgProprietario").textContent = rg;
    document.getElementById("outPlacaVeiculo").textContent = placa;
    document.getElementById("outNomeModelo").textContent = modelo;
    document.getElementById("outMultaAplicada").textContent = multa;

    // Motivos em linhas
    const outMotivos = document.getElementById("outMotivos");
    outMotivos.innerHTML = "";
    motivos.forEach((m) => {
      const p = document.createElement("p");
      p.textContent = m;
      outMotivos.appendChild(p);
    });

    // Foto 1
    const outFoto1 = document.getElementById("outFoto1");
    const reader1 = new FileReader();
    reader1.onload = (e) => {
      outFoto1.src = e.target.result;
      outFoto1.classList.remove("hidden");
    };
    reader1.readAsDataURL(foto1);

    // Foto 2 (opcional)
    const outFoto2 = document.getElementById("outFoto2");
    if (foto2) {
      const reader2 = new FileReader();
      reader2.onload = (e) => {
        outFoto2.src = e.target.result;
        outFoto2.classList.remove("hidden");
      };
      reader2.readAsDataURL(foto2);
    } else {
      outFoto2.classList.add("hidden");
    }
  });

  // SALVAR + IMPRIMIR
  btnPrint.addEventListener("click", async () => {
    const qras = Array.from(document.querySelectorAll("input[name='qra[]']"))
      .map((i) => i.value.trim())
      .filter((v) => v);

    const nomeProprietario = document
      .getElementById("nomeProprietario")
      .value.trim();
    const rg = document.getElementById("rgProprietario").value.trim();
    const placa = document.getElementById("placaVeiculo").value.trim();
    const modelo = document.getElementById("nomeModelo").value.trim();
    const hoje = new Date().toLocaleDateString("pt-BR");

    if (qras.length === 0 || !rg || !placa || !modelo) {
      alert("Preencha QRA, RG, Placa e Modelo antes de imprimir.");
      return;
    }

    for (const qra of qras) {
      const payload = {
        qra,
        nomeProprietario,
        rg,
        placa,
        modelo,
        data: hoje,
      };

      await fetch("http://localhost:3000/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    console.log("✅ Todos os dados enviados para Google Sheets");
    window.print();
  });
});

// Seleciona os elementos
const exampleImg = document.getElementById("exampleImg");
const imageModal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeModal = document.getElementById("closeModal");

// Quando clicar na imagem pequena -> abre o modal
exampleImg.addEventListener("click", () => {
  modalImg.src = exampleImg.src; // pega a mesma imagem
  imageModal.classList.remove("hidden");
});

// Fechar modal ao clicar no botão
closeModal.addEventListener("click", () => {
  imageModal.classList.add("hidden");
});

// Fechar modal ao clicar fora da imagem
imageModal.addEventListener("click", (e) => {
  if (e.target === imageModal) {
    imageModal.classList.add("hidden");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const dadosInput = document.getElementById("dadosBrutos");

  dadosInput.addEventListener("blur", () => {
    const texto = dadosInput.value;

    if (!texto) return;

    // Regex para capturar os campos
    const passaporte = texto.match(/Passaporte:\s*([^\|]+)/i);
    const placa = texto.match(/Placa:\s*([^\|]+)/i);
    const proprietario = texto.match(/Proprietário:\s*([^\|]+)/i);
    const veiculo = texto.match(/Veiculo:\s*([^\|]+)/i);

    // Preencher os campos do formulário se encontrar
    if (passaporte)
      document.getElementById("rgProprietario").value = passaporte[1].trim();
    if (placa) document.getElementById("placaVeiculo").value = placa[1].trim();
    if (proprietario)
      document.getElementById("nomeProprietario").value =
        proprietario[1].trim();
    if (veiculo)
      document.getElementById("nomeModelo").value = veiculo[1].trim();
  });
});

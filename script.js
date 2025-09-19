// =====================
// Função utilitária para pegar valores
// =====================
function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

// =====================
// Gestão de QRA(s)
// =====================
const qraContainer = document.getElementById("qraContainer");
const addQraBtn = document.getElementById("addQra");

function createQraField(qraValue = "", patenteValue = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "flex items-center gap-2";

  // Input QRA
  const inputQra = document.createElement("input");
  inputQra.type = "text";
  inputQra.placeholder = "Digite o QRA";
  inputQra.value = qraValue;
  inputQra.className = "input-modern flex-1 qra-input"; // ✅ adicionada classe

  // Input Patente
  const inputPatente = document.createElement("input");
  inputPatente.type = "text";
  inputPatente.placeholder = "Digite a Patente";
  inputPatente.value = patenteValue;
  inputPatente.className = "input-modern flex-1 patente-input"; // ✅ adicionada classe

  // Botão remover
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "X";
  removeBtn.className =
    "text-red-500 font-bold px-2 py-1 rounded hover:bg-red-100";
  removeBtn.onclick = () => wrapper.remove();

  wrapper.appendChild(inputQra);
  wrapper.appendChild(inputPatente);
  wrapper.appendChild(removeBtn);

  qraContainer.appendChild(wrapper);
}

// Evento do botão "Adicionar outro QRA"
addQraBtn.addEventListener("click", () => createQraField());

// Cria a primeira linha já ao carregar
createQraField();

// =====================
// Motivos da Prisão
// =====================
const motivosList = document.getElementById("motivosList");
const motivosSelect = document.getElementById("motivosSelect");
const motivosDropdown = document.getElementById("motivosDropdown");
const motivosToggle = document.getElementById("motivosToggle");
const motivosPlaceholder = document.getElementById("motivosPlaceholder");
const clearMotivos = document.getElementById("clearMotivos");

const motivos = [
  "Art. 101 - Azaralhamento Recrutamento",
  "Art. 101.1 - Prisão Militar",
  "Art. 102 - Agressão a Funcionário Público",
  "Art. 103 - Prevaricação",
  "Art. 104 - Homicídio Doloso Qualificado",
  "Art. 105 - Homicídio Doloso",
  "Art. 106 - Tentativa de Homicídio",
  "Art. 107 - Homicídio Culposo",
  "Art. 108 - Homicídio Culposo no Trânsito",
  "Art. 109 - Lesão Corporal",
  "Art. 110 - Sequestro",
  "Art. 111 - Cárcere Privado",
  "Art. 112 - Desmanche de Veículos",
  "Art. 113 - Furto",
  "Art. 114 - Receptação de Veículos",
  "Art. 115 - Roubo de Veículos",
  "Art. 116 - Tentativa de Furto",
  "Art. 117 - Furto de Veículos",
  "Art. 118 - Roubo",
  "Art. 119 - Furto a Caixa Eletrônico",
  "Art. 120 - Extorsão",
  "Art. 121 - Posse de Peças de Armas",
  "Art. 122 - Posse de Cápsulas",
  "Art. 123 - Tráfico de Armas",
  "Art. 124 - Tráfico de Itens Ilegais",
  "Art. 125 - Porte de Arma Pesada",
  "Art. 126 - Porte de Arma Leve",
  "Art. 127 - Disparo de Arma de Fogo",
  "Art. 128 - Tráfico de Munições (+100)",
  "Art. 129 - Posse de Munição (-100)",
  "Art. 130 - Posse de Colete",
  "Art. 130.1 - Tráfico de equipamento balistico",
  "Art. 131 - Porte de Arma Branca",
  "Art. 132 - Tráfico de Drogas (+100)",
  "Art. 133 - Aviãozinho (6 a 100)",
  "Art. 134 - Posse de Componentes Narcóticos",
  "Art. 135 - Posse de Drogas (1 a 5)",
  "Art. 136 - Posse de Itens Ilegais",
  "Art. 137 - Dinheiro Sujo",
  "Art. 138 - Falsidade Ideológica",
  "Art. 139 - Associação Criminosa",
  "Art. 140 - Apologia ao Crime",
  "Art. 141 - Posse de Arma em Público",
  "Art. 142 - Tentativa de Suborno",
  "Art. 143 - Ameaça",
  "Art. 144 - Falsa Comunicação de Crime",
  "Art. 145 - Desobediência 01",
  "Art. 146 - Desobediência 02",
  "Art. 147 - Desobediência 03",
  "Art. 148 - Assédio",
  "Art. 149 - Atentado ao Pudor",
  "Art. 150 - Vandalismo",
  "Art. 151 - Invasão de Propriedade",
  "Art. 152 - Abuso de Autoridade",
  "Art. 153 - Uso de Máscara",
  "Art. 154 - Uso de Equipamentos Restritos",
  "Art. 155 - Omissão de Socorro",
  "Art. 156 - Tentativa de Fuga",
  "Art. 157 - Desacato 01",
  "Art. 158 - Desacato 02",
  "Art. 159 - Desacato 03",
  "Art. 160 - Resistência a Prisão",
  "Art. 161 - Réu Reincidente",
  "Art. 162 - Cúmplice",
  "Art. 163 - Obstrução de Justiça",
  "Art. 164 - Ocultação de Provas",
  "Art. 165 - Vadiagem",
  "Art. 166 - Perturbação do Sossego Alheio",
  "Art. 167 - Calúnia, Injúria ou Difamação",
  "Art. 168 - Condução Imprudente",
  "Art. 169 - Dirigir na Contra Mão",
  "Art. 170 - Alta Velocidade",
  "Art. 171 - Poluição Sonora",
  "Art. 172 - Corridas Ilegais",
  "Art. 173 - Uso Excessivo de Insulfilm",
  "Art. 174 - Veículo Muito Danificado",
  "Art. 175 - Veiculo Ilegalmente Estacionado",
  "Art. 176 - Não Ceder Passagem a Viaturas",
  "Art. 177 - Impedir o Fluxo do Tráfego",
  "Art. 178 - Dano a Patrimônio Público",
];

motivos.forEach((motivo) => {
  const label = document.createElement("label");
  label.className = "flex items-center gap-2";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = motivo;

  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      motivosSelect.appendChild(new Option(motivo, motivo, true, true));
    } else {
      [...motivosSelect.options].forEach((opt) => {
        if (opt.value === motivo) opt.remove();
      });
    }
    updateMotivosPlaceholder();
  });

  label.appendChild(checkbox);
  label.appendChild(document.createTextNode(motivo));
  motivosList.appendChild(label);
});

function updateMotivosPlaceholder() {
  if (motivosSelect.options.length === 0) {
    motivosPlaceholder.textContent = "Clique para selecionar motivos";
    motivosPlaceholder.classList.add("text-gray-500");
  } else {
    motivosPlaceholder.textContent = [...motivosSelect.options]
      .map((opt) => opt.value)
      .join(", ");
    motivosPlaceholder.classList.remove("text-gray-500");
  }
}

motivosToggle.addEventListener("click", () => {
  motivosDropdown.classList.toggle("hidden");
});

clearMotivos.addEventListener("click", () => {
  [...motivosSelect.options].forEach((opt) => opt.remove());
  [...motivosList.querySelectorAll("input[type=checkbox]")].forEach(
    (chk) => (chk.checked = false)
  );
  updateMotivosPlaceholder();
});

document.addEventListener("click", (e) => {
  if (
    !motivosDropdown.contains(e.target) &&
    !motivosToggle.contains(e.target)
  ) {
    motivosDropdown.classList.add("hidden");
  }
});

// =====================
// Gerar Relatório
// =====================
const btnGeneratePrisao = document.getElementById("btnGeneratePrisao");

btnGeneratePrisao.addEventListener("click", () => {
  // Coletar QRA + Patente
  const qraFields = qraContainer.querySelectorAll(".qra-input");
  const patenteFields = qraContainer.querySelectorAll(".patente-input");

  let qras = [];
  qraFields.forEach((qra, i) => {
    const qraVal = qra.value.trim();
    const patenteVal = patenteFields[i]?.value.trim();
    if (qraVal && patenteVal) {
      qras.push(`👮 ${qraVal} — ${patenteVal}`);
    }
  });

  const nome = getValue("nomePreso");
  const rg = getValue("rgPreso");
  const idade = getValue("idadePreso");
  const local = getValue("localPrisao");
  const data = getValue("dataPrisao");
  const hora = getValue("horaPrisao");

  const pena = getValue("penaMeses");
  const multa = getValue("multaValor");
  const dinheiroSujo = getValue("dinheiroSujo");
  const porteArma = getValue("porteArma");
  const itens = getValue("itensApreendidos");

  // Atenuantes (checkboxes)
  const atenuantesMarcados = [
    ...document.querySelectorAll(".atenuanteItem:checked"),
  ].map((el) => el.value);

  const motivosSelecionados = [...motivosSelect.options].map((o) => o.value);

  // Foto obrigatória (pelo menos 1, mas pode ser só a primeira)
  const foto1 = document.getElementById("fotoPreso1").files[0];
  const foto2 = document.getElementById("fotoPreso2").files[0];

  // ✅ Regras de obrigatoriedade
  if (
    qras.length === 0 || // pelo menos 1 QRA+Patente obrigatório
    !nome ||
    !rg ||
    !idade ||
    !local ||
    !data ||
    !hora ||
    !pena ||
    !multa ||
    !porteArma ||
    motivosSelecionados.length === 0 ||
    !foto1 // Foto 1 obrigatória
  ) {
    alert("⚠️ Preencha todos os campos obrigatórios!");
    return;
  }

  // Preencher preview
  document.getElementById("outQra").innerHTML = qras
    .map((q) => `<div>${q}</div>`)
    .join("");
  document.getElementById("outNomePreso").textContent = nome;
  document.getElementById("outRgPreso").textContent = rg;
  document.getElementById("outIdadePreso").textContent = idade;
  document.getElementById("outLocalPrisao").textContent = local;
  document.getElementById("outDataPrisao").textContent = data;
  document.getElementById("outHoraPrisao").textContent = hora;
  document.getElementById("outPena").textContent = pena;
  document.getElementById("outMulta").textContent = multa;
  document.getElementById("outDinheiroSujo").textContent = dinheiroSujo || "-";
  document.getElementById("outAtenuantes").textContent =
    atenuantesMarcados.join(", ") || "-";
  document.getElementById("outPorteArma").textContent = porteArma;
  document.getElementById("outItens").textContent = itens || "-";

  // Motivos em linhas separadas
  document.getElementById("outMotivosPrisao").innerHTML = motivosSelecionados
    .map((m) => `<div>${m}</div>`)
    .join("");

  // Mostrar fotos
  if (foto1) {
    const reader1 = new FileReader();
    reader1.onload = (e) => {
      const outFoto1 = document.getElementById("outFotoPreso1");
      outFoto1.src = e.target.result;
      outFoto1.classList.remove("hidden");
    };
    reader1.readAsDataURL(foto1);
  }

  if (foto2) {
    const reader2 = new FileReader();
    reader2.onload = (e) => {
      const outFoto2 = document.getElementById("outFotoPreso2");
      outFoto2.src = e.target.result;
      outFoto2.classList.remove("hidden");
    };
    reader2.readAsDataURL(foto2);
  }
});

// =====================
// Imprimir relatório da direita (#reportPrisao)
// =====================
const btnPrintPrisao = document.getElementById("btnPrintPrisao");
if (btnPrintPrisao) {
  btnPrintPrisao.addEventListener("click", () => {
    const panel = document.getElementById("reportPrisao");
    if (!panel) {
      alert("⚠️ Relatório da direita não encontrado.");
      return;
    }

    const styleId = "temp-print-style-prisao";
    if (document.getElementById(styleId)) {
      document.getElementById(styleId).remove();
    }

    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      @media print {
        body * { visibility: hidden !important; }
        #${panel.id}, #${panel.id} * { visibility: visible !important; }
        #${panel.id} {
          position: absolute !important;
          left: 0; top: 0;
          width: 100%;
          background: white;
        }
      }
    `;
    document.head.appendChild(style);

    function cleanup() {
      const st = document.getElementById(styleId);
      if (st) st.remove();
      window.removeEventListener("afterprint", cleanup);
    }

    window.addEventListener("afterprint", cleanup);

    window.print();

    setTimeout(cleanup, 1500);
  });
}

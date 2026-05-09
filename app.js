const usuarioSalvo = localStorage.getItem("usuarioLogado");

if (!usuarioSalvo) {
  window.location.href = "login.html";
}

const dadosUsuario = JSON.parse(usuarioSalvo);

const usuarioLogado = {
  id: "eu",
  nome: dadosUsuario.nome,
  iniciais: dadosUsuario.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase(),
  cor: "#7f1d1d",
};

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "loginV2.html";
}

const contatos = [
  {
    id: 1,
    nome: "Ryry",
    iniciais: "RY",
    cor: "#1e3a5f",
    status: "online",
    tecnologias: ["Java", "Front-end"],
    ultimaMensagem: "E o lolzinho? Pode abrir um lolzinho?",
    horario: "09:00",
    naoLidas: 1,
  },
  {
    id: 2,
    nome: "Tetteo",
    iniciais: "TE",
    cor: "#1a3a2a",
    status: "away",
    tecnologias: ["Java", "MySQL"],
    ultimaMensagem: "Eu descobri, por meio de pesquisas intensas",
    horario: "11:20",
    naoLidas: 2,
  },
  {
    id: 3,
    nome: "Lian",
    iniciais: "LI",
    cor: "#3b1f5e",
    status: "offline",
    tecnologias: ["Java", "UI/UX"],
    ultimaMensagem: "Já bora",
    horario: "Ontem",
    naoLidas: 0,
  },
  {
    id: 4,
    nome: "Delly",
    iniciais: "IL",
    cor: "#5e1a3b",
    status: "online",
    tecnologias: ["HTML", "CSS", "JavaScript"],
    ultimaMensagem: "Bom dia, Marcelo! Seu crochê do Luffy está pronto! ❤️✨",
    horario: "08:45",
    naoLidas: 1,
  },
];

const historicoMensagens = {
  1: [
    {
      de: 1,
      texto: "E o lolzinho? Pode abrir um lolzinho?",
      hora: "09:00",
    },
  ],

  2: [
    {
      de: 2,
      texto: "Marcelo, quer saber de uma curiosidade muito interessante?",
      hora: "11:20",
    },
    {
      de: 2,
      texto:
        "Eu descobri, por meio de pesquisas intensas, que Java e Javascript não são a mesma coisa!",
      hora: "11:20",
    },
  ],

  3: [
    {
      de: 3,
      texto: "Já bora",
      hora: "Ontem",
    },
  ],

  4: [
    {
      de: 4,
      texto: "Bom dia, Marcelo! Seu crochê do Luffy, de One Piece, está pronto para entrega! ❤️✨",
      hora: "08:45",
    },
  ],
};

let contatoAtivo = null;
let contatosFiltrados = [...contatos];

const statusClasses = {
  online: "bg-green-500",
  away: "bg-yellow-400",
  offline: "bg-gray-500",
};

document.getElementById("nome-usuario").textContent = usuarioLogado.nome;

document.getElementById("header-avatar").textContent = usuarioLogado.iniciais;

function renderContatos(lista) {
  const ul = document.getElementById("contacts-list");
  const count = document.getElementById("contact-count");

  ul.innerHTML = "";
  count.textContent = lista.length;

  lista.forEach((c) => {
    const li = document.createElement("li");

    li.className = `
      flex items-center gap-3 px-3 py-3 rounded-lg
      cursor-pointer hover:bg-white/5 transition-all
    `;

    li.onclick = () => abrirChat(c.id);

    li.innerHTML = `
      <div
        class="w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-semibold"
        style="background:${c.cor}25;color:${c.cor};"
      >
        ${c.iniciais}
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <span class="text-white text-sm font-medium">
            ${c.nome}
          </span>

          <span class="text-white/25 text-xs font-mono">
            ${c.horario}
          </span>
        </div>

        <div class="flex items-center justify-between mt-0.5">
          <span class="text-white/35 text-xs truncate">
            ${c.ultimaMensagem}
          </span>

          <div
            class="w-2 h-2 rounded-full ${statusClasses[c.status]}"
          ></div>
        </div>
      </div>
    `;

    ul.appendChild(li);
  });
}

function abrirChat(id) {
  const contato = contatos.find((c) => c.id === id);

  if (!contato) return;

  contatoAtivo = contato;

  document.getElementById("empty-state").classList.add("hidden");
  document.getElementById("chat-area").classList.remove("hidden");
  document.getElementById("chat-area").classList.add("flex");

  document.getElementById("chat-name").textContent = contato.nome;

  const avatar = document.getElementById("chat-avatar");

  avatar.textContent = contato.iniciais;
  avatar.style.background = `${contato.cor}25`;
  avatar.style.color = contato.cor;

  document.getElementById("chat-status-dot").className =
    `w-2 h-2 rounded-full ${statusClasses[contato.status]}`;

  document.getElementById("chat-status-text").textContent = contato.status;

  document.getElementById("chat-tags").innerHTML = contato.tecnologias
    .map(
      (t) => `
          <span class="font-mono text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
            ${t}
          </span>
        `,
    )
    .join("");

  renderMensagens(id);
}

function renderMensagens(contatoId) {
  const lista = document.getElementById("messages-list");

  lista.innerHTML = "";

  (historicoMensagens[contatoId] || []).forEach((msg) => {
    adicionarMensagemNaTela(msg);
  });
}

function adicionarMensagemNaTela(msg) {
  const lista = document.getElementById("messages-list");

  const souEu = msg.de === "eu";

  const div = document.createElement("div");

  div.className = `
    flex ${souEu ? "justify-end" : "justify-start"}
  `;

  div.innerHTML = `
    <div
      class="max-w-[70%] px-4 py-3 rounded-2xl text-sm text-white animate-bubble
      ${
        souEu
          ? "bg-red-500/15 border border-red-500/20"
          : "bg-white/5 border border-white/10"
      }
      "
    >
      ${msg.texto}

      <div class="text-white/20 text-[10px] font-mono mt-2">
        ${msg.hora}
      </div>
    </div>
  `;

  lista.appendChild(div);

  lista.scrollTop = lista.scrollHeight;
}

function enviarMensagem() {
  const input = document.getElementById("message-input");

  const texto = input.value.trim();

  if (!texto || !contatoAtivo) return;

  const agora = new Date();

  const hora =
    agora.getHours().toString().padStart(2, "0") +
    ":" +
    agora.getMinutes().toString().padStart(2, "0");

  const msg = {
    de: "eu",
    texto,
    hora,
  };

  historicoMensagens[contatoAtivo.id].push(msg);

  adicionarMensagemNaTela(msg);

  input.value = "";
}

document.getElementById("search-input").addEventListener("input", function () {
  const termo = this.value.toLowerCase();

  contatosFiltrados = contatos.filter(
    (c) =>
      c.nome.toLowerCase().includes(termo) ||
      c.tecnologias.some((t) => t.toLowerCase().includes(termo)),
  );

  renderContatos(contatosFiltrados);
});

document
  .getElementById("message-input")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  });

renderContatos(contatos);

/* MINDFAX OPS — chat widget (auto-inject).
   Cria o botão + painel de chat em qualquer página onde for incluído
   via <script src="widget.js"></script>. Leva o visitante ao bot do
   Telegram com a primeira mensagem pré-preenchida (sem expor chave/backend). */
(function () {
  if (window.__MINDFAX_WIDGET__) return; /* evita duplicar */
  window.__MINDFAX_WIDGET__ = true;

  var BOT = "t.me/mindfax_ops_bot";

  var style = document.createElement("style");
  style.textContent = [
    ".mfx-chat-fab{" +
      "position:fixed;right:22px;bottom:22px;z-index:9999;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;" +
      "background:radial-gradient(circle at 30% 30%,#65e3c2,#1f9c6e);box-shadow:0 8px 24px rgba(0,0,0,.35);" +
      "display:flex;align-items:center;justify-content:center;transition:transform .2s;}" +
    ".mfx-chat-fab:hover{transform:scale(1.06)}" +
    ".mfx-chat-fab svg{width:30px;height:30px;fill:#06231a}" +
    ".mfx-chat-panel{" +
      "position:fixed;right:22px;bottom:92px;z-index:9999;width:330px;max-width:calc(100vw - 40px);" +
      "background:#0b1214;border:1px solid #1e2a2e;border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.55);" +
      "display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}" +
    ".mfx-chat-panel.open{display:flex}" +
    ".mfx-chat-head{background:#0f1a1c;padding:14px 16px;border-bottom:1px solid #1e2a2e;display:flex;align-items:center;gap:10px}" +
    ".mfx-chat-head .dot{width:9px;height:9px;border-radius:50%;background:#4fd1a5;box-shadow:0 0 8px #4fd1a5}" +
    ".mfx-chat-head b{font-size:14px;color:#e8f4ee}.mfx-chat-head .sub{display:block;font-size:11px;color:#7f9a8d}" +
    ".mfx-chat-body{padding:14px 16px;min-height:110px;max-height:230px;overflow-y:auto;font-size:13.5px;color:#cfdfd7;line-height:1.5}" +
    ".mfx-chat-msg{background:#14211d;border:1px solid #1f332b;border-radius:12px;padding:10px 12px;margin-bottom:8px}" +
    ".mfx-chat-msg b{color:#5ee0be}" +
    ".mfx-chat-input{display:flex;gap:8px;padding:10px;border-top:1px solid #1e2a2e;background:#0d1517}" +
    ".mfx-chat-input input{flex:1;background:#162226;border:1px solid #22333a;border-radius:10px;color:#e8f4ee;padding:10px 12px;font-size:13px;outline:none}" +
    ".mfx-chat-input button{background:radial-gradient(circle at 30% 30%,#5ee0be,#1f9c6e);border:none;color:#03180f;font-weight:700;border-radius:10px;padding:0 18px;cursor:pointer;font-size:13px}" +
    ".mfx-chat-note{font-size:10.5px;color:#5c7367;text-align:center;padding:6px;border-top:1px solid #131e21}"
  ].join("");
  document.head.appendChild(style);

  function h() {
    var d = document.createElement("button");
    d.className = "mfx-chat-fab"; d.id = "mfxFab"; d.setAttribute("aria-label", "Chat com a MINDFAX OPS");
    d.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3C7 3 3 7.03 3 12c0 2 .7 3.8 1.9 5.2L3 21l4-1.5c1.3.7 2.8 1 4 1 5 0 9-4 9-8.5S17 3 12 3z"/></svg>';
    return d;
  }
  function panel() {
    var p = document.createElement("div"); p.className = "mfx-chat-panel"; p.id = "mfxPanel";
    p.innerHTML =
      '<div class="mfx-chat-head"><span class="dot"></span><span><b>MINDFAX OPS</b><span class="sub">assistente de IA · online</span></span></div>' +
      '<div class="mfx-chat-body"><div class="mfx-chat-msg">Olá 👋 Sou a IA da <b>MINDFAX OPS</b>. Construímos e operamos agentes de IA que assumem o trabalho repetitivo de agências e consultorias.<br><br>Escreva abaixo o que você quer resolver — eu preparo a conversa 👇</div></div>' +
      '<div class="mfx-chat-input"><input id="mfxInput" placeholder="Ex.: quero automatizar meus relatórios" aria-label="Sua mensagem"/><button id="mfxSend">Ir</button></div>' +
      '<div class="mfx-chat-note">Você é atendido pelo nosso assistente no Telegram — sem baixar nada, sem cadastro.</div>';
    return p;
  }
  var fab = h(), pan = panel();
  document.body.appendChild(fab); document.body.appendChild(pan);

  var input = document.getElementById("mfxInput"), send = document.getElementById("mfxSend");
  fab.addEventListener("click", function (e) { e.stopPropagation(); pan.classList.toggle("open"); if (pan.classList.contains("open")) input.focus(); });
  function go() {
    var txt = (input.value || "").trim();
    if (!txt) { input.focus(); return; }
    window.open("https://" + BOT + "?text=" + encodeURIComponent(txt), "_blank");
    input.value = ""; pan.classList.remove("open");
  }
  send.addEventListener("click", go);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
})();

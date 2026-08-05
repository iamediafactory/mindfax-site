/* MINDFAX OPS — chat widget (auto-inject).
   Ao escrever, oferece os 3 canais de atendimento: Telegram (pref.),
   WhatsApp e E-mail. Quem não tem Telegram usa WhatsApp/E-mail.
   Sem expor chave/backend na página. */
(function () {
  if (window.__MINDFAX_WIDGET__) return;
  window.__MINDFAX_WIDGET__ = true;

  var BOT = "t.me/mindfax_ops_bot";
  var WHATSAPP_NUM = "5561996138513"; /* troque pelo número oficial do atendimento */
  var EMAIL_TO = "iamediafactory.studio@gmail.com";

  var style = document.createElement("style");
  style.textContent = [
    ".mfx-chat-fab{position:fixed;right:22px;bottom:22px;z-index:9999;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;background:radial-gradient(circle at 30% 30%,#65e3c2,#1f9c6e);box-shadow:0 8px 24px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;transition:transform .2s}",
    ".mfx-chat-fab:hover{transform:scale(1.06)}",
    ".mfx-chat-fab svg{width:30px;height:30px;fill:#06231a}",
    ".mfx-chat-panel{position:fixed;right:22px;bottom:92px;z-index:9999;width:340px;max-width:calc(100vw - 40px);background:#0b1214;border:1px solid #1e2a2e;border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.55);display:none;flex-direction:column;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}",
    ".mfx-chat-panel.open{display:flex}",
    ".mfx-chat-head{background:#0f1a1c;padding:14px 16px;border-bottom:1px solid #1e2a2e;display:flex;align-items:center;gap:10px}",
    ".mfx-chat-head .dot{width:9px;height:9px;border-radius:50%;background:#4fd1a5;box-shadow:0 0 8px #4fd1a5}",
    ".mfx-chat-head b{font-size:14px;color:#e8f4ee}.mfx-chat-head .sub{display:block;font-size:11px;color:#7f9a8d}",
    ".mfx-chat-body{padding:14px 16px;min-height:110px;max-height:230px;overflow-y:auto;font-size:13.5px;color:#cfdfd7;line-height:1.5}",
    ".mfx-chat-msg{background:#14211d;border:1px solid #1f332b;border-radius:12px;padding:10px 12px;margin-bottom:8px}",
    ".mfx-chat-msg b{color:#5ee0be}",
    ".mfx-chat-input{display:flex;gap:8px;padding:10px;border-top:1px solid #1e2a2e;background:#0d1517}",
    ".mfx-chat-input input{flex:1;background:#162226;border:1px solid #22333a;border-radius:10px;color:#e8f4ee;padding:10px 12px;font-size:13px;outline:none}",
    ".mfx-chat-input button{background:radial-gradient(circle at 30% 30%,#5ee0be,#1f9c6e);border:none;color:#03180f;font-weight:700;border-radius:10px;padding:0 18px;cursor:pointer;font-size:13px}",
    ".mfx-channels{display:flex;flex-direction:column;gap:8px;padding:10px 14px;border-top:1px solid #1e2a2e;background:#0d1517}",
    ".mfx-channels .tl{font-size:11px;color:#7f9a8d;text-align:center}",
    ".mfx-channel{display:flex;align-items:center;gap:9px;background:#14211d;border:1px solid #1f332b;border-radius:10px;padding:10px 12px;color:#e8f4ee;font-size:13px;cursor:pointer;text-align:left;width:100%;font-family:inherit}",
    ".mfx-channel:hover{border-color:#2f4a3d}",
    ".mfx-channel svg{width:18px;height:18px;flex:none}",
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
      '<div class="mfx-chat-body"><div class="mfx-chat-msg">Olá 👋 Sou a IA da <b>MINDFAX OPS</b>. Construímos e operamos agentes de IA que assumem o trabalho repetitivo de agências e consultorias.<br><br>Escreva abaixo o que você quer resolver — e escolha por onde prefere ser atendido 👇</div></div>' +
      '<div class="mfx-chat-input"><input id="mfxInput" placeholder="Ex.: quero automatizar meus relatórios" aria-label="Sua mensagem"/><button id="mfxSend">Ir</button></div>' +
      '<div class="mfx-channels" id="mfxChannels" style="display:none">' +
        '<div class="tl">Escolha por onde continuar:</div>' +
        '<button class="mfx-channel" data-ch="telegram"><svg viewBox="0 0 24 24" fill="#4fd1a5"><path d="M9.7 15.3 9.2 19c.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l3.3-15.6c.3-1.3-.5-1.8-1.3-1.5L1.2 9.6c-1.3.5-1.3 1.2-.2 1.5l4.9 1.5 11.3-7.1c.5-.3 1-.2.6.2z"/></svg><span>Telegram (preferencial)</span></button>' +
        '<button class="mfx-channel" data-ch="whatsapp"><svg viewBox="0 0 24 24" fill="#5ee0be"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.4A10 10 0 1 0 12 2zm4.7 14.2c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .2-1.6-.1-.4-.2-.9-.4-1.5-.9-1.3-1.1-2.7-3-3-4-.1-.5-.1-1 .2-1.4.2-.3.5-.7.9-1 .2-.3.3-.5.4-.8 0-.3 0-.6-.2-1-.3-.6-.6-1.2-1-1.6-.3-.4-.8-.6-1.2-.6h-.8c-.3 0-.8.1-1.2.5-.4.4-1.5 1.4-1.5 3.4s1.6 4 1.8 4.3c.2.3 3.1 4.7 7.5 6.6 4.4 1.9 4.4 1.2 5.2 1.1.8-.1 1.3-.3 1.5-.6.2-.3.2-.9 0-.7z"/></svg><span>WhatsApp</span></button>' +
        '<button class="mfx-channel" data-ch="email"><svg viewBox="0 0 24 24" fill="#e8f4ee"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.5l-8 5-8-5V6h16zm0 12H4V8.9l8 5 8-5V18z"/></svg><span>E-mail</span></button>' +
      '</div>' +
      '<div class="mfx-chat-note">Sem cadastro — você escolhe o canal que preferir.</div>';
    return p;
  }
  var fab = h(), pan = panel();
  document.body.appendChild(fab); document.body.appendChild(pan);

  var input = document.getElementById("mfxInput"), send = document.getElementById("mfxSend"), chans = document.getElementById("mfxChannels");
  fab.addEventListener("click", function (e) { e.stopPropagation(); pan.classList.toggle("open"); if (pan.classList.contains("open")) input.focus(); });

  function openChannel(ch, txt) {
    var msg = encodeURIComponent("MinDFAX OPS: " + txt);
    var url = "";
    if (ch === "telegram") url = "https://" + BOT + "?text=" + msg;
    else if (ch === "whatsapp") url = "https://wa.me/" + WHATSAPP_NUM + "?text=" + msg;
    else url = "mailto:" + EMAIL_TO + "?subject=" + encodeURIComponent("Atendimento MINDFAX OPS") + "&body=" + msg;
    window.open(url, "_blank");
    pan.classList.remove("open"); input.value = "";
  }

  function go() {
    var txt = (input.value || "").trim();
    if (!txt) { input.focus(); return; }
    chans.style.display = "flex"; /* mostra os 3 canais */
  }
  send.addEventListener("click", go);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  chans.addEventListener("click", function (e) {
    var b = e.target.closest(".mfx-channel");
    if (!b) return;
    var txt = (input.value || "").trim() || "Quero automatizar minhas operações";
    openChannel(b.getAttribute("data-ch"), txt);
  });
})();


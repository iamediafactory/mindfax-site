/* MINDFAX OPS — chat widget embutido (conversa no próprio site).
   Chama um endpoint seguro (Cloudflare Worker) que guarda a chave Gemini.
   Se o endpoint não estiver acessível, oferece os canais (Telegram/WhatsApp/E-mail).
   Sem expor chave/backend. */
(function () {
  if (window.__MINDFAX_WIDGET__) return;
  window.__MINDFAX_WIDGET__ = true;

  var ENDPOINT = "/chat"; // será prefixado com o domínio do worker (ver CHAT_URL)
  var CHAT_URL = "https://mindfax-chat.iamediafactory-studio.workers.dev"; // worker do chat (Cloudflare)
  var BOT = "t.me/mindfax_ops_bot";
  var WHATSAPP_NUM = "5561996138513";
  var EMAIL_TO = "iamediafactory.studio@gmail.com";

  var style = document.createElement("style");
  style.textContent = [
    ".mfx-chat-fab{position:fixed;right:22px;bottom:22px;z-index:9999;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;background:radial-gradient(circle at 30% 30%,#65e3c2,#1f9c6e);box-shadow:0 8px 24px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;transition:transform .2s}",
    ".mfx-chat-fab:hover{transform:scale(1.06)}",
    ".mfx-chat-fab svg{width:30px;height:30px;fill:#06231a}",
    ".mfx-chat-panel{position:fixed;right:22px;bottom:92px;z-index:9999;width:360px;max-width:calc(100vw - 40px);height:min(480px,80vh);display:none;flex-direction:column;background:#0b1214;border:1px solid #1e2a2e;border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.55);overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}",
    ".mfx-chat-panel.open{display:flex}",
    ".mfx-chat-head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:#0f1a1c;border-bottom:1px solid #1e2a2e}",
    ".mfx-chat-head .dot{width:9px;height:9px;border-radius:50%;background:#4fd1a5;box-shadow:0 0 8px #4fd1a5}",
    ".mfx-chat-head b{font-size:14px;color:#e8f4ee}.mfx-chat-head .sub{display:block;font-size:11px;color:#7f9a8d}",
    ".mfx-log{flex:1;overflow-y:auto;padding:14px 14px 6px;display:flex;flex-direction:column;gap:8px;font-size:13.5px}",
    ".mfx-b{max-width:82%;padding:9px 12px;border-radius:12px;line-height:1.45;white-space:pre-wrap}",
    ".mfx-b.ai{background:#14211d;border:1px solid #1f332b;color:#cfdfd7;align-self:flex-start}",
    ".mfx-b.you{background:#183a2e;color:#e8f4ee;align-self:flex-end}",
    ".mfx-b.ai b{color:#5ee0be}",
    ".mfx-typing{color:#5c7367;font-size:12px;padding:0 14px}",
    ".mfx-bar{display:flex;gap:8px;padding:10px;border-top:1px solid #1e2a2e;background:#0d1517}",
    ".mfx-bar input{flex:1;background:#162226;border:1px solid #22333a;border-radius:10px;color:#e8f4ee;padding:9px 12px;font-size:13px;outline:none}",
    ".mfx-bar button{background:radial-gradient(circle at 30% 30%,#5ee0be,#1f9c6e);border:none;color:#03180f;font-weight:700;border-radius:10px;padding:0 16px;cursor:pointer;font-size:13px}",
    ".mfx-channels{display:flex;flex-direction:column;gap:8px;padding:10px 14px;border-top:1px solid #1e2a2e;background:#0d1517}",
    ".mfx-channels .tl{font-size:11px;color:#7f9a8d;text-align:center}",
    ".mfx-channel{display:flex;align-items:center;gap:9px;background:#14211d;border:1px solid #1f332b;border-radius:10px;padding:10px 12px;color:#e8f4ee;font-size:13px;cursor:pointer;text-align:left;width:100%;font-family:inherit}",
    ".mfx-channel:hover{border-color:#2f4a3d}",
    ".mfx-channel span{flex:1}",
    ".mfx-note{font-size:10.5px;color:#5c7367;text-align:center;padding:6px;border-top:1px solid #131e21}",
    ".mfx-note a{color:#4fd1a5;text-decoration:none;margin:0 3px}.mfx-note a:hover{text-decoration:underline}",
    ".mfx-hero{padding:8px 16px;background:radial-gradient(300px 60px at 50% 0%,rgba(79,209,165,.18),transparent 75%);font-size:13.5px;color:#e8f4ee;border-bottom:1px solid #14211d}",
    ".mfx-hero span{display:block;font-size:11.5px;color:#7f9a8d}"
  ].join("");
  document.head.appendChild(style);

  // Cria FAB
  var fab = document.createElement("button");
  fab.className = "mfx-chat-fab"; fab.setAttribute("aria-label", "Chat com a MINDFAX OPS");
  fab.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 3C7 3 3 7.03 3 12c0 2 .7 3.8 1.9 5.2L3 21l4-1.5c1.3.7 2.8 1 4 1 5 0 9-4 9-8.5S17 3 12 3z"/></svg>';
  document.body.appendChild(fab);

  var pan = document.createElement("div");
  pan.className = "mfx-chat-panel";
  pan.innerHTML =
    '<div class="mfx-chat-head"><span class="dot"></span><span><b>MINDFAX OPS</b><span class="sub">AI assistant · online</span></span></div>' +
    '<div class="mfx-hero">Chat with us — right here 👇 <span>instant replies, no setup</span></div>' +
    '<div class="mfx-log" id="mfxLog"><div class="mfx-b ai"><b>👋 Welcome to MINDFAX OPS</b><br>We build AI agents that run the repetitive work of agencies and consultancies.<br><br>Please choose your preferred language to continue: <b>English · Español · Português</b></div></div>' +
    '<div class="mfx-bar"><input id="mfxInput" placeholder="Type your message…" aria-label="Message"/><button id="mfxSend">Send</button></div>' +
    '<div class="mfx-note">Prefer another channel? <a href="https://t.me/mindfax_ops_bot" target="_blank" rel="noopener">Telegram</a> · <a href="https://wa.me/5561996138513" target="_blank" rel="noopener">WhatsApp</a> · <a href="mailto:iamediafactory.studio@gmail.com">Email</a></div>';
  document.body.appendChild(pan);

  var log = document.getElementById("mfxLog");
  var input = document.getElementById("mfxInput");
  var send = document.getElementById("mfxSend");
  var history = [];

  function push(role, text) {
    var d = document.createElement("div");
    d.className = "mfx-b " + (role === "assistant" ? "ai" : "you");
    d.innerHTML = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }
  function buf() { var d = document.createElement("div"); d.className = "mfx-typing"; d.id = "mfxTyping"; d.textContent = "IA está digitando…"; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }

  function fallbackChannels(txt) {
    var c = document.createElement("div"); c.className = "mfx-channels";
    c.innerHTML = '<div class="tl">Prefer to continue on another channel?</div>' +
      '<button class="mfx-channel" data-c="t"><span>💬 Telegram</span></button>' +
      '<button class="mfx-channel" data-c="w"><span>💬 WhatsApp</span></button>' +
      '<button class="mfx-channel" data-c="e"><span>📧 Email</span></button>';
    log.appendChild(c);
    c.addEventListener("click", function (e) {
      var b = e.target.closest(".mfx-channel"); if (!b) return;
      var msg = encodeURIComponent("MinDFAX OPS: " + txt);
      var u = b.getAttribute("data-c") === "t" ? "https://" + BOT + "?text=" + msg
             : b.getAttribute("data-c") === "w" ? "https://wa.me/" + WHATSAPP_NUM + "?text=" + msg
             : "mailto:" + EMAIL_TO + "?subject=" + encodeURIComponent("Atendimento MINDFAX OPS") + "&body=" + msg;
      window.open(u, "_blank");
    });
  }

  async function ask() {
    var txt = (input.value || "").trim();
    if (!txt) { input.focus(); return; }
    input.value = "";
    push("user", txt.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\n/g,"<br>"));
    history.push({ role: "user", text: txt });
    var ty = buf();
    try {
      var r = await fetch(CHAT_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: txt, history: history.slice(0, -1) }) });
      var j = await r.json();
      ty.remove();
      if (j.ok) {
        push("assistant", (j.reply || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\n/g,"<br>"));
        history.push({ role: "assistant", text: j.reply || "" });
      } else {
        push("assistant", "Não consegui responder por aqui no momento. Se preferir, siga por um canal abaixo:");
        fallbackChannels(txt);
      }
    } catch (err) {
      ty.remove();
      push("assistant", "Por aqui estou tendo instabilidade. Posso te atender por um canal abaixo:");
      fallbackChannels(txt);
    }
  }

  fab.addEventListener("click", function () { pan.classList.toggle("open"); if (pan.classList.contains("open")) input.focus(); });
  send.addEventListener("click", ask);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") ask(); });
})();


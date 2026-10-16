// Allow Copy & Native AI Assistant
(function () {
  "use strict";

  if (window.top !== window.self) return;
  if (document.getElementById("__allow_copy_ai_assistant_root__")) return;

  function initOverlay() {
    if (document.getElementById("__allow_copy_ai_assistant_root__")) return;

    const host = document.createElement("div");
    host.id = "__allow_copy_ai_assistant_root__";
    host.style.cssText = "all: initial; position: absolute; z-index: 2147483647; top: 0; left: 0;";

    const shadow = host.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }

      /* Floating Launcher - Transparent by default, light glow on hover only */
      #ai-launcher {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(24, 24, 27, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.14);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.3;
        transition: opacity 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
        user-select: none;
        z-index: 2147483647;
      }

      #ai-launcher:hover {
        opacity: 0.85;
        border-color: rgba(255, 255, 255, 0.35);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      }

      #ai-launcher:active {
        transform: scale(0.94);
      }

      #ai-launcher svg {
        width: 20px;
        height: 20px;
        fill: rgba(255, 255, 255, 0.7);
        transition: fill 0.3s ease;
      }

      #ai-launcher:hover svg {
        fill: #ffffff;
      }

      /* Floating Chat Window - Default Compact Small Size */
      #ai-window {
        position: fixed;
        bottom: 78px;
        right: 20px;
        width: 350px;
        height: 480px;
        min-width: 280px;
        min-height: 340px;
        max-width: calc(100vw - 24px);
        max-height: calc(100vh - 90px);
        background: #18181b;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 14px;
        box-shadow: 0 20px 48px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.05);
        display: none;
        flex-direction: column;
        overflow: hidden;
        resize: both;
        z-index: 2147483647;
      }

      #ai-window.active {
        display: flex;
        animation: acFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }

      #ai-window.expanded {
        width: 440px;
        height: 600px;
      }

      @keyframes acFadeIn {
        from {
          opacity: 0;
          transform: translateY(10px) scale(0.97);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Header */
      #window-header {
        height: 40px;
        min-height: 40px;
        background: #121214;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        cursor: grab;
        user-select: none;
      }

      #window-header:active {
        cursor: grabbing;
      }

      .header-title-group {
        display: flex;
        align-items: center;
        gap: 7px;
      }

      .header-title-group svg {
        width: 17px;
        height: 17px;
        fill: #10a37f;
      }

      .header-title {
        color: #fafafa;
        font-size: 13px;
        font-weight: 600;
        letter-spacing: -0.2px;
      }

      .header-badge {
        color: #10a37f;
        font-size: 9.5px;
        font-weight: 600;
        background: rgba(16, 163, 127, 0.15);
        padding: 1px 5px;
        border-radius: 4px;
        border: 1px solid rgba(16, 163, 127, 0.25);
      }

      .header-shortcut {
        color: #71717a;
        font-size: 10px;
        font-weight: 500;
        background: rgba(255, 255, 255, 0.06);
        padding: 1px 5px;
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .header-controls {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .ctrl-btn {
        width: 24px;
        height: 24px;
        border-radius: 5px;
        background: transparent;
        border: none;
        color: #a1a1aa;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s ease, color 0.15s ease;
      }

      .ctrl-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }

      .ctrl-btn svg {
        width: 13px;
        height: 13px;
        stroke: currentColor;
        stroke-width: 2;
        fill: none;
      }

      /* Messages Area */
      #chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: #18181b;
        scroll-behavior: smooth;
      }

      #chat-messages::-webkit-scrollbar {
        width: 5px;
      }

      #chat-messages::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 3px;
      }

      .welcome-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 12px;
        text-align: center;
        color: #a1a1aa;
        font-size: 12px;
        line-height: 1.45;
        margin-top: 6px;
      }

      .welcome-card h4 {
        color: #f4f4f5;
        font-size: 13px;
        margin-bottom: 4px;
      }

      .chips-row {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 8px;
        justify-content: center;
      }

      .chip-btn {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        color: #d4d4d8;
        font-size: 10.5px;
        padding: 3px 8px;
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .chip-btn:hover {
        background: rgba(16, 163, 127, 0.2);
        border-color: rgba(16, 163, 127, 0.4);
        color: #ffffff;
      }

      /* Message Bubbles */
      .msg-row {
        display: flex;
        width: 100%;
      }

      .msg-row.user {
        justify-content: flex-end;
      }

      .msg-row.assistant {
        justify-content: flex-start;
      }

      .msg-bubble {
        max-width: 88%;
        padding: 8px 12px;
        border-radius: 12px;
        font-size: 13px;
        line-height: 1.45;
        word-break: break-word;
      }

      .msg-row.user .msg-bubble {
        background: #2563eb;
        color: #ffffff;
        border-bottom-right-radius: 3px;
      }

      .msg-row.assistant .msg-bubble {
        background: #27272a;
        color: #f4f4f5;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-bottom-left-radius: 3px;
      }

      .msg-bubble pre {
        background: #141416;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 8px;
        margin: 6px 0;
        overflow-x: auto;
        font-family: monospace;
        font-size: 11.5px;
        color: #38bdf8;
      }

      .msg-bubble code {
        font-family: monospace;
        background: rgba(255, 255, 255, 0.1);
        padding: 1px 4px;
        border-radius: 4px;
        font-size: 11.5px;
      }

      /* Typing Animation */
      .typing-indicator {
        display: none;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        background: #27272a;
        border-radius: 12px;
        width: fit-content;
        border: 1px solid rgba(255, 255, 255, 0.08);
      }

      .typing-dot {
        width: 5px;
        height: 5px;
        background: #10a37f;
        border-radius: 50%;
        animation: typingBounce 1.2s infinite ease-in-out;
      }

      .typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .typing-dot:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typingBounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40% { transform: translateY(-4px); opacity: 1; }
      }

      /* Input Area */
      #chat-footer {
        padding: 10px;
        background: #141416;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .input-row {
        display: flex;
        align-items: flex-end;
        gap: 6px;
        background: #202024;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 10px;
        padding: 6px 10px;
      }

      .input-row:focus-within {
        border-color: #10a37f;
      }

      #prompt-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #fafafa;
        font-size: 13px;
        line-height: 1.4;
        resize: none;
        max-height: 100px;
        min-height: 18px;
      }

      #prompt-input::placeholder {
        color: #71717a;
      }

      #send-btn {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: #10a37f;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        transition: opacity 0.15s ease, transform 0.15s ease;
      }

      #send-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      #send-btn:not(:disabled):hover {
        transform: scale(1.05);
      }

      #send-btn svg {
        width: 14px;
        height: 14px;
        fill: currentColor;
      }

      .footer-sub {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2px;
        font-size: 10px;
        color: #71717a;
      }
    `;

    shadow.appendChild(style);

    const isMac = /Mac/i.test(navigator.userAgentData?.platform || navigator.platform);
    const shortcutLabel = isMac ? "⌥C" : "Alt+C";

    // Launcher button
    const launcher = document.createElement("div");
    launcher.id = "ai-launcher";
    launcher.title = "AI Assistant (" + shortcutLabel + ")";
    launcher.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.2-1.31C8.6 21.49 10.25 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
      </svg>
    `;

    // Window
    const win = document.createElement("div");
    win.id = "ai-window";
    win.innerHTML = `
      <div id="window-header">
        <div class="header-title-group">
          <svg viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.2-1.31C8.6 21.49 10.25 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
          </svg>
          <span class="header-title">AI Assistant</span>
          <span class="header-badge">GPT-4o-mini</span>
          <span class="header-shortcut">${shortcutLabel}</span>
        </div>
        <div class="header-controls">
          <button class="ctrl-btn" id="btn-popout" title="Open in separate small window">
            <svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
          </button>
          <button class="ctrl-btn" id="btn-toggle-size" title="Toggle size">
            <svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
          </button>
          <button class="ctrl-btn" id="btn-clear" title="Clear chat">
            <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
          <button class="ctrl-btn" id="btn-close" title="Close">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <div id="chat-messages">
        <div class="welcome-card" id="welcome-card">
          <h4>👋 AI Assistant Ready</h4>
          <p>Ask anything while browsing or in full screen. Free & no login.</p>
          <div class="chips-row">
            <button class="chip-btn" data-prompt="Summarize this topic">Summarize</button>
            <button class="chip-btn" data-prompt="Explain this simply">Explain simply</button>
            <button class="chip-btn" data-prompt="Write a professional message">Write email</button>
          </div>
        </div>

        <div class="typing-indicator" id="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>

      <div id="chat-footer">
        <div class="input-row">
          <textarea id="prompt-input" rows="1" placeholder="Ask a question... (Enter to send)"></textarea>
          <button id="send-btn" title="Send message">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
        <div class="footer-sub">
          <span>Shift+Enter for newline</span>
          <span>${shortcutLabel} to toggle</span>
        </div>
      </div>
    `;

    shadow.appendChild(launcher);
    shadow.appendChild(win);

    // Fullscreen support
    function attachHostToCurrentContext() {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
      const targetParent = fsEl || document.body || document.documentElement;
      if (host.parentElement !== targetParent) {
        targetParent.appendChild(host);
      }
    }

    attachHostToCurrentContext();
    document.addEventListener("fullscreenchange", attachHostToCurrentContext);
    document.addEventListener("webkitfullscreenchange", attachHostToCurrentContext);
    document.addEventListener("mozfullscreenchange", attachHostToCurrentContext);

    // Chat Logic
    const messagesEl = shadow.getElementById("chat-messages");
    const welcomeCard = shadow.getElementById("welcome-card");
    const typingIndicator = shadow.getElementById("typing-indicator");
    const promptInput = shadow.getElementById("prompt-input");
    const sendBtn = shadow.getElementById("send-btn");

    let history = [
      { role: "system", content: "You are a concise, helpful AI assistant built into a browser extension. Keep answers clear, accurate, and direct." }
    ];

    function toggleWindow() {
      if (win.classList.contains("active")) {
        win.classList.remove("active");
      } else {
        win.classList.add("active");
        promptInput.focus();
      }
    }

    launcher.addEventListener("click", toggleWindow);
    shadow.getElementById("btn-close").addEventListener("click", () => win.classList.remove("active"));
    shadow.getElementById("btn-toggle-size").addEventListener("click", () => win.classList.toggle("expanded"));
    shadow.getElementById("btn-popout").addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "open_small_window" });
      win.classList.remove("active");
    });

    shadow.getElementById("btn-clear").addEventListener("click", () => {
      history = [
        { role: "system", content: "You are a concise, helpful AI assistant built into a browser extension. Keep answers clear, accurate, and direct." }
      ];
      messagesEl.innerHTML = "";
      messagesEl.appendChild(welcomeCard);
      messagesEl.appendChild(typingIndicator);
    });

    // Auto-growing textarea
    promptInput.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 100) + "px";
    });

    function formatText(text) {
      let escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      escaped = escaped.replace(/```([a-z]*)\n([\s\S]*?)```/gi, (match, lang, code) => {
        return `<pre><code>${code.trim()}</code></pre>`;
      });

      escaped = escaped.replace(/`([^`]+)`/g, "<code>$1</code>");
      escaped = escaped.replace(/\n/g, "<br>");
      return escaped;
    }

    function addMessage(role, text) {
      if (welcomeCard && welcomeCard.parentElement) {
        welcomeCard.remove();
      }

      const row = document.createElement("div");
      row.className = `msg-row ${role}`;

      const bubble = document.createElement("div");
      bubble.className = "msg-bubble";
      bubble.innerHTML = formatText(text);

      row.appendChild(bubble);
      messagesEl.insertBefore(row, typingIndicator);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function sendMessage(text) {
      const q = text || promptInput.value.trim();
      if (!q) return;

      addMessage("user", q);
      history.push({ role: "user", content: q });

      promptInput.value = "";
      promptInput.style.height = "auto";
      sendBtn.disabled = true;

      typingIndicator.style.display = "flex";
      messagesEl.scrollTop = messagesEl.scrollHeight;

      chrome.runtime.sendMessage(
        { action: "ai_query", messages: history },
        (response) => {
          typingIndicator.style.display = "none";
          sendBtn.disabled = false;

          if (response && response.success && response.text) {
            const answer = response.text.trim();
            addMessage("assistant", answer);
            history.push({ role: "assistant", content: answer });
          } else {
            const errMsg = response?.error || "Unable to reach AI assistant. Please check your network.";
            addMessage("assistant", "⚠️ " + errMsg);
          }
          messagesEl.scrollTop = messagesEl.scrollHeight;
        }
      );
    }

    sendBtn.addEventListener("click", () => sendMessage());

    promptInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Preset Chip Buttons
    shadow.addEventListener("click", (e) => {
      if (e.target.classList.contains("chip-btn")) {
        const p = e.target.getAttribute("data-prompt");
        if (p) sendMessage(p);
      }
    });

    // Keyboard shortcut: Alt + C (Windows) or Option + C (Mac)
    window.addEventListener("keydown", (e) => {
      if (e.altKey && (e.key === "c" || e.key === "C" || e.code === "KeyC")) {
        e.preventDefault();
        toggleWindow();
      }
    });

    // Popup Communication
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request && request.action === "toggle_chatgpt") {
        toggleWindow();
        sendResponse({ success: true });
      }
    });

    // Draggable Header
    const header = shadow.getElementById("window-header");
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialWinX = 0;
    let initialWinY = 0;

    header.addEventListener("mousedown", (e) => {
      if (e.target.closest(".ctrl-btn")) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      const rect = win.getBoundingClientRect();
      initialWinX = rect.left;
      initialWinY = rect.top;

      win.style.bottom = "auto";
      win.style.right = "auto";
      win.style.left = initialWinX + "px";
      win.style.top = initialWinY + "px";

      e.preventDefault();
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      let newX = initialWinX + dx;
      let newY = initialWinY + dy;

      newX = Math.max(10, Math.min(window.innerWidth - win.offsetWidth - 10, newX));
      newY = Math.max(10, Math.min(window.innerHeight - win.offsetHeight - 10, newY));

      win.style.left = newX + "px";
      win.style.top = newY + "px";
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOverlay);
  } else {
    initOverlay();
  }
})();
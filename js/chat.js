(function () {
  "use strict";

  const messagesEl = document.getElementById("chat-messages");
  const welcomeCard = document.getElementById("welcome-card");
  const typingIndicator = document.getElementById("typing-indicator");
  const promptInput = document.getElementById("prompt-input");
  const sendBtn = document.getElementById("send-btn");
  const clearBtn = document.getElementById("btn-clear");

  let history = [
    { role: "system", content: "You are a concise, helpful AI assistant built into a browser extension. Keep answers clear, accurate, and direct." }
  ];

  promptInput.focus();

  promptInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 100) + "px";
  });

  clearBtn.addEventListener("click", () => {
    history = [
      { role: "system", content: "You are a concise, helpful AI assistant built into a browser extension. Keep answers clear, accurate, and direct." }
    ];
    messagesEl.innerHTML = "";
    if (welcomeCard) messagesEl.appendChild(welcomeCard);
    messagesEl.appendChild(typingIndicator);
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

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("chip-btn")) {
      const p = e.target.getAttribute("data-prompt");
      if (p) sendMessage(p);
    }
  });
})();

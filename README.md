# Allow Copy, Disable Page Visibility & AI Assistant (`allow-copy-disable-visibility-ai-assistant`)

A Manifest V3 Chrome Extension that re-enables copy/paste and right-click menus, disables page visibility & blur tracking (anti-tab-switch detection), and provides a built-in floating AI assistant powered by OpenAI GPT-4o-mini.

---

## Features

- **Re-enable Text Selection**: Overrides CSS styles that disable user selection (`user-select: none`).
- **Unblock Context Menu**: Restores native right-click context menu functionality.
- **Enable Copy & Paste**: Prevents webpages from intercepting and blocking clipboard operations (`copy`, `cut`, `paste`).
- **Disable Page Visibility**: Bypasses tab switching and blur detection (`visibilitychange`, `blur`, `focus`) by overriding `document.hidden` and spoofing continuous page focus (great for proctored tests, timers, and inactive tab pausing).
- **Two Operation Modes**:
  - **Standard Mode (Enable Copy)**: Balanced approach suitable for most websites.
  - **Absolute Mode**: Aggressive interception designed for heavily protected pages (e.g., test portals, DRM readers).
- **AI Assistant (Powered by OpenAI GPT-4o-mini)**:
  - **Zero Login / API Key Required**: Instant answers out of the box with zero setup.
  - **Native Built-in Interface**: Clean dark-mode UI with no third-party iframes to avoid login loops or blocked buttons.
  - **Subtle Transparent Launcher**: Faint, non-intrusive floating button that becomes fully visible on hover.
  - **Fullscreen Compatible**: Automatically attaches to `document.fullscreenElement` to stay on top in full-screen mode (videos, canvas, exams).
  - **Standalone Small Window**: Can be popped out into an independent floating desktop window.
  - **Quick Shortcut**: Press `Alt + C` (or `Option + C` on Mac) anywhere.

---

## How Anti-Copy Protections Work

Websites typically restrict user interactions using two layers:

1. **CSS Restrictions**:
   - `user-select: none`, `-webkit-user-select: none`
   - Prevents users from highlighting or selecting text on the page.

2. **JavaScript Event Restrictions**:
   - Attaching event handlers to `copy`, `cut`, `paste`, `contextmenu`, `selectstart`, `mousedown`, `keydown`, etc.
   - Calling `event.preventDefault()` or `return false` to cancel standard browser actions.

---

## Working Mechanism

### 1. Standard Mode (`inj_1.js`)
- **CSS Injection**: Injects dynamic `<style>` rules setting `* { user-select: text !important; }` across all elements.
- **Reset Inline Handlers**: Nullifies inline DOM event attributes on `document` and `document.body` (`oncontextmenu`, `oncopy`, `oncut`, `onpaste`, `onselectstart`, `ondragstart`, `onmousedown`).
- **Event Interception (Capture Phase)**: Registers capture-phase event listeners (`useCapture: true`) for `copy`, `cut`, `paste`, `select`, and `selectstart`. By invoking `event.stopPropagation()`, events are handled before the webpage's bubble/target listeners can execute and cancel them.
- **Synthetic Context Menu Dispatch**: Intercepts `contextmenu` events, cancels site-level blockers, and re-dispatches synthetic MouseEvents to bring back the default context menu.

### 2. Absolute Mode (`inj_2.js`)
- Used when websites use aggressive keyboard/mouse suppression or monitoring scripts.
- Overrides `user-select` styles.
- Listens to all interaction events in the capture phase:
  - `contextmenu`, `copy`, `cut`, `paste`
  - `mouseup`, `mousedown`, `keyup`, `keydown`
  - `drag`, `dragstart`, `select`, `selectstart`
### 3. Disable Page Visibility (`inj_3.js`)
- Stops event propagation for `visibilitychange`, `webkitvisibilitychange`, `blur`, `focus`, and `mouseleave`.
- Overrides `Document.prototype.hidden` and `webkitHidden` to always return `false`.
- Overrides `Document.prototype.visibilityState` and `webkitVisibilityState` to always return `"visible"`.
- Spoofs `Document.prototype.hasFocus()` to continuously return `true`.
- Nullifies inline event handlers (`window.onblur`, `window.onfocus`, `document.onvisibilitychange`).

---

## Architecture & File Structure

```text
├── manifest.json         # Extension manifest (Manifest V3 configuration)
├── popup.html            # UI popup for toggling modes & launching AI
├── popup.js              # Controls mode toggles and sends messages
├── chat.html             # Standalone small window AI chat interface
├── options.html          # Extension options and settings page
├── options.js            # Settings page logic
├── css/
│   ├── popup.css         # Popup styles
│   └── options.css       # Options page styles
├── js/
│   ├── background.js     # Service Worker (tab state & AI query background proxy)
│   ├── content.js        # Injects transparent launcher & floating AI chat overlay
│   ├── chat.js           # Logic for standalone small chat window
│   └── inject/
│       ├── inj_1.js      # Script for Standard "Enable Copy" mode
│       ├── inj_2.js      # Script for "Absolute Mode"
│       └── inj_3.js      # Script for "Disable Page Visibility" mode
└── icons/                # Extension toolbar and status icons
```

---

## Local Installation Guide

1. Open Google Chrome (or any Chromium-based browser like Brave, Edge).
2. Go to `chrome://extensions`.
3. Enable **Developer mode** using the toggle switch in the top-right corner.
4. If a `_metadata` folder exists in this directory, delete it (it is only used for Web Store distribution and will prevent unpacked loading).
5. Click **Load unpacked** in the top-left corner.
6. Select this project root folder (`copy and paste enable extension`).
7. Open the extension popup from the toolbar to toggle **Enable Copy** or **Absolute Mode** on any page.

---

## License

This project is licensed under the [MIT License](LICENSE).

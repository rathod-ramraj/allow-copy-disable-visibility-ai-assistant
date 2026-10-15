# Allow Copy & Enable Right Click - Chrome Extension

A Manifest V3 Chrome Extension that bypasses website restrictions on text selection, right-click context menus, and copy/paste functionality.

---

## Features

- **Re-enable Text Selection**: Overrides CSS styles that disable user selection (`user-select: none`).
- **Unblock Context Menu**: Restores native right-click context menu functionality.
- **Enable Copy & Paste**: Prevents webpages from intercepting and blocking clipboard operations (`copy`, `cut`, `paste`).
- **Two Operation Modes**:
  - **Standard Mode (Enable Copy)**: Balanced approach suitable for most websites.
  - **Absolute Mode**: Aggressive interception designed for heavily protected pages (e.g., test portals, DRM readers).

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
- Calls `stopPropagation()` immediately, completely preventing host page JavaScript from capturing or suppressing user actions.

---

## Architecture & File Structure

```text
├── manifest.json         # Extension manifest (Manifest V3 configuration)
├── popup.html            # UI popup for toggling modes
├── popup.js              # Controls mode toggles and sends messages to background/worker
├── options.html          # Extension options and settings page
├── options.js            # Settings page logic
├── css/
│   ├── popup.css         # Popup styles
│   └── options.css       # Options page styles
├── js/
│   ├── background.js     # Background Service Worker (manages tab state & injection)
│   ├── content.js        # Content script entry point
│   └── inject/
│       ├── inj_1.js      # Script for Standard "Enable Copy" mode
│       └── inj_2.js      # Script for "Absolute Mode"
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

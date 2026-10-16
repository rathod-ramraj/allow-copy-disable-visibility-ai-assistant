(() => {
  "use strict";

  const run = () => {
    // 1. Prevent visibility & blur events from reaching page listeners
    const blockEvent = (e) => {
      e.stopImmediatePropagation();
      e.stopPropagation();
    };

    const events = [
      "visibilitychange",
      "webkitvisibilitychange",
      "blur",
      "focus",
      "mouseleave",
      "mouseout",
      "pagehide"
    ];

    events.forEach((event) => {
      window.addEventListener(event, blockEvent, true);
      document.addEventListener(event, blockEvent, true);
    });

    // 2. Spoof Document and Document.prototype properties (handles polling)
    const spoofProps = {
      hidden: {
        get: () => false,
        configurable: true
      },
      visibilityState: {
        get: () => "visible",
        configurable: true
      },
      webkitHidden: {
        get: () => false,
        configurable: true
      },
      webkitVisibilityState: {
        get: () => "visible",
        configurable: true
      }
    };

    try {
      Object.defineProperties(document, spoofProps);
      Object.defineProperties(Document.prototype, spoofProps);
    } catch (e) {}

    // 3. Spoof Focus Checks
    try {
      document.hasFocus = () => true;
      Document.prototype.hasFocus = () => true;
    } catch (e) {}

    // 4. Neutralize inline event handlers
    try {
      window.onblur = null;
      window.onfocus = null;
      document.onvisibilitychange = null;
      document.onblur = null;
      document.onfocus = null;
    } catch (e) {}
  };

  run();

  // Inject into DOM to guarantee execution in the page's MAIN execution context
  try {
    const s = document.createElement("script");
    s.textContent = `(${run.toString()})();`;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  } catch (e) {}
})();

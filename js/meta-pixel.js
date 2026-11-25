(() => {
  const pixelId = "2993269237699220";
  const analyticsId = "G-S4J8G2546M";
  const metaKey = "hacker.meta-pixel.consent";
  const googleKey = "hacker.google-analytics.consent";
  const privacyUrl = new URL("../aviso-de-privacidad.html", document.currentScript.src);
  let metaStarted = false;
  let googleStarted = false;

  function isEnabled(key) {
    try {
      return localStorage.getItem(key) !== "denied";
    } catch {
      return true;
    }
  }

  function addScript(src) {
    const script = document.createElement("script");
    script.async = true;
    script.src = src;
    document.head.append(script);
  }

  function setMetaEnabled(enabled) {
    if (!enabled) {
      if (metaStarted) window.fbq("consent", "revoke");
      return;
    }

    if (!window.fbq) {
      const fbq = function () {
        if (fbq.callMethod) {
          fbq.callMethod.apply(fbq, arguments);
        } else {
          fbq.queue.push(arguments);
        }
      };
      fbq.queue = [];
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      window.fbq = fbq;
      window._fbq = fbq;
      addScript("https://connect.facebook.net/en_US/fbevents.js");
    }

    window.fbq("consent", "grant");
    if (!metaStarted) {
      window.fbq("set", "autoConfig", false, pixelId);
      window.fbq("init", pixelId);
      window.fbq("trackSingle", pixelId, "PageView");
      metaStarted = true;
    }
  }

  function setGoogleEnabled(enabled) {
    window["ga-disable-" + analyticsId] = !enabled;
    if (enabled && !googleStarted) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      addScript("https://www.googletagmanager.com/gtm.js?id=GTM-P6LWNMBX");
      googleStarted = true;
    }
  }

  const notice = document.createElement("aside");
  notice.className = "measurement-notice";
  notice.setAttribute("aria-label", "Medición del sitio");
  notice.innerHTML = `
    <p>Usamos Google Analytics y el píxel de Meta para medir visitas y publicidad. <a>Aviso de privacidad</a></p>
    <details>
      <summary>Preferencias de cookies</summary>
      <label><input type="checkbox" id="hacker-google-analytics"> Google Analytics</label>
      <label><input type="checkbox" id="hacker-meta-pixel"> Píxel de Meta</label>
    </details>
  `;
  notice.querySelector("a").href = privacyUrl.href;
  document.querySelector("main").before(notice);

  function bindPreference(key, selector, apply) {
    const checkbox = notice.querySelector(selector);
    checkbox.checked = isEnabled(key);
    apply(checkbox.checked);

    checkbox.addEventListener("change", () => {
      try {
        localStorage.setItem(key, checkbox.checked ? "granted" : "denied");
      } catch {
        // The selection still applies to the current page.
      }
      apply(checkbox.checked);
    });

    window.addEventListener("storage", (event) => {
      if (event.key !== key && event.key !== null) return;
      checkbox.checked = isEnabled(key);
      apply(checkbox.checked);
    });
  }

  bindPreference(googleKey, "#hacker-google-analytics", setGoogleEnabled);
  bindPreference(metaKey, "#hacker-meta-pixel", setMetaEnabled);
})();

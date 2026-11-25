(() => {
  const pixelId = "2993269237699220";
  const preferenceKey = "hacker.meta-pixel.consent";
  const privacyUrl = new URL("../aviso-de-privacidad.html", document.currentScript.src);
  let pageViewSent = false;

  function readPreference() {
    try {
      return localStorage.getItem(preferenceKey);
    } catch {
      return null;
    }
  }

  function loadPixel() {
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

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.append(script);
    }

    window.fbq("consent", "grant");
    if (!pageViewSent) {
      window.fbq("set", "autoConfig", false, pixelId);
      window.fbq("init", pixelId);
      window.fbq("trackSingle", pixelId, "PageView");
      pageViewSent = true;
    }
  }

  const banner = document.createElement("section");
  banner.className = "advertising-cookies";
  banner.setAttribute("aria-labelledby", "advertising-cookies-title");
  banner.innerHTML = `
    <h2 id="advertising-cookies-title">Cookies publicitarias</h2>
    <p>Con tu permiso, usamos el píxel de Meta para medir las visitas al sitio y el rendimiento de nuestra publicidad. <a>Aviso de privacidad</a></p>
    <div class="advertising-cookies__actions">
      <button type="button" value="denied">Rechazar</button>
      <button type="button" value="granted">Aceptar</button>
    </div>
  `;
  banner.querySelector("a").href = privacyUrl.href;

  const preferences = document.createElement("button");
  preferences.type = "button";
  preferences.className = "advertising-cookies-toggle";
  preferences.textContent = "Preferencias de cookies";
  preferences.setAttribute("aria-expanded", "false");
  banner.id = "advertising-cookie-preferences";
  preferences.setAttribute("aria-controls", banner.id);

  function showBanner(visible) {
    banner.hidden = !visible;
    preferences.setAttribute("aria-expanded", String(visible));
  }

  for (const choice of banner.querySelectorAll("button")) {
    choice.addEventListener("click", () => {
      try {
        localStorage.setItem(preferenceKey, choice.value);
      } catch {
        // The visitor can still choose for this page when storage is unavailable.
      }
      if (choice.value === "granted") {
        loadPixel();
      } else if (pageViewSent) {
        window.fbq("consent", "revoke");
      }
      showBanner(false);
      preferences.focus({ preventScroll: true });
    });
  }

  preferences.addEventListener("click", () => {
    showBanner(banner.hidden);
    if (!banner.hidden) banner.querySelector("button").focus();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== preferenceKey && event.key !== null) return;
    const preference = readPreference();
    if (preference === "granted") {
      loadPixel();
    } else if (pageViewSent) {
      window.fbq("consent", "revoke");
    }
    showBanner(preference === null);
  });

  const preference = readPreference();
  showBanner(preference === null);
  (document.querySelector("footer") || document.body).append(preferences);
  document.body.append(banner);
  if (preference === "granted") loadPixel();
})();

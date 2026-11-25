(() => {
  const pixelId = "2993269237699220";
  const analyticsId = "G-S4J8G2546M";
  const metaKey = "hacker.meta-pixel.consent";
  const googleKey = "hacker.google-analytics.consent";
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

  function bindPreference(key, id, apply) {
    const checkbox = document.getElementById(id);
    const enabled = isEnabled(key);
    apply(enabled);

    if (checkbox) {
      checkbox.checked = enabled;
      checkbox.addEventListener("change", () => {
        try {
          localStorage.setItem(key, checkbox.checked ? "granted" : "denied");
        } catch {
          // The selection still applies to the current page.
        }
        apply(checkbox.checked);
      });
    }

    window.addEventListener("storage", (event) => {
      if (event.key !== key && event.key !== null) return;
      const enabled = isEnabled(key);
      if (checkbox) checkbox.checked = enabled;
      apply(enabled);
    });
  }

  bindPreference(googleKey, "hacker-google-analytics", setGoogleEnabled);
  bindPreference(metaKey, "hacker-meta-pixel", setMetaEnabled);

  const preferences = document.getElementById("preferencias-de-cookies");
  if (preferences) preferences.disabled = false;
})();

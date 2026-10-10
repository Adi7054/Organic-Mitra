/*
 * api.js – connects the frontend to the OrganicMitra backend.
 *
 * app.js asks for `window.claude.use("sample")` (AI chat / photo check) and
 * `window.claude.use("downloads")` (file saving). Inside Claude those exist already.
 * When the page runs as a normal website, this file provides them:
 *   - AI calls go to our own server at  POST /api/chat   (API key stays on the server)
 *   - downloads use a normal browser download
 */
(function () {
  "use strict";
  if (window.claude) return; // running inside Claude: nothing to do

  const API_BASE = window.ORGANICMITRA_API || ""; // same origin by default

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const s = String(r.result);
        resolve({ media_type: file.type || "image/jpeg", data: s.slice(s.indexOf(",") + 1) });
      };
      r.onerror = () => reject({ code: "image_rejected" });
      r.readAsDataURL(file);
    });
  }

  async function sample(input, opts) {
    opts = opts || {};
    const messages = typeof input === "string" ? [{ role: "user", content: input }] : input;
    const body = { messages };
    if (opts.images) body.image = await fileToBase64(opts.images);

    let res;
    try {
      res = await fetch(API_BASE + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: opts.signal,
      });
    } catch (e) {
      if (e && e.name === "AbortError") throw { code: "cancelled", text: "" };
      throw { code: "network" };
    }
    if (res.status === 429) throw { code: "rate_limited" };
    if (res.status === 400 && body.image) throw { code: "image_rejected" };
    if (!res.ok) throw { code: "server" };

    const data = await res.json();
    const text = data.text || "";
    if (typeof opts.onText === "function") opts.onText({ text });
    return { text };
  }

  // photo check asks whether images are supported
  sample.limits = async () => ({ images: true });

  const downloads = {
    async save({ filename, data }) {
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
  };

  window.claude = {
    async use(name) {
      if (name === "sample") return sample;
      if (name === "downloads") return downloads;
      return null;
    },
  };
})();

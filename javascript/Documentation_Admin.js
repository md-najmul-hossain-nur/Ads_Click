// Documentation_Admin.js
// Tab switching + copy-to-clipboard behavior for Documentation_Admin.html
// Place this file in your project's Js folder (../Js/Documentation_Admin.js)

(function () {
  // Guard: ensure DOM exists
  if (!document) return;

  const btnRequest = document.getElementById('btn-request');
  const btnResponse = document.getElementById('btn-response');
  const panelRequest = document.getElementById('panel-request');
  const panelResponse = document.getElementById('panel-response');

  if (!btnRequest || !btnResponse || !panelRequest || !panelResponse) return;

  function showPanel(targetBtn, targetPanel) {
    [btnRequest, btnResponse].forEach(btn => {
      const selected = (btn === targetBtn);
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-selected', selected ? 'true' : 'false');
    });

    [panelRequest, panelResponse].forEach(panel => {
      const isTarget = (panel === targetPanel);
      panel.classList.toggle('hidden', !isTarget);
      if (isTarget) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
  }

  btnRequest.addEventListener('click', () => showPanel(btnRequest, panelRequest));
  btnResponse.addEventListener('click', () => showPanel(btnResponse, panelResponse));

  // keyboard support for tab buttons (left/right)
  [btnRequest, btnResponse].forEach((btn, idx, arr) => {
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
        ev.preventDefault();
        const nextIdx = (ev.key === 'ArrowRight') ? ((idx + 1) % arr.length) : ((idx - 1 + arr.length) % arr.length);
        arr[nextIdx].focus();
        arr[nextIdx].click();
      }
    });
  });

  // copy-to-clipboard buttons
  document.querySelectorAll('.copy-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const targetId = button.getAttribute('data-target');
      const codeEl = document.getElementById(targetId);
      if (!codeEl) return;
      const text = codeEl.innerText.trim();
      // Try browser clipboard API
      try {
        await navigator.clipboard.writeText(text);
        const orig = button.innerText;
        button.innerText = 'Copied!';
        setTimeout(() => { button.innerText = orig; }, 1500);
      } catch (err) {
        // fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          const orig = button.innerText;
          button.innerText = 'Copied!';
          setTimeout(() => { button.innerText = orig; }, 1500);
        } finally {
          document.body.removeChild(ta);
        }
      }
    });
  });

  // Ensure initial state
  showPanel(btnRequest, panelRequest);
})();
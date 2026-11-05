(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const state = { ...Pauta.defaults };
  const settings = $$('[data-field], [name="type"]');
  const sheet = $('#sheet');
  const stage = $('#stage');
  const languages = $('#language-menu');
  const languageControl = $('#language-control');
  let locale = 'ca';
  let zoom = 1;

  function icon(name) {
    return `<svg class="lucide" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PautaIcons[name]}</svg>`;
  }

  function readLanguage() {
    try {
      const saved = localStorage.getItem('pauta-language');
      if (Object.hasOwn(PautaLanguages, saved)) return saved;
    } catch {
      // The editor is also usable when the browser blocks local storage.
    }
    return (navigator.languages || []).map(value => value.toLowerCase().split('-')[0])
      .find(value => Object.hasOwn(PautaLanguages, value)) || 'ca';
  }

  function t(key) {
    return PautaStrings[key][Object.keys(PautaLanguages).indexOf(locale)];
  }

  function updateZoom() {
    const gutter = parseFloat(getComputedStyle(stage).getPropertyValue('--gutter'));
    const maxWidth = Math.min(stage.clientWidth - gutter * 2, (stage.clientHeight - gutter * 2) * Pauta.page.width / Pauta.page.height);
    sheet.style.setProperty('--sheet-width', Math.max(1, maxWidth * zoom) + 'px');
    $('#zoom-value').value = new Intl.NumberFormat(locale, { style: 'percent' }).format(zoom);
    $('#zoom-out').disabled = zoom <= 0.5;
    $('#zoom-in').disabled = zoom >= 3;
  }

  function render() {
    const { count, layers, weight, code } = Pauta.layout(state);
    for (const [name, segments] of Object.entries(layers)) {
      const path = $('#' + name);
      path.setAttribute('d', segments.map(([x1, y1, x2, y2]) => `M${x1} ${y1}L${x2} ${y2}`).join(' '));
      path.setAttribute('stroke', Pauta.colors[name]);
      path.setAttribute('stroke-width', weight);
    }
    const sheetCode = $('#sheet-code');
    sheetCode.textContent = code?.text || '';
    if (code) {
      sheetCode.setAttribute('x', code.x);
      sheetCode.setAttribute('y', code.y);
      sheetCode.setAttribute('font-size', code.size);
      sheetCode.setAttribute('fill', Pauta.colors.code);
    }
    $('#layout-code').value = Pauta.encode(state);
    $('#line-count').value = t(state.type === 1 ? 'lineCount' : 'groupCount').replace('{n}', count);
    $('#spacing-label').textContent = t(state.type === 1 ? 'spacing' : 'groupSpacing');
    $('#calligraphy').hidden = state.type < 2;
    $('#upper-field').hidden = state.type < 3;
    $('#lower-field').hidden = state.type < 4;
    for (const slider of $$('input[type="range"]')) {
      slider.setAttribute('aria-valuetext', new Intl.NumberFormat(locale).format(state[slider.dataset.field]) + ' mm');
    }
  }

  function syncField(input) {
    const value = state[input.dataset.field || input.name];
    if (input.type === 'radio') input.checked = Number(input.value) === value;
    else if (input.type === 'checkbox') input.checked = Boolean(value);
    else input.value = value;
  }

  function setLanguage(value) {
    locale = value;
    document.documentElement.lang = value;
    document.title = 'Pauta. · ' + t('title');
    $('#current-language').textContent = value.toUpperCase();
    $('#release-date').textContent = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' })
      .format(new Date($('#release-date').dateTime));
    for (const item of $$('[data-i18n]')) item.textContent = t(item.dataset.i18n);
    for (const item of $$('[data-aria]')) item.setAttribute('aria-label', t(item.dataset.aria));
    for (const item of $$('[data-title]')) item.title = t(item.dataset.title);
    for (const button of languages.children) button.setAttribute('aria-pressed', String(button.lang === value));
    for (const status of [$('#code-status'), $('#lightning-status')]) {
      if (status.dataset.message) status.textContent = t(status.dataset.message);
    }
    render();
    updateZoom();
  }

  function showStatus(target, key) {
    const status = $(target);
    status.dataset.message = key;
    status.toggleAttribute('data-error', key === 'invalidCode' || key === 'copyFailed');
    status.textContent = t(key);
  }

  async function copy(text, target) {
    try {
      await navigator.clipboard.writeText(text);
      showStatus(target, 'copied');
    } catch {
      showStatus(target, 'copyFailed');
    }
  }

  for (const [value, name] of Object.entries(PautaLanguages)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button quiet';
    button.lang = value;
    button.textContent = name;
    button.insertAdjacentHTML('beforeend', '<span data-icon="check"></span>');
    button.addEventListener('click', () => {
      setLanguage(value);
      try { localStorage.setItem('pauta-language', value); } catch {}
      languageControl.open = false;
      languageControl.querySelector('summary').focus();
    });
    languages.append(button);
  }
  for (const item of $$('[data-icon]')) item.innerHTML = icon(item.dataset.icon);
  document.addEventListener('click', event => {
    if (languageControl.open && !languageControl.contains(event.target)) languageControl.open = false;
  });
  languageControl.addEventListener('keydown', event => {
    if (event.key === 'Escape' && languageControl.open) {
      languageControl.open = false;
      languageControl.querySelector('summary').focus();
    }
  });

  for (const input of settings) {
    const key = input.dataset.field || input.name;
    const [min, max, step] = Pauta.fields[key];
    if (input.type === 'number' || input.type === 'range') {
      Object.assign(input, { min, max, step });
    }
    input.addEventListener('input', () => {
      if (input.type === 'number' && (!input.validity.valid || input.value === '')) return;
      state[key] = input.type === 'checkbox' ? Number(input.checked) : Number(input.value);
      for (const peer of settings) {
        if (peer !== input && peer.dataset.field === key) syncField(peer);
      }
      render();
    });
    if (input.type === 'number') {
      input.addEventListener('change', () => {
        if (input.value !== '') {
          const steps = Math.round((Math.min(max, Math.max(min, input.valueAsNumber)) - min) / step);
          state[key] = Number((min + steps * step).toFixed(2));
        }
        for (const peer of settings) {
          if (peer.dataset.field === key) syncField(peer);
        }
        render();
      });
    }
    syncField(input);
  }

  $('#reset').addEventListener('click', () => {
    Object.assign(state, Pauta.defaults);
    settings.forEach(syncField);
    render();
  });
  $('#copy-code').addEventListener('click', () => copy(Pauta.encode(state), '#code-status'));
  $('#copy-lightning').addEventListener('click', () => copy($('#lightning-address').textContent, '#lightning-status'));
  $('#restore-form').addEventListener('submit', event => {
    event.preventDefault();
    const field = $('#restore-code');
    const restored = Pauta.decode(field.value.trim().replace(/^Pauta\.\s*/i, ''));
    field.setAttribute('aria-invalid', String(!restored));
    if (!restored) {
      showStatus('#code-status', 'invalidCode');
      return;
    }
    Object.assign(state, restored);
    settings.forEach(syncField);
    render();
    showStatus('#code-status', 'restored');
  });
  $('#restore-code').addEventListener('input', event => {
    event.target.removeAttribute('aria-invalid');
    const status = $('#code-status');
    delete status.dataset.message;
    status.textContent = '';
  });

  $('#zoom-out').addEventListener('click', () => { zoom = Math.max(0.5, zoom - 0.25); updateZoom(); });
  $('#zoom-in').addEventListener('click', () => { zoom = Math.min(3, zoom + 0.25); updateZoom(); });
  $('#zoom-fit').addEventListener('click', () => { zoom = 1; updateZoom(); stage.scrollTo(0, 0); });
  new ResizeObserver(updateZoom).observe(stage);

  $('#download').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([Pauta.pdf(state)], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pauta-a4.pdf';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  });
  $('#print').addEventListener('click', () => window.print());
  for (const button of $$('[data-dialog]')) {
    button.addEventListener('click', () => document.getElementById(button.dataset.dialog).showModal());
  }
  for (const button of $$('[data-close]')) {
    button.addEventListener('click', () => button.closest('dialog').close());
  }
  setLanguage(readLanguage());
})();

(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const state = { ...Pauta.defaults };
  const settings = $$('[data-field], [name="type"]');
  const presetButtons = $$('[data-preset]');
  const hidePresetButtons = $$('[data-hide-preset]');
  const savedTemplates = $('#saved-templates');
  const sheet = $('#sheet');
  const stage = $('#stage');
  const languages = $('#language-menu');
  const languageControl = $('#language-control');
  let locale = 'ca';
  let zoom = 1;
  let paper;
  let drag;
  let library = { hidden: [], saved: [] };

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

  function countLabel(key, count) {
    return t(count === 1 ? key + 'One' : key).replace('{n}', count);
  }

  function updateZoom() {
    const gutter = parseFloat(getComputedStyle(stage).getPropertyValue('--gutter'));
    const { width, height } = stage.getBoundingClientRect();
    const maxWidth = Math.min(width - gutter * 2, (height - gutter * 2) * paper.width / paper.height);
    sheet.style.setProperty('--sheet-width', Math.max(1, maxWidth * zoom) + 'px');
    $('#zoom-value').value = new Intl.NumberFormat(locale, { style: 'percent' }).format(zoom);
    $('#zoom-out').disabled = zoom <= 0.5;
    $('#zoom-in').disabled = zoom >= 3;
    stage.toggleAttribute('data-zoomed', zoom > 1);
  }

  function setZoom(value, x, y) {
    const next = Math.min(3, Math.max(0.5, value));
    if (zoom === next) return;
    const area = stage.getBoundingClientRect();
    x ??= area.left + stage.clientWidth / 2;
    y ??= area.top + stage.clientHeight / 2;
    const before = sheet.getBoundingClientRect();
    const fractionX = (x - before.left) / before.width;
    const fractionY = (y - before.top) / before.height;
    zoom = next;
    updateZoom();
    const after = sheet.getBoundingClientRect();
    stage.scrollLeft += after.left + fractionX * after.width - x;
    stage.scrollTop += after.top + fractionY * after.height - y;
  }

  function render() {
    const { page, count, partial, layers, weight, colors, dash, code } = Pauta.layout(state);
    if (paper?.width !== page.width || paper.height !== page.height) {
      paper = page;
      sheet.setAttribute('viewBox', `0 0 ${page.width} ${page.height}`);
      sheet.style.setProperty('--paper-aspect', `${page.width} / ${page.height}`);
      sheet.style.setProperty('--paper-width', page.width + 'mm');
      sheet.style.setProperty('--paper-height', page.height + 'mm');
      $('#print-size').textContent = `@page { size: ${page.width}mm ${page.height}mm; margin: 0; }`;
      $('#paper-dimensions').textContent = `${page.width} × ${page.height} mm`;
      updateZoom();
    }
    $('#paper-format').textContent = `${page.name} · ${t(state.landscape ? 'landscape' : 'portrait')}`;
    for (const [name, segments] of Object.entries(layers)) {
      const path = $('#' + name);
      path.setAttribute('d', segments.map(([x1, y1, x2, y2]) => `M${x1} ${y1}L${x2} ${y2}`).join(' '));
      path.setAttribute('stroke', colors[name]);
      path.setAttribute('stroke-width', weight);
      path.setAttribute('stroke-dasharray', name === 'margins' || !dash.length ? 'none' : dash.join(' '));
    }
    const sheetCode = $('#sheet-code');
    sheetCode.textContent = code?.text || '';
    if (code) {
      sheetCode.setAttribute('x', code.x);
      sheetCode.setAttribute('y', code.y);
      sheetCode.setAttribute('font-size', code.size);
      sheetCode.setAttribute('fill', colors.code);
    }
    const layoutCode = Pauta.encode(state);
    $('#layout-code').value = layoutCode;
    let countText = countLabel(state.type === 1 ? 'lineCount' : 'groupCount', count);
    if (partial) {
      const remainder = countLabel('lineCount', partial);
      countText = count ? `${countText} + ${remainder}` : remainder;
    }
    $('#line-count').value = countText;
    $('#spacing-label').textContent = t(state.type === 1 ? 'spacing' : 'groupSpacing');
    $('#calligraphy').hidden = state.type < 2;
    $('#upper-field').hidden = state.type < 3;
    $('#lower-field').hidden = state.type < 4;
    for (const button of presetButtons) {
      const active = Object.entries(presetState(button.dataset.preset)).every(([key, value]) => state[key] === value);
      button.setAttribute('aria-pressed', String(active));
    }
    for (const button of savedTemplates.querySelectorAll('[data-code]')) {
      button.setAttribute('aria-pressed', String(button.dataset.code === layoutCode));
    }
    const numberFormat = new Intl.NumberFormat(locale);
    for (const slider of $$('input[type="range"]')) {
      const value = numberFormat.format(state[slider.dataset.field]) + ' mm';
      slider.setAttribute('aria-valuetext', value);
      const reading = $(`output[for="${slider.id}"]`);
      if (reading) reading.value = value;
    }
  }

  function syncField(input) {
    const value = state[input.dataset.field || input.name];
    if (input.type === 'radio') input.checked = Number(input.value) === value;
    else if (input.type === 'checkbox') input.checked = Boolean(value);
    else input.value = value;
  }

  function applyState(next) {
    Object.assign(state, next);
    settings.forEach(syncField);
    render();
  }

  function presetState(name) {
    const { size, landscape, printCode } = state;
    return { ...Pauta.defaults, ...Pauta.presets[name], size, landscape, printCode };
  }

  function renderLibrary() {
    for (const button of hidePresetButtons) {
      const card = button.closest('.template-card');
      card.hidden = library.hidden.includes(button.dataset.hidePreset);
      button.setAttribute('aria-label', t('templateHide') + ' · ' + card.querySelector('strong').textContent);
    }
    $('#gallery-empty').hidden = library.hidden.length !== presetButtons.length;
    $('#restore-gallery').disabled = library.hidden.length === 0;
    $('#export-templates').disabled = library.saved.length === 0;
    const hadFocus = savedTemplates.contains(document.activeElement);
    savedTemplates.replaceChildren(...library.saved.map(template => {
      const row = document.createElement('li');
      row.className = 'template-card';
      const use = document.createElement('button');
      use.type = 'button';
      use.className = 'button secondary preset';
      use.dataset.code = template.code;
      use.setAttribute('aria-pressed', String(template.code === $('#layout-code').value));
      const name = document.createElement('strong');
      name.textContent = template.name;
      const settings = Pauta.decode(template.code);
      const info = document.createElement('span');
      const size = Pauta.paper(settings).name;
      const spacing = new Intl.NumberFormat(locale).format(settings.spacing);
      info.textContent = `${size} · ${t(['single', 'double', 'triple', 'quad'][settings.type - 1])} · ${spacing} mm`;
      use.append(name, info);
      use.addEventListener('click', () => applyState(settings));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'button quiet template-remove';
      remove.title = t('templateRemove');
      remove.setAttribute('aria-label', t('templateRemove') + ' · ' + template.name);
      remove.innerHTML = icon('x');
      remove.addEventListener('click', () => updateLibrary(current => ({
        ...current, saved: current.saved.filter(item => PautaLibrary.templateKey(item) !== PautaLibrary.templateKey(template)),
      }), 'templateRemoved'));
      row.append(use, remove);
      return row;
    }));
    if (hadFocus) $('#template-name').focus({ preventScroll: true });
  }

  function loadLibrary() {
    try { library = PautaLibrary.read(); }
    catch { showStatus('#template-status', 'templateStorageError', true); }
  }

  async function updateLibrary(update, success) {
    try {
      library = await PautaLibrary.change(update);
      renderLibrary();
      showStatus('#template-status', success);
      return true;
    } catch (error) {
      const messages = ['templateDuplicate', 'templateNoNew', 'templateFull'];
      showStatus('#template-status', messages.includes(error.message) ? error.message : 'templateStorageError', true);
      return false;
    }
  }

  function setLanguage(value) {
    locale = value;
    document.documentElement.lang = value;
    document.title = 'Pauta. · ' + t('title');
    $('#current-language').textContent = value.toUpperCase();
    const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' });
    for (const time of $$('#changelog time')) time.textContent = date.format(new Date(time.dateTime));
    for (const item of $$('[data-i18n]')) item.textContent = t(item.dataset.i18n);
    for (const item of $$('[data-aria]')) item.setAttribute('aria-label', t(item.dataset.aria));
    for (const item of $$('[data-title]')) item.title = t(item.dataset.title);
    for (const button of languages.children) button.setAttribute('aria-pressed', String(button.lang === value));
    for (const status of [$('#code-status'), $('#lightning-status'), $('#template-status')]) {
      if (status.dataset.message) status.textContent = t(status.dataset.message);
    }
    render();
    renderLibrary();
    updateZoom();
  }

  function showStatus(target, key, error = false) {
    const status = $(target);
    status.dataset.message = key;
    status.toggleAttribute('data-error', error || key === 'invalidCode' || key === 'copyFailed');
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
      if (input.type === 'color') state[key] = input.value;
      else state[key] = input.type === 'checkbox' ? Number(input.checked) : Number(input.value);
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

  $('#reset').addEventListener('click', () => applyState(Pauta.defaults));
  for (const button of presetButtons) {
    button.addEventListener('click', () => applyState(presetState(button.dataset.preset)));
  }
  for (const button of hidePresetButtons) {
    button.addEventListener('click', async () => {
      const id = button.dataset.hidePreset;
      const saved = await updateLibrary(current => ({ ...current, hidden: [...new Set([...current.hidden, id])] }), 'templateHidden');
      if (saved) $('#restore-gallery').focus({ preventScroll: true });
    });
  }
  $('#restore-gallery').addEventListener('click', async () => {
    const saved = await updateLibrary(current => ({ ...current, hidden: [] }), 'templateRestored');
    if (saved) presetButtons[0].focus({ preventScroll: true });
  });
  $('#save-template').addEventListener('submit', async event => {
    event.preventDefault();
    const field = $('#template-name');
    const name = field.value.trim();
    if (!name) {
      showStatus('#template-status', 'templateNameRequired', true);
      return;
    }
    const template = { name, code: Pauta.encode(state) };
    const saved = await updateLibrary(current => {
      const templates = PautaLibrary.merge(current.saved, [template]);
      if (templates.length === current.saved.length) throw new Error('templateDuplicate');
      return { ...current, saved: templates };
    }, 'templateSaved');
    if (saved && field.value.trim() === name) field.value = '';
  });
  const templateFile = $('#template-file');
  $('#import-templates').addEventListener('click', () => templateFile.click());
  templateFile.addEventListener('change', async () => {
    const [file] = templateFile.files;
    templateFile.value = '';
    if (!file) return;
    let incoming;
    try { incoming = await PautaLibrary.importBackup(file); }
    catch {
      showStatus('#template-status', 'templateInvalidBackup', true);
      return;
    }
    await updateLibrary(current => {
      const templates = PautaLibrary.merge(current.saved, incoming);
      if (templates.length === current.saved.length) throw new Error('templateNoNew');
      return { ...current, saved: templates };
    }, 'templateImported');
  });
  $('#export-templates').addEventListener('click', () => {
    try {
      const { saved } = PautaLibrary.read();
      if (saved.length) downloadFile(new Blob([PautaLibrary.backup(saved)], { type: 'application/json' }), 'pauta-plantilles.json');
    } catch {
      showStatus('#template-status', 'templateStorageError', true);
    }
  });
  window.addEventListener('storage', event => {
    if (event.key !== null && event.key !== PautaLibrary.key) return;
    loadLibrary();
    renderLibrary();
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
    applyState(restored);
    showStatus('#code-status', 'restored');
  });
  $('#restore-code').addEventListener('input', event => {
    event.target.removeAttribute('aria-invalid');
    const status = $('#code-status');
    delete status.dataset.message;
    status.textContent = '';
  });

  $('#zoom-out').addEventListener('click', () => setZoom(zoom - 0.25));
  $('#zoom-in').addEventListener('click', () => setZoom(zoom + 0.25));
  $('#zoom-fit').addEventListener('click', () => { setZoom(1); stage.scrollTo(0, 0); });
  stage.addEventListener('wheel', event => {
    if (event.shiftKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    const pixels = event.deltaY * [1, 16, stage.clientHeight][event.deltaMode];
    const step = Math.min(160, Math.max(-160, pixels));
    setZoom(zoom * Math.exp(-step * 0.002), event.clientX, event.clientY);
  }, { passive: false });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !event.target.closest('.canvas')) return;
    if (stage.scrollWidth <= stage.clientWidth && stage.scrollHeight <= stage.clientHeight) return;
    event.preventDefault();
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: stage.scrollLeft, top: stage.scrollTop };
    stage.setPointerCapture(event.pointerId);
    stage.setAttribute('data-dragging', '');
  });
  stage.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    stage.scrollLeft = drag.left + drag.x - event.clientX;
    stage.scrollTop = drag.top + drag.y - event.clientY;
  });
  stage.addEventListener('lostpointercapture', () => {
    drag = undefined;
    stage.removeAttribute('data-dragging');
  });
  new ResizeObserver(updateZoom).observe(stage);

  function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  async function trackSheetOutput(method) {
    try {
      await window.umami?.track('sheet-output', {
        method,
        paper: paper.name,
        orientation: state.landscape ? 'landscape' : 'portrait',
        ruling_lines: state.type,
        spacing_mm: state.spacing,
        weight_mm: state.weight,
        line_style: state.dashed ? 'dashed' : 'solid',
        left_guide: Boolean(state.guideLeft),
        right_guide: Boolean(state.guideRight),
        show_code: Boolean(state.printCode),
      });
    } catch {
      // Printing and downloads work even when analytics is unavailable.
    }
  }

  $('#download').addEventListener('click', () => {
    downloadFile(new Blob([Pauta.pdf(state)], { type: 'application/pdf' }),
      `pauta-${paper.name.toLowerCase()}${state.landscape ? '-landscape' : ''}.pdf`);
    trackSheetOutput('pdf');
  });
  $('#print').addEventListener('click', () => {
    trackSheetOutput('print');
    window.print();
  });
  for (const button of $$('[data-dialog]')) {
    button.addEventListener('click', () => document.getElementById(button.dataset.dialog).showModal());
  }
  for (const button of $$('[data-close]')) {
    button.addEventListener('click', () => button.closest('dialog').close());
  }
  loadLibrary();
  setLanguage(readLanguage());
})();

const PautaLibrary = (() => {
  const key = 'pauta.templates.v1';
  const format = 'pauta-templates';
  const maxTemplates = 50;
  const maxBytes = 128 * 1024;

  function templateKey(template) {
    return template.code + ' ' + template.name;
  }

  function readTemplates(templates) {
    if (!Array.isArray(templates) || templates.length > maxTemplates) throw new Error('templateInvalidBackup');
    return templates.map(template => {
      const name = typeof template?.name === 'string' ? template.name.trim() : '';
      const settings = typeof template?.code === 'string' && template.code.length <= 40 && Pauta.decode(template.code);
      if (!name || name.length > 80 || !settings) throw new Error('templateInvalidBackup');
      return { name, code: Pauta.encode(settings) };
    });
  }

  function merge(saved, incoming) {
    const templates = new Map(saved.map(template => [templateKey(template), template]));
    for (const template of incoming) templates.set(templateKey(template), template);
    if (templates.size > maxTemplates) throw new Error('templateFull');
    return [...templates.values()];
  }

  function read() {
    const raw = localStorage.getItem(key);
    if (raw === null) return { hidden: [], saved: [] };
    const library = JSON.parse(raw);
    return {
      hidden: [...new Set(library.hidden.filter(id => typeof id === 'string' && Object.hasOwn(Pauta.presets, id)))],
      saved: merge([], readTemplates(library.saved)),
    };
  }

  async function change(update) {
    const write = () => {
      const next = update(read());
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    };
    if (!navigator.locks) return write();
    let entered = false;
    try {
      return await navigator.locks.request(key, () => {
        entered = true;
        return write();
      });
    } catch (error) {
      if (entered || error.name !== 'SecurityError') throw error;
      return write();
    }
  }

  function backup(saved) {
    return JSON.stringify({ format, version: 1, templates: saved }, null, 2);
  }

  async function importBackup(file) {
    try {
      if (file.size > maxBytes) throw new Error();
      const backup = JSON.parse(await file.text());
      if (backup?.format !== format || backup.version !== 1) throw new Error();
      return readTemplates(backup.templates);
    } catch {
      throw new Error('templateInvalidBackup');
    }
  }

  return { key, read, change, merge, backup, importBackup, templateKey };
})();

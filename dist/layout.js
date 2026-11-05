// Shared geometry for the preview, browser print and vector PDF. Units are millimetres.
const Pauta = (() => {
  const page = { width: 210, height: 297 };
  const defaults = {
    type: 1, spacing: 8, weight: 0.25, body: 4, upper: 6, lower: 6,
    left: 15, right: 15, top: 15, bottom: 15, guideLeft: 0, guideRight: 0, printCode: 0,
  };
  const fields = {
    type: [1, 4, 1],
    spacing: [2, 30, 0.1],
    weight: [0.05, 1.5, 0.01],
    body: [2, 15, 0.5],
    upper: [2, 25, 0.5],
    lower: [2, 25, 0.5],
    left: [0, 60, 1],
    right: [0, 60, 1],
    top: [0, 60, 1],
    bottom: [0, 60, 1],
    guideLeft: [0, 1, 1],
    guideRight: [0, 1, 1],
    printCode: [0, 1, 1],
  };
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  // This order and these ranges are part of the printed P1 code format.
  const schema = Object.entries(fields).map(([key, [min, max, step]]) => ({
    key, min, step, size: Math.round((max - min) / step) + 1,
  }));

  function indexFor(field, value) {
    return Math.max(0, Math.min(field.size - 1, Math.round((value - field.min) / field.step)));
  }

  function valueFor(field, index) {
    return Number((field.min + index * field.step).toFixed(2));
  }

  function checksum(digits) {
    const index = [...digits].reduce((acc, digit) => (acc * 17 + alphabet.indexOf(digit)) % 32, 1);
    return alphabet[index];
  }

  function encode(settings) {
    let packed = schema.reduceRight((acc, field) => (
      acc * BigInt(field.size) + BigInt(indexFor(field, settings[field.key]))
    ), 0n);
    let digits = '';
    do {
      digits = alphabet[Number(packed % 32n)] + digits;
      packed /= 32n;
    } while (packed);
    return 'P1-' + (digits + checksum(digits)).match(/.{1,4}/g).join('-');
  }

  function decode(input) {
    const code = input.toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
    if (!code.startsWith('P1')) return null;
    const digits = code.slice(2, -1);
    if (!digits || digits.length > 14 || [...digits].some(digit => !alphabet.includes(digit))) return null;
    if (checksum(digits) !== code.at(-1)) return null;
    let packed = [...digits].reduce((acc, digit) => acc * 32n + BigInt(alphabet.indexOf(digit)), 0n);
    const settings = {};
    for (const field of schema) {
      const size = BigInt(field.size);
      settings[field.key] = valueFor(field, Number(packed % size));
      packed /= size;
    }
    return packed === 0n ? settings : null;
  }

  const colors = { rules: '#242724', fine: '#85877e', margins: '#ad5d56', code: '#4d4d47' };

  function layout(settings) {
    const { type, weight, body, upper, lower, spacing } = settings;
    const offsets = [[], [0], [0, body], [0, upper, upper + body], [0, upper, upper + body, upper + body + lower]][type];
    const groupHeight = offsets.at(-1);
    const top = settings.top;
    const bottom = page.height - Math.max(settings.bottom, settings.printCode ? 10 : 0);
    const left = settings.left;
    const right = page.width - settings.right;
    const stride = groupHeight + spacing;
    const count = Math.floor((bottom - top - weight - groupHeight) / stride + 1e-9) + 1;
    const start = (top + bottom - (count - 1) * stride - groupHeight) / 2;
    const layers = { rules: [], fine: [], margins: [] };

    for (let row = 0; row < count; row++) {
      offsets.forEach((offset, index) => {
        const y = start + row * stride + offset;
        const isOuter = (type >= 3 && index === 0) || (type === 4 && index === 3);
        layers[isOuter ? 'fine' : 'rules'].push([left, y, right, y]);
      });
    }
    if (settings.guideLeft) {
      const x = Math.max(left, weight / 2);
      layers.margins.push([x, top, x, bottom]);
    }
    if (settings.guideRight) {
      const x = Math.min(right, page.width - weight / 2);
      layers.margins.push([x, top, x, bottom]);
    }
    const code = settings.printCode ? { text: 'Pauta. ' + encode(settings), x: Math.max(left, 7), y: 290, size: 2.4 } : null;
    return { count, layers, weight, code };
  }

  function pdf(settings) {
    const { layers, weight, code } = layout(settings);
    const pt = mm => (mm * 72 / 25.4).toFixed(5);
    const rgb = color => color.slice(1).match(/../g).map(part => (parseInt(part, 16) / 255).toFixed(5)).join(' ');
    const commands = [pt(weight) + ' w'];
    for (const [name, segments] of Object.entries(layers)) {
      if (segments.length === 0) continue;
      commands.push(rgb(colors[name]) + ' RG');
      for (const [x1, y1, x2, y2] of segments) {
        commands.push(`${pt(x1)} ${pt(page.height - y1)} m ${pt(x2)} ${pt(page.height - y2)} l S`);
      }
    }
    if (code) {
      commands.push(`${rgb(colors.code)} rg BT /F1 ${pt(code.size)} Tf ${pt(code.x)} ${pt(page.height - code.y)} Td (${code.text}) Tj ET`);
    }
    const stream = commands.join('\n') + '\n';
    const resources = code ? '/Font << /F1 5 0 R >>' : '';
    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pt(page.width)} ${pt(page.height)}] /Resources << ${resources} >> /Contents 4 0 R >>`,
      `<< /Length ${stream.length} >>\nstream\n${stream}endstream`,
    ];
    if (code) objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>');

    // The document uses ASCII, so character offsets also count bytes.
    let document = '%PDF-1.4\n';
    const offsets = objects.map((object, index) => {
      const offset = document.length;
      document += `${index + 1} 0 obj\n${object}\nendobj\n`;
      return offset;
    });
    const xref = document.length;
    document += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (const offset of offsets) document += `${String(offset).padStart(10, '0')} 00000 n \n`;
    return document + `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  }

  return { page, defaults, fields, colors, encode, decode, layout, pdf };
})();

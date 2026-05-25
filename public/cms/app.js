/* Админка «Айтар» — редактор контента (схема-управляемый рендер форм). */
(function () {
  'use strict';
  var CMS = window.CMS;
  var state = { key: null, model: null, dirty: false };

  // --- DOM-помощник ------------------------------------------------------
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on' && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(function (c) {
      if (c != null) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  // --- Значение по умолчанию для нового элемента -------------------------
  function blankValue(field) {
    switch (field.widget) {
      case 'object':
        var o = {}; (field.fields || []).forEach(function (f) { o[f.name] = blankValue(f); }); return o;
      case 'list': return [];
      case 'boolean': return false;
      case 'number': return field.min != null ? field.min : 0;
      default: return '';
    }
  }
  function blankItem(field) {
    if (field.fields) { var o = {}; field.fields.forEach(function (f) { o[f.name] = blankValue(f); }); return o; }
    return blankValue(field.field || { widget: 'string' });
  }

  // --- Рендер одного поля (рекурсивно) -----------------------------------
  // parent[key] — значение поля. Лист пишет напрямую в parent[key].
  function renderField(field, parent, key) {
    var wrap = el('div', { class: 'field' });
    if (field.widget !== 'boolean')
      wrap.appendChild(el('label', { class: 'field-label', text: field.label || field.name }));
    if (field.hint) wrap.appendChild(el('div', { class: 'field-hint', text: field.hint }));

    var val = parent[key];

    switch (field.widget) {
      case 'text': {
        var ta = el('textarea', { rows: 3 }); ta.value = val == null ? '' : val;
        ta.addEventListener('input', function () { parent[key] = ta.value; markDirty(); });
        wrap.appendChild(ta); break;
      }
      case 'number': {
        var inp = el('input', { type: 'number' });
        if (field.min != null) inp.min = field.min;
        if (field.max != null) inp.max = field.max;
        inp.value = val == null ? '' : val;
        inp.addEventListener('input', function () { parent[key] = inp.value === '' ? '' : Number(inp.value); markDirty(); });
        wrap.appendChild(inp); break;
      }
      case 'boolean': {
        var cb = el('input', { type: 'checkbox' }); cb.checked = !!val;
        cb.addEventListener('change', function () { parent[key] = cb.checked; markDirty(); });
        wrap.appendChild(el('label', { class: 'checkbox-row' }, [cb, document.createTextNode(' ' + (field.label || field.name))]));
        break;
      }
      case 'select': {
        var sel = el('select');
        (field.options || []).forEach(function (opt) {
          var o = el('option', { value: opt, text: opt }); if (opt === val) o.selected = true; sel.appendChild(o);
        });
        if (val == null || (field.options || []).indexOf(val) === -1) sel.insertBefore(el('option', { value: '', text: '— выберите —' }), sel.firstChild);
        sel.value = val == null ? '' : val;
        sel.addEventListener('change', function () { parent[key] = sel.value; markDirty(); });
        wrap.appendChild(sel); break;
      }
      case 'image': {
        wrap.appendChild(renderImage(parent, key)); break;
      }
      case 'object': {
        if (val == null || typeof val !== 'object' || Array.isArray(val)) { parent[key] = {}; val = parent[key]; }
        var box = el('div', { class: 'object-box' });
        (field.fields || []).forEach(function (f) { box.appendChild(renderField(f, val, f.name)); });
        wrap.appendChild(box); break;
      }
      case 'list': {
        if (!Array.isArray(val)) { parent[key] = []; val = parent[key]; }
        wrap.appendChild(renderList(field, val)); break;
      }
      default: { // string
        var ti = el('input', { type: 'text' }); ti.value = val == null ? '' : val;
        ti.addEventListener('input', function () { parent[key] = ti.value; markDirty(); });
        wrap.appendChild(ti);
      }
    }
    return wrap;
  }

  // --- Картинка ----------------------------------------------------------
  function renderImage(parent, key) {
    var box = el('div', { class: 'image-field' });
    function draw() {
      box.innerHTML = '';
      var val = parent[key];
      if (val) box.appendChild(el('img', { class: 'image-preview', src: val, alt: '' }));
      var path = el('input', { type: 'text', placeholder: '/uploads/...', value: val || '' });
      path.addEventListener('input', function () { parent[key] = path.value; markDirty(); });
      box.appendChild(path);
      var file = el('input', { type: 'file', accept: 'image/*' });
      var btn = el('button', { type: 'button', class: 'btn-sm', text: '📤 Загрузить', onclick: function () { file.click(); } });
      file.style.display = 'none';
      file.addEventListener('change', function () {
        if (!file.files[0]) return;
        btn.textContent = 'Загрузка...'; btn.disabled = true;
        uploadImage(file.files[0]).then(function (p) {
          parent[key] = p; markDirty(); draw();
        }).catch(function (err) { alert('Ошибка загрузки: ' + err); btn.textContent = '📤 Загрузить'; btn.disabled = false; });
      });
      box.appendChild(btn); box.appendChild(file);
    }
    draw();
    return box;
  }

  // --- Список ------------------------------------------------------------
  function renderList(field, arr) {
    var box = el('div', { class: 'list-box' });
    arr.forEach(function (item, i) {
      var card = el('div', { class: 'list-item' });
      var head = el('div', { class: 'list-item-head' }, [
        el('span', { class: 'list-item-num', text: '#' + (i + 1) }),
        el('div', { class: 'list-item-tools' }, [
          el('button', { type: 'button', class: 'icon-btn', title: 'Вверх', text: '↑', onclick: function () { if (i > 0) { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); markDirty(); renderForm(); } } }),
          el('button', { type: 'button', class: 'icon-btn', title: 'Вниз', text: '↓', onclick: function () { if (i < arr.length - 1) { arr.splice(i + 1, 0, arr.splice(i, 1)[0]); markDirty(); renderForm(); } } }),
          el('button', { type: 'button', class: 'icon-btn danger', title: 'Удалить', text: '✕', onclick: function () { if (confirm('Удалить элемент #' + (i + 1) + '?')) { arr.splice(i, 1); markDirty(); renderForm(); } } })
        ])
      ]);
      card.appendChild(head);
      if (field.fields) {
        field.fields.forEach(function (f) { card.appendChild(renderField(f, item, f.name)); });
      } else {
        // список простых значений (parent = массив, key = индекс)
        card.appendChild(renderField(field.field || { widget: 'string', label: '' }, arr, i));
      }
      box.appendChild(card);
    });
    box.appendChild(el('button', {
      type: 'button', class: 'btn-add', text: '+ Добавить',
      onclick: function () { arr.push(blankItem(field)); markDirty(); renderForm(); }
    }));
    return box;
  }

  // --- Сборка формы раздела ----------------------------------------------
  function renderForm() {
    var content = document.getElementById('content');
    content.innerHTML = '';
    if (!state.key) { content.appendChild(el('div', { class: 'placeholder', text: '← Выберите раздел слева' })); return; }
    var coll = CMS.schema[state.key];

    content.appendChild(el('div', { class: 'form-head' }, [
      el('h1', { text: coll.label })
    ]));

    var form = el('div', { class: 'form-body' });
    coll.fields.forEach(function (f) { form.appendChild(renderField(f, state.model, f.name)); });
    content.appendChild(form);

    // Панель сохранения
    var status = el('span', { class: 'save-status' });
    var saveBtn = el('button', { class: 'btn-save', text: '💾 Сохранить', onclick: function () { doSave(saveBtn, status); } });
    content.appendChild(el('div', { class: 'savebar' }, [saveBtn, status]));
  }

  function markDirty() { state.dirty = true; }

  // --- Загрузка раздела --------------------------------------------------
  function openCollection(key) {
    if (state.dirty && !confirm('Есть несохранённые изменения. Перейти и потерять их?')) return;
    fetch(CMS.api + '?action=load&collection=' + encodeURIComponent(key), { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.error || 'Ошибка загрузки');
        state.key = key; state.model = res.data || {}; state.dirty = false;
        highlightSidebar(); renderForm();
        window.scrollTo(0, 0);
      })
      .catch(function (err) { alert('Не удалось открыть раздел: ' + err.message); });
  }

  // --- Сохранение --------------------------------------------------------
  function doSave(btn, status) {
    btn.disabled = true; status.textContent = 'Сохранение...'; status.className = 'save-status';
    var body = new FormData();
    body.append('action', 'save');
    body.append('collection', state.key);
    body.append('data', JSON.stringify(state.model));
    body.append('csrf', CMS.csrf);
    fetch(CMS.api, { method: 'POST', body: body, credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.error || 'Ошибка');
        state.dirty = false; status.textContent = '✅ Сохранено — изменения уже на сайте'; status.className = 'save-status ok';
      })
      .catch(function (err) { status.textContent = '❌ ' + err.message; status.className = 'save-status err'; })
      .then(function () { btn.disabled = false; });
  }

  // --- Загрузка картинки -------------------------------------------------
  function uploadImage(file) {
    var body = new FormData();
    body.append('action', 'upload'); body.append('csrf', CMS.csrf); body.append('file', file);
    return fetch(CMS.api, { method: 'POST', body: body, credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (res) { if (!res.ok) throw new Error(res.error || 'ошибка'); return res.path; });
  }

  // --- Сайдбар -----------------------------------------------------------
  function buildSidebar() {
    var nav = document.getElementById('sidebar');
    nav.innerHTML = '';
    CMS.collections.forEach(function (c) {
      nav.appendChild(el('button', {
        class: 'nav-item', 'data-key': c.key, text: c.label,
        onclick: function () { openCollection(c.key); }
      }));
    });
  }
  function highlightSidebar() {
    var items = document.querySelectorAll('.nav-item');
    for (var i = 0; i < items.length; i++) items[i].classList.toggle('active', items[i].getAttribute('data-key') === state.key);
  }

  window.addEventListener('beforeunload', function (e) { if (state.dirty) { e.preventDefault(); e.returnValue = ''; } });

  buildSidebar();
})();

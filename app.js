const state = {
  lines: [],
};

const lineForm = document.querySelector('#line-form');
const timelinesEl = document.querySelector('#timelines');
const template = document.querySelector('#timeline-template');
const overviewSelectorEl = document.querySelector('#overview-selector');
const overviewCanvasEl = document.querySelector('#overview-canvas');

const formatDate = (value) => (value ? new Date(`${value}T00:00:00`).toLocaleDateString('es-ES') : '');

const sortItems = (items) => {
  return [...items].sort((a, b) => {
    const aDate = a.type === 'period' ? a.startDate : a.date;
    const bDate = b.type === 'period' ? b.startDate : b.date;
    return aDate.localeCompare(bDate);
  });
};

const selectedOverviewLines = new Set();

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderOverviewItem = (item) => {
  const dateLabel =
    item.type === 'event'
      ? `Fecha: ${formatDate(item.date)}`
      : `${formatDate(item.startDate)} → ${formatDate(item.endDate)}`;

  return `
    <li class="timeline-item ${escapeHtml(item.type)}">
      <h5>${escapeHtml(item.title)}</h5>
      <time>${escapeHtml(dateLabel)}</time>
      ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
    </li>
  `;
};

const renderOverview = () => {
  const lines = state.lines;

  lines.forEach((line) => {
    if (!selectedOverviewLines.has(line.id)) {
      selectedOverviewLines.add(line.id);
    }
  });

  [...selectedOverviewLines].forEach((lineId) => {
    if (!lines.some((line) => line.id === lineId)) {
      selectedOverviewLines.delete(lineId);
    }
  });

  overviewSelectorEl.innerHTML = '';
  lines.forEach((line) => {
    const label = document.createElement('label');
    label.className = 'overview-chip';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selectedOverviewLines.has(line.id);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selectedOverviewLines.add(line.id);
      else selectedOverviewLines.delete(line.id);
      renderOverview();
    });

    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = line.color;

    const text = document.createElement('span');
    text.textContent = line.name;

    label.append(checkbox, dot, text);
    overviewSelectorEl.appendChild(label);
  });

  const visible = lines.filter((line) => selectedOverviewLines.has(line.id));
  if (visible.length === 0) {
    overviewCanvasEl.innerHTML = '<p class="overview-empty">Selecciona una o varias líneas para mostrarlas aquí.</p>';
    return;
  }

  overviewCanvasEl.innerHTML = visible
    .map((line) => {
      const trackItems = sortItems(line.items).map(renderOverviewItem).join('');
      return `
        <article class="overview-line">
          <h4>${escapeHtml(line.name)}</h4>
          <ol class="overview-track ${escapeHtml(line.orientation)}" style="--line-color:${escapeHtml(line.color)}">
            ${trackItems || '<li class="timeline-item"><p>Sin elementos todavía.</p></li>'}
          </ol>
        </article>
      `;
    })
    .join('');
};

const saveState = () => {
  localStorage.setItem('timelines-v1', JSON.stringify(state.lines));
};

const loadState = () => {
  const saved = localStorage.getItem('timelines-v1');
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      state.lines = parsed;
    }
  } catch {
    state.lines = [];
  }
};

const openEditDialog = (lineId, itemId) => {
  const line = state.lines.find((entry) => entry.id === lineId);
  if (!line) return;
  const item = line.items.find((entry) => entry.id === itemId);
  if (!item) return;

  if (item.type === 'event') {
    const title = prompt('Título del evento:', item.title);
    if (title === null) return;
    const date = prompt('Fecha (YYYY-MM-DD):', item.date);
    if (date === null) return;
    const description = prompt('Descripción:', item.description ?? '');
    if (description === null) return;
    const image = prompt('URL de imagen:', item.image ?? '');
    if (image === null) return;
    const link = prompt('Link de referencia:', item.link ?? '');
    if (link === null) return;

    Object.assign(item, {
      title: title.trim(),
      date: date.trim(),
      description: description.trim(),
      image: image.trim(),
      link: link.trim(),
    });
  }

  if (item.type === 'period') {
    const title = prompt('Nombre del periodo:', item.title);
    if (title === null) return;
    const startDate = prompt('Inicio (YYYY-MM-DD):', item.startDate);
    if (startDate === null) return;
    const endDate = prompt('Fin (YYYY-MM-DD):', item.endDate);
    if (endDate === null) return;
    const description = prompt('Descripción:', item.description ?? '');
    if (description === null) return;

    Object.assign(item, {
      title: title.trim(),
      startDate: startDate.trim(),
      endDate: endDate.trim(),
      description: description.trim(),
    });
  }

  saveState();
  render();
};

const renderItem = (item, lineId) => {
  const li = document.createElement('li');
  li.className = `timeline-item ${item.type}`;

  const title = document.createElement('h5');
  title.textContent = item.title;
  li.appendChild(title);

  const dateText = document.createElement('time');
  dateText.textContent =
    item.type === 'event'
      ? `Fecha: ${formatDate(item.date)}`
      : `${formatDate(item.startDate)} → ${formatDate(item.endDate)}`;
  li.appendChild(dateText);

  if (item.description) {
    const desc = document.createElement('p');
    desc.textContent = item.description;
    li.appendChild(desc);
  }

  if (item.type === 'event' && (item.image || item.link)) {
    const linksBox = document.createElement('div');
    linksBox.className = 'item-links';

    if (item.image) {
      const imageLink = document.createElement('a');
      imageLink.href = item.image;
      imageLink.target = '_blank';
      imageLink.rel = 'noopener noreferrer';
      imageLink.textContent = 'Ver imagen';
      linksBox.appendChild(imageLink);

      const preview = document.createElement('img');
      preview.src = item.image;
      preview.alt = item.title;
      preview.style.width = '100%';
      preview.style.maxHeight = '140px';
      preview.style.objectFit = 'cover';
      preview.style.borderRadius = '8px';
      linksBox.appendChild(preview);
    }

    if (item.link) {
      const sourceLink = document.createElement('a');
      sourceLink.href = item.link;
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener noreferrer';
      sourceLink.textContent = 'Abrir referencia';
      linksBox.appendChild(sourceLink);
    }

    li.appendChild(linksBox);
  }

  const buttons = document.createElement('div');
  buttons.className = 'item-buttons';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.textContent = 'Editar';
  editBtn.addEventListener('click', () => openEditDialog(lineId, item.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete';
  deleteBtn.textContent = 'Eliminar';
  deleteBtn.addEventListener('click', () => {
    const line = state.lines.find((entry) => entry.id === lineId);
    if (!line) return;
    line.items = line.items.filter((entry) => entry.id !== item.id);
    saveState();
    render();
  });

  buttons.append(editBtn, deleteBtn);
  li.appendChild(buttons);

  return li;
};

const render = () => {
  timelinesEl.innerHTML = '';

  state.lines.forEach((line) => {
    const fragment = template.content.cloneNode(true);

    const titleEl = fragment.querySelector('.timeline-title');
    const subtitleEl = fragment.querySelector('.timeline-subtitle');
    const colorInput = fragment.querySelector('.line-color-input');
    const orientationSelect = fragment.querySelector('.orientation-select');
    const removeBtn = fragment.querySelector('.remove-line-btn');
    const eventForm = fragment.querySelector('.event-form');
    const periodForm = fragment.querySelector('.period-form');
    const track = fragment.querySelector('.timeline-track');

    titleEl.textContent = line.name;
    subtitleEl.textContent = `${line.items.length} elementos`;
    colorInput.value = line.color;
    orientationSelect.value = line.orientation;

    track.style.setProperty('--line-color', line.color);
    track.classList.add(line.orientation);

    sortItems(line.items).forEach((item) => {
      track.appendChild(renderItem(item, line.id));
    });

    colorInput.addEventListener('input', (event) => {
      line.color = event.target.value;
      saveState();
      render();
    });

    orientationSelect.addEventListener('change', (event) => {
      line.orientation = event.target.value;
      saveState();
      render();
    });

    removeBtn.addEventListener('click', () => {
      state.lines = state.lines.filter((entry) => entry.id !== line.id);
      saveState();
      render();
    });

    eventForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      line.items.push({
        id: crypto.randomUUID(),
        type: 'event',
        title: String(formData.get('title')).trim(),
        date: String(formData.get('date')),
        description: String(formData.get('description') ?? '').trim(),
        image: String(formData.get('image') ?? '').trim(),
        link: String(formData.get('link') ?? '').trim(),
      });

      event.currentTarget.reset();
      saveState();
      render();
    });

    periodForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const startDate = String(formData.get('startDate'));
      const endDate = String(formData.get('endDate'));

      if (endDate < startDate) {
        alert('La fecha final del periodo no puede ser anterior al inicio.');
        return;
      }

      line.items.push({
        id: crypto.randomUUID(),
        type: 'period',
        title: String(formData.get('title')).trim(),
        startDate,
        endDate,
        description: String(formData.get('description') ?? '').trim(),
      });

      event.currentTarget.reset();
      saveState();
      render();
    });

    timelinesEl.appendChild(fragment);
  });

  renderOverview();
};

lineForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);

  state.lines.push({
    id: crypto.randomUUID(),
    name: String(formData.get('name')).trim(),
    color: String(formData.get('color')),
    orientation: String(formData.get('orientation')),
    items: [],
  });

  event.currentTarget.reset();
  saveState();
  render();
});

loadState();
render();

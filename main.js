let allExtensions = [];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.extensions-container');
  const filterBtns = document.querySelectorAll('.filter-btn');

  fetch('./data.json')
    .then(res => res.json())
    .then(data => {
      allExtensions = data;
      renderExtensions(allExtensions);
    })
    .catch(err => console.error('Error loading JSON:', err));

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active')?.classList.remove('active');
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let filtered = allExtensions;

      if (filter === 'active') {
        filtered = allExtensions.filter(ext => ext.isActive);
      } else if (filter === 'inactive') {
        filtered = allExtensions.filter(ext => !ext.isActive);
      }

      renderExtensions(filtered);
    });
  });

  function renderExtensions(extensions) {
    container.innerHTML = '';
    extensions.forEach(extension => {
      const card = createCard(extension);
      container.appendChild(card);
    });
  }

  function createCard({ id, name, description, logo, isActive }) {
    const card = document.createElement('div');
    card.className = 'extension-card';

    card.innerHTML = `
      <img src="./assets/images/${logo}" alt="${name} Logo" class="extension-logo" />
      <h3 class="extension-name">${name}</h3>
      <p class="extension-description">${description}</p>

      <div class="switch-wrapper">
        <label class="switch">
          <input type="checkbox" ${isActive ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <button class="remove-btn">Remove</button>
    `;

    // Toggle switch logic
    const switchInput = card.querySelector('.switch input');
    switchInput.addEventListener('change', () => {
      const ext = allExtensions.find(ext => ext.id === id);
      if (ext) ext.isActive = switchInput.checked;

      // Re-filter based on current filter
      const activeBtn = document.querySelector('.filter-btn.active');
      activeBtn?.click(); // re-triggers current filter
    });

    // Remove logic
    const removeBtn = card.querySelector('.remove-btn');
    removeBtn.addEventListener('click', () => {
      allExtensions = allExtensions.filter(ext => ext.id !== id);
      const activeBtn = document.querySelector('.filter-btn.active');
      activeBtn?.click(); // re-render with filter re-applied
    });

    return card;
  }
});

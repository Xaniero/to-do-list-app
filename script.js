document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selection ---
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoDate = document.getElementById('todo-date');
  const todoCategory = document.getElementById('todo-category');
  const todoList = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const dateDisplay = document.getElementById('date-display');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sortSelect = document.getElementById('sort-select');
  const progressText = document.getElementById('progress-text');
  const progressCircle = document.getElementById('progress-circle');
  const toastContainer = document.getElementById('toast-container');

  // Modal Elements
  const editModal = document.getElementById('edit-modal');
  const editInput = document.getElementById('edit-input');
  const editDate = document.getElementById('edit-date');
  const editCategory = document.getElementById('edit-category');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnSaveEdit = document.getElementById('btn-save-edit');

  // --- App State ---
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  let currentFilter = 'all';
  let currentSort = 'newest';
  let currentEditId = null;

  // --- Initialize ---
  init();

  function init() {
    setupDateDisplay();
    renderTodos(true);
    setupEventListeners();
  }

  function setupEventListeners() {
    todoForm.addEventListener('submit', handleAddTodo);
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTodos(true); // Re-animate saat ganti tab
      });
    });

    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderTodos(true);
    });

    // Modal
    btnCloseModal.addEventListener('click', closeEditModal);
    btnSaveEdit.addEventListener('click', saveEditTodo);
    editModal.addEventListener('click', (e) => {
      if(e.target === editModal) closeEditModal();
    });
  }

  // --- Core Functions ---

  function setupDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('id-ID', options);
    dateDisplay.textContent = today;
  }

  function handleAddTodo(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    
    if (!text) {
      todoForm.classList.add('shake');
      showToast('Nama tugas tidak boleh kosong', 'error');
      setTimeout(() => todoForm.classList.remove('shake'), 500);
      return;
    }

    const newTodo = {
      id: Date.now(),
      text,
      deadline: todoDate.value,
      category: todoCategory.value,
      completed: false,
      createdAt: new Date()
    };

    todos.unshift(newTodo);
    saveLocal();
    renderTodos(true);
    
    // Reset form with animation
    todoInput.value = '';
    todoDate.value = '';
    showToast('Tugas baru ditambahkan', 'success');
  }

  function deleteTodo(id, element) {
    element.classList.add('slide-out');
    element.addEventListener('animationend', () => {
      todos = todos.filter(t => t.id !== id);
      saveLocal();
      renderTodos(false);
      showToast('Tugas dihapus', 'success');
    });
  }

  function toggleComplete(id) {
    let completedNow = false;
    
    todos = todos.map(t => {
      if (t.id === id) {
        completedNow = !t.completed; // Cek status baru
        return { ...t, completed: !t.completed };
      }
      return t;
    });

    saveLocal();
    
    // Jika tugas BARU SAJA dicentang selesai (completedNow === true)
    // Kita berikan sedikit delay agar user melihat animasi centang sebelum item hilang
    if (completedNow) {
      fireConfetti();
      showToast('Kerja bagus! Tugas selesai.', 'success');
      
      // Cari elemen di DOM untuk animasi keluar (opsional, biar halus)
      const itemEl = document.querySelector(`button[onclick*="${id}"]`)?.closest('li') || 
                     Array.from(document.querySelectorAll('li')).find(li => li.innerText.includes(todos.find(t=>t.id===id).text));
      
      if(itemEl) {
          // Render ulang segera untuk update logika
          renderTodos(false);
      } else {
          renderTodos(false);
      }
    } else {
      // Jika di-uncheck (dikembalikan ke aktif), langsung render
      renderTodos(false);
    }
  }

  // --- Sorting & Rendering Logic (BAGIAN YANG DIUBAH) ---

  function getSortedAndFilteredTodos() {
    let result = todos;

    // FILTER LOGIC DIPERBARUI:
    if (currentFilter === 'completed') {
      // Tab 'Selesai': Hanya tampilkan yang completed = true
      result = result.filter(t => t.completed);
    } else {
      // Tab 'Semua' (all) ATAU 'Proses' (active):
      // Hanya tampilkan yang completed = false (BELUM SELESAI)
      result = result.filter(t => !t.completed);
    }

    // Sort Logic
    return result.sort((a, b) => {
      if (currentSort === 'newest') return b.id - a.id;
      if (currentSort === 'az') return a.text.localeCompare(b.text);
      if (currentSort === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return 0;
    });
  }

  function renderTodos(animate = false) {
    const finalList = getSortedAndFilteredTodos();
    todoList.innerHTML = '';

    if (finalList.length === 0) {
      emptyState.classList.remove('hidden');
      // Ubah teks empty state sesuai konteks filter
      const emptyTitle = emptyState.querySelector('h3');
      const emptyDesc = emptyState.querySelector('p');
      if(currentFilter === 'completed') {
        emptyTitle.textContent = "Belum Ada yang Selesai";
        emptyDesc.textContent = "Ayo selesaikan tugasmu!";
      } else {
        emptyTitle.textContent = "Semua Beres!";
        emptyDesc.textContent = "Saatnya bersantai atau buat target baru.";
      }
    } else {
      emptyState.classList.add('hidden');
      
      finalList.forEach((todo, index) => {
        const li = createTodoElement(todo);
        if (animate) {
          li.style.animationDelay = `${index * 0.05}s`;
        } else {
          li.style.animation = 'none';
          li.style.opacity = '1';
          li.style.transform = 'translateY(0)';
        }
        todoList.appendChild(li);
      });
    }

    updateProgress();
  }

  function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    const icons = { business: '💼', personal: '🏠', shopping: '🛒', health: '💪' };
    const icon = icons[todo.category] || '📌';
    
    // Deadline Badge Logic
    let badgeHtml = '';
    if (todo.deadline && !todo.completed) {
      const today = new Date().setHours(0,0,0,0);
      const target = new Date(todo.deadline).setHours(0,0,0,0);
      const diff = (target - today) / (1000 * 60 * 60 * 24);
      
      let badgeClass = 'badge-grey';
      let badgeText = new Date(todo.deadline).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'});
      
      if (diff < 0) { badgeClass = 'badge-red'; badgeText = 'Terlewat'; }
      else if (diff === 0) { badgeClass = 'badge-yellow'; badgeText = 'Hari Ini'; }
      
      badgeHtml = `<span class="badge ${badgeClass}">${badgeText}</span>`;
    }

    li.innerHTML = `
      <div class="item-left">
        <div class="category-indicator">${icon}</div>
        <div class="text-content">
          <span class="todo-text">${todo.text}</span>
          <div class="meta-info">${badgeHtml}</div>
        </div>
      </div>
      <div class="item-actions">
        <button class="action-btn btn-check" title="Selesai/Batal"><i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i></button>
        <button class="action-btn btn-edit" title="Edit"><i class="fas fa-pen"></i></button>
        <button class="action-btn btn-delete" title="Hapus"><i class="fas fa-trash"></i></button>
      </div>
    `;

    // Bind Events
    li.querySelector('.btn-check').addEventListener('click', () => toggleComplete(todo.id));
    li.querySelector('.btn-edit').addEventListener('click', () => openEditModal(todo.id));
    li.querySelector('.btn-delete').addEventListener('click', () => deleteTodo(todo.id, li));

    return li;
  }

  // --- Utility Functions ---

  function updateProgress() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    // Update Text
    progressText.textContent = `${percent}%`;
    
    // Update Circle Stroke
    const radius = progressCircle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;
    
    progressCircle.style.strokeDashoffset = offset;
  }

  function saveLocal() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.5s forwards';
      toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
  }

  // --- Modal Logic ---
  function openEditModal(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    currentEditId = id;
    editInput.value = todo.text;
    editDate.value = todo.deadline || '';
    editCategory.value = todo.category || 'personal';
    editModal.classList.remove('hidden');
    editInput.focus();
  }

  function closeEditModal() {
    editModal.classList.add('hidden');
    currentEditId = null;
  }

  function saveEditTodo() {
    if (!currentEditId) return;
    const newText = editInput.value.trim();
    if (!newText) return showToast('Nama tidak boleh kosong', 'error');

    todos = todos.map(t => {
      if (t.id === currentEditId) {
        return { ...t, text: newText, deadline: editDate.value, category: editCategory.value };
      }
      return t;
    });
    
    saveLocal();
    renderTodos(false);
    closeEditModal();
    showToast('Tugas diperbarui', 'success');
  }

  // --- Confetti Effect ---
  function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for(let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: Math.random() * 10 + 5,
        h: Math.random() * 10 + 5,
        dx: (Math.random() - 0.5) * 10,
        dy: (Math.random() - 0.5) * 10 - 5,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        gravity: 0.1,
        drag: 0.96,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += p.gravity;
        p.dx *= p.drag;
        p.dy *= p.drag;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        if (p.y < canvas.height) activeParticles++;
      });

      if (activeParticles > 0) {
        requestAnimationFrame(animateConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    animateConfetti();
  }
});
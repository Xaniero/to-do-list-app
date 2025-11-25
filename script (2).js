// inisialisasi
document.addEventListener('DOMContentLoaded', function() {
  // Ambil referensi elemen DOM
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const errorMessage = document.getElementById('error-message');
  
  // Hapus contoh tugas awal
  const initialExample = todoList.querySelector('.todo-item');
  if (initialExample) {
    initialExample.remove();
  }
  
  // Event: tambah tugas baru
  todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validasi input
    const taskText = todoInput.value.trim();
    
    if (taskText === '') {
      errorMessage.textContent = 'Tugas tidak boleh kosong!';
      return;
    }
    
    // Reset pesan error
    errorMessage.textContent = '';
    
    // Buat elemen tugas baru
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    
    todoItem.innerHTML = `
      <span class="todo-text">${taskText}</span>
      <div class="todo-actions">
        <button class="btn-complete">Selesai</button>
        <button class="btn-delete">Hapus</button>
      </div>
    `;
    
    // Tambahkan ke daftar
    todoList.appendChild(todoItem);
    
    // Reset input
    todoInput.value = '';
    todoInput.focus();
  });
  
  // Event: tugas selesai dan tugas dihapus (event delegation)
  todoList.addEventListener('click', function(e) {
    const target = e.target;
    const todoItem = target.closest('.todo-item');
    
    if (!todoItem) return;
    
    // Event: tugas selesai
    if (target.classList.contains('btn-complete')) {
      todoItem.classList.toggle('completed');
      
      // Ubah teks tombol berdasarkan status
      if (todoItem.classList.contains('completed')) {
        target.textContent = 'Batal';
      } else {
        target.textContent = 'Selesai';
      }
    }
    
    // Event: tugas dihapus
    if (target.classList.contains('btn-delete')) {
      todoItem.remove();
    }
  });
});
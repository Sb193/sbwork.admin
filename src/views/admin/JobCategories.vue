<template>
  <div class="categories">
    <div class="page-header">
      <h1>Quản lý danh mục việc làm</h1>
      <button class="btn-add" @click="showAddModal = true">
        <i class="bi bi-plus"></i>
        Thêm danh mục
      </button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm theo tên danh mục..."
          @input="handleSearch"
        >
      </div>
      <div class="filter-group">
        <select v-model="statusFilter" @change="handleFilter">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Tạm dừng</option>
        </select>
      </div>
    </div>

    <!-- Categories Table -->
    <div class="table-container">
      <table class="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Mô tả</th>
            <th>Số lượng việc làm</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td>{{ category.id }}</td>
            <td>
              <div class="category-info">
                <span class="category-name">{{ category.name }}</span>
                <span class="category-slug">{{ category.slug }}</span>
              </div>
            </td>
            <td>{{ category.description }}</td>
            <td>{{ category.jobCount }}</td>
            <td>
              <span class="status-badge" :class="category.status">
                {{ category.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng' }}
              </span>
            </td>
            <td>{{ formatDate(category.createdAt) }}</td>
            <td>
              <div class="actions">
                <button class="btn-edit" @click="editCategory(category)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-delete" @click="confirmDelete(category)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button 
        class="btn-prev" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="bi bi-chevron-left"></i>
      </button>
      <span class="page-info">
        Trang {{ currentPage }} / {{ totalPages }}
      </span>
      <button 
        class="btn-next"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <i class="bi bi-chevron-right"></i>
      </button>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal" v-if="showAddModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục' }}</h2>
          <button class="btn-close" @click="closeModal">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Tên danh mục</label>
              <input type="text" v-model="formData.name" required>
            </div>
            <div class="form-group">
              <label>Slug</label>
              <input type="text" v-model="formData.slug" required>
              <small class="form-text">URL thân thiện, ví dụ: cong-nghe-thong-tin</small>
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="formData.description" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <label>Icon</label>
              <input type="text" v-model="formData.icon" placeholder="Tên icon Bootstrap">
              <small class="form-text">Ví dụ: bi-code-square</small>
            </div>
            <div class="form-group">
              <label>Màu sắc</label>
              <input type="color" v-model="formData.color" required>
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="formData.status" required>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeModal">
                Hủy
              </button>
              <button type="submit" class="btn-save">
                {{ editingCategory ? 'Cập nhật' : 'Thêm' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeletePopup
      :is-open="showDeleteConfirm"
      title="Xác nhận xóa danh mục"
      :message="'Bạn có chắc chắn muốn xóa danh mục ' + selectedCategory?.name + ' không?'"
      :details="'Hành động này không thể hoàn tác!'"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import DeletePopup from '@/components/DeletePopup.vue'

export default {
  name: 'AdminJobCategories',
  components: {
    DeletePopup
  },
  setup() {
    const categories = ref([
      {
        id: 1,
        name: 'Công nghệ thông tin',
        slug: 'cong-nghe-thong-tin',
        description: 'Các vị trí liên quan đến lập trình, phát triển phần mềm, quản trị hệ thống',
        jobCount: 150,
        icon: 'bi-code-square',
        color: '#1976d2',
        status: 'active',
        createdAt: '2024-01-01'
      },
      // Add more sample categories...
    ])

    const searchQuery = ref('')
    const statusFilter = ref('')
    const currentPage = ref(1)
    const totalPages = ref(5)
    const showAddModal = ref(false)
    const showDeleteModal = ref(false)
    const editingCategory = ref(null)
    const showDeleteConfirm = ref(false)
    const selectedCategory = ref(null)

    const formData = reactive({
      name: '',
      slug: '',
      description: '',
      icon: '',
      color: '#1976d2',
      status: 'active'
    })

    const handleSearch = () => {
      // Implement search logic
      console.log('Searching for:', searchQuery.value)
    }

    const handleFilter = () => {
      // Implement filter logic
      console.log('Filtering by:', {
        status: statusFilter.value
      })
    }

    const changePage = (page) => {
      currentPage.value = page
      // Implement pagination logic
    }

    const editCategory = (category) => {
      editingCategory.value = category
      Object.assign(formData, category)
      showAddModal.value = true
    }

    const confirmDelete = (category) => {
      selectedCategory.value = category
      showDeleteConfirm.value = true
    }

    const handleSubmit = () => {
      // Implement submit logic
      console.log('Submitting form:', formData)
      closeModal()
    }

    const closeModal = () => {
      showAddModal.value = false
      showDeleteModal.value = false
      editingCategory.value = null
      selectedCategory.value = null
      Object.assign(formData, {
        name: '',
        slug: '',
        description: '',
        icon: '',
        color: '#1976d2',
        status: 'active'
      })
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('vi-VN')
    }

    const closeDeleteModal = () => {
      showDeleteConfirm.value = false
      selectedCategory.value = null
    }

    const handleDelete = () => {
      // Implement delete logic
      console.log('Deleting category:', selectedCategory.value)
      closeDeleteModal()
    }

    return {
      categories,
      searchQuery,
      statusFilter,
      currentPage,
      totalPages,
      showAddModal,
      showDeleteModal,
      editingCategory,
      formData,
      handleSearch,
      handleFilter,
      changePage,
      editCategory,
      confirmDelete,
      handleSubmit,
      closeModal,
      formatDate,
      showDeleteConfirm,
      selectedCategory,
      closeDeleteModal,
      handleDelete
    }
  }
}
</script>

<style scoped>
.categories {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  color: var(--text-color);
  margin: 0;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  background: #357abd;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: 300px;
}

.search-box input {
  border: none;
  background: none;
  margin-left: 0.5rem;
  width: 100%;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-group select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow-x: auto;
}

.categories-table {
  width: 100%;
  border-collapse: collapse;
}

.categories-table th,
.categories-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.categories-table th {
  font-weight: 600;
  color: var(--text-secondary);
}

.category-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-name {
  font-weight: 500;
  color: var(--text-color);
}

.category-slug {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background: #f5f5f5;
  color: #757575;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #e3f2fd;
  color: #1976d2;
  border: none;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
  border: none;
}

.btn-edit:hover {
  background: #bbdefb;
}

.btn-delete:hover {
  background: #ffcdd2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-prev,
.btn-next {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-prev:disabled,
.btn-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-secondary);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: var(--text-color);
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-text {
  display: block;
  margin-top: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.warning-text {
  color: #c62828;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-save {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f5f5f5;
  color: var(--text-color);
  border: 1px solid #ddd;
}

.btn-save {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-cancel:hover {
  background: #eee;
}

.btn-save:hover {
  background: #357abd;
}

@media (max-width: 768px) {
  .categories {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }

  .filter-group {
    width: 100%;
  }

  .filter-group select {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .categories-table th:nth-child(3),
  .categories-table td:nth-child(3),
  .categories-table th:nth-child(4),
  .categories-table td:nth-child(4) {
    display: none;
  }

  .modal-content {
    margin: 1rem;
  }
}
</style> 
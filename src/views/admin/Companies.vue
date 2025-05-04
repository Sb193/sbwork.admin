<template>
  <div class="companies">
    <div class="page-header">
      <h1>Quản lý công ty</h1>
      <button class="btn-add" @click="showAddModal = true">
        <i class="bi bi-plus"></i>
        Thêm công ty
      </button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm theo tên công ty..."
          @input="handleSearch"
        >
      </div>
      <div class="filter-group">
        <select v-model="statusFilter" @change="handleFilter">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Tạm dừng</option>
          <option value="pending">Chờ xét duyệt</option>
        </select>
        <select v-model="sizeFilter" @change="handleFilter">
          <option value="">Tất cả quy mô</option>
          <option value="small">Dưới 50 nhân viên</option>
          <option value="medium">50-200 nhân viên</option>
          <option value="large">200-1000 nhân viên</option>
          <option value="enterprise">Trên 1000 nhân viên</option>
        </select>
      </div>
    </div>

    <!-- Companies Table -->
    <div class="table-container">
      <table class="companies-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Thông tin công ty</th>
            <th>Địa chỉ</th>
            <th>Quy mô</th>
            <th>Số lượng việc làm</th>
            <th>Trạng thái</th>
            <th>Ngày đăng ký</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="company in companies" :key="company.id">
            <td>{{ company.id }}</td>
            <td>
              <div class="company-info">
                <img :src="company.logo" :alt="company.name" class="company-logo">
                <div class="company-details">
                  <span class="company-name">{{ company.name }}</span>
                  <span class="company-industry">{{ company.industry }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="location-info">
                <i class="bi bi-geo-alt"></i>
                {{ company.location }}
              </div>
            </td>
            <td>
              <span class="size-badge" :class="company.size">
                {{ getSizeLabel(company.size) }}
              </span>
            </td>
            <td>{{ company.jobCount }}</td>
            <td>
              <span class="status-badge" :class="company.status">
                {{ getStatusLabel(company.status) }}
              </span>
            </td>
            <td>{{ formatDate(company.createdAt) }}</td>
            <td>
              <div class="actions">
                <button class="btn-edit" @click="editCompany(company)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-delete" @click="confirmDelete(company)">
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
          <h2>{{ editingCompany ? 'Chỉnh sửa công ty' : 'Thêm công ty' }}</h2>
          <button class="btn-close" @click="closeModal">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Tên công ty</label>
              <input type="text" v-model="formData.name" required>
            </div>
            <div class="form-group">
              <label>Logo</label>
              <div class="logo-upload">
                <img :src="formData.logoPreview || formData.logo" alt="Company Logo" class="logo-preview">
                <input 
                  type="file" 
                  accept="image/*"
                  @change="handleLogoUpload"
                  class="file-input"
                >
                <button type="button" class="btn-upload" @click="$refs.fileInput.click()">
                  <i class="bi bi-upload"></i>
                  Tải lên logo
                </button>
              </div>
            </div>
            <div class="form-group">
              <label>Ngành nghề</label>
              <select v-model="formData.industry" required>
                <option value="it">Công nghệ thông tin</option>
                <option value="finance">Tài chính</option>
                <option value="education">Giáo dục</option>
                <option value="healthcare">Y tế</option>
                <option value="retail">Bán lẻ</option>
              </select>
            </div>
            <div class="form-group">
              <label>Địa chỉ</label>
              <input type="text" v-model="formData.location" required>
            </div>
            <div class="form-group">
              <label>Website</label>
              <input type="url" v-model="formData.website" placeholder="https://">
            </div>
            <div class="form-group">
              <label>Quy mô</label>
              <select v-model="formData.size" required>
                <option value="small">Dưới 50 nhân viên</option>
                <option value="medium">50-200 nhân viên</option>
                <option value="large">200-1000 nhân viên</option>
                <option value="enterprise">Trên 1000 nhân viên</option>
              </select>
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="formData.description" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="formData.status" required>
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="pending">Chờ xét duyệt</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeModal">
                Hủy
              </button>
              <button type="submit" class="btn-save">
                {{ editingCompany ? 'Cập nhật' : 'Thêm' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeletePopup
      :is-open="showDeleteConfirm"
      title="Xác nhận xóa công ty"
      :message="'Bạn có chắc chắn muốn xóa công ty ' + selectedCompany?.name + ' không?'"
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
  name: 'AdminCompanies',
  components: {
    DeletePopup
  },
  setup() {
    const companies = ref([
      {
        id: 1,
        name: 'Tech Company',
        logo: 'https://via.placeholder.com/60',
        industry: 'it',
        location: 'Hà Nội',
        size: 'medium',
        jobCount: 15,
        status: 'active',
        createdAt: '2024-01-01'
      },
      // Add more sample companies...
    ])

    const searchQuery = ref('')
    const statusFilter = ref('')
    const sizeFilter = ref('')
    const currentPage = ref(1)
    const totalPages = ref(5)
    const showAddModal = ref(false)
    const showDeleteModal = ref(false)
    const editingCompany = ref(null)
    const showDeleteConfirm = ref(false)
    const selectedCompany = ref(null)

    const formData = reactive({
      name: '',
      logo: '',
      logoPreview: '',
      industry: '',
      location: '',
      website: '',
      size: '',
      description: '',
      status: 'pending'
    })

    const handleSearch = () => {
      // Implement search logic
      console.log('Searching for:', searchQuery.value)
    }

    const handleFilter = () => {
      // Implement filter logic
      console.log('Filtering by:', {
        status: statusFilter.value,
        size: sizeFilter.value
      })
    }

    const changePage = (page) => {
      currentPage.value = page
      // Implement pagination logic
    }

    const handleLogoUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          formData.logoPreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    }

    const editCompany = (company) => {
      editingCompany.value = company
      Object.assign(formData, {
        ...company,
        logoPreview: company.logo
      })
      showAddModal.value = true
    }

    const confirmDelete = (company) => {
      selectedCompany.value = company
      showDeleteConfirm.value = true
    }

    const closeDeleteModal = () => {
      showDeleteConfirm.value = false
      selectedCompany.value = null
    }

    const handleDelete = () => {
      // Implement delete logic
      console.log('Deleting company:', selectedCompany.value)
      closeDeleteModal()
    }

    const handleSubmit = () => {
      // Implement submit logic
      console.log('Submitting form:', formData)
      closeModal()
    }

    const closeModal = () => {
      showAddModal.value = false
      showDeleteModal.value = false
      editingCompany.value = null
      selectedCompany.value = null
      Object.assign(formData, {
        name: '',
        logo: '',
        logoPreview: '',
        industry: '',
        location: '',
        website: '',
        size: '',
        description: '',
        status: 'pending'
      })
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('vi-VN')
    }

    const getSizeLabel = (size) => {
      const sizes = {
        small: 'Dưới 50 nhân viên',
        medium: '50-200 nhân viên',
        large: '200-1000 nhân viên',
        enterprise: 'Trên 1000 nhân viên'
      }
      return sizes[size] || size
    }

    const getStatusLabel = (status) => {
      const statuses = {
        active: 'Đang hoạt động',
        inactive: 'Tạm dừng',
        pending: 'Chờ xét duyệt'
      }
      return statuses[status] || status
    }

    return {
      companies,
      searchQuery,
      statusFilter,
      sizeFilter,
      currentPage,
      totalPages,
      showAddModal,
      showDeleteModal,
      editingCompany,
      formData,
      handleSearch,
      handleFilter,
      changePage,
      handleLogoUpload,
      editCompany,
      confirmDelete,
      handleSubmit,
      closeModal,
      formatDate,
      getSizeLabel,
      getStatusLabel,
      showDeleteConfirm,
      selectedCompany,
      closeDeleteModal,
      handleDelete
    }
  }
}
</script>

<style scoped>
.companies {
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

.companies-table {
  width: 100%;
  border-collapse: collapse;
}

.companies-table th,
.companies-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.companies-table th {
  font-weight: 600;
  color: var(--text-secondary);
}

.company-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.company-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.company-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.company-name {
  font-weight: 500;
  color: var(--text-color);
}

.company-industry {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.location-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.size-badge,
.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.size-badge.small {
  background: #e3f2fd;
  color: #1976d2;
}

.size-badge.medium {
  background: #e8f5e9;
  color: #2e7d32;
}

.size-badge.large {
  background: #fff3e0;
  color: #f57c00;
}

.size-badge.enterprise {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background: #f5f5f5;
  color: #757575;
}

.status-badge.pending {
  background: #fff3e0;
  color: #f57c00;
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

.logo-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.logo-preview {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.file-input {
  display: none;
}

.btn-upload {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: #f5f5f5;
  color: var(--text-color);
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-upload:hover {
  background: #eee;
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
  .companies {
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
  .companies-table th:nth-child(3),
  .companies-table td:nth-child(3),
  .companies-table th:nth-child(4),
  .companies-table td:nth-child(4) {
    display: none;
  }

  .modal-content {
    margin: 1rem;
  }
}
</style> 
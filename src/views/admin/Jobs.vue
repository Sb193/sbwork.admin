<template>
  <div class="jobs">
    <div class="page-header">
      <h1>Quản lý tin tuyển dụng</h1>
      <button class="btn-add" @click="showAddModal = true">
        <i class="bi bi-plus"></i>
        Thêm tin tuyển dụng
      </button>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="search-box">
        <i class="bi bi-search"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Tìm kiếm theo tiêu đề, công ty..."
          @input="handleSearch"
        >
      </div>
      <div class="filter-group">
        <select v-model="categoryFilter" @change="handleFilter">
          <option value="">Tất cả ngành nghề</option>
          <option value="it">Công nghệ thông tin</option>
          <option value="marketing">Marketing</option>
          <option value="design">Thiết kế</option>
          <option value="finance">Tài chính</option>
        </select>
        <select v-model="statusFilter" @change="handleFilter">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang tuyển</option>
          <option value="inactive">Tạm dừng</option>
          <option value="closed">Đã đóng</option>
        </select>
        <select v-model="typeFilter" @change="handleFilter">
          <option value="">Tất cả loại hình</option>
          <option value="fulltime">Toàn thời gian</option>
          <option value="parttime">Bán thời gian</option>
          <option value="intern">Thực tập</option>
        </select>
      </div>
    </div>

    <!-- Jobs Table -->
    <div class="table-container">
      <table class="jobs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Công ty</th>
            <th>Ngành nghề</th>
            <th>Loại hình</th>
            <th>Lương</th>
            <th>Trạng thái</th>
            <th>Ngày đăng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.id">
            <td>{{ job.id }}</td>
            <td>
              <div class="job-info">
                <span class="job-title">{{ job.title }}</span>
                <span class="job-location">
                  <i class="bi bi-geo-alt"></i>
                  {{ job.location }}
                </span>
              </div>
            </td>
            <td>
              <div class="company-info">
                <img :src="job.companyLogo" :alt="job.companyName" class="company-logo">
                <span>{{ job.companyName }}</span>
              </div>
            </td>
            <td>
              <span class="category-badge" :class="job.category">
                {{ job.category }}
              </span>
            </td>
            <td>
              <span class="type-badge" :class="job.type">
                {{ job.type }}
              </span>
            </td>
            <td>{{ formatSalary(job.salary) }}</td>
            <td>
              <span class="status-badge" :class="job.status">
                {{ job.status }}
              </span>
            </td>
            <td>{{ formatDate(job.postedAt) }}</td>
            <td>
              <div class="actions">
                <button class="btn-edit" @click="editJob(job)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-delete" @click="confirmDelete(job)">
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
          <h2>{{ editingJob ? 'Chỉnh sửa tin tuyển dụng' : 'Thêm tin tuyển dụng' }}</h2>
          <button class="btn-close" @click="closeModal">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Tiêu đề</label>
              <input type="text" v-model="formData.title" required>
            </div>
            <div class="form-group">
              <label>Công ty</label>
              <select v-model="formData.companyId" required>
                <option value="">Chọn công ty</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Ngành nghề</label>
              <select v-model="formData.category" required>
                <option value="it">Công nghệ thông tin</option>
                <option value="marketing">Marketing</option>
                <option value="design">Thiết kế</option>
                <option value="finance">Tài chính</option>
              </select>
            </div>
            <div class="form-group">
              <label>Loại hình</label>
              <select v-model="formData.type" required>
                <option value="fulltime">Toàn thời gian</option>
                <option value="parttime">Bán thời gian</option>
                <option value="intern">Thực tập</option>
              </select>
            </div>
            <div class="form-group">
              <label>Lương</label>
              <div class="salary-inputs">
                <input type="number" v-model="formData.minSalary" placeholder="Tối thiểu" required>
                <span>-</span>
                <input type="number" v-model="formData.maxSalary" placeholder="Tối đa" required>
                <select v-model="formData.salaryType" required>
                  <option value="vnd">VND</option>
                  <option value="usd">USD</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Địa điểm</label>
              <input type="text" v-model="formData.location" required>
            </div>
            <div class="form-group">
              <label>Mô tả</label>
              <textarea v-model="formData.description" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <label>Yêu cầu</label>
              <textarea v-model="formData.requirements" rows="4" required></textarea>
            </div>
            <div class="form-group">
              <label>Trạng thái</label>
              <select v-model="formData.status" required>
                <option value="active">Đang tuyển</option>
                <option value="inactive">Tạm dừng</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeModal">
                Hủy
              </button>
              <button type="submit" class="btn-save">
                {{ editingJob ? 'Cập nhật' : 'Thêm' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeletePopup
      :is-open="showDeleteConfirm"
      title="Xác nhận xóa tin tuyển dụng"
      :message="'Bạn có chắc chắn muốn xóa tin tuyển dụng ' + selectedJob?.title + ' không?'"
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
  name: 'AdminJobs',
  components: {
    DeletePopup
  },
  setup() {
    const jobs = ref([
      {
        id: 1,
        title: 'Senior Frontend Developer',
        companyName: 'Tech Company',
        companyLogo: 'https://via.placeholder.com/40',
        category: 'it',
        type: 'fulltime',
        salary: {
          min: 20000000,
          max: 30000000,
          type: 'vnd'
        },
        location: 'Hà Nội',
        status: 'active',
        postedAt: '2024-01-01'
      },
      // Add more sample jobs...
    ])

    const companies = ref([
      {
        id: 1,
        name: 'Tech Company'
      },
      // Add more sample companies...
    ])

    const searchQuery = ref('')
    const categoryFilter = ref('')
    const statusFilter = ref('')
    const typeFilter = ref('')
    const currentPage = ref(1)
    const totalPages = ref(5)
    const showAddModal = ref(false)
    const showDeleteModal = ref(false)
    const editingJob = ref(null)
    const showDeleteConfirm = ref(false)
    const selectedJob = ref(null)

    const formData = reactive({
      title: '',
      companyId: '',
      category: '',
      type: '',
      minSalary: '',
      maxSalary: '',
      salaryType: 'vnd',
      location: '',
      description: '',
      requirements: '',
      status: ''
    })

    const handleSearch = () => {
      // Implement search logic
      console.log('Searching for:', searchQuery.value)
    }

    const handleFilter = () => {
      // Implement filter logic
      console.log('Filtering by:', {
        category: categoryFilter.value,
        status: statusFilter.value,
        type: typeFilter.value
      })
    }

    const changePage = (page) => {
      currentPage.value = page
      // Implement pagination logic
    }

    const editJob = (job) => {
      editingJob.value = job
      Object.assign(formData, {
        ...job,
        minSalary: job.salary.min,
        maxSalary: job.salary.max,
        salaryType: job.salary.type
      })
      showAddModal.value = true
    }

    const confirmDelete = (job) => {
      selectedJob.value = job
      showDeleteConfirm.value = true
    }

    const closeDeleteModal = () => {
      showDeleteConfirm.value = false
      selectedJob.value = null
    }

    const handleDelete = () => {
      // Implement delete logic
      console.log('Deleting job:', selectedJob.value)
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
      editingJob.value = null
      selectedJob.value = null
      Object.assign(formData, {
        title: '',
        companyId: '',
        category: '',
        type: '',
        minSalary: '',
        maxSalary: '',
        salaryType: 'vnd',
        location: '',
        description: '',
        requirements: '',
        status: ''
      })
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('vi-VN')
    }

    const formatSalary = (salary) => {
      const min = salary.min.toLocaleString('vi-VN')
      const max = salary.max.toLocaleString('vi-VN')
      const type = salary.type === 'vnd' ? 'VND' : 'USD'
      return `${min} - ${max} ${type}`
    }

    return {
      jobs,
      companies,
      searchQuery,
      categoryFilter,
      statusFilter,
      typeFilter,
      currentPage,
      totalPages,
      showAddModal,
      showDeleteModal,
      editingJob,
      formData,
      handleSearch,
      handleFilter,
      changePage,
      editJob,
      confirmDelete,
      handleSubmit,
      closeModal,
      formatDate,
      formatSalary,
      showDeleteConfirm,
      selectedJob,
      closeDeleteModal,
      handleDelete
    }
  }
}
</script>

<style scoped>
.jobs {
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

.jobs-table {
  width: 100%;
  border-collapse: collapse;
}

.jobs-table th,
.jobs-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.jobs-table th {
  font-weight: 600;
  color: var(--text-secondary);
}

.job-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.job-title {
  font-weight: 500;
  color: var(--text-color);
}

.job-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.company-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.category-badge,
.type-badge,
.status-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.category-badge.it {
  background: #e3f2fd;
  color: #1976d2;
}

.category-badge.marketing {
  background: #e8f5e9;
  color: #2e7d32;
}

.category-badge.design {
  background: #fff3e0;
  color: #f57c00;
}

.category-badge.finance {
  background: #f3e5f5;
  color: #7b1fa2;
}

.type-badge.fulltime {
  background: #e3f2fd;
  color: #1976d2;
}

.type-badge.parttime {
  background: #fff3e0;
  color: #f57c00;
}

.type-badge.intern {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-badge.inactive {
  background: #f5f5f5;
  color: #757575;
}

.status-badge.closed {
  background: #ffebee;
  color: #c62828;
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

.salary-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.salary-inputs input {
  flex: 1;
}

.salary-inputs select {
  width: 80px;
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
  .jobs {
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
  .jobs-table th:nth-child(3),
  .jobs-table td:nth-child(3),
  .jobs-table th:nth-child(5),
  .jobs-table td:nth-child(5) {
    display: none;
  }

  .modal-content {
    margin: 1rem;
  }
}
</style> 
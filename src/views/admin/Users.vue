<template>
  <div class="users">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="page-title">Quản lý người dùng</h1>
      <button class="btn btn-primary" @click="showAddModal">
        <i class="bi bi-plus-lg"></i>
        Thêm người dùng
      </button>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                class="form-control" 
                v-model="searchQuery"
                placeholder="Tìm kiếm theo tên hoặc email..."
                @input="handleSearch"
              >
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="roleFilter" @change="handleFilter">
              <option value="">Tất cả vai trò</option>
              <option value="user">Người dùng</option>
              <option value="company">Công ty</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="statusFilter" @change="handleFilter">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="suspended">Đã khóa</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ảnh đại diện</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>
                  <div class="avatar">
                    <img :src="user.avatar" :alt="user.name">
                  </div>
                </td>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" :class="getRoleClass(user.role)">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="getStatusClass(user.status)">
                    {{ getStatusLabel(user.status) }}
                  </span>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <div class="btn-group">
                    <button 
                      class="btn btn-sm btn-outline-primary"
                      @click="showEditModal(user)"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger"
                      @click="showDeleteModal(user)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="d-flex justify-content-between align-items-center mt-4">
          <div class="text-muted">
            Hiển thị {{ pagination.start }} đến {{ pagination.end }} trong tổng số {{ pagination.total }} người dùng
          </div>
          <nav>
            <ul class="pagination mb-0">
              <li class="page-item" :class="{ disabled: pagination.currentPage === 1 }">
                <button class="page-link" @click="prevPage">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              <li 
                v-for="page in pagination.pages" 
                :key="page"
                class="page-item"
                :class="{ active: page === pagination.currentPage }"
              >
                <button class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{ disabled: pagination.currentPage === pagination.totalPages }">
                <button class="page-link" @click="nextPage">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" :class="{ show: showModal }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Tên</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    v-model="formData.name"
                    required
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    v-model="formData.email"
                    required
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">Mật khẩu</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    v-model="formData.password"
                    :required="!isEditMode"
                  >
                </div>
                <div class="col-md-6">
                  <label class="form-label">Vai trò</label>
                  <select class="form-select" v-model="formData.role" required>
                    <option value="user">Người dùng</option>
                    <option value="company">Công ty</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Trạng thái</label>
                  <select class="form-select" v-model="formData.status" required>
                    <option value="active">Đang hoạt động</option>
                    <option value="suspended">Đã khóa</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ảnh đại diện</label>
                  <input 
                    type="file" 
                    class="form-control" 
                    accept="image/*"
                    @change="handleAvatarChange"
                  >
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Hủy
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="handleSubmit"
            >
              {{ isEditMode ? 'Cập nhật' : 'Thêm' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Replace old delete modal with new DeletePopup component -->
    <DeletePopup
      :is-open="showDeleteConfirm"
      title="Xác nhận xóa người dùng"
      :message="'Bạn có chắc chắn muốn xóa người dùng ' + selectedUser?.name + ' không?'"
      :details="'Hành động này không thể hoàn tác!'"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import DeletePopup from '@/components/DeletePopup.vue'

export default {
  name: 'AdminUsers',
  components: {
    DeletePopup
  },
  setup() {
    // State
    const users = ref([
      {
        id: 1,
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        role: 'user',
        status: 'active',
        avatar: 'https://via.placeholder.com/40',
        createdAt: '2024-01-01'
      },
      // Add more sample users...
    ])

    const searchQuery = ref('')
    const roleFilter = ref('')
    const statusFilter = ref('')
    const showModal = ref(false)
    const showDeleteConfirm = ref(false)
    const isEditMode = ref(false)
    const selectedUser = ref(null)

    const formData = ref({
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active',
      avatar: null
    })

    const pagination = ref({
      currentPage: 1,
      itemsPerPage: 10,
      total: 0,
      totalPages: 0,
      start: 0,
      end: 0,
      pages: []
    })

    // Computed
    const filteredUsers = computed(() => {
      let result = users.value

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(user => 
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        )
      }

      if (roleFilter.value) {
        result = result.filter(user => user.role === roleFilter.value)
      }

      if (statusFilter.value) {
        result = result.filter(user => user.status === statusFilter.value)
      }

      // Update pagination
      pagination.value.total = result.length
      pagination.value.totalPages = Math.ceil(result.length / pagination.value.itemsPerPage)
      pagination.value.pages = Array.from(
        { length: pagination.value.totalPages },
        (_, i) => i + 1
      )

      // Calculate start and end
      const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
      const end = start + pagination.value.itemsPerPage
      pagination.value.start = start + 1
      pagination.value.end = Math.min(end, result.length)

      return result.slice(start, end)
    })

    // Methods
    const handleSearch = () => {
      pagination.value.currentPage = 1
    }

    const handleFilter = () => {
      pagination.value.currentPage = 1
    }

    const showAddModal = () => {
      isEditMode.value = false
      formData.value = {
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active',
        avatar: null
      }
      showModal.value = true
    }

    const showEditModal = (user) => {
      isEditMode.value = true
      selectedUser.value = user
      formData.value = { ...user }
      showModal.value = true
    }

    const showDeleteModal = (user) => {
      selectedUser.value = user
      showDeleteConfirm.value = true
    }

    const closeModal = () => {
      showModal.value = false
      formData.value = {
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active',
        avatar: null
      }
    }

    const closeDeleteModal = () => {
      showDeleteConfirm.value = false
      selectedUser.value = null
    }

    const handleSubmit = () => {
      if (isEditMode.value) {
        // Update user
        const index = users.value.findIndex(u => u.id === selectedUser.value.id)
        if (index !== -1) {
          users.value[index] = { ...formData.value }
        }
      } else {
        // Add new user
        const newUser = {
          id: users.value.length + 1,
          ...formData.value,
          createdAt: new Date().toISOString().split('T')[0]
        }
        users.value.push(newUser)
      }
      closeModal()
    }

    const handleDelete = async () => {
      try {
        // Implement delete logic here
        console.log('Deleting user:', selectedUser.value)
        closeDeleteModal()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }

    const handleAvatarChange = (event) => {
      const file = event.target.files[0]
      if (file) {
        formData.value.avatar = URL.createObjectURL(file)
      }
    }

    const getRoleClass = (role) => {
      switch (role) {
        case 'admin':
          return 'bg-danger'
        case 'company':
          return 'bg-success'
        default:
          return 'bg-primary'
      }
    }

    const getRoleLabel = (role) => {
      switch (role) {
        case 'admin':
          return 'Quản trị viên'
        case 'company':
          return 'Công ty'
        default:
          return 'Người dùng'
      }
    }

    const getStatusClass = (status) => {
      return status === 'active' ? 'bg-success' : 'bg-warning'
    }

    const getStatusLabel = (status) => {
      return status === 'active' ? 'Đang hoạt động' : 'Đã khóa'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('vi-VN')
    }

    const prevPage = () => {
      if (pagination.value.currentPage > 1) {
        pagination.value.currentPage--
      }
    }

    const nextPage = () => {
      if (pagination.value.currentPage < pagination.value.totalPages) {
        pagination.value.currentPage++
      }
    }

    const goToPage = (page) => {
      pagination.value.currentPage = page
    }

    return {
      users,
      searchQuery,
      roleFilter,
      statusFilter,
      showModal,
      showDeleteConfirm,
      isEditMode,
      selectedUser,
      formData,
      pagination,
      filteredUsers,
      handleSearch,
      handleFilter,
      showAddModal,
      showEditModal,
      showDeleteModal,
      closeModal,
      closeDeleteModal,
      handleSubmit,
      handleDelete,
      handleAvatarChange,
      getRoleClass,
      getRoleLabel,
      getStatusClass,
      getStatusLabel,
      formatDate,
      prevPage,
      nextPage,
      goToPage
    }
  }
}
</script>

<style scoped>
.users {
  padding: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}

.card {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  margin-bottom: 1.5rem;
}

.card-body {
  padding: 1.25rem;
}

.table {
  margin-bottom: 0;
}

.table th {
  font-weight: 600;
  color: var(--text-color);
  background-color: #f8f9fc;
  border-bottom: 1px solid #e3e6f0;
}

.table td {
  vertical-align: middle;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge {
  padding: 0.5em 0.75em;
  font-weight: 500;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal.show {
  display: block;
}

.modal-dialog {
  margin: 1.75rem auto;
}

.modal-content {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  border-bottom: 1px solid #e3e6f0;
  padding: 1rem 1.25rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-color);
}

.modal-body {
  padding: 1.25rem;
}

.modal-footer {
  border-top: 1px solid #e3e6f0;
  padding: 1rem 1.25rem;
}

.form-label {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border: 1px solid #d1d3e2;
  border-radius: 0.35rem;
  padding: 0.375rem 0.75rem;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
}

.btn-group {
  gap: 0.25rem;
}

.btn {
  padding: 0.375rem 0.75rem;
  font-weight: 500;
  border-radius: 0.35rem;
}

.btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #2e59d9;
  border-color: #2653d4;
}

.btn-outline-primary {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-outline-primary:hover {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-outline-danger {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.btn-outline-danger:hover {
  background-color: var(--danger-color);
  border-color: var(--danger-color);
}

.pagination {
  margin-bottom: 0;
}

.page-link {
  color: var(--primary-color);
  border: 1px solid #d1d3e2;
  padding: 0.5rem 0.75rem;
}

.page-item.active .page-link {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.page-item.disabled .page-link {
  color: #858796;
  background-color: #fff;
  border-color: #d1d3e2;
}

@media (max-width: 768px) {
  .users {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .table-responsive {
    margin: 0 -0.5rem;
  }
  
  .modal-dialog {
    margin: 0.5rem;
  }
}
</style> 
<template>
  <div class="admin-layout">
    <!-- Sidebar Toggle Button -->
    <button class="sidebar-toggle" @click="toggleSidebar">
      <i class="bi bi-list"></i>
    </button>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed, 'show': isSidebarOpen }">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <i class="bi bi-briefcase-fill"></i>
          </div>
          <h1 v-if="!isSidebarCollapsed">Sbwork Admin</h1>
        </div>
        <button class="btn-toggle" @click="toggleSidebar" v-if="!isMobile">
          <i class="bi" :class="isSidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin" class="nav-item" active-class="active">
          <i class="bi bi-speedometer2"></i>
          <span v-if="!isSidebarCollapsed">Tổng quan</span>
        </router-link>
        <router-link to="/admin/users" class="nav-item" active-class="active">
          <i class="bi bi-people"></i>
          <span v-if="!isSidebarCollapsed">Quản lý người dùng</span>
        </router-link>
        <router-link to="/admin/companies" class="nav-item" active-class="active">
          <i class="bi bi-building"></i>
          <span v-if="!isSidebarCollapsed">Quản lý công ty</span>
        </router-link>
        <router-link to="/admin/jobs" class="nav-item" active-class="active">
          <i class="bi bi-briefcase"></i>
          <span v-if="!isSidebarCollapsed">Quản lý tin tuyển dụng</span>
        </router-link>
        <router-link to="/admin/categories" class="nav-item" active-class="active">
          <i class="bi bi-tags"></i>
          <span v-if="!isSidebarCollapsed">Quản lý danh mục</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="avatar">
            <i class="bi bi-person-circle"></i>
          </div>
          <div v-if="!isSidebarCollapsed" class="user-details">
            <span class="username">{{ username }}</span>
            <span class="role">Administrator</span>
          </div>
        </div>
        <button class="btn-logout" @click="handleLogout">
          <i class="bi bi-box-arrow-right"></i>
          <span v-if="!isSidebarCollapsed">Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'main-content-expanded': isSidebarCollapsed }">
      <!-- Top Bar -->
      <header class="top-bar">
        <div class="top-bar-left">
          <div class="search-box" v-if="!isMobile">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Tìm kiếm..."
              @input="handleSearch"
            >
          </div>
        </div>
        <div class="top-bar-right">
          <div class="notifications" v-if="!isMobile">
            <i class="bi bi-bell"></i>
            <span class="badge">3</span>
          </div>
          <div class="user-menu">
            <div class="avatar">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="user-menu-dropdown">
              <div class="user-info">
                <div class="avatar">
                  <i class="bi bi-person-circle"></i>
                </div>
                <div class="user-details">
                  <span class="username">{{ username }}</span>
                  <span class="email">{{ userEmail }}</span>
                </div>
              </div>
              <div class="menu-items">
                <router-link to="/admin/profile" class="menu-item">
                  <i class="bi bi-person"></i>
                  <span>Hồ sơ</span>
                </router-link>
                <router-link to="/admin/settings" class="menu-item">
                  <i class="bi bi-gear"></i>
                  <span>Cài đặt</span>
                </router-link>
                <button class="menu-item" @click="handleLogout">
                  <i class="bi bi-box-arrow-right"></i>
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const isSidebarCollapsed = ref(false)
    const isSidebarOpen = ref(false)
    const isMobile = ref(false)
    const searchQuery = ref('')
    const username = ref('Admin')
    const userEmail = ref('admin@sbwork.com')

    const checkMobile = () => {
      isMobile.value = window.innerWidth <= 768
    }

    onMounted(() => {
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
    })

    const toggleSidebar = () => {
      if (isMobile.value) {
        isSidebarOpen.value = !isSidebarOpen.value
      } else {
        isSidebarCollapsed.value = !isSidebarCollapsed.value
      }
    }

    const handleSearch = () => {
      // Implement search logic
      console.log('Searching for:', searchQuery.value)
    }

    const handleLogout = () => {
      // Implement logout logic
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      router.push('/login')
    }

    return {
      isSidebarCollapsed,
      isSidebarOpen,
      isMobile,
      searchQuery,
      username,
      userEmail,
      toggleSidebar,
      handleSearch,
      handleLogout
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: white;
  box-shadow: 2px 0 4px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: fixed;
  height: 100vh;
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--primary-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.logo h1 {
  font-size: 1.2rem;
  color: var(--text-color);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.btn-toggle:hover {
  background: #f5f5f5;
}

.sidebar-nav {
  padding: 1rem 0;
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.nav-item i {
  font-size: 1.2rem;
  min-width: 24px;
  flex-shrink: 0;
}

.nav-item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-item:hover {
  background: #f5f5f5;
}

.nav-item.active {
  background: var(--primary-color);
  color: white;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #eee;
  position: sticky;
  bottom: 0;
  background: white;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 1.5rem;
  flex-shrink: 0;
}

.user-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.username {
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role, .email {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.8rem;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: #eee;
}

/* Main Content Styles */
.main-content {
  margin-left: 280px;
  flex: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content-expanded {
  margin-left: 80px;
}

.top-bar {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 99;
}

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  width: 300px;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  background: white;
  box-shadow: 0 0 0 2px var(--primary-color);
}

.search-box input {
  border: none;
  background: none;
  margin-left: 0.5rem;
  width: 100%;
  outline: none;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.notifications {
  position: relative;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.notifications:hover {
  background: #f5f5f5;
}

.notifications .badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #f44336;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  position: relative;
  cursor: pointer;
}

.user-menu .avatar {
  transition: all 0.3s ease;
}

.user-menu:hover .avatar {
  background: #f5f5f5;
}

.user-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 250px;
  padding: 1rem;
  display: none;
  margin-top: 0.5rem;
}

.user-menu:hover .user-menu-dropdown {
  display: block;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-items {
  margin-top: 1rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f5f5;
}

.content {
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .sidebar {
    width: 80px;
  }

  .sidebar-header h1,
  .nav-item span,
  .user-details,
  .btn-logout span {
    display: none;
  }

  .main-content {
    margin-left: 80px;
  }

  .search-box {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .sidebar-toggle {
    display: flex;
  }

  .top-bar {
    padding: 1rem;
    justify-content: flex-end;
  }

  .search-box {
    display: none;
  }

  .notifications {
    display: none;
  }

  .sidebar {
    width: 280px;
    transform: translateX(-100%);
    position: fixed;
    top: 0;
    left: 0;
  }

  .sidebar.show {
    transform: translateX(0);
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
  }

  .main-content {
    margin-left: 0;
  }

  .content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
  }

  .sidebar-toggle {
    top: 0.75rem;
    left: 0.75rem;
    width: 36px;
    height: 36px;
  }

  .top-bar {
    padding: 0.75rem;
  }

  .user-menu .avatar {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }

  .user-menu-dropdown {
    width: 100%;
    max-width: 280px;
    right: 0.75rem;
  }
}

.sidebar-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 101;
  background: var(--primary-color);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

@media (min-width: 769px) {
  .sidebar-toggle {
    display: none;
  }
}

@media (max-width: 768px) {
  .sidebar-toggle {
    display: flex;
  }
}
</style> 
<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="logo-container">
          <img src="../assets/logo.png" alt="Logo" class="logo">
          <h1>SB Work Admin</h1>
        </div>
        <p class="welcome-text">Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label class="form-label">
            <i class="bi bi-envelope"></i>
            Email
          </label>
          <div class="input-group">
            <input 
              type="email" 
              v-model="email" 
              placeholder="Nhập email của bạn"
              required
              class="form-input"
            >
            <i class="bi bi-check-circle-fill input-icon success" v-if="email && isValidEmail"></i>
            <i class="bi bi-exclamation-circle-fill input-icon error" v-if="email && !isValidEmail"></i>
          </div>
          <span class="error-message" v-if="email && !isValidEmail">Email không hợp lệ</span>
        </div>

        <div class="form-group">
          <label class="form-label">
            <i class="bi bi-lock"></i>
            Mật khẩu
          </label>
          <div class="input-group">
            <input 
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Nhập mật khẩu"
              required
              class="form-input"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe">
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <a href="#" class="forgot-password">Quên mật khẩu?</a>
        </div>

        <button type="submit" class="login-button" :disabled="isLoading || !isValidEmail">
          <span v-if="!isLoading">Đăng nhập</span>
          <div v-else class="spinner"></div>
        </button>

        <div v-if="error" class="error-message">
          <i class="bi bi-exclamation-circle"></i>
          {{ error }}
        </div>
      </form>

      <div class="login-footer">
        <p>© 2024 SB Work Admin. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const rememberMe = ref(false)
    const showPassword = ref(false)
    const isLoading = ref(false)
    const error = ref('')

    const isValidEmail = computed(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email.value)
    })

    const handleLogin = async () => {
      try {
        isLoading.value = true
        error.value = ''
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Add your login logic here
        if (email.value === 'admin@example.com' && password.value === 'password') {
          router.push('/admin')
        } else {
          throw new Error('Email hoặc mật khẩu không chính xác')
        }
      } catch (err) {
        error.value = err.message
      } finally {
        isLoading.value = false
      }
    }

    return {
      email,
      password,
      rememberMe,
      showPassword,
      isLoading,
      error,
      isValidEmail,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  padding: 3.5rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.login-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.logo {
  width: 90px;
  height: 90px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.login-header h1 {
  font-size: 2.2rem;
  color: #2d3748;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.welcome-text {
  color: #718096;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
  font-size: 0.9rem;
}

.form-label i {
  color: var(--primary-color);
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  padding-right: 2.8rem;
  background: #f8fafc;
}

.form-input:focus {
  border-color: #667eea;
  outline: none;
  box-shadow: 0 0 0 4px rgba(102,126,234,0.1);
  background: white;
}

.input-icon {
  position: absolute;
  right: 0.8rem;
  font-size: 1.2rem;
}

.input-icon.success {
  color: var(--success-color);
}

.input-icon.error {
  color: var(--danger-color);
}

.toggle-password {
  position: absolute;
  right: 0.8rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  font-size: 1.2rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.remember-me input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--primary-hover);
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1.2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 52px;
  margin-top: 1.5rem;
  letter-spacing: 0.5px;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102,126,234,0.3);
}

.login-button:disabled {
  background: #90cdf4;
  cursor: not-allowed;
  opacity: 0.8;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #e53e3e;
  background: #fff5f5;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  font-size: 0.95rem;
  margin-top: 0.8rem;
  border: 1px solid #fed7d7;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-footer {
  margin-top: 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .login-box {
    padding: 2rem;
  }

  .logo {
    width: 60px;
    height: 60px;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style> 
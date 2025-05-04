<template>
  <div class="forbidden">
    <div class="content">
      <div class="status-code">
        <span>4</span>
        <div class="lock">
          <div class="lock-body">
            <div class="keyhole"></div>
          </div>
          <div class="lock-hook"></div>
        </div>
        <span>3</span>
      </div>

      <h1>Truy cập bị từ chối</h1>
      <p>Xin lỗi, bạn không có quyền truy cập vào trang này.</p>
      
      <div class="message">
        <i class="bi bi-shield-lock"></i>
        <span>Vui lòng liên hệ quản trị viên nếu bạn cần được hỗ trợ.</span>
      </div>

      <div class="actions">
        <button @click="goBack" class="btn-back">
          <i class="bi bi-arrow-left"></i>
          Quay lại
        </button>
        <router-link to="/" class="btn-home">
          <i class="bi bi-house"></i>
          Trang chủ
        </router-link>
      </div>
    </div>

    <div class="security-pattern">
      <div v-for="n in 100" :key="n" class="pattern-item"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forbidden',
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.forbidden {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1c1e;
  color: white;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.content {
  text-align: center;
  z-index: 2;
  max-width: 600px;
}

.status-code {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #f8f9fa;
  gap: 1rem;
}

.lock {
  width: 120px;
  height: 140px;
  position: relative;
  animation: shake 0.5s ease-in-out infinite;
  transform-origin: center bottom;
}

.lock-body {
  width: 100%;
  height: 80px;
  background: #ffd700;
  border-radius: 12px;
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.keyhole {
  width: 24px;
  height: 32px;
  background: #1a1c1e;
  border-radius: 50%;
  position: relative;
}

.keyhole::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 16px;
  background: #1a1c1e;
}

.lock-hook {
  width: 80px;
  height: 80px;
  border: 20px solid #ffd700;
  border-radius: 50px 50px 0 0;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #adb5bd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 1.2rem;
  color: #adb5bd;
  margin-bottom: 2rem;
}

.message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.message i {
  color: #ffd700;
  font-size: 1.2rem;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-back,
.btn-home {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-back {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-home {
  background: #ffd700;
  color: #1a1c1e;
  border: none;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
}

.security-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 1px;
  opacity: 0.1;
  z-index: 1;
}

.pattern-item {
  aspect-ratio: 1;
  background: linear-gradient(135deg, transparent 0%, #ffffff 100%);
  animation: patternFade 3s infinite;
  animation-delay: calc(var(--delay) * 0.1s);
}

.pattern-item:nth-child(3n) {
  animation-duration: 4s;
}

.pattern-item:nth-child(7n) {
  animation-duration: 5s;
}

@keyframes shake {
  0%, 100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-1deg);
  }
  75% {
    transform: rotate(1deg);
  }
}

@keyframes patternFade {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.2;
  }
}

@media (max-width: 768px) {
  .status-code {
    font-size: 6rem;
  }

  .lock {
    width: 90px;
    height: 105px;
  }

  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .status-code {
    font-size: 4rem;
  }

  .lock {
    width: 60px;
    height: 70px;
  }

  .lock-body {
    height: 40px;
  }

  .lock-hook {
    width: 40px;
    height: 40px;
    border-width: 10px;
  }

  .keyhole {
    width: 12px;
    height: 16px;
  }

  .keyhole::after {
    width: 6px;
    height: 8px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .actions {
    flex-direction: column;
  }

  .message {
    flex-direction: column;
    text-align: center;
  }
}
</style> 
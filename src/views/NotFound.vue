<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <div class="error-text">
        <div class="line"></div>
        <span>Trang không tồn tại</span>
        <div class="line"></div>
      </div>
      <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
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
    <div class="illustration">
      <div class="astronaut">
        <div class="astronaut-body"></div>
        <div class="astronaut-head">
          <div class="visor"></div>
        </div>
        <div class="astronaut-backpack"></div>
        <div class="astronaut-rope"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1f35 0%, #2d3a6d 100%);
  color: white;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.content {
  text-align: center;
  z-index: 1;
}

h1 {
  font-size: 8rem;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.error-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0 2rem;
}

.line {
  height: 2px;
  width: 50px;
  background: rgba(255,255,255,0.2);
}

.error-text span {
  font-size: 1.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
}

p {
  color: rgba(255,255,255,0.7);
  margin-bottom: 2rem;
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
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
}

.btn-home {
  background: white;
  color: #2d3a6d;
  border: none;
}

.btn-back:hover {
  background: rgba(255,255,255,0.2);
}

.btn-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.illustration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.astronaut {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  animation: float 6s ease-in-out infinite;
}

.astronaut-body {
  width: 100px;
  height: 150px;
  background: white;
  border-radius: 50px;
  position: relative;
}

.astronaut-head {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: -40px;
  left: 10px;
}

.visor {
  width: 60px;
  height: 30px;
  background: #1a1f35;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 10px;
}

.astronaut-backpack {
  width: 60px;
  height: 80px;
  background: #ddd;
  position: absolute;
  top: 20px;
  left: -30px;
  border-radius: 10px;
  transform: rotate(-20deg);
}

.astronaut-rope {
  width: 2px;
  height: 200px;
  background: rgba(255,255,255,0.2);
  position: absolute;
  top: -200px;
  left: 50%;
  transform-origin: bottom;
  animation: swing 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(-20px);
  }
}

@keyframes swing {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@media (max-width: 768px) {
  h1 {
    font-size: 6rem;
  }

  .astronaut {
    right: -50px;
    transform: translateY(-50%) scale(0.8);
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 4rem;
  }

  .error-text span {
    font-size: 1.2rem;
  }

  .actions {
    flex-direction: column;
  }

  .astronaut {
    display: none;
  }
}
</style> 
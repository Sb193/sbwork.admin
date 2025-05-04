<template>
  <div class="delete-popup-overlay" v-if="isOpen" @click="closePopup">
    <div class="delete-popup" @click.stop>
      <div class="popup-header">
        <div class="icon-container">
          <i class="bi bi-exclamation-triangle"></i>
        </div>
        <h3 class="popup-title">{{ title }}</h3>
      </div>

      <div class="popup-content">
        <p class="popup-message">{{ message }}</p>
        <div class="popup-details" v-if="details">
          <p class="details-label">Chi tiết:</p>
          <p class="details-content">{{ details }}</p>
        </div>
      </div>

      <div class="popup-actions">
        <button 
          class="cancel-button"
          @click="closePopup"
        >
          <i class="bi bi-x-lg"></i>
          Hủy
        </button>
        <button 
          class="delete-button"
          @click="confirmDelete"
          :disabled="isLoading"
        >
          <i class="bi bi-trash"></i>
          <span v-if="!isLoading">Xóa</span>
          <div v-else class="spinner"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'DeletePopup',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Xác nhận xóa'
    },
    message: {
      type: String,
      required: true
    },
    details: {
      type: String,
      default: ''
    }
  },
  emits: ['close', 'confirm'],
  setup(props, { emit }) {
    const isLoading = ref(false)

    const closePopup = () => {
      emit('close')
    }

    const confirmDelete = async () => {
      try {
        isLoading.value = true
        await emit('confirm')
        closePopup()
      } catch (error) {
        console.error('Error during deletion:', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      isLoading,
      closePopup,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.delete-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.delete-popup {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

.popup-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.icon-container {
  width: 64px;
  height: 64px;
  background: #fff5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e53e3e;
  font-size: 2rem;
  animation: pulse 2s infinite;
}

.popup-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  text-align: center;
}

.popup-content {
  margin-bottom: 2rem;
}

.popup-message {
  color: #4a5568;
  font-size: 1.1rem;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 1rem;
}

.popup-details {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1rem;
}

.details-label {
  color: #718096;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.details-content {
  color: #2d3748;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.popup-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.cancel-button,
.delete-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background: #f1f5f9;
  color: #64748b;
  border: none;
}

.cancel-button:hover {
  background: #e2e8f0;
}

.delete-button {
  background: #e53e3e;
  color: white;
  border: none;
}

.delete-button:hover:not(:disabled) {
  background: #c53030;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(229, 62, 62, 0.2);
}

.delete-button:disabled {
  background: #fc8181;
  cursor: not-allowed;
  opacity: 0.8;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .delete-popup {
    margin: 1rem;
    padding: 1.5rem;
  }

  .icon-container {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }

  .popup-title {
    font-size: 1.3rem;
  }

  .popup-message {
    font-size: 1rem;
  }

  .popup-actions {
    flex-direction: column;
  }

  .cancel-button,
  .delete-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 
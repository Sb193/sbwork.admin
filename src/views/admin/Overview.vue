<template>
  <div class="overview">
    <h1 class="page-title">Tổng quan</h1>
    
    <!-- Statistics Cards -->
    <div class="row g-4 mb-4">
      <div class="col-md-6 col-lg-3">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Người dùng</h6>
                <h3 class="mb-0">1,234</h3>
                <small class="text-success">
                  <i class="bi bi-arrow-up"></i>
                  12% so với tháng trước
                </small>
              </div>
              <div class="stat-icon bg-primary">
                <i class="bi bi-people"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Công ty</h6>
                <h3 class="mb-0">456</h3>
                <small class="text-success">
                  <i class="bi bi-arrow-up"></i>
                  8% so với tháng trước
                </small>
              </div>
              <div class="stat-icon bg-success">
                <i class="bi bi-building"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Tin tuyển dụng</h6>
                <h3 class="mb-0">789</h3>
                <small class="text-success">
                  <i class="bi bi-arrow-up"></i>
                  15% so với tháng trước
                </small>
              </div>
              <div class="stat-icon bg-info">
                <i class="bi bi-briefcase"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6 col-lg-3">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="text-muted mb-2">Đơn ứng tuyển</h6>
                <h3 class="mb-0">2,345</h3>
                <small class="text-success">
                  <i class="bi bi-arrow-up"></i>
                  20% so với tháng trước
                </small>
              </div>
              <div class="stat-icon bg-warning">
                <i class="bi bi-file-earmark-text"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts -->
    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Lượt truy cập theo tháng</h5>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <!-- Chart will be rendered here -->
              <div class="placeholder-chart">
                <i class="bi bi-bar-chart"></i>
                <p>Biểu đồ sẽ được hiển thị ở đây</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Phân bố theo ngành nghề</h5>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <!-- Chart will be rendered here -->
              <div class="placeholder-chart">
                <i class="bi bi-pie-chart"></i>
                <p>Biểu đồ sẽ được hiển thị ở đây</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">Hoạt động gần đây</h5>
      </div>
      <div class="card-body">
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon bg-primary">
              <i class="bi bi-person-plus"></i>
            </div>
            <div class="activity-content">
              <h6>Người dùng mới đăng ký</h6>
              <p>Nguyễn Văn A đã đăng ký tài khoản</p>
              <small class="text-muted">2 phút trước</small>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon bg-success">
              <i class="bi bi-building"></i>
            </div>
            <div class="activity-content">
              <h6>Công ty mới</h6>
              <p>Công ty ABC đã đăng ký tài khoản</p>
              <small class="text-muted">15 phút trước</small>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon bg-info">
              <i class="bi bi-briefcase"></i>
            </div>
            <div class="activity-content">
              <h6>Tin tuyển dụng mới</h6>
              <p>Công ty XYZ đã đăng tin tuyển dụng mới</p>
              <small class="text-muted">30 phút trước</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminOverview'
}
</script>

<style scoped>
.overview {
  padding: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.card {
  border: none;
  border-radius: 0.5rem;
  box-shadow: 0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15);
  margin-bottom: 1.5rem;
}

.card-header {
  background-color: #f8f9fc;
  border-bottom: 1px solid #e3e6f0;
  padding: 1rem 1.25rem;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.bg-primary {
  background-color: var(--primary-color);
}

.bg-success {
  background-color: var(--success-color);
}

.bg-info {
  background-color: var(--info-color);
}

.bg-warning {
  background-color: var(--warning-color);
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-chart {
  text-align: center;
  color: var(--text-secondary);
}

.placeholder-chart i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e3e6f0;
}

.activity-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-content h6 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-color);
}

.activity-content p {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: var(--text-secondary);
}

.activity-content small {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .overview {
    padding: 0.5rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}
</style> 
// Kiểm tra đăng nhập
window.addEventListener('DOMContentLoaded', function() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!isAuthenticated || !currentUser.fullName) {
        window.location.href = 'index.html';
        return;
    }
    
    // Hiển thị tên người dùng
    document.getElementById('userName').textContent = currentUser.fullName;
    
    // Tải danh sách hồ sơ
    loadRecords();
    
    // Thiết lập ngày mặc định cho form
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('visitDate').value = now.toISOString().slice(0, 16);
});

// Đăng xuất
function logout() {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Lấy danh sách hồ sơ từ localStorage
function getRecords() {
    const records = localStorage.getItem('medicalRecords');
    return records ? JSON.parse(records) : [];
}

// Lưu danh sách hồ sơ vào localStorage
function saveRecords(records) {
    localStorage.setItem('medicalRecords', JSON.stringify(records));
}

// Tải và hiển thị danh sách hồ sơ
function loadRecords() {
    const records = getRecords();
    const container = document.getElementById('recordsContainer');
    
    if (records.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h3>📋</h3>
                <h3>Chưa có hồ sơ bệnh án nào</h3>
                <p>Nhấn nút "Tạo hồ sơ bệnh án mới" để bắt đầu</p>
            </div>
        `;
        return;
    }
    
    // Sắp xếp theo ngày (mới nhất trước)
    records.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
    
    container.innerHTML = records.map((record, index) => `
        <div class="record-card" onclick="viewRecord('${record.id}')">
            <div class="record-header">
                <div>
                    <div class="record-id">Mã HS: ${record.id}</div>
                </div>
                <div class="record-actions" onclick="event.stopPropagation()">
                    <button class="btn-icon" onclick="editRecord('${record.id}')" title="Chỉnh sửa">✏️</button>
                    <button class="btn-icon" onclick="deleteRecord('${record.id}')" title="Xóa">🗑️</button>
                </div>
            </div>
            <div class="record-info">
                <div class="info-row">
                    <span class="info-label">Bệnh nhân:</span>
                    <span class="info-value">${record.patientName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tuổi:</span>
                    <span class="info-value">${record.patientAge || 'N/A'} ${record.patientGender ? `(${record.patientGender})` : ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Lý do khám:</span>
                    <span class="info-value">${record.chiefComplaint.substring(0, 50)}${record.chiefComplaint.length > 50 ? '...' : ''}</span>
                </div>
                ${record.diagnosis ? `
                <div class="info-row">
                    <span class="info-label">Chẩn đoán:</span>
                    <span class="info-value">${record.diagnosis.substring(0, 50)}${record.diagnosis.length > 50 ? '...' : ''}</span>
                </div>
                ` : ''}
                <div class="info-row">
                    <span class="info-label">Tình trạng:</span>
                    <span class="info-value">${record.status || 'Đang điều trị'}</span>
                </div>
            </div>
            <div class="record-date">
                Ngày khám: ${formatDateTime(record.visitDate)}
            </div>
        </div>
    `).join('');
}

// Mở modal tạo hồ sơ mới
function openNewRecordModal() {
    document.getElementById('modalTitle').textContent = 'Tạo hồ sơ bệnh án mới';
    document.getElementById('recordForm').reset();
    document.getElementById('recordForm').dataset.recordId = '';
    
    // Thiết lập ngày mặc định
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('visitDate').value = now.toISOString().slice(0, 16);
    
    document.getElementById('recordModal').classList.add('show');
}

// Đóng modal
function closeRecordModal() {
    document.getElementById('recordModal').classList.remove('show');
    document.getElementById('recordForm').reset();
}

// Xem chi tiết hồ sơ
function viewRecord(id) {
    const records = getRecords();
    const record = records.find(r => r.id === id);
    
    if (!record) return;
    
    // Mở modal với thông tin đầy đủ (chế độ chỉ đọc)
    openEditModal(record, true);
}

// Chỉnh sửa hồ sơ
function editRecord(id) {
    const records = getRecords();
    const record = records.find(r => r.id === id);
    
    if (!record) return;
    
    openEditModal(record, false);
}

// Mở modal chỉnh sửa
function openEditModal(record, readOnly = false) {
    document.getElementById('modalTitle').textContent = readOnly ? 'Chi tiết hồ sơ bệnh án' : 'Chỉnh sửa hồ sơ bệnh án';
    document.getElementById('recordForm').dataset.recordId = record.id;
    
    // Điền thông tin vào form
    document.getElementById('patientName').value = record.patientName || '';
    document.getElementById('patientId').value = record.patientId || '';
    document.getElementById('patientAge').value = record.patientAge || '';
    document.getElementById('patientGender').value = record.patientGender || '';
    document.getElementById('patientPhone').value = record.patientPhone || '';
    document.getElementById('patientAddress').value = record.patientAddress || '';
    document.getElementById('visitDate').value = record.visitDate ? new Date(record.visitDate).toISOString().slice(0, 16) : '';
    document.getElementById('doctorName').value = record.doctorName || '';
    document.getElementById('chiefComplaint').value = record.chiefComplaint || '';
    document.getElementById('diagnosis').value = record.diagnosis || '';
    document.getElementById('treatment').value = record.treatment || '';
    document.getElementById('notes').value = record.notes || '';
    document.getElementById('bloodPressure').value = record.bloodPressure || '';
    document.getElementById('temperature').value = record.temperature || '';
    document.getElementById('heartRate').value = record.heartRate || '';
    document.getElementById('weight').value = record.weight || '';
    document.getElementById('status').value = record.status || 'Đang điều trị';
    
    // Nếu chỉ đọc, disable tất cả các trường
    const inputs = document.querySelectorAll('#recordForm input, #recordForm select, #recordForm textarea, #recordForm button[type="submit"]');
    inputs.forEach(input => {
        input.disabled = readOnly;
    });
    
    if (readOnly) {
        document.querySelector('.modal-actions').style.display = 'none';
    } else {
        document.querySelector('.modal-actions').style.display = 'flex';
    }
    
    document.getElementById('recordModal').classList.add('show');
}

// Xóa hồ sơ
function deleteRecord(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) {
        return;
    }
    
    const records = getRecords();
    const filteredRecords = records.filter(r => r.id !== id);
    saveRecords(filteredRecords);
    loadRecords();
}

// Xử lý submit form
document.getElementById('recordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const recordId = this.dataset.recordId;
    const records = getRecords();
    
    const recordData = {
        id: recordId || generateId(),
        patientName: document.getElementById('patientName').value.trim(),
        patientId: document.getElementById('patientId').value.trim(),
        patientAge: document.getElementById('patientAge').value,
        patientGender: document.getElementById('patientGender').value,
        patientPhone: document.getElementById('patientPhone').value.trim(),
        patientAddress: document.getElementById('patientAddress').value.trim(),
        visitDate: document.getElementById('visitDate').value,
        doctorName: document.getElementById('doctorName').value.trim(),
        chiefComplaint: document.getElementById('chiefComplaint').value.trim(),
        diagnosis: document.getElementById('diagnosis').value.trim(),
        treatment: document.getElementById('treatment').value.trim(),
        notes: document.getElementById('notes').value.trim(),
        bloodPressure: document.getElementById('bloodPressure').value.trim(),
        temperature: document.getElementById('temperature').value,
        heartRate: document.getElementById('heartRate').value,
        weight: document.getElementById('weight').value,
        status: document.getElementById('status').value,
        createdAt: recordId ? records.find(r => r.id === recordId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (recordId) {
        // Cập nhật hồ sơ hiện có
        const index = records.findIndex(r => r.id === recordId);
        if (index !== -1) {
            records[index] = recordData;
        }
    } else {
        // Thêm hồ sơ mới
        records.push(recordData);
    }
    
    saveRecords(records);
    loadRecords();
    closeRecordModal();
    
    alert(recordId ? 'Cập nhật hồ sơ thành công!' : 'Tạo hồ sơ thành công!');
});

// Tạo ID duy nhất
function generateId() {
    return 'HS-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Định dạng ngày giờ
function formatDateTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Tìm kiếm hồ sơ
function filterRecords() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const records = getRecords();
    const container = document.getElementById('recordsContainer');
    
    if (!searchTerm) {
        loadRecords();
        return;
    }
    
    const filteredRecords = records.filter(record => {
        return (
            record.patientName.toLowerCase().includes(searchTerm) ||
            record.patientId.toLowerCase().includes(searchTerm) ||
            record.chiefComplaint.toLowerCase().includes(searchTerm) ||
            (record.diagnosis && record.diagnosis.toLowerCase().includes(searchTerm)) ||
            (record.doctorName && record.doctorName.toLowerCase().includes(searchTerm))
        );
    });
    
    if (filteredRecords.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h3>🔍</h3>
                <h3>Không tìm thấy hồ sơ nào</h3>
                <p>Thử tìm kiếm với từ khóa khác</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredRecords.map(record => `
        <div class="record-card" onclick="viewRecord('${record.id}')">
            <div class="record-header">
                <div>
                    <div class="record-id">Mã HS: ${record.id}</div>
                </div>
                <div class="record-actions" onclick="event.stopPropagation()">
                    <button class="btn-icon" onclick="editRecord('${record.id}')" title="Chỉnh sửa">✏️</button>
                    <button class="btn-icon" onclick="deleteRecord('${record.id}')" title="Xóa">🗑️</button>
                </div>
            </div>
            <div class="record-info">
                <div class="info-row">
                    <span class="info-label">Bệnh nhân:</span>
                    <span class="info-value">${record.patientName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Tuổi:</span>
                    <span class="info-value">${record.patientAge || 'N/A'} ${record.patientGender ? `(${record.patientGender})` : ''}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Lý do khám:</span>
                    <span class="info-value">${record.chiefComplaint.substring(0, 50)}${record.chiefComplaint.length > 50 ? '...' : ''}</span>
                </div>
                ${record.diagnosis ? `
                <div class="info-row">
                    <span class="info-label">Chẩn đoán:</span>
                    <span class="info-value">${record.diagnosis.substring(0, 50)}${record.diagnosis.length > 50 ? '...' : ''}</span>
                </div>
                ` : ''}
                <div class="info-row">
                    <span class="info-label">Tình trạng:</span>
                    <span class="info-value">${record.status || 'Đang điều trị'}</span>
                </div>
            </div>
            <div class="record-date">
                Ngày khám: ${formatDateTime(record.visitDate)}
            </div>
        </div>
    `).join('');
}

// Đóng modal khi click bên ngoài
document.getElementById('recordModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeRecordModal();
    }
});


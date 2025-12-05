// Hàm chuyển đổi giữa form đăng nhập và đăng ký
function switchToRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    clearMessages();
}

function switchToLogin() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    clearMessages();
}

// Xóa thông báo
function clearMessages() {
    document.getElementById('errorMessage').classList.remove('show');
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('successMessage').classList.remove('show');
    document.getElementById('successMessage').textContent = '';
    document.getElementById('registerErrorMessage').classList.remove('show');
    document.getElementById('registerErrorMessage').textContent = '';
    document.getElementById('registerSuccessMessage').classList.remove('show');
    document.getElementById('registerSuccessMessage').textContent = '';
}

// Lấy danh sách tài khoản từ localStorage
function getAccounts() {
    const accounts = localStorage.getItem('userAccounts');
    return accounts ? JSON.parse(accounts) : [];
}

// Lưu danh sách tài khoản vào localStorage
function saveAccounts(accounts) {
    localStorage.setItem('userAccounts', JSON.stringify(accounts));
}

// Xử lý đăng ký
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('registerFullName').value.trim();
    const studentId = document.getElementById('registerStudentId').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('registerErrorMessage');
    const successMessage = document.getElementById('registerSuccessMessage');
    
    // Xóa thông báo cũ
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    successMessage.classList.remove('show');
    successMessage.textContent = '';
    
    // Kiểm tra dữ liệu đầu vào
    if (!fullName || !studentId || !password || !confirmPassword) {
        errorMessage.textContent = 'Vui lòng điền đầy đủ thông tin!';
        errorMessage.classList.add('show');
        return;
    }
    
    // Kiểm tra mật khẩu (tối thiểu 6 ký tự)
    if (password.length < 6) {
        errorMessage.textContent = 'Mật khẩu phải có ít nhất 6 ký tự!';
        errorMessage.classList.add('show');
        return;
    }
    
    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
        errorMessage.textContent = 'Mật khẩu xác nhận không khớp!';
        errorMessage.classList.add('show');
        return;
    }
    
    // Kiểm tra mã sinh viên đã tồn tại chưa
    const accounts = getAccounts();
    const existingAccount = accounts.find(acc => acc.studentId === studentId);
    
    if (existingAccount) {
        errorMessage.textContent = 'Mã sinh viên này đã được đăng ký!';
        errorMessage.classList.add('show');
        return;
    }
    
    // Tạo tài khoản mới
    const newAccount = {
        fullName: fullName,
        studentId: studentId,
        password: password, // Trong thực tế nên hash mật khẩu
        createdAt: new Date().toISOString()
    };
    
    accounts.push(newAccount);
    saveAccounts(accounts);
    
    // Hiển thị thông báo thành công
    successMessage.textContent = 'Đăng ký thành công! Vui lòng đăng nhập.';
    successMessage.classList.add('show');
    
    // Xóa form
    this.reset();
    
    // Tự động chuyển về form đăng nhập sau 2 giây
    setTimeout(() => {
        switchToLogin();
        // Điền sẵn mã sinh viên
        document.getElementById('loginStudentId').value = studentId;
    }, 2000);
});

// Xử lý đăng nhập
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('loginStudentId').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Xóa thông báo cũ
    errorMessage.classList.remove('show');
    errorMessage.textContent = '';
    successMessage.classList.remove('show');
    successMessage.textContent = '';
    
    // Kiểm tra dữ liệu đầu vào
    if (!studentId || !password) {
        errorMessage.textContent = 'Vui lòng điền đầy đủ thông tin!';
        errorMessage.classList.add('show');
        return;
    }
    
    // Kiểm tra tài khoản
    const accounts = getAccounts();
    const account = accounts.find(acc => acc.studentId === studentId);
    
    if (!account) {
        errorMessage.textContent = 'Mã sinh viên chưa được đăng ký!';
        errorMessage.classList.add('show');
        return;
    }
    
    // Kiểm tra mật khẩu
    if (account.password !== password) {
        errorMessage.textContent = 'Mật khẩu không chính xác!';
        errorMessage.classList.add('show');
        return;
    }
    
    // Đăng nhập thành công - Lưu thông tin người dùng vào localStorage
    const userData = {
        fullName: account.fullName,
        studentId: account.studentId,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    
    // Hiển thị thông báo thành công
    successMessage.textContent = 'Đăng nhập thành công! Đang chuyển hướng...';
    successMessage.classList.add('show');
    
    // Chuyển đến trang dashboard sau 1 giây
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
});

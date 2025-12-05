# Trung tâm Y tế Khẩn cấp Hoà Lạc - Đại học Quốc gia Hà Nội

Website quản lý hồ sơ bệnh án cho Trung tâm Y tế Khẩn cấp Hoà Lạc.

## Tính năng

### 1. Trang đăng nhập
- Đăng nhập với Họ và tên, Mã sinh viên, và Mật khẩu
- Xác thực thông tin người dùng
- Giao diện hiện đại và thân thiện

### 2. Quản lý hồ sơ bệnh án
- **Tạo hồ sơ mới**: Tạo hồ sơ bệnh án cho bệnh nhân với đầy đủ thông tin
- **Xem chi tiết**: Xem toàn bộ thông tin của hồ sơ bệnh án
- **Chỉnh sửa**: Cập nhật thông tin hồ sơ bệnh án
- **Xóa**: Xóa hồ sơ bệnh án không cần thiết
- **Tìm kiếm**: Tìm kiếm hồ sơ theo tên, mã số, triệu chứng, chẩn đoán

### 3. Thông tin hồ sơ bệnh án bao gồm:
- Thông tin bệnh nhân: Họ tên, mã số, tuổi, giới tính, số điện thoại, địa chỉ
- Thông tin khám: Ngày khám, bác sĩ khám
- Triệu chứng và chẩn đoán
- Điều trị và đơn thuốc
- Dấu hiệu sinh tồn: Huyết áp, nhiệt độ, nhịp tim, cân nặng
- Tình trạng bệnh nhân
- Ghi chú bổ sung

## Cách sử dụng

1. Mở file `index.html` trong trình duyệt web
2. Đăng nhập với thông tin của bạn:
   - Họ và tên
   - Mã sinh viên
   - Mật khẩu (tối thiểu 6 ký tự)
3. Sau khi đăng nhập, bạn sẽ vào trang quản lý hồ sơ bệnh án
4. Nhấn nút "Tạo hồ sơ bệnh án mới" để thêm hồ sơ
5. Click vào hồ sơ để xem chi tiết
6. Sử dụng nút chỉnh sửa hoặc xóa để quản lý hồ sơ
7. Sử dụng ô tìm kiếm để tìm hồ sơ nhanh chóng

## Lưu trữ dữ liệu

Dữ liệu được lưu trữ trong localStorage của trình duyệt, bao gồm:
- Thông tin người dùng đăng nhập
- Tất cả hồ sơ bệnh án

**Lưu ý**: Dữ liệu sẽ bị xóa nếu bạn xóa cache trình duyệt. Để lưu trữ lâu dài, nên kết nối với cơ sở dữ liệu.

## Cấu trúc file

```
├── index.html          # Trang đăng nhập
├── dashboard.html      # Trang quản lý hồ sơ bệnh án
├── styles.css          # File CSS cho toàn bộ website
├── auth.js             # Xử lý đăng nhập
├── dashboard.js        # Xử lý quản lý hồ sơ bệnh án
└── README.md           # File hướng dẫn
```

## Yêu cầu

- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Không cần cài đặt thêm phần mềm nào

## Giao diện

- Thiết kế hiện đại với gradient màu tím/xanh
- Responsive, tương thích với mọi kích thước màn hình
- Animation mượt mà, trải nghiệm người dùng tốt


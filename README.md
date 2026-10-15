# GameVui Profile · Family UI

Trang hồ sơ HTML/CSS/JavaScript thuần, không cần bước build.

## Chạy và kiểm thử

- Mở `index.html`, hoặc chạy `node scripts/preview.cjs` rồi truy cập `http://127.0.0.1:4173`.
- Cài dependency kiểm thử: `npm install`.
- Chạy `npx playwright install chromium`, sau đó `npm test`.
- Có thể dùng Edge đã cài bằng biến môi trường `BROWSER_CHANNEL=msedge`.
- Kết quả ảnh nằm trong `test-results/`, không đưa vào Git.

## Phần cha mẹ

Card **Chế độ cha mẹ** nằm sau Thông tin cá nhân. Gồm hướng dẫn ba bước và dialog quản lý mẫu với hai bí danh hư cấu. Có thể thay đổi mức tuổi, hạn mức, hủy thay đổi, chọn hồ sơ và xem thời lượng minh họa. Đóng dialog sẽ xóa mọi thay đổi của bản xem thử.

Đây là **UI preview**, chưa phải dịch vụ quản lý gia đình. Nút kích hoạt bị vô hiệu hóa có giải thích. Không thu PIN/mật khẩu/thông tin trẻ, không gọi API, không ghi browser storage. Khoảng 0–180 phút và mức tuổi trong bản xem thử chỉ phục vụ minh họa, không phải quy định hoặc cấu hình production. Luồng lưu hồ sơ sẵn có cũng chỉ lưu trong bộ nhớ trang.

## Trước khi kết nối dịch vụ thật

Đối chiếu `trien-khai.md` và backend tài khoản. Các endpoint trong tài liệu chưa được xác minh. Cần xác định điều kiện kích hoạt, xác minh và đồng ý, phiên PIN, quyền sở hữu gia đình, hạn mức cấu hình, dữ liệu thời lượng và trạng thái thực thi chính sách.

Thay phần preview bằng controller tích hợp riêng khi API đã có contract. UI phải có loading, empty, error/offline, unauthorized/session-expired và success do server xác nhận. Không suy quyền cha mẹ từ ngày sinh mẫu; không biến lỗi tải thành danh sách rỗng; không dùng browser storage làm nguồn quyết định quyền hoặc hạn mức. Dữ liệu mẫu không được dùng làm fallback cho API thật.

## Kiểm tra trước phát hành

Xem `docs/family-ui-validation.md`. Backend, kiểm soát game và đồng bộ thiết bị chưa thuộc thay đổi này.


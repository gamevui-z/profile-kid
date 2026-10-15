# GameVui Profile · Family UI

Trang hồ sơ HTML/CSS/JavaScript thuần, không cần bước build.

## Chạy và kiểm thử

- Mở `index.html`, hoặc chạy `node scripts/preview.cjs` rồi truy cập `http://127.0.0.1:4173`.
- Cài dependency kiểm thử: `npm install`.
- Chạy `npx playwright install chromium`, sau đó `npm test`.
- Có thể dùng Edge đã cài bằng biến môi trường `BROWSER_CHANNEL=msedge`.
- Kết quả ảnh nằm trong `test-results/`, không đưa vào Git.

## Phần cha mẹ

Card **Chế độ cha mẹ** nằm sau Thông tin cá nhân. Bấm **Xem các gói** để trải nghiệm:

1. Chọn dùng thử **1 tháng 0đ**, hoặc gói **3 tháng / 6 tháng / 1 năm**. Giá gói dài hạn chưa được chốt nên hiển thị “Giá sẽ công bố”.
2. Xác nhận đang dùng demo rồi kích hoạt tài khoản cha mẹ mẫu.
3. Tạo tài khoản con bằng bí danh, username, mức tuổi và hạn mức mẫu. Username được chuẩn hóa chữ thường và kiểm tra trùng trong phiên demo. Thông tin đăng nhập minh họa được sinh tự động, không dùng đăng nhập thật.
4. Tạo thêm con, chọn hồ sơ và cập nhật/hủy quy tắc. Đổi gói không xóa các hồ sơ đã tạo.

Trạng thái kích hoạt và các hồ sơ tự tạo được giữ trong bộ nhớ khi đóng/mở dialog, mất khi tải lại trang. “Để sau” giữ trạng thái cha mẹ đã kích hoạt nhưng không tạo con. Trước khi kích hoạt, “Xem thử khu vực quản lý” vẫn dùng hai hồ sơ hư cấu có sẵn và xóa thay đổi mỗi lần đóng.

Đây là **demo tương tác**, chưa phải dịch vụ quản lý gia đình. Kích hoạt và xác minh chỉ mô phỏng; không thu tiền, tự động gia hạn, yêu cầu thẻ, PIN hay mật khẩu thật. Form yêu cầu dùng thông tin mẫu, không gửi dữ liệu ra ngoài và không ghi browser storage. Khoảng 0–180 phút và mức tuổi chỉ phục vụ minh họa, không phải quy định hoặc cấu hình production. Luồng lưu hồ sơ sẵn có cũng chỉ lưu trong bộ nhớ trang.

Phần chọn gói được bổ sung theo yêu cầu demo mới; chưa triển khai thương mại hóa, thanh toán hay paywall trong `trien-khai.md`.

## Trước khi kết nối dịch vụ thật

Đối chiếu `trien-khai.md` và backend tài khoản. Các endpoint trong tài liệu chưa được xác minh. Cần xác định điều kiện kích hoạt, xác minh và đồng ý, phiên PIN, quyền sở hữu gia đình, hạn mức cấu hình, dữ liệu thời lượng và trạng thái thực thi chính sách.

Thay phần preview bằng controller tích hợp riêng khi API đã có contract. UI phải có loading, empty, error/offline, unauthorized/session-expired và success do server xác nhận. Không suy quyền cha mẹ từ ngày sinh mẫu; không biến lỗi tải thành danh sách rỗng; không dùng browser storage làm nguồn quyết định quyền hoặc hạn mức. Dữ liệu mẫu không được dùng làm fallback cho API thật.

## Kiểm tra trước phát hành

Xem `docs/family-ui-validation.md`. Backend, kiểm soát game và đồng bộ thiết bị chưa thuộc thay đổi này.


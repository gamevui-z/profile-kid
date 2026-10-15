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
3. Tạo tài khoản con bằng bí danh, username, mật khẩu và xác nhận mật khẩu, mức tuổi game và hạn mức mẫu. Username chuẩn hóa chữ thường và kiểm tra trùng. Mật khẩu 8–64 ký tự, có nút hiện/ẩn; chỉ kiểm tra tại chỗ, xóa khỏi form sau tạo hoặc đóng, không giữ lại trong hồ sơ demo.
4. Tạo thêm con, chọn hồ sơ và cập nhật/hủy quy tắc. Đổi gói không xóa các hồ sơ đã tạo.

Sau kích hoạt, card chuyển sang **Quản lý gia đình**, ẩn giới thiệu/hướng dẫn và hiển thị danh sách con với mức tuổi, phút đã dùng/hạn mức. Bấm một dòng để mở đúng hồ sơ.

Lọc tuổi dùng **trần nhãn game**, không phải tuổi tối thiểu của con: chỉ 0+; nhãn ≤12; nhãn ≤16; không giới hạn. Các badge minh họa cập nhật khi lưu. Đây chưa phải bộ lọc danh mục game production.

Biểu đồ cột 7 ngày viết bằng HTML/CSS/JavaScript thuần. Hai hồ sơ mẫu có dữ liệu hư cấu được gắn nhãn; hồ sơ mới có toàn bộ giá trị 0, không tạo lịch sử chơi giả.

Trạng thái kích hoạt và các hồ sơ tự tạo được giữ trong bộ nhớ khi đóng/mở dialog, mất khi tải lại trang. “Để sau” giữ trạng thái cha mẹ đã kích hoạt nhưng không tạo con. Trước khi kích hoạt, “Xem thử khu vực quản lý” vẫn dùng hai hồ sơ hư cấu có sẵn và xóa thay đổi mỗi lần đóng.

Đây là **demo tương tác**, chưa phải dịch vụ quản lý gia đình. Kích hoạt và xác minh chỉ mô phỏng; không thu tiền, tự động gia hạn, yêu cầu thẻ hoặc PIN. Dùng mật khẩu mẫu, không tái sử dụng mật khẩu thật. Form không gửi dữ liệu ra ngoài và không ghi browser storage. Khoảng 0–180 phút chỉ phục vụ minh họa, không phải quy định hoặc cấu hình production. Luồng lưu hồ sơ sẵn có cũng chỉ lưu trong bộ nhớ trang.

## Mã nguồn và tài nguyên

Toàn bộ giao diện chạy bằng HTML/CSS/JavaScript thuần trong `index.html`, gồm biểu đồ tự viết. Không CDN, không framework, thư viện biểu đồ, font web hoặc tài nguyên tải ngoài. SVG được nhúng trực tiếp/data URL. Playwright chỉ là dependency phát triển để kiểm thử, không được nạp vào trang. Xem `docs/code-review.md`.

Phần chọn gói được bổ sung theo yêu cầu demo mới; chưa triển khai thương mại hóa, thanh toán hay paywall trong `trien-khai.md`.

## Trước khi kết nối dịch vụ thật

Đối chiếu `trien-khai.md` và backend tài khoản. Các endpoint trong tài liệu chưa được xác minh. Cần xác định điều kiện kích hoạt, xác minh và đồng ý, phiên PIN, quyền sở hữu gia đình, hạn mức cấu hình, dữ liệu thời lượng và trạng thái thực thi chính sách.

Thay phần preview bằng controller tích hợp riêng khi API đã có contract. UI phải có loading, empty, error/offline, unauthorized/session-expired và success do server xác nhận. Không suy quyền cha mẹ từ ngày sinh mẫu; không biến lỗi tải thành danh sách rỗng; không dùng browser storage làm nguồn quyết định quyền hoặc hạn mức. Dữ liệu mẫu không được dùng làm fallback cho API thật.

## Kiểm tra trước phát hành

Xem `docs/family-ui-validation.md`. Backend, kiểm soát game và đồng bộ thiết bị chưa thuộc thay đổi này.


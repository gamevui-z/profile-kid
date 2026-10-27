# Trạng thái hiện hành: Free và Standard sắp ra mắt

Tài liệu này thay thế các mô tả gói và nhóm danh mục cũ trong docs. Ngày đối chiếu: 2026-10-27.

- Free: 1 tài khoản con, mức tuổi game, hạn mức mỗi ngày. Giữ các luồng tương tác trong phiên theo yêu cầu chủ sản phẩm.
- Standard: 49.000đ/tháng, 3 con và quyền lợi dự kiến hiển thị. Sắp ra mắt, không có hành động mua/kích hoạt Standard.
- Pro đã bỏ. Không còn dùng thử Standard 0đ, kỳ thanh toán hay tự gia hạn.
- Chức năng báo cáo nâng cao của Pro không được cấp cho Free. Không tự chuyển các quyền này sang Standard.

## Danh mục chính thức
Nguồn: https://gamevui.vn/ — menu Danh mục, đối chiếu trực tiếp ngày 2026-10-27. Danh sách 75 tên hiện có khớp menu. Đã sắp lại đúng thứ tự, bỏ 7 nhóm suy diễn và bộ lọc nhóm. Game Hot/Hay/Mới và các bộ sưu tập được giữ như menu. Khóa nội bộ hiện chưa phải ID API của GameVui. Cần ánh xạ ID khi tích hợp backend; không suy ra phân loại tuổi từ danh mục.

## Giới hạn kỹ thuật — dành cho đội phát triển
Theo xác nhận của chủ sản phẩm, đây vẫn là bản trình bày tương tác như sản phẩm thật, không yêu cầu khóa Free. Các chú thích kỹ thuật được chuyển khỏi UI, không có nghĩa là đã tích hợp backend. Tài khoản đủ điều kiện hiện là fixture; dữ liệu lưu trong bộ nhớ, mất khi tải lại; trang kid dùng dữ liệu tĩnh. Không có thanh toán, OTP/SMS, đăng nhập, đổi mật khẩu, lưu cloud hay thực thi giới hạn game thật. Mã xác nhận luồng chuyển đổi trong phiên là 123456. Không dùng thông tin hoặc mật khẩu thật để kiểm thử. Không đưa bản này vào vận hành tài khoản thực khi chưa thay fixture và nối API có phân quyền.

## Kiểm thử
Bộ hiện hành kiểm tra Free, hai thẻ gói, không còn CTA mua/dùng thử, danh mục 75 mục đúng thứ tự, tạo/sửa con, mật khẩu, chuyển độc lập, giới hạn thời gian và responsive. Các ca mua Pro/Standard, dùng thử, báo cáo Pro và nhóm danh mục cũ được lưu tham khảo ở profile-tests-before-two-tier.cjs; không thuộc bài kiểm thử phát hành hiện tại.

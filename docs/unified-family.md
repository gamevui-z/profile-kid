# Luồng gia đình hợp nhất

Chế độ cha mẹ nằm trước Thông tin cá nhân. Chọn cấp tính năng Standard / Pro / Pro+, sau đó chọn kỳ 1/3/6/12 tháng. Kỳ hạn không thay quyền lợi.

- Standard: 49.000đ/tháng, tối đa 1 con, thời gian/ngày, tuổi game, danh mục, từ khóa, báo cáo 7 ngày.
- Pro: giá đề xuất 79.000đ/tháng, toàn bộ Standard, tối đa 3 con, lịch tuần, giờ nghỉ, báo cáo 30 ngày.
- Pro+: giá đề xuất 109.000đ/tháng, toàn bộ Pro, tối đa 5 con, báo cáo 90 ngày, so sánh tuần và xuất CSV.
- Kỳ 3/6/12 tháng giảm đề xuất 10%/15%/25% so với giá tháng cùng cấp. Trả trước, không tự gia hạn.
- Dùng thử Standard 1 tháng 0đ, sau đó gia hạn Standard 49.000đ/tháng theo điều kiện mô phỏng, xác nhận không tích sẵn.

Giới hạn số con được kiểm tra trong demo. Hạ gói không đủ chỗ bị chặn, không xóa con. Đổi kỳ hạn giữ nguyên cấp tính năng. Các quy tắc nâng cao đã lưu không bị xóa khi hạ gói nhưng bị ẩn ở Standard.

Form con gồm tên hiển thị, username, mật khẩu/xác nhận, ngày sinh, giới tính; tuổi tự tính, dưới 18 tuổi, không căn cước/địa chỉ. Gợi ý ≤5, 6–12, 13–16 tuổi: bấm nhóm để xem, bấm Áp dụng để điền quy tắc; 17 tuổi tự thiết lập. Danh mục và từ khóa sửa được trong quản lý. Xem child-presets.md.

## Giới hạn demo

Không backend, đăng nhập, thanh toán, gia hạn/hủy thuê bao thật hoặc thực thi lọc/khóa game. Trạng thái chỉ trong bộ nhớ, mất khi tải lại. Không browser storage hay gửi dữ liệu ra ngoài. Mật khẩu mẫu chỉ kiểm tra rồi xóa. Không dùng thông tin thật.

Lịch tuần và giờ nghỉ lưu theo từng con, hỗ trợ qua đêm; chưa có game engine đọc quy tắc. Danh mục là nhóm mẫu, chưa nối taxonomy GameVui. Báo cáo 7/30/90 ngày và CSV có nhãn demo: con mới chưa có lượt chơi, tất cả bằng 0; biểu đồ mẫu chỉ có 7 ngày và không suy diễn dữ liệu tuần trước. Biểu đồ hiển thị 7 ngày gần nhất; chọn kỳ báo cáo thay phạm vi tổng hợp/CSV. Khoảng 0–180 phút là giới hạn minh họa.

## Kiểm thử và production

11/11 nhóm Edge/Windows đạt: 12 mức giá, số con, bảo vệ hạ gói, lịch/giờ nghỉ, báo cáo và CSV, ngày sinh/preset, responsive, keyboard, mật khẩu, profile cũ, không request ngoài. Đã xem ảnh desktop/mobile. Chưa thử Safari/Firefox, thiết bị thật, screen reader.

Trước production cần chốt giá, API tài khoản/quyền gia đình, xác minh cha mẹ, billing/hủy gia hạn, enforcement phía server, taxonomy, thu thập thời lượng và retention. Không lấy dữ liệu demo thay cho lỗi API. trien-khai.md là tài liệu tham khảo, chưa xác minh backend. Tài liệu pricing-demo cũ đã được thay thế bởi tài liệu này.


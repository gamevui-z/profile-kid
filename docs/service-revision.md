# Free, quyền lợi trả phí và nhãn tuổi

Tài liệu này cập nhật và thay thế phần phân gói, ngày sinh, nhóm tuổi trong unified-family.md và child-presets.md.

## Gói

Giá hiện trực tiếp trên thẻ, chọn bằng nút; không cần mở dropdown. Free 0đ không hết hạn: 1 con, giới hạn tuổi và thời gian/ngày. Standard 49.000đ/tháng có 3 tài khoản con, kế thừa Free, thêm lịch tuần/giờ nghỉ, chọn nhiều danh mục, từ khóa. Pro 79.000đ/tháng là giá đề xuất: 5 tài khoản con, toàn bộ Standard, báo cáo 7/30/90 ngày, so sánh tuần và xuất CSV. Chỉ còn ba gói Free, Standard, Pro. Chức năng ngoài quyền lợi được ẩn hoàn toàn trong quản lý và đề xuất, không hiển thị dạng khóa. Kỳ dài chỉ giảm giá.

“Không quảng cáo” là quyền lợi sản phẩm Standard trở lên nhưng CHƯA được triển khai trong game: cần contract với hệ thống quảng cáo GameVui và từng SDK game. UI có dấu * và chú thích, không thông báo đang chặn quảng cáo. Không được mở bán dịch vụ thật dựa trên demo này.

## Nội dung và ngày sinh

Danh mục checkbox độc lập, chọn nhiều, lưu/hủy đúng từng con. Bỏ tất cả nghĩa là danh sách cho phép rỗng, không phải tất cả. Free không sửa danh mục/từ khóa; nâng gói mở khóa. Dữ liệu cũ dạng nhóm chuyển thành danh sách khi hiển thị. Cần taxonomy GameVui thật và enforcement server/game trước production.

Ngày sinh là ba select Ngày/Tháng/Năm; không có năm tương lai, tháng/ngày bị giới hạn bởi ngày hiện tại, xử lý số ngày từng tháng/năm nhuận. Vẫn kiểm tra toàn bộ ngày hợp lệ và tuổi dưới 18 khi submit. Không dùng lịch native cho phép cuộn năm tương lai.

## Nhãn tuổi

Nguồn gốc: khoản 1 Điều 38 Nghị định 147/2024/NĐ-CP, Mục 3. Trang văn bản Chính phủ: https://vanban.chinhphu.vn/?classid=1&docid=211654&pageid=27160 ; bản ký: https://datafiles.chinhphu.vn/cpp/files/vbpq/2024/11/147-nd.signed.pdf . Đây không phải báo cáo xác minh toàn bộ hiệu lực pháp luật hoặc chứng nhận tuân thủ.

Chỉ dùng nhãn 00+, 12+, 16+, 18+. Nhãn là tuổi tối thiểu, không phải tuổi tối đa. Bỏ 6+, “không giới hạn” và “≤12”. Chính sách UI: dưới 12 chỉ 00+; 12–15 có thể chọn 00+/12+; 16–17 có thể chọn 00+/12+/16+. Cha mẹ chọn chặt hơn được; không mở vượt tuổi thực. 18+ hiển thị vô hiệu cho tài khoản con. Ngày sinh được kiểm tra khi lưu để tránh chỉ dựa vào disabled UI.

Gợi ý thời gian 20/45/60 phút chỉ là giá trị demo cha mẹ chỉnh được, không phải mức pháp luật hay khuyến nghị sức khỏe. Phân loại game phải dựa trên nội dung đã thẩm định và metadata đáng tin; từ khóa không thay thế phân loại. Các giới hạn thời gian pháp luật và kiểm soát tổng thời gian cần rà soát/triển khai riêng ở backend.

## Kiểm thử

Kiểm tra Free/upgrade, giá nhìn thấy, chọn nhiều/lưu/hủy danh mục, không năm tương lai, năm nhuận, các mốc 11/12/15/16 tuổi, nhãn bị khóa, hồi quy toàn bộ form/gói, responsive và keyboard. Chưa thực thi thanh toán, quảng cáo, lọc game hay đồng bộ máy thật. Các báo cáo vẫn là dữ liệu demo.


## Gói tài khoản và nâng cấp trực tiếp

Nhãn cạnh tên thay ID bằng Free / Standard / Pro, đồng bộ sau xác nhận gói. Tài khoản đủ cả ba điều kiện: đăng nhập, số điện thoại đã xác thực, đủ 18 tuổi tự có Free. Demo dùng fixture người lớn đã xác thực; production phải lấy từ phiên xác thực và kiểm tra server, không tin giá trị client. Gói tài khoản và việc bắt đầu quản lý gia đình là hai trạng thái riêng: Free có sẵn, tạo con không yêu cầu mua lại.

Nâng lên Standard / Pro chọn sẵn cấp tiếp theo và đưa đến kỳ hạn; không thu tiền hay đổi gói trước xác nhận. Hủy giữ gói cũ. Nâng cấp từ nút cạnh tên khi đã có con quay về tổng quan, giữ nguyên hồ sơ. Các thao tác vẫn chỉ mô phỏng trong bộ nhớ, chưa có billing hay lưu tài khoản thật.

Đăng nhập & bảo mật gom số điện thoại, mật khẩu và các liên kết thành một thẻ rộng, hai cột desktop/một cột mobile. Không thêm CDN.


## Cảm nhận ban đầu và nội dung giao diện

Bỏ nút nâng cấp trong header; tên và nhãn gói nằm trên nền trắng cạnh avatar, quyền lợi một dòng. Đổi gói nằm trong quản lý gia đình khi đã bắt đầu. Bảng khám phá tương tác dùng tình huống 25 phút: chọn 30/60/90 phút cập nhật thời gian còn lại và mở cài đặt với hạn mức vừa chọn. Phần này ẩn sau khi bắt đầu quản lý con.

Gỡ các nhãn demo/mẫu/mô phỏng trên giao diện; thông báo ở bước xác nhận vẫn nói rõ chưa kết nối thanh toán và dữ liệu chỉ tồn tại trong phiên. Các liên kết mạng xã hội đều hiển thị chưa kết nối vì chưa có OAuth thật. Các ID cũ được giữ cho tương thích. Không thay đổi giới hạn kỹ thuật về lưu trữ/backend.

Kiểm thử 14 nhóm: có kiểm tra nội dung hiển thị, tương tác hạn mức và trả focus về nút mở.


## Danh mục đầy đủ và gợi ý tuổi

Đối chiếu 75 mục từ ảnh menu do người dùng cung cấp, bỏ nút Đóng; giữ tên các bộ sưu tập như Game Hot, Game Hay, Game Mới, Game Y8 cùng các danh mục. Bảy nhóm chỉ phục vụ trình bày, không thay đổi tên taxonomy. Chưa có ID/API taxonomy production: ID hiện là khóa nội bộ giao diện, cần ánh xạ trước khi tích hợp.

Bộ chọn có tìm không dấu, lọc nhóm, chỉ mục đã chọn, bộ đếm, chọn tất cả mục đang hiện và bỏ chọn tất cả. Bộ lọc không xóa lựa chọn; lưu/hủy theo từng con. Không có lựa chọn nghĩa là không cho phép danh mục nào. Danh mục là một điều kiện cùng với tuổi, không thay thế phân loại game. Game nhiều nhãn và danh mục tuyển chọn rộng cần backend áp dụng giao của danh mục cho phép với mức tuổi; chưa có lọc thư viện thật.

Theo xác nhận của chủ sản phẩm: GameVui không có game cờ bạc. Đã bỏ mặc định từ khóa cờ bạc và mọi từ khóa mặc định khác. Gợi ý dưới 6 tuổi: 20 phút, học tập/tô màu/luyện trí nhớ/xếp hình; 6–11: 30 phút thêm toán/tiếng Anh/giải đố/âm nhạc; 12–15: 45 phút thêm thể thao/chơi cờ/thiết kế; 16–17: 60 phút thêm chiến thuật/phiêu lưu/đua xe/Minecraft. Mức thời gian để cha mẹ cân nhắc, không phải chuẩn sức khỏe hay luật định. Nhãn game vẫn là 00+/12+/16+, 18+ bị chặn với trẻ. Trạng thái Free vẫn ẩn bộ chọn và từ khóa theo quyền lợi.

Dữ liệu cũ creative chuyển sang Thiết kế; jigsaw hiển thị Xếp hình. Các khóa cũ learning/puzzle/strategy được chuẩn hóa theo danh sách có thật.


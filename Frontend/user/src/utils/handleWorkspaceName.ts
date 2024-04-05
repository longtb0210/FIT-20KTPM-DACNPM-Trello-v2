export function handleWorkspaceName(title: string, MAX_TITLE_LENGTH: number = 15): string {
    if (title && title.length > MAX_TITLE_LENGTH) {
        // Tìm vị trí khoảng trắng cuối cùng trước giới hạn MAX_TITLE_LENGTH
        const lastSpaceIndex: number = title.lastIndexOf(' ', MAX_TITLE_LENGTH);

        if (lastSpaceIndex !== -1) {
            // Cắt tiêu đề tại vị trí khoảng trắng cuối cùng
            title = title.substring(0, lastSpaceIndex) + '...'
        } else {
            // Nếu không tìm thấy khoảng trắng, cắt tiêu đề ngay tại giới hạn MAX_TITLE_LENGTH
            title = title.substring(0, MAX_TITLE_LENGTH) + '...'
        }

        return title
    }
    return title
}

import { stringToColor } from "./StringToColor"

export function stringAvatar(name: string) {
  let abbreviation = ''
  if (name.includes(' ')) {
    // Nếu tên có ít nhất một khoảng trắng, lấy hai chữ cái đầu tiên từ các từ
    abbreviation = name
      .split(' ')
      .map((word) => word[0])
      .join('')
  } else {
    // Nếu tên chỉ có một từ, lấy chữ cái đầu tiên của từ đó
    abbreviation = name[0]
  }

  return {
    sx: {
      width: 24,
      height: 24,
      fontSize: '14px',
      '&:hover': {
        bgcolor: 'primary.90',
        cursor: 'pointer'
      },
      bgcolor: stringToColor(name)
    },
    children: abbreviation
  }
}

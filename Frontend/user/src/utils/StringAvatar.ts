import { stringToColor } from './StringToColor'

export function stringAvatar(name: string, fontSizeProp?: string, widthProp?: number, heightProp?: number) {
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
      width: widthProp ? widthProp : 24,
      height: heightProp ? heightProp : 24,
      fontSize: fontSizeProp ? fontSizeProp : '14px',
      '&:hover': {
        bgcolor: 'primary.90',
        cursor: 'pointer'
      },
      bgcolor: stringToColor(name)
    },
    children: abbreviation
  }
}

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import { FormControl } from '@mui/base/FormControl/FormControl'
import { useTheme } from '../Theme/themeContext'
import { IoMdClose } from 'react-icons/io'
import ListItem from '@mui/material/ListItem'
import Avatar from '@mui/material/Avatar'
import { stringToColor } from '~/utils/StringToColor'
import React from 'react'
import { BoardApiRTQ, UserApiRTQ } from '~/api'

interface Props {
  open: boolean
  handleCloseShare: () => void
  boardID: string
}

const isValidEmail = (email: string) => {
  // Sử dụng biểu thức chính quy để kiểm tra định dạng email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

function stringAvatar(name: string) {
  let abbreviation = ''

  // Kiểm tra xem tham số name có tồn tại không
  if (name) {
    if (name.includes(' ')) {
      // Nếu tên có ít nhất một khoảng trắng, lấy hai chữ cái đầu tiên từ các từ
      abbreviation = name
        .split(' ')
        .map((word) => word[0])
        .join('')
    } else {
      // Nếu tên chỉ có một từ, lấy chữ cái đầu tiên của từ đó
      abbreviation = name[0].toUpperCase()
    }
  } else {
    // Xử lý trường hợp name không tồn tại (undefined hoặc null)
    abbreviation = 'N/A'
  }

  return {
    sx: {
      width: 30,
      height: 30,
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

export default function ShareDialog({ open, handleCloseShare, boardID }: Props) {
  const [emailInput, setEmailInput] = React.useState('')
  const { colors } = useTheme()
  const [getUserByEmail, { data: UserData }] = UserApiRTQ.UserApiSlice.useLazyGetUserByEmailQuery()
  const [addMemberToBoard] = BoardApiRTQ.BoardApiSlice.useAddMemberToBoardMutation()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [selectedValue, setSelectedValue] = React.useState('')
  const options = ['Admin', 'Observer', 'Member']

  const handleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSelectedValue(event.target.value)
  }
  // Hàm xử lý khi nhấn nút Share
  const handleShare = () => {
    if (isValidEmail(emailInput)) {
      // Nếu là email hợp lệ, gọi hàm gọi API
      addMemberToBoard({ _id: boardID, email: emailInput })
        .then((response) => {
          // Xử lý kết quả trả về từ API ở đây
          console.log(response)
          alert('Thêm thành công')
        })
        .catch((error) => {
          // Xử lý lỗi nếu có
          console.error(error)
        })
    } else {
      // Nếu không phải email hợp lệ, thông báo lỗi cho người dùng
      alert('Please enter a valid email address')
    }
  }

  // Hàm xử lý thay đổi giá trị trong ô input
  const handleInputChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setEmailInput(event.target.value)
  }

  const storedProfile = localStorage.getItem('profile')
  const [profile, setProFile] = React.useState({ email: '', name: '' })
  React.useEffect(() => {
    const profileSave = storedProfile ? JSON.parse(storedProfile) : { email: '', name: '' }
    setProFile({ ...profileSave })
  })

  React.useEffect(() => {
    getUserByEmail({ email: profile.email }).then((a) => console.log(a))
  }, [getUserByEmail])
  return (
    <Dialog open={open} onClose={handleCloseShare} aria-labelledby='alert-dialog-title' className='rounded-[10px]'>
      <DialogTitle id='alert-dialog-title' sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {'Share board'}
        <IoMdClose className='cursor-pointer' onClick={handleCloseShare} />
      </DialogTitle>
      <DialogContent>
        <Box sx={{ width: '520px' }}>
          <FormControl className='flex w-[98%]'>
            <input
              type='text'
              className={`h-7 w-[342px] rounded-[3px] border-[3px] border-[#92a1b9] px-2 py-4 transition-all duration-100 active:scale-[0.98]`}
              placeholder='Email address or name'
              style={{ backgroundColor: '#ffff' }}
              onChange={handleInputChange}
            />
            <select
              style={{
                width: '100px',
                fontSize: '14px',
                height: '38px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                borderRadius: '3px',
                border: '1px solid #ccc',
                backgroundColor: colors.button,
                outline: 'none',
                paddingLeft: '10px',
                marginLeft: '5px'
              }}
              className={`hover:bg-[${colors.button_hover}]`}
            >
              <option value='member'>Member</option>
              <option value='member'>Unknow</option>
            </select>
            <Box
              sx={{
                width: '60px',
                fontSize: '14px',
                fontWeight: 'bold',
                height: '40px',
                marginLeft: '6px',
                marginBottom: '2px',
                paddingY: '10px',
                paddingX: '10px',
                borderRadius: '4px',
                bgcolor: '#0C66E4',
                cursor: 'pointer',
                color: 'white',
                ':hover': {
                  backgroundColor: '#0055CC'
                }
              }}
              onClick={handleShare}
            >
              Share
            </Box>
          </FormControl>
          {UserData && UserData.data && (
            <ListItem
              secondaryAction={
                <select
                  style={{
                    padding: '7px 8px',
                    marginTop: '10px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: `${colors.button}`
                  }}
                  value={selectedValue}
                  onChange={handleChange}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              }
            >
              <Box sx={{ marginRight: '10px' }}>
                <Avatar {...stringAvatar(UserData.data.username)} />
              </Box>
              <Box>
                <Box sx={{ fontSize: '13px', fontWeight: '300x' }}>{UserData.data.username} (you)</Box>
                <Box sx={{ fontSize: '12px', fontWeight: '300x' }}>
                  @{UserData.data.username} - {UserData.data.bio}
                </Box>
              </Box>
            </ListItem>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

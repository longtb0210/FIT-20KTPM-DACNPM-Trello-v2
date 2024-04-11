import React, { ChangeEvent, useState } from 'react'
import { styled } from '@mui/material/styles'
import { Box, ButtonBase, Divider, Drawer } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { useTheme } from '~/components/Theme/themeContext'
import Button from '@mui/material/Button'
import { LuPlus } from 'react-icons/lu'
import { BoardApiRTQ } from '~/api'

const drawerWidth = 320

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  marginTop: 12
}))

interface Props {
  open: boolean
  handleDrawerClose: () => void
}

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    width: '100% !important' // Overrides inline-style
  },
  '&:hover, &.Mui-focusVisible': {
    zIndex: 1,
    '& .MuiImageBackdrop-root': {
      opacity: 0.15
    },
    '& .MuiImageMarked-root': {
      opacity: 0
    },
    '& .MuiTypography-root': {
      border: '4px solid currentColor'
    }
  }
}))

const ImageSrc = styled('span')({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center 40%',
  borderRadius: '8px'
})

// const Image = styled('span')(({ theme }) => ({
//   position: 'absolute',
//   left: 0,
//   right: 0,
//   top: 0,
//   bottom: 0,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   color: theme.palette.common.white,
//   borderRadius: '8px'
// }))

const ImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  borderRadius: '8px',
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create('opacity')
}))

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
})

const ChangeBackground: React.FC<Props> = ({ open, handleDrawerClose }) => {
  const url = window.location.href
  const workspaceIndex = url.indexOf('workspace/')
  const idsPart = url.substring(workspaceIndex + 'workspace/'.length)
  const [boardId] = idsPart.split('&')

  const { colors } = useTheme()

  // const [activeItem, setActiveItem] = useState<string | null>(null)

  // const handleItemClick = (item: string) => {
  //   setActiveItem(item)
  // }

  const [addBackgroundById, { data: boardData }] = BoardApiRTQ.BoardApiSlice.useAddBackgroundBoardMutation()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedFile, setSelectedFile] = useState<any | null>(null)

  const [previewUrl, setPreviewUrl] = useState('')

  const [inputExists, setInputExists] = useState<boolean | null>(false)

  // Cập nhật previewUrl khi selectedFile thay đổi
  React.useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    // Dọn dẹp khi component unmount hoặc selectedFile thay đổi
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    setInputExists(event.target.files && event.target.files.length > 0)
    if (file) {
      // Kiểm tra nếu file có đúng định dạng
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        setSelectedFile(file)
        console.log('File đã được chọn:', file)
        //lưu file vào local
        addBackgroundById({ id: boardId, background: file })
      } else {
        alert('Vui lòng chỉ chọn file có định dạng là PNG hoặc JPG.')
      }
    }
  }

  return (
    <div style={{ position: 'absolute' }}>
      <Drawer
        sx={{
          ...(open && { width: drawerWidth }),
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '53px',
            color: colors.text,
            paddingX: '20px',
            backgroundColor: colors.background
          },
          color: colors.text,
          backgroundColor: colors.background
        }}
        variant='persistent'
        anchor='right'
        open={open}
      >
        <DrawerHeader>
          <span className='text- w-[100%] rounded-md font-bold'>
            <div className='flex justify-center'>
              <h3>Change background</h3>
              <IoMdClose
                className='absolute right-3 cursor-pointer hover:text-gray-400'
                onClick={handleDrawerClose}
              ></IoMdClose>
            </div>
          </span>
        </DrawerHeader>
        <Divider />
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>Custom</h3>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexFlow: 'row wrap'
          }}
        >
          <Button
            component='label'
            startIcon={<LuPlus className='ml-2 text-[#69768C]' />}
            sx={{
              width: '128px',
              marginTop: '15px',
              borderRadius: '8px',
              height: '80px',
              cursor: 'pointer',
              backgroundColor: '#F1F2F4',
              '&hover': {
                backgroundColor: '#C4C9D2'
              }
            }}
          >
            <VisuallyHiddenInput type='file' accept='.png, .jpg, .jpeg' onChange={handleFileChange} />
          </Button>
          <ImageButton
            focusRipple
            key='hello'
            style={{
              width: '128px',
              height: '80px',
              marginTop: '15px',
              borderRadius: '8px'
            }}
          >
            <ImageSrc
              style={{ backgroundImage: `url(${'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e'})` }}
            />
            <ImageBackdrop className='MuiImageBackdrop-root' />
          </ImageButton>
          {boardData &&
            boardData?.data &&
            boardData.data.background_list.map((images) => (
              <ImageButton
                focusRipple
                key='hello'
                style={{
                  width: '128px',
                  height: '80px',
                  marginTop: '15px',
                  borderRadius: '8px'
                }}
              >
                <ImageSrc style={{ backgroundImage: `url(${images})` }} />
                <ImageBackdrop className='MuiImageBackdrop-root' />
              </ImageButton>
            ))}
          {inputExists && (
            <ImageButton
              focusRipple
              key='hello'
              style={{
                width: '128px',
                height: '80px',
                marginTop: '15px',
                borderRadius: '8px'
              }}
            >
              <ImageSrc style={{ backgroundImage: `url(${previewUrl})` }} />
              <ImageBackdrop className='MuiImageBackdrop-root' />
            </ImageButton>
          )}
        </Box>
      </Drawer>
    </div>
  )
}

export default ChangeBackground

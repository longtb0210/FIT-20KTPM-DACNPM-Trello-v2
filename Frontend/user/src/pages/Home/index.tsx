import StarBorderIcon from '@mui/icons-material/StarBorder'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ProjectTile from './components/ProjectTile'
import { useTheme } from '../../components/Theme/themeContext'
import SidebarTemplate from '~/components/SidebarTemplate'
import { Box, Button, Typography } from '@mui/material'
import CardContent from './components/CardContent'
import { BoardApiRTQ } from '~/api'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'

export default function HomePage() {
  const { darkMode, colors } = useTheme()

  const [getALlBoard, { data: boardData }] = BoardApiRTQ.BoardApiSlice.useLazyGetAllBoardQuery()
  React.useEffect(() => {
    getALlBoard().then((a) => console.log(a))
  }, [getALlBoard])
  console.log(boardData?.data)

  const [starred, setStarred] = useState(false)

  const handleClickToStar = () => {
    setStarred(!starred)
  }

  return (
    <>
      <Box
        className='flex flex-row items-start justify-center'
        sx={{
          color: colors.text,
          backgroundColor: colors.background,
          transition: darkMode ? 'all 0.2s ease-in' : 'all 0.2s ease-in',
          a: {
            textDecorationLine: 'none'
          },
          button: {
            borderRadius: '0.125rem',
            boxSizing: 'border-box',
            paddingY: '10px'
          }
        }}
      >
        <div className='flex flex-row items-start justify-center'>
          <nav className='sticky top-10 mr-20 w-64'>
            <SidebarTemplate />
          </nav>

          {/* highlight main content */}
          <div className='ml-24 mt-3 pl-12'>
            <div className='relative z-0'>
              <div className='pb-5'>
                {/* content: Icon + HighLight */}
                <div className='mb-3 flex h-8 items-baseline justify-start pl-4'>
                  <div className='relative top-px -ml-2 w-8 text-center'>
                    <span className='mb-1 h-3 w-4 leading-4'>
                      <StarBorderIcon
                        sx={{
                          fontSize: '20px',
                          color: starred ? '#FF991F' : '',
                          marginBottom: '4px',
                          marginLeft: '5px',
                          cursor: 'pointer',
                          '&hover': {
                            color: '#FF991F',
                            fontSize: '22px'
                          },
                          '&:active': {
                            color: '#FF991F'
                          }
                        }}
                        onClick={handleClickToStar}
                      />
                    </span>
                  </div>
                  <div
                    className='m-0 mt-4 flex-auto py-2 text-xs font-semibold leading-4 text-gray-700'
                    style={{ color: colors.text }}
                  >
                    Highlights
                  </div>
                </div>
                {/* end */}

                {/* annoucement */}
                <div className='RN8jBKHlQoem5U'>{/* Add your content for recently viewed boards here */}</div>
                {/* end annoucement */}

                <ul data-testid='home-highlights-list'>
                  {/* Add card highlight items here */}
                  <div className='container mx-auto w-[450px] pl-5'>
                    <CardContent />
                  </div>
                  {/* end add highlight */}
                </ul>
              </div>
            </div>
          </div>

          {/* right side bar home */}
          <div className='sticky top-16 h-[90vh] w-full max-w-[342px] overflow-y-auto pl-12'>
            <div className='pb-6' data-testid='home-recently-viewed-boards-container'>
              <div className='mb-2 flex h-8 items-baseline justify-start pl-3'>
                <div className='relative top-[3px] -ml-2 mb-1 w-8 text-center'>
                  <span className='mb-2 leading-4'>
                    <AccessTimeIcon sx={{ fontSize: '18px', marginBottom: '5px' }} />
                  </span>
                </div>
                <div
                  className='m-0 mt-4 flex-auto py-2 text-xs font-semibold leading-4 text-gray-700'
                  style={{ color: colors.text }}
                >
                  Recently viewed
                </div>
              </div>

              {/* card home tile */}
              <div className='mt-5'>
                {/* Kiểm tra xem workspaceData có tồn tại và có phần tử data không trước khi sử dụng */}
                {boardData &&
                  boardData.data &&
                  boardData.data.map(
                    (
                      owner // Mapping qua mảng các chủ sở hữu
                    ) => (
                      <ProjectTile key={owner._id} boardData={owner} /> // Truyền dữ liệu từng chủ sở hữu vào ProjectTile
                    )
                  )}
              </div>
              {/* end home tile */}
            </div>

            <div className='iSLLvvYdGSEgKr'>
              <h6 className='mb-4 ml-3 text-[13px] font-semibold'>Links</h6>
              <div className='relative flex h-12 items-center rounded'>
                <button className='absolute m-0 flex h-6 h-[50px] w-[100%] cursor-pointer items-center rounded rounded-md border-0 p-0  font-thin shadow-none hover:bg-[#DCDFE4]'>
                  <span className='ml-2 mr-4 rounded-md bg-[#F1F2F4] px-3 py-2'>
                    <FaPlus className='' />
                  </span>
                  <span className=' mt-0 block overflow-hidden whitespace-nowrap text-[14px] font-normal leading-3 text-gray-700'>
                    Create a board
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </>
  )
}

import { useState } from 'react' // Import useState hook
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { useTheme } from '~/components/Theme/themeContext'
import { WorkspaceApiRTQ } from '~/api'
import React from 'react'
import { DbSchemas } from '@trello-v2/shared'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

interface ProjectTileProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  boardData: Record<string, any>
}

const ProjectTile: React.FC<ProjectTileProps> = ({ boardData }) => {
  const { colors, darkMode } = useTheme()
  const [isStar, setIsStar] = useState(false) // State để theo dõi hover của icon
  const [isHovered, setIsHovered] = useState(false) // State để theo dõi hover của ProjectTile
  const [getWorkspaceById, { data: workspaceData }] = WorkspaceApiRTQ.WorkspaceApiSlice.useLazyGetWorkspaceInfoQuery()

  React.useEffect(() => {
    getWorkspaceById(boardData.workspace_id)
  }, [boardData.workspace_id, getWorkspaceById])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleIconClick(): void {
    setIsStar(!isStar)
  }

  return (
    <div
      data-testid='home-tile-Project Trello'
      className='relative flex h-12 items-center rounded'
      onMouseEnter={() => setIsHovered(true)} // Khi hover vào div, setIsHovered(true)
      onMouseLeave={() => setIsHovered(false)} // Khi rời khỏi div, setIsHovered(false)
    >
      <Link
        to={`/workspace/${boardData.workspace_id}/board/${boardData._id}`}
        className={`relative m-0 box-border flex h-12 w-full cursor-pointer items-center rounded border-0 p-0 py-2 pl-2 pr-10 font-normal text-gray-700 no-underline shadow-none transition ${darkMode ? 'hover:bg-gray-700' : 'bg-white hover:bg-slate-200'}`}
      >
        <div
          className='mr-2 block h-6 w-8 flex-initial rounded bg-cover'
          style={{
            backgroundImage:
              boardData.background.charAt(0) === 'h' ? `url('${boardData.background}')` : boardData.background
          }}
        ></div>
        <span className='mr-2 block overflow-hidden'>
          <span
            className='block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-bold leading-4 text-gray-800'
            style={{ color: colors.text }}
          >
            {boardData.name}
          </span>
          <span
            className='mt-0 block overflow-hidden text-ellipsis whitespace-nowrap text-xs font-normal leading-3 text-gray-700'
            style={{ color: colors.text }}
          >
            {workspaceData?.data.name}
          </span>
        </span>
      </Link>
      {/* Hiển thị icon ngôi sao khi hover vào ProjectTile hoặc khi hover vào icon */}
      {(isHovered || isStar) && (
        <button
          data-testid='home-tile-secondary-button-Project Trello'
          title='Click to star Project Trello. It will show up at the top of your boards list.'
          className='absolute right-3 top-3 m-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded border-0 p-0 font-normal shadow-none'
          onClick={handleIconClick}
        >
          {/* <span className={`hover:text-[#FF991F] ${isStar ? 'text-[#FF991F]' : ''}`}>
            <StarBorderIcon sx={{ fontSize: '18px' }} />
          </span> */}
          {isStar ? (
            <FontAwesomeIcon color='yellow' fontSize={14} icon={faStar} />
          ) : (
            <StarBorderIcon sx={{ fontSize: '18px' }} />
          )}
        </button>
      )}
    </div>
  )
}

export default ProjectTile

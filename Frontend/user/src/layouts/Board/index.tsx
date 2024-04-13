import { ReactNode, useEffect, useState } from 'react'
import backgroundImage from '../../assets/Board/bg_2.jpg'
import { BoardApiRTQ } from '~/api'
import { Board } from '@trello-v2/shared/src/schemas/Board'
import { useParams } from 'react-router-dom'
interface LayoutProps {
  children: ReactNode
  openCardSetting: string
}
export const BoardLayout: React.FC<LayoutProps> = ({ children, openCardSetting }) => {
  const [getBoardById, { data: boardRes }] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByIdQuery()
  const [boardData, setBoardData] = useState<Board | null>()
  const params = useParams()
  const boardId = params.boardId
  useEffect(() => {
    console.log('boardId BG: ', boardId)
    getBoardById(boardId)
  }, [])
  useEffect(() => {
    console.log('boardData BG: ', boardRes)
    setBoardData(boardRes?.data)
  }, [boardRes])
  const backgroundStyle = {
    backgroundImage: `url(${boardData?.background ? boardData?.background : backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.7
  }
  return (
    <div className={`relative`} style={{ minHeight: 'calc(100vh - 50px)' }}>
      <div className={`absolute inset-0`} style={backgroundStyle} />
      <main className={`relative z-0  ${openCardSetting ? 'pointer-events-none' : ''}`}>{children}</main>
    </div>
  )
}

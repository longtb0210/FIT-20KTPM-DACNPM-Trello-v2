import { ReactNode, useEffect, useState } from 'react'
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
    getBoardById(boardId)
  }, [boardId, boardRes, getBoardById])
  useEffect(() => {
    setBoardData(boardRes?.data)
  }, [boardRes])
  const backgroundStyle = {
    backgroundImage: boardData?.background.charAt(0) === 'h' ? `url(${boardData?.background})` : boardData?.background,
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

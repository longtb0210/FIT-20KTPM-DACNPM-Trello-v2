// import React, { useState } from 'react'
// import { BoardApiRTQ, UserApiRTQ } from '~/api'

// interface Props {
//   boardId: string
// }

// const ListAvatar: React.FC<Props> = ({ boardId }) => {
//   const [getBoardById, { data: boardData }] = BoardApiRTQ.BoardApiSlice.useLazyGetBoardByIdQuery()
//   React.useEffect(() => {
//     getBoardById(boardId).then((a) => console.log(a))
//   }, [boardId, getBoardById])

//   return (
//     <>
//       {boardData &&
//         boardData.data &&
//         (typeof boardData.data.members_email !== 'undefined' && boardData.data.members_email.length > 0
//           ? Promise.all(
//               boardData.data.members_email.map((owner) =>
//                 getUserById(owner).then((users) => {
//                   // Xử lý logic với mảng users đã được trả về từ getUserById
//                 })
//               )
//             ).catch((error) => {
//               console.error('Error while fetching user data:', error)
//             })
//           : console.warn('boardData.data.members_email is undefined or empty'))}
//     </>
//   )
// }

// export default ListAvatar

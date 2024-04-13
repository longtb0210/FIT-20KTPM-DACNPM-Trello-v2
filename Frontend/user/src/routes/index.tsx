import { Routes, Route } from 'react-router-dom'
import HomePage from '~/pages/Home'
import { Templates } from './../pages/Templates/index'
import { AccountManagement, Board, BoardsPage, ErrorPage } from '~/pages'
import { CategoryWorkspace } from '~/pages/CategoryWorkspace'
import PageMembers from '~/pages/Members'
import Login from '~/pages/Login'
import { WorkspaceSetting } from '~/pages/WorkspaceSetting'
import { WorkspaceBoardsPage } from '~/pages/WorkspaceBoardsPage'
import Layout from '~/layouts/Layout/layout'
import PrivateRoute from './privateRoute'
import { useContext } from 'react'
import { AuthContext } from '~/components/AuthProvider/AuthProvider'
import CardDetailWindow from '~/components/CardDetailWindow'

export const Navigation = () => {
  const authContext = useContext(AuthContext)
  const isLoggedIn = authContext?.isLoggedIn

  console.log(isLoggedIn)

  return (
    <Routes>
      <Route element={<PrivateRoute isAllowed={!isLoggedIn} redirectPath='/' />}>
        <Route path='/login' element={<Login />} />
      </Route>
      {isLoggedIn !== undefined && (
        <Route element={<PrivateRoute isAllowed={isLoggedIn} redirectPath='/login' />}>
          <Route element={<Layout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/profile' element={<AccountManagement page={`profile`} />} />
            <Route path='/template' element={<Templates />} />

            <Route path='/workspace/:workspaceId/board/:boardId' element={<CategoryWorkspace />} />
            <Route path='/boards/:id?' element={<BoardsPage />} />

            <Route path='/activity' element={<AccountManagement page={`activity`} />} />
            {/* <Route path='/cardlist' element={<Board />} /> */}
            {/* <Route path='/carddetail' element={<CardDetailWindow />} /> */}
            <Route path='/workspace/:workspaceId/members' element={<PageMembers />} />
            <Route path='/workspaceSetting/:workspaceId' element={<WorkspaceSetting />} />
            <Route path='/workspaceboard/:workspaceId' element={<WorkspaceBoardsPage />} />
          </Route>
        </Route>
      )}

      <Route path='*' element={<ErrorPage />} />
    </Routes>
  )
}

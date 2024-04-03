import { Routes, Route } from 'react-router-dom'
import HomePage from '~/pages/Home'
import { Templates } from './../pages/Templates/index'
import { AccountManagement, Board, BoardsPage, ErrorPage } from '~/pages'
import CardDetailWindow from '~/components/CardDetailWindow'
import { CategoryWorkspace } from '~/pages/CategoryWorkspace'
import PageMembers from '~/pages/Members'
import Login from '~/pages/Login'
import { WorkspaceSetting } from '~/pages/WorkspaceSetting'
import { WorkspaceBoardsPage } from '~/pages/WorkspaceBoardsPage'
import Layout from '~/layouts/Layout/layout'
import PrivateRoute from './privateRoute'
import { useContext } from 'react'
import { AuthContext } from '~/components/AuthProvider/AuthProvider'

export const Navigation = () => {
  const authContext = useContext(AuthContext)
  // const isLoggedIn = authContext?.isLoggedIn
  const isLoggedIn = true

  return (
    <Routes>
      <Route element={<PrivateRoute isAllowed={!isLoggedIn} redirectPath='/' />}>
        <Route path='/login' element={<Login />} />
      </Route>
      <Route element={<PrivateRoute isAllowed={isLoggedIn ?? false} redirectPath='/login' />}>
        <Route element={<Layout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/profile/:id' element={<AccountManagement page={`profile`} />} />
          <Route path='/template' element={<Templates />} />
          <Route path='/workspace/:workspaceId' element={<CategoryWorkspace />} />
          <Route path='/board/:id?' element={<BoardsPage />} />
          <Route path='/activity/:id' element={<AccountManagement page={`activity`} />} />
          <Route path='/carddetail' element={<CardDetailWindow />} />
          <Route path='/cardlist' element={<Board />} />
          <Route path='/workspace/:workspaceId/members' element={<PageMembers />} />
          <Route path='/workspaceSetting' element={<WorkspaceSetting />} />
          <Route path='/workspaceboard' element={<WorkspaceBoardsPage />} />
        </Route>
      </Route>
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  )
}

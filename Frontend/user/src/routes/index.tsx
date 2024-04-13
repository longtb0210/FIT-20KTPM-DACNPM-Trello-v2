import { Routes, Route } from 'react-router-dom'
import HomePage from '~/pages/Home'
import CardTemplate from '~/pages/Templates/component/CardTemplate'
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
            <Route path='/profile/:id' element={<AccountManagement page={`profile`} />} />
            <Route path='/template' element={<CardTemplate />} />
            <Route path='/workspace/:workspaceId/:boardId' element={<CategoryWorkspace />} />
            <Route path='/boards' element={<BoardsPage />} />
            <Route path='/activity/:id' element={<AccountManagement page={`activity`} />} />
            <Route path='/cardlist' element={<Board />} />
            <Route path='/carddetail' element={<CardDetailWindow />} />
            <Route path='/workspace/:workspaceId/members' element={<PageMembers />} />
            <Route path='/workspace/:workspaceId/workspaceSetting' element={<WorkspaceSetting />} />
            <Route path='/workspaceboard/:workspaceId/:workspace' element={<WorkspaceBoardsPage />} />
          </Route>
        </Route>
      )}

      <Route path='*' element={<ErrorPage />} />
    </Routes>
  )
}

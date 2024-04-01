import { ReactNode } from 'react'
import PropTypes from 'prop-types'
import { Navigate, Outlet } from 'react-router-dom'

type PrivateRouteProps = {
  isAllowed: boolean
  redirectPath: string
  children?: ReactNode
}

const PrivateRoute = ({ isAllowed, redirectPath, children }: PrivateRouteProps) =>
  isAllowed ? children || <Outlet /> : <Navigate to={redirectPath} replace />

PrivateRoute.propTypes = {
  isAllowed: PropTypes.bool.isRequired,
  redirectPath: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default PrivateRoute

import { Navigate } from 'react-router'
import LoadingSpinner from '../components/Shared/LoadingSpinner'
import useRole from '../hooks/useRole'

const AdminRoute = ({ children }) => {
    const [role, isRoleLoading] = useRole()

    if (isRoleLoading) return <LoadingSpinner />
    if (role === 'admin') return children
    return <Navigate to='/' />
}

export default AdminRoute
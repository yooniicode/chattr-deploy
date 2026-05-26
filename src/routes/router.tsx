import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { ChatPage } from '../pages/ChatPage'
import { DmPage } from '../pages/DmPage'
import { LoginPage } from '../pages/LoginPage'
import { ProfilePage } from '../pages/ProfilePage'
import { WorkspaceManagePage } from '../pages/WorkspaceManagePage'
import { WorkspaceMemberPage } from '../pages/WorkspaceMemberPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/chat" />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/chat',
    element: <ChatPage />,
  },
  {
    path: '/dm',
    element: <DmPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  {
    path: '/workspaces/manage',
    element: <WorkspaceManagePage />,
  },
  {
    path: '/workspaces/members',
    element: <WorkspaceMemberPage />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

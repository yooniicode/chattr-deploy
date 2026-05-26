import { mockWorkspaces } from '../../mocks/mockWorkspace'
import { WorkspaceCard } from '../workspace/WorkspaceCard'

export function WorkspaceSidebar() {
  return (
    <nav aria-label="Workspaces" className="workspace-sidebar">
      {mockWorkspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </nav>
  )
}

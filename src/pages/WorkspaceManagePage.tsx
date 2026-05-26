import { WorkspaceCard } from '../components/workspace/WorkspaceCard'
import { mockWorkspaces } from '../mocks/mockWorkspace'

export function WorkspaceManagePage() {
  return (
    <main className="page">
      <h1>Workspace management</h1>
      <div className="stack">
        {mockWorkspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>
    </main>
  )
}

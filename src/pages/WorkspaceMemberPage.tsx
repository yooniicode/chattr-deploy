import { WorkspaceMemberItem } from '../components/workspace/WorkspaceMemberItem'
import { mockWorkspaceMembers } from '../mocks/mockWorkspace'

export function WorkspaceMemberPage() {
  return (
    <main className="page">
      <h1>Workspace members</h1>
      <section className="panel">
        {mockWorkspaceMembers.map((member) => (
          <WorkspaceMemberItem key={member.id} member={member} />
        ))}
      </section>
    </main>
  )
}

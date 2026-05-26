import type { Workspace } from '../../types/workspace'

interface WorkspaceCardProps {
  workspace: Workspace
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  return <button className="workspace-card" type="button">{workspace.name.slice(0, 2)}</button>
}

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { createWorkspace, joinWorkspace } from '../utils/cloudStorage';
import { Workspace } from '../types';

interface WorkspaceManagerProps {
  userEmail: string;
  currentWorkspaceId: string | null;
  onWorkspaceChange: (workspaceId: string) => void;
  onClose: () => void;
}

export default function WorkspaceManager({
  userEmail,
  currentWorkspaceId,
  onWorkspaceChange,
  onClose,
}: WorkspaceManagerProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [joinId, setJoinId] = useState('');

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .contains('members', [userEmail]);

      if (error) throw error;
      setWorkspaces(data || []);
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;

    setLoading(true);
    const workspace = await createWorkspace(workspaceName.trim(), userEmail);
    if (workspace) {
      await loadWorkspaces();
      onWorkspaceChange(workspace.id);
      setShowCreate(false);
      setWorkspaceName('');
    }
    setLoading(false);
  };

  const handleJoinWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinId.trim()) return;

    setLoading(true);
    const success = await joinWorkspace(joinId.trim(), userEmail);
    if (success) {
      await loadWorkspaces();
      onWorkspaceChange(joinId.trim());
      setShowJoin(false);
      setJoinId('');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center z-50 p-4 overflow-y-auto pt-20">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl mt-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Workspaces</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-4">Signed in as: {userEmail}</p>
        </div>

        {/* Current Workspaces */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Your Workspaces</h3>
          {workspaces.length === 0 ? (
            <p className="text-sm text-gray-400">No workspaces yet</p>
          ) : (
            <div className="space-y-2">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    onWorkspaceChange(ws.id);
                    onClose();
                  }}
                  className={`w-full text-left px-3 py-2 rounded border transition ${
                    currentWorkspaceId === ws.id
                      ? 'bg-gray-100 border-gray-300'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{ws.name}</div>
                  <div className="text-xs text-gray-400">{ws.members.length} members</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create Workspace */}
        {showCreate ? (
          <form onSubmit={handleCreateWorkspace} className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
            <label className="block text-gray-700 mb-2 text-sm font-medium">Workspace Name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-3"
              placeholder="e.g., Family Habits, Team Goals..."
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreate(false);
                  setWorkspaceName('');
                }}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !workspaceName.trim()}
                className="flex-1 px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition text-sm disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="w-full mb-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded transition text-sm font-medium"
          >
            + Create Workspace
          </button>
        )}

        {/* Join Workspace */}
        {showJoin ? (
          <form onSubmit={handleJoinWorkspace} className="p-4 bg-gray-50 rounded border border-gray-200">
            <label className="block text-gray-700 mb-2 text-sm font-medium">Workspace ID</label>
            <input
              type="text"
              value={joinId}
              onChange={(e) => setJoinId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent mb-3"
              placeholder="Enter workspace ID or invite link"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowJoin(false);
                  setJoinId('');
                }}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !joinId.trim()}
                className="flex-1 px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition text-sm disabled:opacity-50"
              >
                Join
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowJoin(true)}
            className="w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition text-sm font-medium"
          >
            Join Workspace
          </button>
        )}
      </div>
    </div>
  );
}


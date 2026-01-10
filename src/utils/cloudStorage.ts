import { supabase } from './supabase';
import { AppData, Workspace } from '../types';

export const createWorkspace = async (name: string, userEmail: string): Promise<Workspace | null> => {
  try {
    const workspace: Omit<Workspace, 'id'> = {
      name,
      createdBy: userEmail,
      createdAt: new Date().toISOString(),
      members: [userEmail],
      isPublic: false,
    };

    const { data, error } = await supabase
      .from('workspaces')
      .insert(workspace)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to create workspace:', error);
    return null;
  }
};

export const joinWorkspace = async (workspaceId: string, userEmail: string): Promise<boolean> => {
  try {
    const { data: workspace, error: fetchError } = await supabase
      .from('workspaces')
      .select('members')
      .eq('id', workspaceId)
      .single();

    if (fetchError) throw fetchError;

    if (!workspace.members.includes(userEmail)) {
      const { error: updateError } = await supabase
        .from('workspaces')
        .update({ members: [...workspace.members, userEmail] })
        .eq('id', workspaceId);

      if (updateError) throw updateError;
    }

    return true;
  } catch (error) {
    console.error('Failed to join workspace:', error);
    return false;
  }
};

export const loadWorkspaceData = async (workspaceId: string): Promise<AppData | null> => {
  try {
    const { data, error } = await supabase
      .from('workspace_data')
      .select('data')
      .eq('workspace_id', workspaceId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data yet, return empty data
        return { habits: [], completions: [], moods: [] };
      }
      throw error;
    }

    return data?.data || { habits: [], completions: [], moods: [] };
  } catch (error) {
    console.error('Failed to load workspace data:', error);
    return null;
  }
};

export const saveWorkspaceData = async (workspaceId: string, data: AppData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('workspace_data')
      .upsert({
        workspace_id: workspaceId,
        data,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to save workspace data:', error);
    return false;
  }
};

export const subscribeToWorkspaceData = (
  workspaceId: string,
  callback: (data: AppData) => void
) => {
  return supabase
    .channel(`workspace:${workspaceId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'workspace_data',
        filter: `workspace_id=eq.${workspaceId}`,
      },
      (payload: any) => {
        if (payload.new && payload.new.data) {
          callback(payload.new.data as AppData);
        }
      }
    )
    .subscribe();
};


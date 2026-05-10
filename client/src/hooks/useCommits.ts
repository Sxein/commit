import { fetchCommits, createCommit, updateCommit, deleteCommit } from '@/services/api';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export function useCommits() {
    const queryClient = useQueryClient();

    // Fetch commits using React Query
    const {data : commitsData, isPending, isError, error} = useQuery({
      queryKey: ['commits'],
      queryFn: fetchCommits,
    })

    // Create commit mutation
    const createCommitMutation = useMutation({
      mutationFn: createCommit,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['commits'] });
      }
    })

    // Update commit mutation
    const updateCommitMutation = useMutation({
      mutationFn: ({commitId, title}: {commitId: number, title: string}) => updateCommit(commitId, title),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['commits'] });
      }
    })
    
    // Delete commit mutation
    const deleteCommitMutation = useMutation({
      mutationFn: deleteCommit,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['commits'] });
      }
    })
    return {
        commitsData,
        isPending,
        isError,
        error,
        createCommit : createCommitMutation,
        updateCommit : updateCommitMutation,
        deleteCommit : deleteCommitMutation,
    };
}
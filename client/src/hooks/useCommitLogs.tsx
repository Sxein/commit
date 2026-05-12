import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCommitLogs, createCommitLog } from "@/services/api";
import type { Commit, CommitLog } from "@/types";
import { useMemo } from "react";
import { calculateStreaks} from "@/lib/utils";

export function useCommitLogs(commits: Commit[]) {
    // Fetch commit logs for all commits using useQueries
    const queryClient = useQueryClient();
    const commitLogsQueries = useQueries({
      queries: commits.map((commit: Commit) => ({
        queryKey: ['commitLogs', commit.id],
        queryFn: () => fetchCommitLogs(commit.id),
        enabled: !!commit.id, // Ensure the query only runs if commit.id is available
      })),
      combine: (results) => {
        return {
          isPending: results.some((result) => result.isPending),
          data: results.map((result) => result.data).filter(Boolean).flat() as CommitLog[],
        }
      }
    })

    // Create commit log mutation
    const createCommitLogMutation = useMutation({
      mutationFn: ({ commitId, date}: {commitId: number, date: string}) => createCommitLog(commitId, date),
      onSuccess: (newLog, variables) => {
        const queryKey = ['commitLogs', variables.commitId];
        queryClient.setQueryData(queryKey, (oldLogs: CommitLog[] | undefined) => {
          if (!oldLogs) return [newLog];
          return [...oldLogs, newLog];
        });
      }
    });

    // Extract completed commit IDs for today using useMemo to optimize performance
    const completedCommitIdsToday = useMemo(() => {
      const commitLogs = commitLogsQueries.data || [];
      const today = new Date().toDateString();

      return commitLogs
      .filter(log => log.isCompleted && new Date(log.date).toDateString() === today)
      .map(log => log.commitId);
     }, [commitLogsQueries.data]
    );

    // Calculate streaks for each commit using useMemo to avoid unnecessary recalculations
    const streaks = useMemo(()=> {
      const commitLogs = commitLogsQueries.data || [];
      const newStreak: Record<number, number> = {};

      commits.forEach((commit: Commit) => {
        const logsForSpecificCommit = commitLogs.filter(log => (log.commitId === commit.id))
        newStreak[commit.id] = calculateStreaks(logsForSpecificCommit);
      })
      return newStreak;
     }, [commitLogsQueries.data, commits]
    );

    return {
        commitLogs: commitLogsQueries.data || [],
        isPendingLogs: commitLogsQueries.isPending,
        createCommitLog : createCommitLogMutation,
        completedCommitIdsToday,
        streaks,
    }
 };
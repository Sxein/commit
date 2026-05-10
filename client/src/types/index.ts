export interface Commit {
    id: number;
    title: string;
    userId: number;
  }

export interface CommitLog {
    date: string;
    isCompleted: boolean;
    commitId: number;
}

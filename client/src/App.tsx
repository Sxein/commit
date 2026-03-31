import './App.css';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchCommits, createCommit, logCommitCompletion, fetchCommitLogs } from '@/services/api';


  interface Commit {
    id: number;
    title: string;
    userId: number;
  }

function App() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [commitTitle, setCommitTitle] = useState('');
  const [completeToday, setCompleteToday] = useState<number[]>([]);
  const [streaks, setStreaks] = useState<Record<number, number>>({});
  
  function calculateStreaks(logs: { date: string; isCompleted: boolean }[]): number {
    // Filter logs to only include completed ones
    const completedLogs = logs.filter(log => log.isCompleted);
    // Extract unique dates from completed logs and get ride of time component for accurate streak calculation
    const uniqueCompletedLogs = Array.from(new Set(completedLogs.map(log => new Date(log.date).toDateString())));
    // Sort Commit logs by dates in descending order
    const sortedDates = uniqueCompletedLogs.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (sortedDates.length === 0) {
      return 0;
    }

    const expectedDate = new Date(sortedDates[0]);
    expectedDate.setHours(0, 0, 0, 0); // Normalize to start of the day
    
    // the most recent completed log date cannot be smaller than yesterday, otherwise the streak is already broken
    if (expectedDate < yesterday) {
      return 0; 
    }

    for (let i = 0; i < sortedDates.length; i++) {
      const logDate = new Date(sortedDates[i]);
      logDate.setHours(0, 0, 0, 0); // Normalize to start of the day

      if (logDate.getTime() === expectedDate.getTime()) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1); // Move to the previous day
      } else {
        break; // Break the loop if the streak is broken (gap in the days)
      }
    }

    return streak;

}
  useEffect(() => {
    const loadCommitsToBeCompletedToday = async () => {
      const userId = '1';
      try {
        //fetch commits for user
        const commits = await fetchCommits(userId);
        setCommits(commits);

        //fetch logs for each commit
        const logPromises = commits.map((commit: Commit) => fetchCommitLogs(commit.id));
        const allLogs = await Promise.all(logPromises);

        const completedCommitIdsForToday: number[] = [];
        const today = new Date().toDateString();

        const allLogsFlat = allLogs.flat();
        allLogsFlat.forEach((log: { date: string; isCompleted: boolean; commitId: number }) => {
          const logDate = new Date(log.date).toDateString();
          if (log.isCompleted && logDate === today) {
            completedCommitIdsForToday.push(log.commitId);
          }
        })
        setCompleteToday(completedCommitIdsForToday);
      } catch (error) {
        console.error('Error fetching commits:', error);
      }
    };
    loadCommitsToBeCompletedToday();
  }, []);


  // Create a new commit
  function handleCreateCommit(title: string){
    const userId = 1;
    
    createCommit(title, userId).then(newCommit => {
      setCommits(prevCommits => [...prevCommits, newCommit]);
      setCommitTitle('');
    })
  }

  // Log commit completion
  function handleLogCommit(commitId: number) {
    if (completeToday.includes(commitId)) {
      return;
    }
    
    logCommitCompletion(commitId).then(() => {
      console.log(`Logged completion for commit ${commitId}`);
    }).catch(error => {
      console.error(`Error logging completion for commit ${commitId}:`, error);
    });

    if (!completeToday.includes(commitId)) {
      setCompleteToday(prev => [...prev, commitId]);
    }
  }
  // useEffect(() => {
  //   const userId = '1';
  //   fetchCommits(userId)
  //     .then(data => { 
  //       setCommits(data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching commits:', error);
  //     });
  // }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Commits</h1>
     <form 
        className='flex w-full items-center space-x-2 mb-8'
        onSubmit={(e) => {
          e.preventDefault();
          if (commitTitle.trim()) {
            handleCreateCommit(commitTitle);
          }
        }} 
      >
        <Input type="text"
          className="flex-1"
          placeholder="Enter commit message..."
          value={commitTitle}
          onChange={(e) => setCommitTitle(e.target.value)} />
        <Button type="submit">Create Commit</Button>
      </form>

      <div className="space-y-4">
      {commits.map((commit) => ( 
        <Card 
        key={commit.id} 
        className={
          `my-3 transition-colors shadow-sm
          ${completeToday.includes(commit.id) ? 'bg-green-200 cursor-not-allowed' : 'bg-white hover:bg-gray-50 cursor-pointer'}`}
          onClick = {() => handleLogCommit(commit.id)}
        >
          <CardHeader className="py-4 px-6 gap-1">
            <CardTitle className="text-lg text-slate-900">{commit.title}</CardTitle>
            <CardDescription className="text-sm">Commit #{commit.id} • User {commit.userId}</CardDescription>
          </CardHeader>
        </Card>
      ))}
      </div>
    </div>
  )
}

export default App

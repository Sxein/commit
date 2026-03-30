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
        allLogsFlat.forEach((log: {commitId: number, date: string, isCompleted: boolean}) => {
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
      // setCommits([...commits, newCommit]);
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

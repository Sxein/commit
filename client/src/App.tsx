import './App.css';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { fetchCommits, createCommit } from '@/services/api';

  interface Commit {
    id: number;
    title: string;
    userId: number;
  }
function App() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [commitTitle, setCommitTitle] = useState('');

  function handleCreateCommit(title: string){
    const userId = 1;
    
    createCommit(title, userId).then(newCommit => {
      // setCommits([...commits, newCommit]);
      setCommits(prevCommits => [...prevCommits, newCommit]);
      setCommitTitle('');
    })
  }
  useEffect(() => {
    const userId = '1';
    fetchCommits(userId)
      .then(data => { 
        setCommits(data);
      })
      .catch(error => {
        console.error('Error fetching commits:', error);
      });
  }, []);

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
        <Card key={commit.id} className="my-3 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
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

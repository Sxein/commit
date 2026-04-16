//simple async function to fetch commits from backend
export async function fetchCommits(userId: string) {
    try {
        const response = await fetch(`http://localhost:3000/api/commits/${userId}`);
        if (!response.ok) {
            throw new Error(`Error fetching commits: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching commits:', error);
        throw error;
    }
}

export async function createCommit(title: string, userId: number) {
    try {
        const response = await fetch(`http://localhost:3000/api/commits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, userId }),
        });
        if (!response.ok) {
            throw new Error(`Error creating commit: ${response.statusText}`);
        }
        console.log('response from createCommit:', response);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating commit:', error);
        throw error;
    }
}

export async function createCommitLog(commitId: number) {
    try {
        const response = await fetch(`http://localhost:3000/api/commits/${commitId}/logs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
            throw new Error(`Error logging commit completion: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error logging commit completion:', error);
        throw error;
    }
}

export async function fetchCommitLogs(commitId: number) {
    try {
        const response = await fetch(`http://localhost:3000/api/commits/${commitId}/logs`);
        if (!response.ok) {
            throw new Error(`Error fetching commit logs: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching commit logs:', error);
        throw error;
    }
}
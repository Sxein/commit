import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
})

export const getMe = async () => {
    try {
        const { data } = await api.get('/auth/me');
        return data;
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}
export const fetchCommits = async () => {
    try {
        const { data } = await api.get('/commits');
        return data;
    } catch (error) {
        console.error('Error fetching commits:', error);
        throw error;
    }
}

export const createCommit = async (title: string) => {
    try {
        const { data } = await api.post('/commits', { title });
        return data;
    } catch (error) {
        console.error('Error creating commit:', error);
        throw error;
    }
}

export const fetchCommitLogs = async (commitId: number) => {
    try {
        const { data } = await api.get(`/commits/${commitId}/logs`);
        return data;
    } catch (error) {
        console.error('Error fetching commit logs:', error);
        throw error;    
    }
}

export const createCommitLog = async (commitId: number) => {
    try {
        const { data } = await api.post(`/commits/${commitId}/logs`);
        return data;
    } catch (error) {
        console.error('Error creating commit log:', error);
        throw error;    
    }
}


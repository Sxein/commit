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

export const register = async (email: string, password: string) => {
    try {
        const { data } = await api.post('/auth/register', { email, password });
        return data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

export const login = async (email: string, password: string) => {
    try {
        const { data } = await api.post('/auth/login', { email, password });
        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export const logout = async () => {
    try {
        const { data } = await api.post('/auth/logout');
        return data;
    } catch (error) {
        console.error('Error logging out:', error);
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

export const updateCommit = async (commitId: number, title: string) => {
    try {
        const { data } = await api.put(`/commits/${commitId}`, { title });
        return data;
    } catch (error) {
        console.error('Error updating commit:', error);
        throw error;
    }
}

export const deleteCommit = async (commitId: number) => {
    try {
        const { data } = await api.delete(`/commits/${commitId}`);
        return data;
    } catch (error) {
        console.error('Error deleting commit:', error);
        throw error;
    }
}

import { getAuth } from '../utils/authUtils';

const API_URL = 'http://localhost:3000/api/auth';
const BASE_URL = 'http://localhost:3000/api';

const getToken = () => {
    const auth = getAuth();
    return auth ? auth.token : null;
};

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
    }

    return response.json();
};

export const register = async (userData) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
    }

    return response.json();
};

export const verifyIdentity = async (data) => {
    const token = getToken();
    const response = await fetch(`${API_URL}/verify-identity`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Verification failed');
    }

    return response.json();
};

export const getStudents = async () => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/users/students`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch students');
    }

    return response.json();
};

export const getUsers = async () => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    return response.json();
};

export const getUser = async (id) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    return response.json();
};

export const updateUser = async (id, userData) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error('Failed to update user');
    }

    return response.json();
};

export const deleteUser = async (id) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete user');
    }

    return response.json();
};

export const getStudentsByMentor = async (mentorId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/users/mentor/${mentorId}/students`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch students for mentor');
    }

    return response.json();
};


export const getMentorStudents = async () => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/mentor/students`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch mentor students');
    }

    return response.json();
};

export const getTasks = async (studentId) => {
    const token = getToken();
    let url = `${BASE_URL}/tasks`;
    if (studentId) {
        url += `?studentId=${studentId}`;
    }
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }

    return response.json();
};

export const createTask = async (taskData) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        throw new Error('Failed to create task');
    }

    return response.json();
};

export const updateTask = async (id, taskData) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    return response.json();
};

export const deleteTask = async (id) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete task');
    }

    return response.json();
};


export const predictBookSales = async (data) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/ai/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Prediction failed');
    }

    return response.json();
};

export const createExam = async (examData) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/exams`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(examData),
    });

    if (!response.ok) {
        throw new Error('Failed to create exam');
    }

    return response.json();
};

export const getStudentExams = async (studentId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/exams/${studentId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch exams');
    }

    return response.json();
};

export const getExamDetail = async (examId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/exams/detail/${examId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch exam details');
    }

    return response.json();
};



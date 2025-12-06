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

// =====================
// MEETING API FUNCTIONS
// =====================

export const createMeeting = async (meetingData) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create meeting');
    }

    return response.json();
};

export const getMeetingsByMentor = async (mentorId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings/mentor/${mentorId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch meetings');
    }

    return response.json();
};

export const getUpcomingMeetings = async (mentorId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings/mentor/${mentorId}/upcoming`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch upcoming meetings');
    }

    return response.json();
};

export const getMeetingsByStudent = async (studentId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings/student/${studentId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch meetings');
    }

    return response.json();
};

export const getMeetingById = async (meetingId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings/${meetingId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch meeting details');
    }

    return response.json();
};

export const updateMeeting = async (meetingId, meetingData) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings/${meetingId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
        throw new Error('Failed to update meeting');
    }

    return response.json();
};

export const deleteMeeting = async (meetingId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete meeting');
    }

    return response.json();
};

export const updateParticipantStatus = async (meetingId, studentId, status) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings/${meetingId}/participants/${studentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error('Failed to update participant status');
    }

    return response.json();
};

export const getParticipants = async (meetingId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings/${meetingId}/participants`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch participants');
    }

    return response.json();
};

export const addParticipant = async (meetingId, studentId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings/${meetingId}/participants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId }),
    });

    if (!response.ok) {
        throw new Error('Failed to add participant');
    }

    return response.json();
};

export const removeParticipant = async (meetingId, studentId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/meetings/${meetingId}/participants/${studentId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to remove participant');
    }

    return response.json();
};

// ==========================
// NOTIFICATION API FUNCTIONS
// ==========================

export const sendNotification = async (notificationData) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send notification');
    }

    return response.json();
};

export const sendBulkNotification = async (notificationData) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications/bulk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send notifications');
    }

    return response.json();
};

export const getNotificationsByUser = async (userId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch notifications');
    }

    return response.json();
};

export const getUnreadNotifications = async (userId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications/user/${userId}/unread`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch unread notifications');
    }

    return response.json();
};

export const getUnreadNotificationCount = async (userId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications/user/${userId}/unread/count`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch unread count');
    }

    return response.json();
};

export const getSentNotifications = async (senderId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications/sent/${senderId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch sent notifications');
    }

    return response.json();
};

export const markNotificationAsRead = async (notificationId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to mark notification as read');
    }

    return response.json();
};

export const markAllNotificationsAsRead = async (userId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications/user/${userId}/read-all`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
    }

    return response.json();
};

export const deleteNotification = async (notificationId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete notification');
    }

    return response.json();
};

export const deleteAllNotifications = async (userId) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete notifications');
    }

    return response.json();
};

export const getNotificationsByType = async (userId, type) => {
    const token = getToken();
    const response = await fetch(`${BASE_URL}/notifications/user/${userId}/type/${type}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch notifications by type');
    }

    return response.json();
};

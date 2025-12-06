const MeetingService = require('../services/MeetingService');

class MeetingController {
    /**
     * Create a new meeting
     * POST /api/meetings
     */
    async createMeeting(req, res) {
        try {
            const { mentorId, meetingDate, title, meetingType, notes, meetingLink, studentIds } = req.body;

            // Basic validation
            if (!mentorId || !meetingDate || !title) {
                return res.status(400).json({ message: 'Missing required fields: mentorId, meetingDate, title' });
            }

            if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
                return res.status(400).json({ message: 'At least one student must be selected' });
            }

            const result = await MeetingService.createMeeting(req.body);
            res.status(201).json(result);
        } catch (error) {
            console.error('Create Meeting Error:', error);
            res.status(500).json({ message: 'Error creating meeting', error: error.message });
        }
    }

    /**
     * Get all meetings for a mentor
     * GET /api/meetings/mentor/:mentorId
     */
    async getMeetingsByMentor(req, res) {
        try {
            const mentorId = req.params.mentorId;
            const meetings = await MeetingService.getMeetingsByMentorId(mentorId);
            res.json(meetings);
        } catch (error) {
            console.error('Get Mentor Meetings Error:', error);
            res.status(500).json({ message: 'Error fetching meetings', error: error.message });
        }
    }

    /**
     * Get all meetings for a student
     * GET /api/meetings/student/:studentId
     */
    async getMeetingsByStudent(req, res) {
        try {
            const studentId = req.params.studentId;
            const meetings = await MeetingService.getMeetingsByStudentId(studentId);
            res.json(meetings);
        } catch (error) {
            console.error('Get Student Meetings Error:', error);
            res.status(500).json({ message: 'Error fetching meetings', error: error.message });
        }
    }

    /**
     * Get upcoming meetings for a mentor
     * GET /api/meetings/mentor/:mentorId/upcoming
     */
    async getUpcomingMeetings(req, res) {
        try {
            const mentorId = req.params.mentorId;
            const meetings = await MeetingService.getUpcomingMeetingsByMentorId(mentorId);
            res.json(meetings);
        } catch (error) {
            console.error('Get Upcoming Meetings Error:', error);
            res.status(500).json({ message: 'Error fetching upcoming meetings', error: error.message });
        }
    }

    /**
     * Get a meeting by ID
     * GET /api/meetings/:id
     */
    async getMeetingById(req, res) {
        try {
            const meetingId = req.params.id;
            const meeting = await MeetingService.getMeetingById(meetingId);

            if (!meeting) {
                return res.status(404).json({ message: 'Meeting not found' });
            }

            res.json(meeting);
        } catch (error) {
            console.error('Get Meeting By Id Error:', error);
            res.status(500).json({ message: 'Error fetching meeting details', error: error.message });
        }
    }

    /**
     * Update a meeting
     * PUT /api/meetings/:id
     */
    async updateMeeting(req, res) {
        try {
            const meetingId = req.params.id;
            const result = await MeetingService.updateMeeting(meetingId, req.body);
            res.json(result);
        } catch (error) {
            console.error('Update Meeting Error:', error);
            res.status(500).json({ message: 'Error updating meeting', error: error.message });
        }
    }

    /**
     * Delete a meeting
     * DELETE /api/meetings/:id
     */
    async deleteMeeting(req, res) {
        try {
            const meetingId = req.params.id;
            const result = await MeetingService.deleteMeeting(meetingId);
            res.json(result);
        } catch (error) {
            console.error('Delete Meeting Error:', error);
            res.status(500).json({ message: 'Error deleting meeting', error: error.message });
        }
    }

    /**
     * Update participant status
     * PATCH /api/meetings/:meetingId/participants/:studentId
     */
    async updateParticipantStatus(req, res) {
        try {
            const { meetingId, studentId } = req.params;
            const { status } = req.body;

            if (!status) {
                return res.status(400).json({ message: 'Status is required' });
            }

            const result = await MeetingService.updateParticipantStatus(meetingId, studentId, status);
            res.json(result);
        } catch (error) {
            console.error('Update Participant Status Error:', error);
            res.status(500).json({ message: 'Error updating participant status', error: error.message });
        }
    }

    /**
     * Get participants for a meeting
     * GET /api/meetings/:meetingId/participants
     */
    async getParticipants(req, res) {
        try {
            const meetingId = req.params.meetingId;
            const participants = await MeetingService.getParticipants(meetingId);
            res.json(participants);
        } catch (error) {
            console.error('Get Participants Error:', error);
            res.status(500).json({ message: 'Error fetching participants', error: error.message });
        }
    }

    /**
     * Add a participant to a meeting
     * POST /api/meetings/:meetingId/participants
     */
    async addParticipant(req, res) {
        try {
            const meetingId = req.params.meetingId;
            const { studentId } = req.body;

            if (!studentId) {
                return res.status(400).json({ message: 'Student ID is required' });
            }

            const result = await MeetingService.addParticipant(meetingId, studentId);
            res.status(201).json(result);
        } catch (error) {
            console.error('Add Participant Error:', error);
            res.status(500).json({ message: 'Error adding participant', error: error.message });
        }
    }

    /**
     * Remove a participant from a meeting
     * DELETE /api/meetings/:meetingId/participants/:studentId
     */
    async removeParticipant(req, res) {
        try {
            const { meetingId, studentId } = req.params;
            const result = await MeetingService.removeParticipant(meetingId, studentId);
            res.json(result);
        } catch (error) {
            console.error('Remove Participant Error:', error);
            res.status(500).json({ message: 'Error removing participant', error: error.message });
        }
    }
}

module.exports = new MeetingController();

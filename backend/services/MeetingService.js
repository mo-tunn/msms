const MeetingRepository = require('../repositories/MeetingRepository');

class MeetingService {
    /**
     * Create a new meeting with participants
     */
    async createMeeting(meetingData) {
        const { mentorId, meetingDate, title, meetingType, notes, meetingLink, studentIds } = meetingData;

        // 1. Create the meeting
        const meetingId = await MeetingRepository.createMeeting(
            mentorId,
            meetingDate,
            title,
            meetingType,
            notes || '',
            meetingLink || ''
        );

        if (!meetingId) {
            throw new Error('Failed to create meeting');
        }

        // 2. Add participants
        if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
            for (const studentId of studentIds) {
                await MeetingRepository.addParticipant(meetingId, studentId, 'Bekleniyor');
            }
        }

        // 3. Return the created meeting with participants
        return await this.getMeetingById(meetingId);
    }

    /**
     * Get all meetings for a mentor
     */
    async getMeetingsByMentorId(mentorId) {
        const meetings = await MeetingRepository.getMeetingsByMentorId(mentorId);
        return meetings.map(meeting => this.formatMeeting(meeting));
    }

    /**
     * Get all meetings for a student
     */
    async getMeetingsByStudentId(studentId) {
        const meetings = await MeetingRepository.getMeetingsByStudentId(studentId);
        return meetings;
    }

    /**
     * Get upcoming meetings for a mentor
     */
    async getUpcomingMeetingsByMentorId(mentorId) {
        const meetings = await MeetingRepository.getUpcomingMeetingsByMentorId(mentorId);
        return meetings.map(meeting => this.formatMeeting(meeting));
    }

    /**
     * Get a meeting by ID
     */
    async getMeetingById(meetingId) {
        const meeting = await MeetingRepository.getMeetingById(meetingId);
        if (!meeting) return null;
        return this.formatMeeting(meeting);
    }

    /**
     * Update a meeting
     */
    async updateMeeting(meetingId, meetingData) {
        const { meetingDate, title, meetingType, notes, meetingLink, studentIds } = meetingData;

        // 1. Update the meeting
        const updated = await MeetingRepository.updateMeeting(
            meetingId,
            meetingDate,
            title,
            meetingType,
            notes || '',
            meetingLink || ''
        );

        if (!updated) {
            throw new Error('Meeting not found or could not be updated');
        }

        // 2. Update participants if provided
        if (studentIds && Array.isArray(studentIds)) {
            // Clear existing participants
            await MeetingRepository.clearParticipants(meetingId);

            // Add new participants
            for (const studentId of studentIds) {
                await MeetingRepository.addParticipant(meetingId, studentId, 'Bekleniyor');
            }
        }

        // 3. Return updated meeting
        return await this.getMeetingById(meetingId);
    }

    /**
     * Delete a meeting
     */
    async deleteMeeting(meetingId) {
        const deletedId = await MeetingRepository.deleteMeeting(meetingId);
        if (!deletedId) {
            throw new Error('Meeting not found or could not be deleted');
        }
        return { success: true, deletedId };
    }

    /**
     * Update participant status
     */
    async updateParticipantStatus(meetingId, studentId, status) {
        const validStatuses = ['Bekleniyor', 'Katıldı', 'Katılmadı'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid participation status');
        }

        const result = await MeetingRepository.updateParticipantStatus(meetingId, studentId, status);
        if (!result) {
            throw new Error('Participant not found');
        }
        return result;
    }

    /**
     * Get participants for a meeting
     */
    async getParticipants(meetingId) {
        return await MeetingRepository.getParticipants(meetingId);
    }

    /**
     * Add a participant to a meeting
     */
    async addParticipant(meetingId, studentId) {
        const participantId = await MeetingRepository.addParticipant(meetingId, studentId, 'Bekleniyor');
        if (!participantId) {
            throw new Error('Could not add participant (may already exist)');
        }
        return { success: true, participantId };
    }

    /**
     * Remove a participant from a meeting
     */
    async removeParticipant(meetingId, studentId) {
        const removedId = await MeetingRepository.removeParticipant(meetingId, studentId);
        if (!removedId) {
            throw new Error('Participant not found');
        }
        return { success: true, removedId };
    }

    /**
     * Format meeting data for response
     */
    formatMeeting(meeting) {
        return {
            id: meeting.id,
            mentorId: meeting.mentor_id,
            meetingDate: meeting.meeting_date,
            title: meeting.title,
            meetingType: meeting.meeting_type,
            notes: meeting.notes,
            meetingLink: meeting.meeting_link,
            participants: meeting.participants || []
        };
    }
}

module.exports = new MeetingService();

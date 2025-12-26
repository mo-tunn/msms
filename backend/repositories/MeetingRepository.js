const pool = require('../config/db');

class MeetingRepository {
    /**
     * Create a new meeting
     */
    async createMeeting(mentorId, meetingDate, title, meetingType, notes, meetingLink) {
        const query = `
            INSERT INTO meetings (mentor_id, meeting_date, title, meeting_type, notes, meeting_link)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        const result = await pool.query(query, [mentorId, meetingDate, title, meetingType, notes, meetingLink]);
        return result.rows[0].id;
    }

    /**
     * Add a participant to a meeting
     */
    async addParticipant(meetingId, studentId, participationStatus = 'Bekleniyor') {
        const query = `
            INSERT INTO meeting_participants (meeting_id, student_id, participation_status)
            VALUES ($1, $2, $3)
            ON CONFLICT (meeting_id, student_id) DO NOTHING
            RETURNING id
        `;
        const result = await pool.query(query, [meetingId, studentId, participationStatus]);
        return result.rows[0]?.id;
    }

    /**
     * Get all meetings for a mentor
     */
    async getMeetingsByMentorId(mentorId) {
        const query = `
            SELECT 
                meeting_id AS id,
                mentor_id,
                meeting_date,
                title,
                meeting_type,
                notes,
                meeting_link,
                participants
            FROM vw_meeting_with_participants
            WHERE mentor_id = $1
            ORDER BY meeting_date DESC
        `;
        const result = await pool.query(query, [mentorId]);
        return result.rows;
    }

    /**
     * Get meetings for a student
     */
    async getMeetingsByStudentId(studentId) {
        const query = `
            SELECT 
                m.*,
                mp.participation_status,
                ment_u.first_name as mentor_first_name,
                ment_u.last_name as mentor_last_name
            FROM meetings m
            INNER JOIN meeting_participants mp ON m.id = mp.meeting_id
            LEFT JOIN users ment_u ON m.mentor_id = ment_u.id
            WHERE mp.student_id = $1
            ORDER BY m.meeting_date DESC
        `;
        const result = await pool.query(query, [studentId]);
        return result.rows;
    }

    /**
     * Get a meeting by ID with participants
     */
    async getMeetingById(meetingId) {
        const query = `
            SELECT 
                meeting_id AS id,
                mentor_id,
                meeting_date,
                title,
                meeting_type,
                notes,
                meeting_link,
                participants
            FROM vw_meeting_with_participants
            WHERE meeting_id = $1
        `;
        const result = await pool.query(query, [meetingId]);
        return result.rows[0];
    }

    /**
     * Update a meeting
     */
    async updateMeeting(meetingId, meetingDate, title, meetingType, notes, meetingLink) {
        const query = `
            UPDATE meetings
            SET meeting_date = $2, title = $3, meeting_type = $4, notes = $5, meeting_link = $6
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(query, [meetingId, meetingDate, title, meetingType, notes, meetingLink]);
        return result.rows[0];
    }

    /**
     * Delete a meeting
     */
    async deleteMeeting(meetingId) {
        const query = 'DELETE FROM meetings WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [meetingId]);
        return result.rows[0]?.id;
    }

    /**
     * Remove a participant from a meeting
     */
    async removeParticipant(meetingId, studentId) {
        const query = 'DELETE FROM meeting_participants WHERE meeting_id = $1 AND student_id = $2 RETURNING id';
        const result = await pool.query(query, [meetingId, studentId]);
        return result.rows[0]?.id;
    }

    /**
     * Update participant status
     */
    async updateParticipantStatus(meetingId, studentId, participationStatus) {
        const query = `
            UPDATE meeting_participants
            SET participation_status = $3
            WHERE meeting_id = $1 AND student_id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [meetingId, studentId, participationStatus]);
        return result.rows[0];
    }

    /**
     * Get participants for a meeting
     */
    async getParticipants(meetingId) {
        const query = `
            SELECT 
                mp.*,
                u.first_name,
                u.last_name,
                u.email
            FROM meeting_participants mp
            JOIN users u ON mp.student_id = u.id
            WHERE mp.meeting_id = $1
        `;
        const result = await pool.query(query, [meetingId]);
        return result.rows;
    }

    /**
     * Get upcoming meetings for mentor
     */
    async getUpcomingMeetingsByMentorId(mentorId) {
        const query = `
            SELECT 
                meeting_id AS id,
                mentor_id,
                meeting_date,
                title,
                meeting_type,
                notes,
                meeting_link,
                participants
            FROM vw_meeting_with_participants
            WHERE mentor_id = $1 AND meeting_date >= NOW()
            ORDER BY meeting_date ASC
        `;
        const result = await pool.query(query, [mentorId]);
        return result.rows;
    }

    /**
     * Clear all participants from a meeting
     */
    async clearParticipants(meetingId) {
        const query = 'DELETE FROM meeting_participants WHERE meeting_id = $1';
        await pool.query(query, [meetingId]);
    }
}

module.exports = new MeetingRepository();

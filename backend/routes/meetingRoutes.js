const express = require('express');
const router = express.Router();
const MeetingController = require('../controllers/MeetingController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Meeting CRUD routes
router.post('/', MeetingController.createMeeting);
router.get('/:id', MeetingController.getMeetingById);
router.put('/:id', MeetingController.updateMeeting);
router.delete('/:id', MeetingController.deleteMeeting);

// Mentor-specific routes
router.get('/mentor/:mentorId', MeetingController.getMeetingsByMentor);
router.get('/mentor/:mentorId/upcoming', MeetingController.getUpcomingMeetings);

// Student-specific routes
router.get('/student/:studentId', MeetingController.getMeetingsByStudent);

// Participant management routes
router.get('/:meetingId/participants', MeetingController.getParticipants);
router.post('/:meetingId/participants', MeetingController.addParticipant);
router.patch('/:meetingId/participants/:studentId', MeetingController.updateParticipantStatus);
router.delete('/:meetingId/participants/:studentId', MeetingController.removeParticipant);

module.exports = router;

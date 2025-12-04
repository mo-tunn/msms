const ExamRepository = require('../repositories/ExamRepository');

class ExamService {
    async saveExamResult(examData) {
        const { studentId, examName, examType, examDate, details } = examData;

        // 1. Create the main exam entry using the Stored Procedure
        const examId = await ExamRepository.createExam(studentId, examName, examType, examDate);

        if (!examId) {
            throw new Error('Failed to create exam record');
        }

        // 2. Iterate through lessons (details)
        if (details && Array.isArray(details)) {
            for (const lesson of details) {
                const { lessonName, correctCount, wrongCount, emptyCount, topics } = lesson;

                // Create exam detail (lesson)
                const examDetailId = await ExamRepository.createExamDetail(
                    examId,
                    lessonName,
                    correctCount || 0,
                    wrongCount || 0,
                    emptyCount || 0
                );

                // 3. Iterate through topics if any
                if (topics && Array.isArray(topics)) {
                    for (const topic of topics) {
                        const { topicName, correctCount: tCorrect, wrongCount: tWrong, emptyCount: tEmpty } = topic;

                        await ExamRepository.createExamTopicDetail(
                            examDetailId,
                            topicName,
                            tCorrect || 0,
                            tWrong || 0,
                            tEmpty || 0
                        );
                    }
                }
            }
        }

        return { success: true, examId };
    }

    async getStudentExams(studentId) {
        return await ExamRepository.getExamsByStudentId(studentId);
    }

    async getExamById(examId) {
        const exam = await ExamRepository.getExamById(examId);
        if (!exam) return null;

        const details = await ExamRepository.getExamDetails(examId);

        // Calculate total net for the exam
        let totalNet = 0;
        let totalCorrect = 0;
        let totalWrong = 0;

        const detailsWithTopics = await Promise.all(details.map(async (detail) => {
            const topics = await ExamRepository.getExamTopicDetails(detail.id);

            // Calculate net for this lesson
            const net = (detail.correct_count || 0) - ((detail.wrong_count || 0) / 4);
            totalNet += net;
            totalCorrect += (detail.correct_count || 0);
            totalWrong += (detail.wrong_count || 0);

            return {
                ...detail,
                net: net,
                topics
            };
        }));

        return {
            ...exam,
            totalNet,
            totalCorrect,
            totalWrong,
            details: detailsWithTopics
        };
    }
}

module.exports = new ExamService();

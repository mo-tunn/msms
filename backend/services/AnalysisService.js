const analysisRepository = require('../repositories/AnalysisRepository');

class AnalysisService {
    async getDailyActivities(studentId) {
        return await analysisRepository.getDailyActivities(studentId);
    }

    async getTaskAnalysis(studentId, timeFilter) {
        // Calculate start date based on filter
        const now = new Date();
        let startDate = new Date();

        switch (timeFilter) {
            case '1 Hafta':
                startDate.setDate(now.getDate() - 7);
                break;
            case '1 Ay':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case '3 Ay':
                startDate.setMonth(now.getMonth() - 3);
                break;
            case '6 Ay':
                startDate.setMonth(now.getMonth() - 6);
                break;
            case '1 Yıl':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setDate(now.getDate() - 7); // Default 1 week
        }

        const stats = await analysisRepository.getTaskCompletionStats(studentId, startDate);

        // Fetch time series data for the chart
        const interval = (timeFilter === '1 Hafta' || timeFilter === '1 Ay') ? 'day' : 'month';
        const rawChartData = await analysisRepository.getTaskTimeSeries(studentId, startDate, interval);

        // Process stats
        let completed = 0;
        let missed = 0;
        let pending = 0;

        stats.forEach(stat => {
            if (stat.status === 'Completed') completed += parseInt(stat.count);
            else if (stat.status === 'Overdue' || stat.status === 'Cancelled') missed += parseInt(stat.count);
            else pending += parseInt(stat.count);
        });

        const total = completed + missed + pending;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Fill gaps in chart data
        const chart = [];
        const labels = [];

        // Helper to format date
        const formatDate = (date, intv) => {
            const d = new Date(date);
            if (intv === 'day') {
                return d.toLocaleDateString('tr-TR', { weekday: 'short' }); // Pzt, Sal
            } else {
                return d.toLocaleDateString('tr-TR', { month: 'short' }); // Oca, Şub
            }
        };

        if (interval === 'day') {
            // Fill last X days
            const days = timeFilter === '1 Hafta' ? 7 : 30;
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD

                // Find matching data point (assuming db returns local time or UTC aligned enough for simple match)
                // DB date_bucket is timestamp. 
                const match = rawChartData.find(item => {
                    const itemDate = new Date(item.date_bucket).toISOString().split('T')[0];
                    return itemDate === dateStr;
                });

                chart.push(match ? parseInt(match.completed_count) : 0);
                labels.push(formatDate(d, 'day'));
            }
        } else {
            // Fill months
            const months = timeFilter === '3 Ay' ? 3 : (timeFilter === '6 Ay' ? 6 : 12);
            for (let i = months - 1; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const monthStr = `${d.getFullYear()}-${d.getMonth()}`;

                const match = rawChartData.find(item => {
                    const itemDate = new Date(item.date_bucket);
                    return `${itemDate.getFullYear()}-${itemDate.getMonth()}` === monthStr;
                });

                chart.push(match ? parseInt(match.completed_count) : 0);
                labels.push(formatDate(d, 'month'));
            }
        }

        return {
            total,
            completed,
            missed,
            rate,
            chart, // Array of values
            labels // Array of labels
        };
    }

    async getMentorStudentsAnalytics(mentorId) {
        // Step 1: Get list of students
        const students = await analysisRepository.getMentorStudentsBasic(mentorId);

        // Step 2: Fetch details for each student
        const enrichedStudents = await Promise.all(students.map(async (student) => {
            const stats = await analysisRepository.getStudentStats(student.id);
            const exams = await analysisRepository.getStudentExamHistory(student.id);

            // Metrics
            const completed = parseInt(stats.completed) || 0;
            const incomplete = parseInt(stats.incomplete) || 0;
            const streak = parseInt(stats.last_30_days_activity) || 0;

            // 1. Task Score (Max 40)
            const totalTasks = completed + incomplete;
            const taskRate = totalTasks > 0 ? (completed / totalTasks) : 0;
            const taskScore = Math.round(taskRate * 40);

            // 2. Streak/Activity Score (Max 30)
            // If they have activity in 20 of last 30 days, they get full points
            const streakScore = Math.min(streak, 20) * 1.5;

            // 3. Exam Trend Score (Max 30)
            let examScore = 0;
            let examTrend = 'stable';

            if (exams.length === 0) {
                examScore = 0; // No data
            } else if (exams.length === 1) {
                examScore = 15; // Base score for having 1 exam
            } else {
                const lastNet = parseFloat(exams[0].net || 0);
                const prevNet = parseFloat(exams[1].net || 0);

                if (lastNet > prevNet) {
                    examScore = 30;
                    examTrend = 'increasing';
                } else if (lastNet < prevNet) {
                    examScore = 10;
                    examTrend = 'decreasing';
                } else {
                    examScore = 20;
                    examTrend = 'stable';
                }
            }

            // Total Score
            let totalScore = Math.round(taskScore + streakScore + examScore);
            if (totalScore > 100) totalScore = 100;

            // Risk Label Logic
            let riskStatus = 'Çok Riskli';
            if (totalScore >= 80) riskStatus = 'Çok Yükselişte';
            else if (totalScore >= 60) riskStatus = 'Yükselişte';
            else if (totalScore >= 40) riskStatus = 'Dengeli';
            else if (totalScore >= 20) riskStatus = 'Riskli';

            return {
                ...student,
                tasksCompleted: completed,
                tasksIncomplete: incomplete,
                streak: streak,
                lastExamScore: exams.length > 0 ? parseFloat(exams[0].net).toFixed(1) : 0,
                examTrend: examTrend,
                studentScore: totalScore,
                riskStatus: riskStatus // Override DB risk_status with computed one
            };
        }));

        return enrichedStudents;
    }
    async getStudentDashboard(studentId) {
        // Parallel fetch for dashboard components
        const [stats, tasks, meetings] = await Promise.all([
            analysisRepository.getDashboardStats(studentId),
            analysisRepository.getUpcomingTasks(studentId),
            analysisRepository.getWeeklyMeetings(studentId)
        ]);

        return {
            stats: stats || {
                success_score: 0,
                risk_status: 'Bilinmiyor',
                task_success_rate: 0,
                attended_meetings: 0,
                unread_notifications: 0
            },
            upcomingTasks: tasks,
            weeklyMeetings: meetings
        };
    }
}

module.exports = new AnalysisService();

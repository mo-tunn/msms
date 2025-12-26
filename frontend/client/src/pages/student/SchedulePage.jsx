import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../../services/api';

const SchedulePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Helper to get Monday of the current week
    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        return new Date(d.setDate(diff));
    };

    // Helper to get all 7 days of the week
    const getWeekDays = (startDate) => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            days.push(d);
        }
        return days;
    };

    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = getWeekDays(startOfWeek);

    const formatDate = (date) => {
        return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    };

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const handleDateChange = (e) => {
        setCurrentDate(new Date(e.target.value));
    };

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const data = await getTasks();
            // Backend returns tasks with start_time, end_time, etc.
            // We need to map them to frontend format if necessary.
            // Frontend uses: id, title, date (YYYY-MM-DD), startTime (HH:MM), endTime (HH:MM), priority, description, creator, isCompleted

            const formattedTasks = data.map(task => {
                const start = new Date(task.start_time);
                const end = new Date(task.end_time);
                return {
                    id: task.id,
                    title: task.title,
                    date: start.toISOString().split('T')[0],
                    startTime: start.toTimeString().slice(0, 5),
                    endTime: end.toTimeString().slice(0, 5),
                    priority: task.priority,
                    description: task.description,
                    creator: 'Öğrenci', // Or derive from mentor_id/student_id
                    isCompleted: task.status === 'Completed'
                };
            });
            setTasks(formattedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = () => {
        setEditingTask(null);
        setIsTaskModalOpen(true);
    };

    const handleEditTask = (task) => {
        if (task.status === 'Overdue' || (new Date(task.date + 'T' + task.endTime) < new Date() && task.status !== 'Completed')) {
            // Check if it's already overdue or effectively overdue
            // Actually backend handles status update on fetch, so checking status 'Overdue' should be enough if we refreshed.
            // But let's be safe.
        }

        if (task.status === 'Overdue') {
            alert('Süresi geçmiş görevler düzenlenemez.');
            return;
        }
        setEditingTask(task);
        setIsTaskModalOpen(true);
    };

    const handleSaveTask = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const dateStr = formData.get('date');
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today && !editingTask) {
            alert('Geçmiş bir tarihe görev ekleyemezsiniz.');
            return;
        }

        const taskData = {
            title: formData.get('title'),
            date: dateStr,
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            priority: formData.get('priority'),
            description: formData.get('description'),
            status: editingTask ? (editingTask.isCompleted ? 'Completed' : 'Pending') : 'Pending'
        };

        try {
            if (editingTask) {
                await updateTask(editingTask.id, taskData);
            } else {
                await createTask(taskData);
            }
            await fetchTasks();
            setIsTaskModalOpen(false);
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Görev kaydedilirken bir hata oluştu: ' + error.message);
        }
    };

    const handleDeleteTask = async () => {
        if (editingTask) {
            if (editingTask.status === 'Overdue') {
                alert('Süresi geçmiş görevler silinemez.');
                return;
            }
            if (confirm('Bu görevi silmek istediğinize emin misiniz?')) {
                try {
                    await deleteTask(editingTask.id);
                    await fetchTasks();
                    setIsTaskModalOpen(false);
                } catch (error) {
                    console.error('Error deleting task:', error);
                    alert('Görev silinirken bir hata oluştu.');
                }
            }
        }
    };

    const toggleTaskCompletion = async (taskId, currentStatus) => {
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status === 'Overdue') {
            alert('Süresi geçmiş görevler tamamlandı olarak işaretlenemez.');
            return;
        }

        // Optimistic update
        const newStatus = !currentStatus;
        setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted: newStatus } : t));

        try {
            await updateTask(taskId, { status: newStatus ? 'Completed' : 'Pending' });
        } catch (error) {
            console.error('Error updating task status:', error);
            // Revert on error
            setTasks(tasks.map(t => t.id === taskId ? { ...t, isCompleted: currentStatus } : t));
            alert('Görev güncellenirken bir hata oluştu: ' + error.message);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
            case 'medium': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
            case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
            default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300';
        }
    };

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Ders Programı</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {formatDate(weekDays[0])} - {formatDate(weekDays[6])} {weekDays[0].getFullYear()}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                        <button onClick={handlePrevWeek} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>
                        <button onClick={handleToday} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors" title="Bugün">
                            <span className="material-symbols-outlined text-xl">today</span>
                        </button>
                        <button onClick={handleNextWeek} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                        </button>
                    </div>

                    <input
                        type="date"
                        value={currentDate.toISOString().split('T')[0]}
                        onChange={handleDateChange}
                        className="h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />

                    <button onClick={handleAddTask} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-xl">add_task</span>
                        <span className="text-sm font-semibold">Görev Ekle</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-w-full overflow-x-auto p-1 pb-4">
                {weekDays.map((day, index) => {
                    const isToday = day.toDateString() === new Date().toDateString();
                    const dayTasks = tasks.filter(t => t.date === day.toISOString().split('T')[0]);
                    // Sort tasks by start time
                    dayTasks.sort((a, b) => a.startTime.localeCompare(b.startTime));

                    return (
                        <div
                            key={index}
                            className={`flex flex-col min-w-[200px] md:min-w-0 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700/50 h-full min-h-[500px] ${isToday ? 'ring-2 ring-primary/20 bg-primary/[0.02]' : ''}`}
                        >
                            {/* Day Header */}
                            <div className={`p-3 text-center border-b border-gray-200 dark:border-gray-700/50 ${isToday ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                                <p className={`font-semibold ${isToday ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {day.toLocaleDateString('tr-TR', { weekday: 'long' })}
                                </p>
                                <p className={`text-sm ${isToday ? 'text-primary/80 font-medium' : 'text-gray-500'}`}>
                                    {day.getDate()} {day.toLocaleDateString('tr-TR', { month: 'short' })}
                                </p>
                            </div>

                            {/* Tasks Container */}
                            <div className="flex-1 p-2 space-y-3">
                                {dayTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        onClick={() => handleEditTask(task)}
                                        className={`relative border-l-[3px] rounded-r-lg p-3 flex flex-col gap-2 group cursor-pointer hover:shadow-md transition-all hover:translate-x-0.5 bg-white dark:bg-gray-800 ${getPriorityColor(task.priority)} ${task.status === 'Overdue' ? 'opacity-60 grayscale' : ''}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <p className={`font-bold text-sm line-clamp-2 ${task.isCompleted ? 'line-through opacity-70' : ''}`}>{task.title}</p>
                                            <input
                                                type="checkbox"
                                                checked={task.isCompleted}
                                                onClick={(e) => { e.stopPropagation(); toggleTaskCompletion(task.id, task.isCompleted); }}
                                                className="rounded text-primary focus:ring-primary/20 mt-1"
                                                disabled={task.status === 'Overdue'}
                                            />
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs opacity-80 font-medium">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            {task.startTime} - {task.endTime}
                                        </div>

                                        {task.description && (
                                            <div className="text-xs opacity-90 bg-black/5 dark:bg-white/10 rounded px-2 py-1 line-clamp-3">
                                                {task.description}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-1 pt-2 border-t border-black/5 dark:border-white/5">
                                            <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{task.creator}</span>
                                            {task.priority === 'high' && <span className="material-symbols-outlined text-[16px] text-red-500">priority_high</span>}
                                            {task.status === 'Overdue' && <span className="text-[10px] font-bold text-red-600 uppercase">Süresi Geçti</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Task Modal */}
            {isTaskModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{editingTask ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}</h3>
                            <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSaveTask} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Başlık</label>
                                <input required name="title" defaultValue={editingTask?.title} type="text" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tarih</label>
                                    <input required name="date" min={!editingTask ? new Date().toISOString().split('T')[0] : undefined} defaultValue={editingTask?.date || new Date().toISOString().split('T')[0]} type="date" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Öncelik</label>
                                    <select name="priority" defaultValue={editingTask?.priority || 'medium'} className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary">
                                        <option value="high">Yüksek</option>
                                        <option value="medium">Orta</option>
                                        <option value="low">Düşük</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Başlangıç</label>
                                    <input required name="startTime" defaultValue={editingTask?.startTime || '09:00'} type="time" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bitiş</label>
                                    <input required name="endTime" defaultValue={editingTask?.endTime || '10:00'} type="time" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama</label>
                                <textarea name="description" defaultValue={editingTask?.description} rows="3" className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary"></textarea>
                            </div>
                            {/* Creator field removed */}
                            <div className="pt-4 flex justify-between items-center">
                                {editingTask ? (
                                    <button type="button" onClick={handleDeleteTask} className="px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium flex items-center gap-2">
                                        <span className="material-symbols-outlined">delete</span>
                                        Sil
                                    </button>
                                ) : (
                                    <div></div> // Spacer
                                )}
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium">İptal</button>
                                    <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 font-medium">Kaydet</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default SchedulePage;

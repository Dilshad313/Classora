import express from 'express';
import {
  getClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  deleteClassroom,
  bulkDeleteClassrooms,
  toggleClassroomAvailability,
  getClassroomStats,
} from '../controllers/classroomController.js';
import {
  getTimePeriods,
  createTimePeriod,
  updateTimePeriod,
  deleteTimePeriod,
  getTimePeriodStats,
} from '../controllers/timePeriodController.js';
import {
  getWeekDays,
  createWeekDay,
  updateWeekDay,
  deleteWeekDay,
  toggleWeekDayActive,
  getWeekDayStats,
} from '../controllers/weekDayController.js';
import {
  createOrUpdateTimetable,
  getTimetableByClass,
  getTimetableByTeacher,
  getAllTimetables,
  deleteTimetable,
  toggleTimetableActive,
  getTimetableStats,
  getAvailableResources,
} from '../controllers/timetableController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Classroom Routes
router.get('/classrooms', getClassrooms);
router.get('/classrooms/stats/summary', getClassroomStats);
router.get('/classrooms/:id', getClassroomById);
router.post('/classrooms', createClassroom);
router.put('/classrooms/:id', updateClassroom);
router.delete('/classrooms/:id', deleteClassroom);
router.post('/classrooms/bulk-delete', bulkDeleteClassrooms);
router.patch('/classrooms/:id/toggle-availability', toggleClassroomAvailability);

// TimePeriod Routes
router.get('/time-periods', getTimePeriods);
router.get('/time-periods/stats/summary', getTimePeriodStats);
router.post('/time-periods', createTimePeriod);
router.put('/time-periods/:id', updateTimePeriod);
router.delete('/time-periods/:id', deleteTimePeriod);

// WeekDay Routes
router.get('/week-days', getWeekDays);
router.get('/week-days/stats/summary', getWeekDayStats);
router.post('/week-days', createWeekDay);
router.put('/week-days/:id', updateWeekDay);
router.delete('/week-days/:id', deleteWeekDay);
router.patch('/week-days/:id/toggle-active', toggleWeekDayActive);

// Timetable Routes
router.get('/', getAllTimetables);
router.get('/stats/summary', getTimetableStats);
router.get('/resources/available', getAvailableResources);
router.get('/class/:classId', getTimetableByClass);
router.get('/teacher/:teacherId', getTimetableByTeacher);
router.post('/', createOrUpdateTimetable);
router.delete('/:id', deleteTimetable);
router.patch('/:id/toggle-active', toggleTimetableActive);

export default router;
import express from 'express';


import { getLessons, createLesson, getLesson, filterLesson, deleteLesson, updateLesson } from '../controllers/lessons.js';


const router = express.Router();

router.get('/', getLessons);

router.post('/', createLesson);

router.get('/:_id', getLesson);

router.get('/search/:key', filterLesson);

router.delete('/:_id', deleteLesson);

router.put('/:_id', updateLesson);

export default router;
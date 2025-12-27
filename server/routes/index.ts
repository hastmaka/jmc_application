import express from 'express';
const router = express.Router();

router.get('/checkHealth', (req, res) => {
    res.status(200).send('Healthy!');
})

export default router;
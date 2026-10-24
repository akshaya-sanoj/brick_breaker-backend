// server/routes/gameRoutes.js
const express = require('express');
const router = express.Router();
const { startGame, completeGame, buySkin } = require('../controllers/gameController');
const auth = require('../middleware/authMiddleware');

router.post('/start', auth, startGame);
router.post('/complete', auth, completeGame);
router.post('/buy-skin', auth, buySkin);

module.exports = router;
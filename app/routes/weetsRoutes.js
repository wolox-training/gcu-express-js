// eslint-disable-next-line new-cap
const router = require('express').Router();
const weeksService = require('../services/weetsService');
const asyncWrapper = require('../utils/asyncWrapper');

router.get(
  '/',
  [],
  asyncWrapper(async (req, res) => {
    const phrase = await weeksService.getOneRandomPhrase();
    return res.status(200).json(phrase);
  })
);

module.exports = router;

const router = require('express').Router();
const asyncWrapper = require('../utils/asyncWrapper');
const { getOneRandomPhrase } = require('../services/weetsService');

router.get(
  '/',
  [],
  asyncWrapper(async (req, res) => {
    const phrase = await getOneRandomPhrase();
    return res.status(200).json(phrase);
  })
);

module.exports = router;

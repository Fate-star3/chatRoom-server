const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

router.post('/test', (req, res) => {
  console.log(req.body);
  res.status(200).json(req.body)
})

module.exports = router
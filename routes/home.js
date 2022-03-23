const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('index',{title:'property router',message: 'heelo'})
  })

  module.exports = router;
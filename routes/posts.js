const router = require('express').Router();
const verify = require('./verifyToken')

router.get('/', verify, (req, res) => {
  res.json({
    posts: {
      title: 'post1',
      description: 'cant access if not logged in'
    }
  })
})

module.exports = router;
// router object for all /api calls/handlers/middleware/endpoints

const express = require('express')

const db = require('./db.js')

const router = express.Router()

router.post('/', (req, res) => {
  db.insert(req.body)
    .then((post) => {
      res.status(200).json(post)
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error adding the post' })
    })
})

router.post('/:id/comments', (req, res) => {
  // something
})

router.get('/', (req, res) => {
  db.find(req.query)
    .then((posts) => {
      res.status(200).json(posts)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: 'Error retrieving the posts' })
    })
})

router.get('/:id', (req, res) => {
  // something
})

router.get('/:id/comments', (req, res) => {
  db.findPostComments(req.params.id)
    .then((comments) => {
      if (comments.length > 0) {
        res.status(200).json(comments)
      } else {
        res.status(404).json({ message: 'No comments found' })
      }
    })
    .catch((error) => {
      res.status(500).json(error)
    })
})

router.put('/:id', (req, res) => {
  // something
})

router.delete('/:id', (req, res) => {
  // something
})

module.exports = router

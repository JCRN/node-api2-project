// router object for all /api calls/handlers/middleware/endpoints

const express = require('express')
const { findById } = require('./db.js')
const db = require('./db.js')

const router = express.Router()

// Creates a post
router.post('/', (req, res) => {
  const newPost = req.body
  const { contents, title } = req.body
  if (!title || !contents) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide title and contents for the post.' })
  } else {
    db.insert(newPost)
      .then((post) => {
        res.status(201).json(post)
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({
          message: 'There was an error while saving the post to the database',
        })
      })
  }
})

// Creates a comment for the post with the specified id
router.post('/:id/comments', (req, res) => {
  const newComment = req.body
  const { text } = req.body
  const { id } = req.params

  if (!findById(id)) {
    res
      .status(404)
      .json({ message: 'The post with the specified ID does not exist.' })
  } else if (!text) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide text for the comment.' })
  } else {
    try {
      db.insertComment(newComment).then((comment) => {
        res.status(201).json(comment)
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: 'There was an error while saving the comment to the database.',
      })
    }
  }
})

// Returns an array of all the post objects contained in the database
router.get('/', (req, res) => {
  db.find()
    .then((posts) => {
      res.status(200).json(posts)
    })
    .catch((error) => {
      console.log(error)
      res
        .status(500)
        .json({ error: 'The posts information could not be retrieved.' })
    })
})

// Returns the post object with the specified id
router.get('/:id', (req, res) => {
  const { id } = req.params

  db.findById(id)
    .then((post) => {
      if (post.length > 0) {
        res.status(200).json(post)
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      }
    })
    .catch((error) => {
      console.log(error)
      res
        .status(500)
        .json({ error: 'The post information could not be retrieved.' })
    })
})

// Returns an array of all the comment objects associated with the post with the specified id
router.get('/:id/comments', (req, res) => {
  const { id } = req.params

  db.findPostComments(id)
    .then((comments) => {
      if (comments.length > 0) {
        res.status(200).json(comments)
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      }
    })
    .catch((error) => {
      console.log(error)
      res
        .status(500)
        .json({ error: 'The comments information could not be retrieved.' })
    })
})

// Updates the post with the specified id, returns the modified object
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { contents, title } = req.body
  const post = db.findById(id)
  const changes = req.body

  if (!post) {
    res
      .status(404)
      .json({ message: 'The post with the specified ID does not exist.' })
  } else if (!contents || !title) {
    res
      .status(400)
      .json({ errorMessage: 'Please provide title and contents for the post.' })
  } else {
    db.update(id, changes)
      .then((post) => {
        res.status(200).json(changes)
      })
      .catch((error) => {
        console.log(error)
        res
          .status(500)
          .json({ error: 'The post information could not be modified.' })
      })
  }
})

// Removes the post with the specified id and returns the deleted post object
router.delete('/:id', (req, res) => {
  const { id } = req.params

  db.remvove(id)
    .then((post) => {
      if (post.length > 0) {
        res.status(200).json(post)
      } else {
        res
          .status(404)
          .json({ message: 'The post with the specified ID does not exist.' })
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ error: 'The post could not be removed.' })
    })
})

module.exports = router

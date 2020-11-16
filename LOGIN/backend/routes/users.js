const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const jwt = require('jsonwebtoken')
const secretKey = require('../config/auth.config')
const auth = require('../middleware/auth')

const User = require('../models').User

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !name || !password) {
    res.status(404).send({ message: "Please try again" })
  }
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  })
  if(user) {
    res.status(404).send({ message: "This email already exist"})
  }
  const passwordHash = bcrypt.hashSync(password, 10)
  try {
    const user = await User.create({
      name: name,
      email: email,
      password: passwordHash
    })
    res.status(201).send(user)
  } 
  catch(error) {
    console.log(error)
    res.status(400).send(error)
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(404).send({ message: "Please try again" })
  }
  try {
    const user = await User.findOne({
      where: {
        email: email
      }
    })
    if(user) {
      const isCorrect = bcrypt.compareSync(password, user.password)
      if(isCorrect) {
        const token = jwt.sign({ email }, secretKey.secret )
        res.status(200).send({ token })
      }
      else {
        res.status(404).send({ message: "Password invalid"})
      }
    }
    else {
      res.status(404).send({ message: "This email invalid"})
    }
  } 
  catch(error) {
    console.log(error)
    res.status(400).send(error)
  }
})

router.get('/profile', auth.authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ 
      wehere: { 
        email: req.body.email 
      }
    })
    if(user) {
      res.status(200).send({ name: user.name })
    }
    else {
      res.status(404).send({ message: "Can't find this email"})
    }
  }
  catch(error) {
    console.log(error)
    res.status(400).send(error)
  }
})

router.patch('/update', auth.authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ 
      where: { 
        email: req.user.email 
      }
    })
    if(user) {
      const updatedUser = await User.update({
        name: req.body.name
        }, { 
          where: { 
            email: req.user.email
          }
        })
        res.status(200).send({ message: "Your profile name has change" })
    }
    else {
      res.status(404).send({ message: "Can't find this user"})
    }
  }
  catch(error) {
    console.log(error)
    res.status(400).send(error)
  }
})

module.exports = router;

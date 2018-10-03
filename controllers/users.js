const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({})
        response.json(users.map(User.format))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'Something went wrong' })
    }
})

usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const currentUsers = await User.find({})
        const overlappingUsernames = currentUsers.filter(u => u.username === body.username)

        if (overlappingUsernames.length > 0) {
            return response.status(400).json({ error: 'username already in use' })
        }

        if (body.password.length < 3) {
            return response.status(400).json({ error: 'password must be at least 3 characters long' })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
            adult: body.adult ? body.adult : true
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = usersRouter
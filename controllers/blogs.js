const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog
            .find({})
            .populate('user', { username: 1, name: 1 })
        response.json(blogs.map(Blog.format))
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong' })
    }
})

blogsRouter.post('/', async (request, response) => {
    try {
        const users = await User.find({})
        const firstUser = users[0]
        const blog = new Blog({ ...request.body, user: firstUser._id })
        
        if (!blog.title) {
            return response.status(400).json({ error: 'title missing' })
        }

        if (!blog.url) {
            return response.status(400).json({ error: 'url missing' })
        }

        if (!blog.likes) {
            blog.likes = 0
        }
        
        await blog.save()
        firstUser.blogs = firstUser.blogs.concat(blog._id)
        await firstUser.save()
        response.status(201).json(blog)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    try {
        const body = request.body

        const blog = {
            author: body.author,
            title: body.title,
            likes: body.likes,
            url: body.url
        }

        const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(updatedNote)
    } catch (exception) {
        console.log(exception)
        response.status(400).json({ error: 'malformed id' })
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)

        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).json({ error: 'malformatted id' })
    }
})

module.exports = blogsRouter
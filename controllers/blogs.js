const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong' })
    }
})

blogsRouter.post('/', async (request, response) => {
    try {
        const blog = new Blog(request.body)
        
        if (!blog.title) {
            return response.status(400).json({ error: 'title missing' })
        }

        if (!blog.url) {
            return response.status(400).json({ error: 'url missing' })
        }

        if (!blog.likes) {
            blog.likes = 0
        }
        
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
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
    console.log('got this far')
    try {
        await Blog.findByIdAndRemove(request.params.id)

        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).json({ error: 'malformatted id' })
    }
})

module.exports = blogsRouter
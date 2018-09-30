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

module.exports = blogsRouter
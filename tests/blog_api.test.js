const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 4
    },
    {
        title: 'EKI EKI Considered Harmful',
        author: 'Eki E. Ekijkstra',
        url: 'http://http://http://ekieki.com.fi.ru',
        likes: 5
    },
    {
        title: 'Mani boi mo!',
        author: 'Edsger W. Dijkstra',
        url: 'httpx://httpy://httpz://jekimeki.com.fi.ruuuuuuuuuuuu',
        likes: 4
    }
]

beforeAll(async () => {
    await Blog.remove({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('a new blog is correctly added', async () => {
    const newTitle = "Ghetto Testing"
    const newBlog = {
        author: "Ernie Ball",
        title: newTitle,
        url: 'http://someurl.org',
        likes: 2000
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api
        .get('/api/blogs')

    const titles = response.body.map(blog => blog.title)

    expect(response.body.length).toBe(initialBlogs.length + 1)
    expect(titles).toContain(newTitle)
})

test('a new blog without likes will have zero likes by default', async () => {
    const newTitle = 'Unlikeable'
    const newBlog = {
        author: 'Bernie All',
        url: 'http://someurl.org',
        title: newTitle
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const savedBlog = response.body
    expect(savedBlog.likes).toBe(0)
})

test('a new blog must have a title', async () => {
    const newBlog = {
        author: 'Bernie All',
        url: 'http://majorurl.com',
        likes: 5
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
    expect(response.body.error).toBe('title missing')
})

test('a new blog must have a url', async () => {
    const newBlog = {
        author: 'Bernie All',
        title: 'Moreover, yes!',
        likes: 9
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    
    expect(response.body.error).toBe('url missing')
})

afterAll(() => {
    server.close()
})
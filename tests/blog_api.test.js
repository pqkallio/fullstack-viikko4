const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb, nonExistingId, usersInDb, dummyUser, getTokenForUser } = require('./test_helper')

describe('With initially saved blogs in the database', async () => {
    beforeAll(async () => {
        await Blog.remove({})

        const blogObjects = initialBlogs.map(blog => new Blog(blog))
        const promiseArray = blogObjects.map(blog => blog.save())
        await Promise.all(promiseArray)
    })
    
    test('blogs are returned as json', async () => {
        const blogsInDatabase = await blogsInDb()
    
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(response.body.length).toBe(blogsInDatabase.length)
    })
    
    describe('Addition of a new blog', async () => {
        let dummy
        let token
        
        beforeAll(async () => {
            await User.remove({})

            dummy = dummyUser
            await dummy.save()

            token = await getTokenForUser(dummy)
        })

        test('without a token a new blog is not added', async () => {
            const blogsPreOp = await blogsInDb()
            
            const newTitle = "Ghetto Testing"
            const newBlog = {
                author: "Ernie Ball",
                title: newTitle,
                url: 'http://someurl.org',
                likes: 2000
            }
        
            const response = await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)
        
            const blogsPostOp = await blogsInDb()
            const savedBlog = await Blog.findOne({ title: newTitle })
            
            expect(blogsPostOp.length).toBe(blogsPreOp.length)
            expect(savedBlog).toBeNull()
            expect(response.body.error).toBe('Token missing')
        })

        test('with a token with an invalid schema a new blog is not added', async () => {
            const blogsPreOp = await blogsInDb()
            
            const newTitle = "Ghetto Testing"
            const newBlog = {
                author: "Ernie Ball",
                title: newTitle,
                url: 'http://someurl.org',
                likes: 2000
            }
        
            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Beaver ${token}`)
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)
        
            const blogsPostOp = await blogsInDb()
            const savedBlog = await Blog.findOne({ title: newTitle })
            
            expect(blogsPostOp.length).toBe(blogsPreOp.length)
            expect(savedBlog).toBeNull()
            expect(response.body.error).toBe('Token missing')
        })

        test('with an invalid token a new blog is not added', async () => {
            const blogsPreOp = await blogsInDb()
            
            const newTitle = "Ghetto Testing"
            const newBlog = {
                author: "Ernie Ball",
                title: newTitle,
                url: 'http://someurl.org',
                likes: 2000
            }
        
            const invalidToken = token.substring(0, token.length - 1) + (token.charAt(token.length - 1) === '0' ? '1' : '0')
            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${invalidToken}`)
                .send(newBlog)
                .expect(401)
                .expect('Content-Type', /application\/json/)
        
            const blogsPostOp = await blogsInDb()
            const savedBlog = await Blog.findOne({ title: newTitle })
            
            expect(blogsPostOp.length).toBe(blogsPreOp.length)
            expect(savedBlog).toBeNull()
            expect(response.body.error).toBe('invalid signature')
        })

        test('with a token a new blog is correctly added', async () => {
            const blogsPreOp = await blogsInDb()
            
            const newTitle = "Ghetto Testing"
            const newBlog = {
                author: "Ernie Ball",
                title: newTitle,
                url: 'http://someurl.org',
                likes: 2000
            }
        
            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
        
            const blogsPostOp = await blogsInDb()
            const savedBlog = await Blog.findOne({ title: newTitle })
            const titles = blogsPostOp.map(blog => blog.title)
        
            expect(blogsPostOp.length).toBe(blogsPreOp.length + 1)
            expect(titles).toContain(newTitle)
            expect(savedBlog.user).toEqual(dummy._id)
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
                .set('Authorization', `Bearer ${token}`)
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
                .set('Authorization', `Bearer ${token}`)
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
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)
                .expect('Content-Type', /application\/json/)
            
            expect(response.body.error).toBe('url missing')
        })
    })

    describe('deletion of a blog', async () => {
        let addedBlog

        beforeAll(async () => {
            addedBlog = new Blog({
                author: 'The Author',
                title: 'A Title',
                url: 'http://www.agenericurl.com',
                likes: 0
            })

            await addedBlog.save()
        })

        test('DELETE /api/blogs/:id succeeds with proper status code', async () => {
            const blogsPreOp = await blogsInDb()

            await api
                .delete(`/api/blogs/${addedBlog._id}`)
                .expect(204)
            
            const blogsPostOp = await blogsInDb()
            
            const titles = blogsPostOp.map(blog => blog.title)

            expect(titles).not.toContain(addedBlog.title)
            expect(blogsPostOp.length).toBe(blogsPreOp.length - 1)
        })

        test('DELETE of a non-existent blog returns proper status code', async () => {
            const blogsPreOp = await blogsInDb()
            const nonExistentId = await nonExistingId()

            await api
                .delete(`/api/blogs/${nonExistentId}`)
                .expect(204)
            
            const blogsPostOp = await blogsInDb()

            expect(blogsPostOp.length).toBe(blogsPreOp.length)
        })
    })

    describe('update blog', async () => {
        let blogToUpdate

        beforeAll(async () => {
            const blogs = await blogsInDb()
            blogToUpdate = blogs[0]
        })

        test('PUT /api/blogs/:id succeeds with proper status code', async () => {
            const copyOfOriginal = {
                author: blogToUpdate.author,
                title: blogToUpdate.title,
                likes: blogToUpdate.likes,
                url: blogToUpdate.url
            }

            const updateStr = ' UPDATE!'

            blogToUpdate.author = blogToUpdate.author + updateStr
            blogToUpdate.title = blogToUpdate.title + updateStr
            blogToUpdate.likes += 1
            blogToUpdate.url = blogToUpdate.url + updateStr

            await api
                .put(`/api/blogs/${blogToUpdate._id}`)
                .send(blogToUpdate)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            
            const blogsPostOp = await blogsInDb()
            const updatedBlog = blogsPostOp[0]
            
            expect(updatedBlog.author).toEqual(copyOfOriginal.author + updateStr)
            expect(updatedBlog.title).toEqual(copyOfOriginal.title + updateStr)
            expect(updatedBlog.likes).toBe(copyOfOriginal.likes + 1)
        })
    })
    
    afterAll(async () => {
        await server.close()
    })
})
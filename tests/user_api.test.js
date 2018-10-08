const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { initialBlogs, blogsInDb, usersInDb, nonExistingId } = require('./test_helper')

describe('With at least one user in the database', async () => {
    beforeAll(async () => {
        await User.remove({})
        
        const user = new User({
            name: 'Test User',
            username: 'testuser',
            password: 'TesTPassWorD',
            adult: false
        })

        await user.save()
    })

    test('GET /api/users returns a formatted list of all users in database', async () => {
        const usersInDatabase = await usersInDb()

        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(response.body.length).toBe(usersInDatabase.length)
        expect(response.body[0].passwordHash).not.toBeDefined()
        expect(response.body[0].blogs).toBeDefined()
    })

    test('saving a user with a unique username succeeds', async () => {
        const usersPreOp = await usersInDb()

        const nuevoUtilizador = {
            name: 'Test User',
            username: 'testuser2',
            password: 'TesTPassWorD',
            adult: false
        }

        await api
            .post('/api/users')
            .send(nuevoUtilizador)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersPostOp = await usersInDb()
        const usernames = usersPostOp.map(user => user.username)

        expect(usersPostOp.length).toBe(usersPreOp.length + 1)
        expect(usernames).toContain('testuser2')
    })

    test('saving a user with a username already in use fails', async () => {
        const usersPreOp = await usersInDb()

        const nuevoUtilizador = {
            name: 'Test User',
            username: 'testuser',
            password: 'TesTPassWorD',
            adult: false
        }

        const response = await api
            .post('/api/users')
            .send(nuevoUtilizador)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersPostOp = await usersInDb()

        expect(usersPostOp.length).toBe(usersPreOp.length)
        expect(response.body.error).toEqual('username already in use')
    })

    test('saving a user with too short password fails', async () => {
        const usersPreOp = await usersInDb()

        const nuevoUtilizador = {
            name: 'Test User',
            username: 'testuser3',
            password: 'Te',
            adult: false
        }

        const response = await api
            .post('/api/users')
            .send(nuevoUtilizador)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersPostOp = await usersInDb()
        const usernames = usersPostOp.map(user => user.username)

        expect(usersPostOp.length).toBe(usersPreOp.length)
        expect(usernames).not.toContain('testuser3')
        expect(response.body.error).toEqual('password must be at least 3 characters long')
    })

    test('saving a user with 3 character password succeeds', async () => {
        const usersPreOp = await usersInDb()

        const nuevoUtilizador = {
            name: 'Test User',
            username: 'testuser4',
            password: 'Tes',
            adult: false
        }

        await api
            .post('/api/users')
            .send(nuevoUtilizador)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersPostOp = await usersInDb()
        const usernames = usersPostOp.map(user => user.username)

        expect(usersPostOp.length).toBe(usersPreOp.length + 1)
        expect(usernames).toContain('testuser4')
    })

    test('user\'s param adult is true by default', async () => {
        const nuevoUtilizador = {
            name: 'Test User',
            username: 'testuser5',
            password: 'Tes'
        }

        await api
            .post('/api/users')
            .send(nuevoUtilizador)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const savedUser = await User.findOne({ username: nuevoUtilizador.username })

        expect(savedUser.adult).toBe(true)
    })

    afterAll(async () => {
        await server.close()
    })
})
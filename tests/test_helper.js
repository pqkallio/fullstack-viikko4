const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const secret = require('../config').secret

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

const dummyUser = new User({
    name: 'Test User',
    username: 'testuser',
    passwordHash: 'xxxxxxx',
    adult: true,
    blogs: []
})

const getTokenForUser = user => {
    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, secret)

    return token
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs
}

const usersInDb = async () => {
    const users = await User.find({})
    return users
}

const nonExistingId = async () => {
    const blog = new Blog()
    await blog.save()
    await blog.remove()

    return blog._id
}

module.exports = {
    initialBlogs,
    blogsInDb,
    usersInDb,
    nonExistingId,
    dummyUser,
    getTokenForUser
}
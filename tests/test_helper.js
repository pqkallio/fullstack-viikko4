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

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs
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
    nonExistingId
}
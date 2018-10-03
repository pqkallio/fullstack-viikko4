const listHelper = require('../utils/list_helper')

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listWithTwoBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 1,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f9',
        title: 'EKI EKI Considered Harmful',
        author: 'Eki E. Ekijkstra',
        url: 'http://http://http://ekieki.com.fi.ru',
        likes: 5,
        __v: 0
    }
]

const listWithThreeBlogs = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 4,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f9',
        title: 'EKI EKI Considered Harmful',
        author: 'Eki E. Ekijkstra',
        url: 'http://http://http://ekieki.com.fi.ru',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f9',
        title: 'Mani boi mo!',
        author: 'Edsger W. Dijkstra',
        url: 'httpx://httpy://httpz://jekimeki.com.fi.ruuuuuuuuuuuu',
        likes: 4,
        __v: 0
    }
]

describe('List helpers', () => {
    describe('Dummy', () => {
        test('dummy is called', () => {
            const blogs = []
        
            const result = listHelper.dummy(blogs)
            expect(result).toBe(1)
        })
    })
    
    describe('Total likes', () => {
        test('likes of an empty list is zero', () => {
            const result = listHelper.totalLikes([])
            expect(result).toBe(0)
        })
    
        test('likes of a single-blog-list is correct', () => {
            const result = listHelper.totalLikes(listWithOneBlog)
            expect(result).toBe(5)
        })
    
        test('likes of a two-blog-list is correct', () => {
            const result = listHelper.totalLikes(listWithTwoBlogs)
            expect(result).toBe(6)
        })
    })
    
    describe('Favorite blog', () => {
        test('empty blogs list returns empty object', () => {
            const result = listHelper.favoriteBlog([])
            expect(result).toEqual({})
        })
    
        test('one blog list returns an object corresponding to its only element', () => {
            const result = listHelper.favoriteBlog(listWithOneBlog)
            const expected = {
                "title": listWithOneBlog[0].title,
                "author": listWithOneBlog[0].author,
                "likes": listWithOneBlog[0].likes
            }
    
            expect(result).toEqual(expected)
        })
    
        test('two blog list returns an object corresponding to the item with most likes', () => {
            const result = listHelper.favoriteBlog(listWithTwoBlogs)
            const expected = {
                "title": listWithTwoBlogs[1].title,
                "author": listWithTwoBlogs[1].author,
                "likes": listWithTwoBlogs[1].likes
            }
    
            expect(result).toEqual(expected)
        })
    
        test('three blog list returns an object corresponding to the item with most likes', () => {
            const result = listHelper.favoriteBlog(listWithThreeBlogs)
            const expected = {
                "title": listWithThreeBlogs[1].title,
                "author": listWithThreeBlogs[1].author,
                "likes": listWithThreeBlogs[1].likes
            }
    
            expect(result).toEqual(expected)
        })
    })
    
    describe('Most blogs', () => {
        test('empty blog list returns empty object', () => {
            const result = listHelper.mostBlogs([])
            expect(result).toEqual({})
        })
    
        test('one blog list returns the only author with one blog', () => {
            const result = listHelper.mostBlogs(listWithOneBlog)
            const expected = {
                "author": listWithOneBlog[0].author,
                "blogs": 1
            }
    
            expect(result).toEqual(expected)
        })
    
        test('two-author list returns the author with most blogs', () => {
            const result = listHelper.mostBlogs(listWithThreeBlogs)
            const expected = {
                "author": listWithThreeBlogs[2].author,
                "blogs": 2
            }
    
            expect(result).toEqual(expected)
        })
    })
    
    describe('Most likes', () => {
        test('empty blog list returns empty object', () => {
            const result = listHelper.mostLikes([])
            expect(result).toEqual({})
        })
    
        test('one blog list returns the only author with its likes', () => {
            const result = listHelper.mostLikes(listWithOneBlog)
            const expected = {
                "author": listWithOneBlog[0].author,
                "likes": listWithOneBlog[0].likes
            }
    
            expect(result).toEqual(expected)
        })
    
        test('two-author list returns the author with most likes', () => {
            const result = listHelper.mostLikes(listWithThreeBlogs)
            const expected = {
                "author": listWithThreeBlogs[2].author,
                "likes": 8
            }
    
            expect(result).toEqual(expected)
        })
    })
})
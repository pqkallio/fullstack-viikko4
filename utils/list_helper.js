const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item
    }

    const likes = blogs.map(blog => blog.likes)
    
    return blogs.length === 0 ? 0 : likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }

    const copyOfBlogs = [...blogs]

    copyOfBlogs.sort((a, b) => {
        return b.likes - a.likes
    })

    return {
        "title": copyOfBlogs[0].title,
        "author": copyOfBlogs[0].author,
        "likes": copyOfBlogs[0].likes
    }
}

const AuthorSummary = (author, summaryName, summaryVal) => {
    return {
        author,
        [summaryName]: summaryVal
    }
}

const summarizeAuthorsBy = (blogs, attribute, aggregate = false) => {
    let summary = []
    
    blogs.forEach(blog => {
        let author = blog.author
        let authorSummary = summary.find(element => {
            return element.author === author
        })
        
        if (!authorSummary) {
            let i = summary.push(AuthorSummary(author, attribute, 0)) - 1
            authorSummary = summary[i]
        }

        authorSummary[attribute] += aggregate ? blog[attribute] : 1
    })

    return summary
}

const findAuthorWithMost = (blogs, attribute, accumulatorAttribute) => {
    if (blogs.length === 0) {
        return {}
    }

    const summary = summarizeAuthorsBy(blogs, attribute, accumulatorAttribute)

    summary.sort((a, b) => {
        return b[attribute] - a[attribute]
    })

    return summary[0]
}

const mostBlogs = (blogs) => {
    const result = findAuthorWithMost(blogs, 'blogs')
    return result
}

const mostLikes = (blogs) => {
    const result = findAuthorWithMost(blogs, 'likes', true)
    return result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
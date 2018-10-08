const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    let token

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    } else {
        token = null
    }

    request.token = token

    next()
}

module.exports = {
    tokenExtractor
}
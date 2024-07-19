const logger = require('./logger')
const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.length === 0
    ? 0
    : blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const blogLikes = blogs.map(blog => blog.likes)
  logger.info(`blog likes: ${blogLikes}`)
  const maxLikes = Math.max(...blogLikes)
  logger.info(`max likes: ${maxLikes}`)
  const index = blogLikes.indexOf(maxLikes)
  logger.info(`index: ${index}`)

  return index === -1
    ? {}
    : blogs[index]
}

const mostBlogs = (blogs) => {
  const blogsPerAuthor = lodash.countBy(blogs, 'author')
  logger.info(`blogs per authors: ${JSON.stringify(blogsPerAuthor)}`)
  const arrayBlogsPerAuthor = Object.keys(blogsPerAuthor).map(author => ({
    author,
    blogs: blogsPerAuthor[author]
  }))
  logger.info(`array of the blogs per authors: ${JSON.stringify(arrayBlogsPerAuthor)}`)
  const authorWithMost = lodash.maxBy(arrayBlogsPerAuthor, 'blogs')
  logger.info(`author with most blogs: ${JSON.stringify(authorWithMost)}`)

  return blogs.length === 0
    ? {}
    : authorWithMost
}

const mostLikes = (blogs) => {
  const authorsBlogs = lodash.groupBy(blogs, 'author')
  logger.info(`blogs grouped by authors: ${JSON.stringify(authorsBlogs)}`)
  const arrayAuthorsLikes = Object.keys(authorsBlogs).map(author => ({
    author,
    likes: totalLikes(authorsBlogs[author])
  }))
  logger.info(`array of authors' likes: ${JSON.stringify(arrayAuthorsLikes)}`)
  const authorWithMost = lodash.maxBy(arrayAuthorsLikes, 'likes')
  logger.info(`author with most likes: ${JSON.stringify(authorWithMost)}`)

  return blogs.length === 0
    ? {}
    : authorWithMost
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
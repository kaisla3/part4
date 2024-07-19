const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5
  },
  {
    title: 'sometitle',
    author: 'someone',
    url: 'www.ok.fi',
    likes: 100,
  },
  {
    title: 'sometitle2',
    author: 'someone2',
    url: 'www.ok2.fi',
    likes: 102,
  },
  {
    title: 'sometitle3',
    author: 'someone3',
    url: 'www.ok3.fi',
    likes: 103,
  },
  {
    title: 'sometitle4',
    author: 'someone4',
    url: 'www.ok4.fi',
    likes: 104,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'almost deleted',
    author: 'almost deleted',
    url: 'www.juu.fi',
  })
  await blog.save()
  await blog.deleteOne()

  return blog.id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}


module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}
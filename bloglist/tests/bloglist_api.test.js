const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const logger = require('../utils/logger')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const Blog = require('../models/blog')

describe('when there is initially a user who has blogs saved', () => {
  let TOKEN
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    const savedUser = await user.save()

    const blogsWithUser = helper.initialBlogs
      .map(blog => ({
        ...blog, 
        user: savedUser.id,
      }))

    const blogObjects = blogsWithUser.map(blog => new Blog(blog))

    const savedBlogs = await Promise.all(blogObjects.map(blog => blog.save()))

    const newUser = {
        username: 'root', 
        passwordHash,
        blogs: savedBlogs.map(blog => blog.id)
      }

    const updated = await User.findByIdAndUpdate(savedUser.id, newUser, { new: true })
    logger.info(JSON.stringify(updated))

    const userForToken = {
        username: savedUser.username,
        id: savedUser.id,
      }
  
      TOKEN = jwt.sign(userForToken, process.env.SECRET)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('unique identifier property of blogs is named id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert(!blog.hasOwnProperty('_id'))
    assert(blog.hasOwnProperty('id'))
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data and when user is logged in', async () => {
      const newBlog = {
        title: 'sometitle5',
        author: 'someone5',
        url: 'www.ok5.fi',
        likes: 105,
      }

      await api
        .post('/api/blogs')
        .set( 'Authorization', `Bearer ${TOKEN}` )
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)


      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)


      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('sometitle5'))
    })

    test('if likes property is not defined, it will default to 0', async () => {
      const newBlog = {
        title: 'sometitle6',
        author: 'someone6',
        url: 'www.ok5.fi',
      }

      await api
        .post('/api/blogs')
        .set( 'Authorization', `Bearer ${TOKEN}` )
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)


      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(n => n.title)
      assert(titles.includes('sometitle6'))
      const index = blogsAtEnd.length - 1
      assert.strictEqual(blogsAtEnd[index].title, newBlog.title)
      assert.strictEqual(blogsAtEnd[index].likes, 0)
    })

    test('blog without title is not added', async () => {
      const newBlog = {
        author: 'someone6',
        url: 'www.ok6.fi',
        likes: 106,
      }

      await api
        .post('/api/blogs')
        .set( 'Authorization', `Bearer ${TOKEN}` )
        .send(newBlog)
        .expect(400)


      const blogsAtEnd = await helper.blogsInDb()


      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
      const newBlog = {
        title: 'sometitle7',
        author: 'someone7',
        likes: 106,
      }

      await api
        .post('/api/blogs')
        .set( 'Authorization', `Bearer ${TOKEN}` )
        .send(newBlog)
        .expect(400)


      const blogsAtEnd = await helper.blogsInDb()


      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
    test('fails with code 401 when user is not logged in', async () => {
        const newBlog = {
          title: 'sometitle99',
          author: 'someone99',
          url: 'www.ok99.fi',
          likes: 199,
        }
  
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401)
  
  
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  
  
        const titles = blogsAtEnd.map(n => n.title)
        assert(!titles.includes('sometitle99'))
      })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid and user is logged in', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set( 'Authorization', `Bearer ${TOKEN}` )
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.title))
    })
    test('fails with status code 401 user is not logged in', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
  
        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(401)
  
        const blogsAtEnd = await helper.blogsInDb()
  
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  
        const titles = blogsAtEnd.map(r => r.title)
        assert(titles.includes(blogToDelete.title))
      })
  })
  describe('updating the data of a blog', () => {
    test('succeeds with status code 200 if values are valid', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: 'sometitle8',
        author: 'somebody8',
        url: 'www.ok8.fi',
        likes: 108,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)

      const resultBlog = await api
        .get(`/api/blogs/${blogToUpdate.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(resultBlog.body.title, updatedBlog.title)
      assert.strictEqual(resultBlog.body.author, updatedBlog.author)
      assert.strictEqual(resultBlog.body.url, updatedBlog.url)
      assert.strictEqual(resultBlog.body.likes, updatedBlog.likes)

    })
  })
})
describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  test('creation fails with proper statuscode and message if username is not long enough', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'no',
      name: 'someone',
      password: 'hihihihihi',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('shorter than the minimum allowed length'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  test('creation fails with proper statuscode and message if password is not long enough', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'joku',
      name: 'someone',
      password: 'hi',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password not suitable'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  test('creation fails with proper statuscode and message if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'joku',
      name: 'someone',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('password not suitable'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
  test('creation fails with proper statuscode and message if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'someone',
      password: 'hihihihihi',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('`username` is required'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

})

after(async () => {
  await mongoose.connection.close()
})
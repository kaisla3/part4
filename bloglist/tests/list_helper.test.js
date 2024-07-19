const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  const bloglist = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '6697d950e2c0f3814086fcab',
      title: 'sometitle',
      author: 'someone',
      url: 'www.ok.fi',
      likes: 100,
      __v: 0
    },
    {
      _id: '6697d99de2c0f3814086fcb0',
      title: 'sometitle2',
      author: 'someone2',
      url: 'www.ok2.fi',
      likes: 102,
      __v: 0
    },
    {
      _id: '6697dc460dcae1552df287af',
      title: 'sometitle3',
      author: 'someone3',
      url: 'www.ok3.fi',
      likes: 103,
      __v: 0
    },
    {
      _id: '6697e52abf1a759bdba3e18a',
      title: 'sometitle4',
      author: 'someone4',
      url: 'www.ok4.fi',
      likes: 104,
      __v: 0
    }
  ]

  const emptyList = []

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(bloglist)
    assert.strictEqual(result, 414)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  const bloglist = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '6697d950e2c0f3814086fcab',
      title: 'sometitle',
      author: 'someone',
      url: 'www.ok.fi',
      likes: 100,
      __v: 0
    },
    {
      _id: '6697d99de2c0f3814086fcb0',
      title: 'sometitle2',
      author: 'someone2',
      url: 'www.ok2.fi',
      likes: 102,
      __v: 0
    },
    {
      _id: '6697dc460dcae1552df287af',
      title: 'sometitle3',
      author: 'someone3',
      url: 'www.ok3.fi',
      likes: 103,
      __v: 0
    },
    {
      _id: '6697e52abf1a759bdba3e18a',
      title: 'sometitle4',
      author: 'someone4',
      url: 'www.ok4.fi',
      likes: 104,
      __v: 0
    }
  ]

  const bloglistMultiple = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '6697d950e2c0f3814086fcab',
      title: 'sometitle',
      author: 'someone',
      url: 'www.ok.fi',
      likes: 104,
      __v: 0
    },
    {
      _id: '6697d99de2c0f3814086fcb0',
      title: 'sometitle2',
      author: 'someone2',
      url: 'www.ok2.fi',
      likes: 102,
      __v: 0
    },
    {
      _id: '6697dc460dcae1552df287af',
      title: 'sometitle3',
      author: 'someone3',
      url: 'www.ok3.fi',
      likes: 103,
      __v: 0
    },
    {
      _id: '6697e52abf1a759bdba3e18a',
      title: 'sometitle4',
      author: 'someone4',
      url: 'www.ok4.fi',
      likes: 104,
      __v: 0
    }
  ]

  const emptyList = []

  test('of empty list is empty', () => {
    const result = listHelper.favoriteBlog(emptyList)
    assert.deepStrictEqual(result, {})
  })

  test('when list has only one blog, function returns that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(bloglist)
    assert.deepStrictEqual(result, bloglist[4])
  })

  test('with multiple same likes the earlier one is returned', () => {
    const result = listHelper.favoriteBlog(bloglistMultiple)
    assert.deepStrictEqual(result, bloglistMultiple[1])
  })
})

describe('most blogs', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  const bloglist = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '6697d950e2c0f3814086fcab',
      title: 'sometitle',
      author: 'someone',
      url: 'www.ok.fi',
      likes: 100,
      __v: 0
    },
    {
      _id: '6697d99de2c0f3814086fcb0',
      title: 'sometitle2',
      author: 'someone',
      url: 'www.ok2.fi',
      likes: 102,
      __v: 0
    },
    {
      _id: '6697dc460dcae1552df287af',
      title: 'sometitle3',
      author: 'someone3',
      url: 'www.ok3.fi',
      likes: 103,
      __v: 0
    },
    {
      _id: '6697e52abf1a759bdba3e18a',
      title: 'sometitle4',
      author: 'someone4',
      url: 'www.ok4.fi',
      likes: 104,
      __v: 0
    }
  ]

  const bloglistMultiple = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '6697d950e2c0f3814086fcab',
      title: 'sometitle',
      author: 'someone',
      url: 'www.ok.fi',
      likes: 104,
      __v: 0
    },
    {
      _id: '6697d99de2c0f3814086fcb0',
      title: 'sometitle2',
      author: 'someone',
      url: 'www.ok2.fi',
      likes: 102,
      __v: 0
    },
    {
      _id: '6697dc460dcae1552df287af',
      title: 'sometitle3',
      author: 'someone3',
      url: 'www.ok3.fi',
      likes: 103,
      __v: 0
    },
    {
      _id: '6697e52abf1a759bdba3e18a',
      title: 'sometitle4',
      author: 'someone3',
      url: 'www.ok4.fi',
      likes: 104,
      __v: 0
    }
  ]

  const emptyList = []

  test('of empty list is empty', () => {
    const result = listHelper.mostBlogs(emptyList)
    assert.deepStrictEqual(result, {})
  })

  test('when list has only one blog, function returns that author', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }
    assert.deepStrictEqual(result, expected)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(bloglist)
    const expected = {
      author: 'someone',
      blogs: 2
    }
    assert.deepStrictEqual(result, expected)
  })

  test('with multiple same likes the earlier author is returned', () => {
    const result = listHelper.mostBlogs(bloglistMultiple)
    const expected = {
      author: 'someone',
      blogs: 2
    }
    assert.deepStrictEqual(result, expected)
  })
})

describe('most likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  const bloglist = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    },
    {
      _id: '6697d950e2c0f3814086fcab',
      title: 'sometitle',
      author: 'someone',
      url: 'www.ok.fi',
      likes: 100,
      __v: 0
    },
    {
      _id: '6697d99de2c0f3814086fcb0',
      title: 'sometitle2',
      author: 'someone',
      url: 'www.ok2.fi',
      likes: 102,
      __v: 0
    },
    {
      _id: '6697dc460dcae1552df287af',
      title: 'sometitle3',
      author: 'someone3',
      url: 'www.ok3.fi',
      likes: 103,
      __v: 0
    },
    {
      _id: '6697e52abf1a759bdba3e18a',
      title: 'sometitle4',
      author: 'someone3',
      url: 'www.ok4.fi',
      likes: 104,
      __v: 0
    }
  ]

  const bloglistMultiple = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 207,
      __v: 0
    },
    {
      _id: '6697d950e2c0f3814086fcab',
      title: 'sometitle',
      author: 'someone',
      url: 'www.ok.fi',
      likes: 104,
      __v: 0
    },
    {
      _id: '6697d99de2c0f3814086fcb0',
      title: 'sometitle2',
      author: 'someone',
      url: 'www.ok2.fi',
      likes: 102,
      __v: 0
    },
    {
      _id: '6697dc460dcae1552df287af',
      title: 'sometitle3',
      author: 'someone3',
      url: 'www.ok3.fi',
      likes: 103,
      __v: 0
    },
    {
      _id: '6697e52abf1a759bdba3e18a',
      title: 'sometitle4',
      author: 'someone3',
      url: 'www.ok4.fi',
      likes: 104,
      __v: 0
    }
  ]

  const emptyList = []

  test('of empty list is empty', () => {
    const result = listHelper.mostLikes(emptyList)
    assert.deepStrictEqual(result, {})
  })

  test('when list has only one blog, function returns that author', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
    assert.deepStrictEqual(result, expected)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(bloglist)
    const expected = {
      author: 'someone3',
      likes: 207
    }
    assert.deepStrictEqual(result, expected)
  })

  test('with multiple same likes the earlier author is returned', () => {
    const result = listHelper.mostLikes(bloglistMultiple)
    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 207
    }
    assert.deepStrictEqual(result, expected)
  })
})
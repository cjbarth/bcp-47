'use strict'

var test = require('tape')
var bcp47 = require('..')

test('.parse()', function(t) {
  t.equal(typeof bcp47.parse, 'function', 'should be a method')

  t.throws(function() {
    bcp47.parse()
  }, 'should throw when given `undefined`')

  t.throws(function() {
    bcp47.parse(null)
  }, 'should throw when given `null`')

  t.doesNotThrow(function() {
    bcp47.parse({toString: toString})
    function toString() {
      return 'en'
    }
  }, 'should coerce to a string')

  t.deepEqual(
    bcp47.parse('i-klingon'),
    {
      language: 'tlh',
      extendedLanguageSubtags: [],
      script: null,
      region: null,
      variants: [],
      extensions: [],
      privateuse: [],
      irregular: null,
      regular: null
    },
    'should normalize when possible'
  )

  t.deepEqual(
    bcp47.parse('i-klingon', {normalize: false}),
    {
      language: null,
      extendedLanguageSubtags: [],
      script: null,
      region: null,
      variants: [],
      extensions: [],
      privateuse: [],
      irregular: 'i-klingon',
      regular: null
    },
    'should not normalize when `normalize: false`'
  )

  t.deepEqual(
    bcp47.parse('i-default'),
    {
      language: null,
      extendedLanguageSubtags: [],
      script: null,
      region: null,
      variants: [],
      extensions: [],
      privateuse: [],
      irregular: 'i-default',
      regular: null
    },
    'should return an irregular when not normalizable'
  )

  t.deepEqual(
    bcp47.parse('zh-min'),
    {
      language: null,
      extendedLanguageSubtags: [],
      script: null,
      region: null,
      variants: [],
      extensions: [],
      privateuse: [],
      irregular: null,
      regular: 'zh-min'
    },
    'should return a regular when not normalizable'
  )

  t.test('Too long variant', function(st) {
    var fixture = 'en-GB-abcdefghi'

    st.plan(6)

    st.deepEqual(
      bcp47.parse(fixture, {warning: warning}),
      {
        language: null,
        extendedLanguageSubtags: [],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return `null`'
    )

    function warning() {
      st.equal(arguments[0], 'Too long variant, expected at most 8 characters')
      st.equal(arguments[1], 1)
      st.equal(arguments[2], 15)
      st.equal(arguments.length, 3)
    }

    st.deepEqual(
      bcp47.parse(fixture, {forgiving: true}),
      {
        language: 'en',
        extendedLanguageSubtags: [],
        script: null,
        region: 'GB',
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return untill the error when `forgiving: true`'
    )
  })

  t.test('Too many subtags', function(st) {
    var fixture = 'aa-bbb-ccc-ddd-eee'

    st.plan(6)

    st.deepEqual(
      bcp47.parse(fixture, {warning: warning}),
      {
        language: null,
        extendedLanguageSubtags: [],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return `null`'
    )

    function warning() {
      st.equal(
        arguments[0],
        'Too many extended language subtags, expected at most 3 subtags'
      )
      st.equal(arguments[1], 3)
      st.equal(arguments[2], 14)
      st.equal(arguments.length, 3)
    }

    st.deepEqual(
      bcp47.parse('aa-bbb-ccc-ddd-eee', {forgiving: true}),
      {
        language: 'aa',
        extendedLanguageSubtags: ['bbb', 'ccc', 'ddd'],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return untill the error when `forgiving: true`'
    )
  })

  t.test('Too long extension', function(st) {
    var fixture = 'en-i-abcdefghi'

    st.plan(6)

    st.deepEqual(
      bcp47.parse(fixture, {warning: warning}),
      {
        language: null,
        extendedLanguageSubtags: [],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return `null`'
    )

    function warning() {
      st.equal(
        arguments[0],
        'Too long extension, expected at most 8 characters'
      )
      st.equal(arguments[1], 2)
      st.equal(arguments[2], 13)
      st.equal(arguments.length, 3)
    }

    st.deepEqual(
      bcp47.parse(fixture, {forgiving: true}),
      {
        language: 'en',
        extendedLanguageSubtags: [],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return untill the error when `forgiving: true`'
    )
  })

  t.test('Empty extension', function(st) {
    var fixture = 'en-i-a'

    st.plan(6)

    st.deepEqual(
      bcp47.parse(fixture, {warning: warning}),
      {
        language: null,
        extendedLanguageSubtags: [],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return `null`'
    )

    function warning() {
      st.equal(
        arguments[0],
        'Empty extension, extensions must have at least 2 characters of content'
      )
      st.equal(arguments[1], 4)
      st.equal(arguments[2], 4)
      st.equal(arguments.length, 3)
    }

    st.deepEqual(
      bcp47.parse(fixture, {forgiving: true}),
      {
        language: 'en',
        extendedLanguageSubtags: [],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return untill the error when `forgiving: true`'
    )
  })

  t.test('Too long private-use', function(st) {
    var fixture = 'en-x-abcdefghi'

    st.plan(6)

    st.deepEqual(
      bcp47.parse(fixture, {warning: warning}),
      {
        language: null,
        extendedLanguageSubtags: [],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return `null`'
    )

    function warning() {
      st.equal(
        arguments[0],
        'Too long private-use area, expected at most 8 characters'
      )
      st.equal(arguments[1], 5)
      st.equal(arguments[2], 13)
      st.equal(arguments.length, 3)
    }

    st.deepEqual(
      bcp47.parse(fixture, {forgiving: true}),
      {
        language: 'en',
        extendedLanguageSubtags: [],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return untill the error when `forgiving: true`'
    )
  })

  t.test('Extra content', function(st) {
    var fixture = 'abcdefghijklmnopqrstuvwxyz'

    st.plan(6)

    st.deepEqual(
      bcp47.parse(fixture, {warning: warning}),
      {
        language: null,
        extendedLanguageSubtags: [],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return `null`'
    )

    function warning() {
      st.equal(arguments[0], 'Found superfluous content after tag')
      st.equal(arguments[1], 6)
      st.equal(arguments[2], 0)
      st.equal(arguments.length, 3)
    }

    st.deepEqual(
      bcp47.parse(fixture, {forgiving: true}),
      {
        language: null,
        extendedLanguageSubtags: [],
        script: null,
        region: null,
        variants: [],
        extensions: [],
        privateuse: [],
        irregular: null,
        regular: null
      },
      'should return untill the error when `forgiving: true`'
    )
  })

  t.end()
})

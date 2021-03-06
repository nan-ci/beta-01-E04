const nArray = n => Array(n).map((_,i) => i)

module.exports = ({ test, describe, exports, code, $, stringify }) => {
  const pass = _ => _
  const moveLastFirst = arr => (arr.unshift(arr.pop()), arr)
  const testMethod = (name, values, shift=pass) => test.against(name,
    (...args) => Array.prototype[name].call(...shift(args)), values)

  const testCurryMethod = (name, values) => test.against(name, (...args) =>
    Array.prototype[name].call(...moveLastFirst(args)), values, 'deepEqual')

  const testCallback = (method, arr) => [
    test(`${method} callback first argument should be the value`)
      .call(() => (v => (exports[method](value => v = value, arr), v))())
      .equal(arr[arr.length - 1]),

    test(`${method} callback second argument should be the index`)
      .call(() => (_i => (exports[method]((a, i) => _i = i, arr), _i))())
      .equal(arr.length - 1),

    test(`${method} callback third argument should be the array`)
      .call(() => (_a => (exports[method]((a, b, i) => _a = i, arr), arr))())
      .equal(arr),
  ]

  const largeArray = nArray(10000)
  const methodTestArrays = [
    [ 'salut' ],
    [ 1, 2, 3 ],
    [ {}, undefined, Function, [] ],
    largeArray,
  ]

  const testCb = method => methodTestArrays
    .reduce((r, t) => r.concat(testCallback(method, t)), [])

  const emptyArray = []
  const testArrays = [
    [ 'a' ],
    [ 'l', 'wesh', 'u' ],
    [ 'u', 1, 2 ],
    [ 't', true, emptyArray, 1 ],
    [ 'x', false, 'hehe' ],
    'saalutsaluut'.split(''),
    [ 'alut', 30, true, {}, undefined, 0, 10, 'super' ],
    nArray(200),
    emptyArray,
  ]

  const arrayParts = testArrays
    .slice(0)
    .reverse()
    .map((arr, i) => [ arr, 'u' ])
    .concat([ [ undefined, nArray(5) ] ])
    .concat(nArray(5).map(n => [ n, nArray(5) ]))

  return [
    describe('cheating', [
        'require',
      ].map(key => test(`${key} should not be used`)
        .value($(`#${key}`).length).equal(0))
      .concat([
        'every',
        'fill',
        'filter',
        'find',
        'findIndex',
        'forEach',
        'includes',
        'indexOf',
        'join',
        'lastIndexOf',
        'map',
        'reduce',
        'reduceRight',
        'slice',
        'some',
        'reverse',
        'split', // string split !
      ].map(key => test(`method ${key} should not be used, code your own !`)
        .value($(`MemberExpression #${key}`).length).equal(0)))),

    test.against('isArray', Array.isArray, [
      '',
      [],
      'pouet',
      'pouet'.split(''),
      true,
      null,
      undefined,
      0,
      {},
      Array,
    ].map(a => [a])),

    test.against('argsToArray3', function () { return Array.from(arguments) }, [
      [ 1, 2, 3 ],
      [ 'a', 'b', 'c' ],
      [ 'a', 2, 'c' ],
      [],
    ], 'deepEqual'),

    test.against('first', a => a && a[0], [
      [ [ 1, 2, 3, 5, 9, 'pouet' ] ],
      [ [ 'a', 'b', 'c' ] ],
      [ [ 'a' ] ],
      [ [] ],
    ]),

    test.against('last', a => a && a[a.length - 1], [
      [ [ 1, 2, 3, 5, 9, 'pouet' ] ],
      [ [ 'a', 'b', 'c' ] ],
      [ [ 'a' ] ],
      [ [] ],
    ]),

    test.fn('each', testCb('each')),
    test.fn('filter', testCb('filter')),
    testCurryMethod('filter', [
      Boolean,
      Math.floor,
      Array.isArray,
      str => typeof str === 'string',
      n => n > 5 && n < 150,
    ].map(f => [ f, testArrays ])),
    test.fn('map', testCb('map')),
    testCurryMethod('map', [
      Boolean,
      Math.floor,
      Array.isArray,
      str => typeof str === 'string',
      n => n > 5 && n < 150,
    ].map(f => [ f, testArrays ])),
    test.fn('reduce', testCb('reduce')),
    testCurryMethod('reduce', [
      Boolean,
      Math.floor,
      Array.isArray,
      str => typeof str === 'string',
      n => n > 5 && n < 150,
    ].map(f => [ f, testArrays ])),

    // join
    // split

    /*
    test('Users should be exported')
      .value(exports.users)
      .isA(Array, `module.exports.users must be an array`),

    test('Users should have proper data structure')
      .value(exports.users)
      .map(arr => arr.filter(u => typeof u.firstname === 'string'
        && typeof u.lastname === 'string'
        && typeof u.age === 'number'
        && /^[0-9]+$/.test(u.phone)
        && /^.+@.+$/.test(u.mail)
        && /^@.+#[0-9]+$/.test(u.discord)).length === arr.length)
      .equal(true, `module.exports.users format invalid`),

    //testCurryMethod('forEach', [ [ forEachTester, testArrays ] ]),
    /*
    testCurryMethod('map', [
      t => t * 2,
      t => `${t} lol`,
    ].map(f => [ f, testArrays ])),
  /*
    test('forEach callback should be called for each elements')
      .value(() => totalCalls)
      .map(fn => fn())
      .equal(testArrays.length),
/*
    testMethod('indexOf', arrayParts),
    testMethod('lastIndexOf', arrayParts),
    testMethod('includes', arrayParts),
    testMethod('slice', [
      [ 0 ],
      [ 1 ],
      [ 2 ],
      [ 3 ],
      [ 100 ],
      [ 0, 1 ],
      [ 0, 4 ],
      [ 0, 10 ],
      [ 0, 100 ],
      [ -2, 5 ],
      [ 2, -5 ],
      [ 2, 5 ],
      [ -2, -5 ],
      [ -2 ],
    ].map(arr => [ nArray(50) ].concat(arr))),
  /**/
  ]
}

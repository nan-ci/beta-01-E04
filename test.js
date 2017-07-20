const nArray = n => Array(n).map((_,i) => i)

module.exports = ({ test, describe, exports, code, $, stringify }) => {
  const pass = _ => _
  const moveLastFirst = arr => (arr.unshift(arr.pop()), arr)
  const testMethod = (name, values, shift=pass) => test.against(name,
    (...args) => Array.prototype[name].call(...shift(args)), values)

  const testCurryMethod = (name, values) =>
    testMethod(name, values, moveLastFirst)

  const testCallback = (method, testArr) => [
    test(`${method.name} callback first argument should be the value`)
      .call(() => (v => (method(value => v = value, testArr), v))())
      .equal(testArr[testArr.length - 1]),

    test(`${method.name} callback second argument should be the index`)
      .call(() => (_i => (method((a, i) => _i = i, testArr), _i))())
      .equal(testArr.length - 1),

    test(`${method.name} callback third argument should be the array`)
      .call(() => (arr => (method((a, b, i) => arr = i, testArr), arr))())
      .equal(testArr),
  ]

  const largeArray = nArray(10000)
  const methodTestArrays = [
    [ 'salut' ],
    [ 1, 2, 3 ],
    [ {}, Function, [] ],
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

  let totalCalls = 0
  const forEachTester = (value, index, arr) => {
    if (value !== testArrays[index]) {
      throw Error(`Callback expected currentValue of ${
        stringify(testArrays[index])
      } but was ${stringify(value)}`)
    }
    if (typeof index !== 'number') {
      throw Error(`Callback 2nd argument should be the index`)
    }
    if (arr !== testArrays) {
      throw Error(`Callback 3rd argument should be the given array`)
    }
    totalCalls++
  }

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

    test.fn('each', testCb(exports.each))),
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

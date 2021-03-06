const {anything, array, assert, base64, boolean, constant, integer, oneof, property} = require('fast-check')
const unicodeStringJsonObjectListFixedLength = require('../shared/unicodeStringJsonObjectListFixedLength')
const whitespace = require('../shared/whitespace')
const {dsv: deserializerFactory} = require('./dsv')

const delimiters    = [',', ';', '.', '|', '/', '-', '+', '$', '#', '!'].map(constant)
const quoteOrEscape = ["'", '"', '`', '\\'].map(constant)

test('deserializes a dsv file without provided header', () => {
  const err                 = []

  const argv                = {verbose: 0}
  const lines               = anything()

  const jsonsChunksDefaults = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          boolean().chain(fixedLength =>
            unicodeStringJsonObjectListFixedLength([delimiter, quote, escape]).map(jsons => {
              const chunks = (
                [Object.keys(jsons[0]).join(delimiter)]
                .concat(jsons.map(json => Object.values(json).join(delimiter)))
              )
  
              return {
                jsons,
                chunks,
                defaults: {
                  delimiter,
                  quote,
                  escape,
                  header:          '[]',
                  skipHeader:      false,
                  fixedLength,
                  trimWhitespaces: false,
                  skipEmptyValues: false,
                  missingAsNull:   false,
                  emptyAsNull:     false,
                  skipNull:        false
                }
              }
            })
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file with provided header', () => {
  const err                 = []

  const argv                = {verbose: 0}
  const lines               = anything()

  const jsonsChunksDefaults = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          boolean().chain(fixedLength =>
            unicodeStringJsonObjectListFixedLength([delimiter, quote, escape]).chain(jsons => {
              const len = Object.keys(jsons[0]).length

              return array(base64(), len, len).map(keys => {
                const _jsons  = (
                  [Object.keys(jsons[0]).reduce((acc, key, i) => ({...acc, [keys[i]]: key}), {})]
                  .concat(
                    jsons.map(json =>
                      Object.values(json).reduce((acc, value, i) => ({...acc, [keys[i]]: value}), {})
                    )
                  )
                )
                const chunks = (
                  [Object.keys(jsons[0]).join(delimiter)]
                  .concat(jsons.map(json => Object.values(json).join(delimiter)))
                )
                const header = '[' + keys.map(key => '"' + key + '"').join(',') + ']'
    
                return {
                  jsons: _jsons,
                  chunks,
                  defaults: {
                    delimiter,
                    quote,
                    escape,
                    header,
                    skipHeader:      false,
                    fixedLength,
                    trimWhitespaces: false,
                    skipEmptyValues: false,
                    missingAsNull:   false,
                    emptyAsNull:     false,
                    skipNull:        false
                  }
                }
              })
            })
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file with provided header and skipHeader', () => {
  const err                 = []

  const argv                = {verbose: 0}
  const lines               = anything()

  const jsonsChunksDefaults = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          boolean().chain(fixedLength =>
            unicodeStringJsonObjectListFixedLength([delimiter, quote, escape]).chain(jsons => {
              const len = Object.keys(jsons[0]).length

              return array(base64(), len, len).map(keys => {
                const _jsons = jsons.map(json =>
                  Object.values(json).reduce((acc, value, i) => ({...acc, [keys[i]]: value}), {})
                )
                const chunks = (
                  [Object.keys(jsons[0]).join(delimiter)]
                  .concat(jsons.map(json => Object.values(json).join(delimiter)))
                )
                const header = '[' + keys.map(key => '"' + key + '"').join(',') + ']'
    
                return {
                  jsons: _jsons,
                  chunks,
                  defaults: {
                    delimiter,
                    quote,
                    escape,
                    header,
                    skipHeader:      true,
                    fixedLength,
                    trimWhitespaces: false,
                    skipEmptyValues: false,
                    missingAsNull:   false,
                    emptyAsNull:     false,
                    skipNull:        false
                  }
                }
              })
            })
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file without provided header and skipHeader', () => {
  const err                 = []

  const argv                = {verbose: 0}
  const lines               = anything()

  const jsonsChunksDefaults = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          boolean().chain(fixedLength =>
            unicodeStringJsonObjectListFixedLength([delimiter, quote, escape]).map(jsons => {
              const _jsons  = jsons.map(json => Object.values(json))
              const chunks = (
                [Object.keys(jsons[0]).join(delimiter)]
                .concat(jsons.map(json => Object.values(json).join(delimiter)))
              )
  
              return {
                jsons: _jsons,
                chunks,
                defaults: {
                  delimiter,
                  quote,
                  escape,
                  header:          '[]',
                  skipHeader:      true,
                  fixedLength,
                  trimWhitespaces: false,
                  skipEmptyValues: false,
                  missingAsNull:   false,
                  emptyAsNull:     false,
                  skipNull:        false
                }
              }
            })
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file with variable values lengths and the fixed length option', () => {
  const argv  = {verbose: 0}
  const lines = anything()

  const jsonsChunksDefaultsErr = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          unicodeStringJsonObjectListFixedLength([delimiter, quote, escape], 2).chain(jsons => 
            integer(0, jsons.length - 1).map(noOfDeletes => {
              const chunks = noOfDeletes === 0 ? (
                [Object.keys(jsons[0]).join(delimiter)]
                .concat(jsons.map(json => Object.values(json).join(delimiter)))
              ) : (
                [Object.keys(jsons[0]).join(delimiter)]
                .concat(
                  jsons.slice(0, noOfDeletes).map(json => Object.values(json).slice(1).join(delimiter))
                )
                .concat(
                  jsons.slice(noOfDeletes).map(json => Object.values(json).join(delimiter))
                )
              )
              const _jsons = jsons.slice(noOfDeletes, jsons.length)

              const err = []
              for (let i = 0; i < noOfDeletes; i++) {
                const msg = {msg: 'Number of values does not match number of headers'}
                err.push(msg)
              }
  
              return {
                noOfDeletes,
                err,
                jsons: _jsons,
                chunks,
                defaults: {
                  delimiter,
                  quote,
                  escape,
                  header:          '[]',
                  skipHeader:      false,
                  fixedLength:     true,
                  trimWhitespaces: false,
                  skipEmptyValues: false,
                  missingAsNull:   false,
                  emptyAsNull:     false,
                  skipNull:        false
                }
              }
            })
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaultsErr, (lines, {jsons, chunks, defaults, err}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file with variable values lengths and the fixed length option with lines', () => {
  const argv  = {verbose: 1}

  const jsonsChunksDefaultsErrLines = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          unicodeStringJsonObjectListFixedLength([delimiter, quote, escape], 2).chain(jsons => 
            integer().chain(lineOffset =>
              integer(0, jsons.length - 1).map(noOfDeletes => {
                const chunks = noOfDeletes === 0 ? (
                  [Object.keys(jsons[0]).join(delimiter)]
                  .concat(jsons.map(json => Object.values(json).join(delimiter)))
                ) : (
                  [Object.keys(jsons[0]).join(delimiter)]
                  .concat(
                    jsons.slice(0, noOfDeletes).map(json => Object.values(json).slice(1).join(delimiter))
                  )
                  .concat(
                    jsons.slice(noOfDeletes).map(json => Object.values(json).join(delimiter))
                  )
                )
                const _jsons = jsons.slice(noOfDeletes, jsons.length)
  
                const lines = []
                for (let i = 0; i < chunks.length; i++) lines.push(lineOffset + i)

                const err = []
                for (let i = 0; i < noOfDeletes; i++) {
                  err.push({
                    msg:  'Number of values does not match number of headers',
                    line: lines[i + 1]
                  })
                }
    
                return {
                  noOfDeletes,
                  lines,
                  err,
                  jsons: _jsons,
                  chunks,
                  defaults: {
                    delimiter,
                    quote,
                    escape,
                    header:          '[]',
                    skipHeader:      false,
                    fixedLength:     true,
                    trimWhitespaces: false,
                    skipEmptyValues: false,
                    missingAsNull:   false,
                    emptyAsNull:     false,
                    skipNull:        false
                  }
                }
              })
            )
          )
        )
      )
    )
  )
  
  assert(
    property(jsonsChunksDefaultsErrLines, ({jsons, chunks, defaults, err, lines}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file with variable values lengths and the fixed length option with lines and info', () => {
  const argv  = {verbose: 2}

  const jsonsChunksDefaultsErrLines = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          unicodeStringJsonObjectListFixedLength([delimiter, quote, escape], 2).chain(jsons => 
            integer().chain(lineOffset =>
              integer(0, jsons.length - 1).map(noOfDeletes => {
                const chunks = noOfDeletes === 0 ? (
                  [Object.keys(jsons[0]).join(delimiter)]
                  .concat(jsons.map(json => Object.values(json).join(delimiter)))
                ) : (
                  [Object.keys(jsons[0]).join(delimiter)]
                  .concat(
                    jsons.slice(0, noOfDeletes).map(json => Object.values(json).slice(1).join(delimiter))
                  )
                  .concat(
                    jsons.slice(noOfDeletes).map(json => Object.values(json).join(delimiter))
                  )
                )
                const _jsons = jsons.slice(noOfDeletes, jsons.length)
  
                const lines = []
                for (let i = 0; i < chunks.length; i++) lines.push(lineOffset + i)

                const err = []
                for (let i = 0; i < noOfDeletes; i++) {
                  const values = Object.values(jsons[i]).slice(1)
                  const keys   = Object.keys(jsons[0])
                  err.push({
                    msg:  'Number of values does not match number of headers',
                    line: lines[i + 1],
                    info: `values [${values.join(',')}] and headers [${keys.join(',')}]`
                  })
                }
    
                return {
                  noOfDeletes,
                  lines,
                  err,
                  jsons: _jsons,
                  chunks,
                  defaults: {
                    delimiter,
                    quote,
                    escape,
                    header:          '[]',
                    skipHeader:      false,
                    fixedLength:     true,
                    trimWhitespaces: false,
                    skipEmptyValues: false,
                    missingAsNull:   false,
                    emptyAsNull:     false,
                    skipNull:        false
                  }
                }
              })
            )
          )
        )
      )
    )
  )
  
  assert(
    property(jsonsChunksDefaultsErrLines, ({jsons, chunks, defaults, err, lines}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file and trim whitespaces', () => {
  const err                 = []

  const argv                = {verbose: 0}
  const lines               = anything()

  const jsonsChunksDefaults = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          boolean().chain(fixedLength =>
            unicodeStringJsonObjectListFixedLength([delimiter, quote, escape]).chain(jsons =>
              whitespace().map(ws => {
                const _jsons = jsons.map(json => {
                  return Object.keys(json).reduce(
                    (acc, key) => ({...acc, [key.replace(/^\s+|\s+$/g, '')]: json[key].replace(/^\s+|\s+$/g, '')}),
                    {}
                  )
                })

                const chunks = (
                  [Object.keys(_jsons[0]).map(key => ws + key + ws).join(delimiter)]
                  .concat(_jsons.map(json => Object.values(json).map(value => ws + value + ws).join(delimiter)))
                )

                return {
                  jsons: _jsons,
                  chunks,
                  defaults: {
                    delimiter,
                    quote,
                    escape,
                    header:          '[]',
                    skipHeader:      false,
                    fixedLength,
                    trimWhitespaces: true,
                    skipEmptyValues: false,
                    missingAsNull:   false,
                    emptyAsNull:     false,
                    skipNull:        false
                  }
                }
              })
            )
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file and skip empty values', () => {
  const err                 = []

  const argv                = {verbose: 0}
  const lines               = anything()

  const jsonsChunksDefaults = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          boolean().chain(fixedLength =>
            unicodeStringJsonObjectListFixedLength([delimiter, quote, escape]).map(jsons => {
              const chunks = (
                [Object.keys(jsons[0]).join(delimiter)]
                .concat(jsons.map(json => Object.values(json).map(value => value === '' ? ' ' : value).join(delimiter)))
                .concat(jsons.map(json => Object.values(json).map(() => '').join(delimiter)))
              )

              return {
                jsons,
                chunks,
                defaults: {
                  delimiter,
                  quote,
                  escape,
                  header:          '[]',
                  skipHeader:      false,
                  fixedLength,
                  trimWhitespaces: false,
                  skipEmptyValues: true,
                  missingAsNull:   false,
                  emptyAsNull:     false,
                  skipNull:        false
                }
              }
            })
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file and convert empty values to nulls', () => {
  const argv  = {verbose: 0}
  const lines = anything()

  const jsonsChunksDefaultsErr = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          boolean().chain(fixedLength =>
            unicodeStringJsonObjectListFixedLength([delimiter, quote, escape], 2).chain(jsons => 
              integer(0, jsons.length - 1).map(noOfNulls => {
                const err = []

                const _jsons = noOfNulls === 0 ? (
                  jsons
                ) : (
                  jsons
                  .slice(0, noOfNulls)
                  .map(json =>
                    Object.keys(json)
                    .reduce((acc, key) => ({...acc, [key]: null}), {})
                  )
                  .concat(jsons.slice(noOfNulls))
                )

                const chunks = noOfNulls === 0 ? (
                  [Object.keys(_jsons[0]).join(delimiter)]
                  .concat(_jsons.map(json => Object.values(json).join(delimiter)))
                ) : (
                  [Object.keys(_jsons[0]).join(delimiter)]
                  .concat(
                    _jsons.slice(0, noOfNulls).map(json => Object.values(json).map(() => '').join(delimiter))
                  )
                  .concat(
                    _jsons.slice(noOfNulls).map(json => Object.values(json).join(delimiter))
                  )
                )
                
                return {
                  noOfNulls,
                  err,
                  jsons: _jsons,
                  chunks,
                  defaults: {
                    delimiter,
                    quote,
                    escape,
                    header:          '[]',
                    skipHeader:      false,
                    fixedLength,
                    trimWhitespaces: false,
                    skipEmptyValues: false,
                    missingAsNull:   false,
                    emptyAsNull:     true,
                    skipNull:        false
                  }
                }
              })
            )
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaultsErr, (lines, {jsons, chunks, defaults, err}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file and convert missing values (if #keys > #values) to nulls', () => {
  const argv  = {verbose: 0}
  const lines = anything()

  const jsonsChunksDefaultsErr = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          unicodeStringJsonObjectListFixedLength([delimiter, quote, escape], 2).chain(jsons => 
            integer(0, jsons.length - 1).map(noOfNulls => {
              const err = []

              const _jsons = noOfNulls === 0 ? (
                jsons
              ) : (
                jsons
                .slice(0, noOfNulls)
                .map(json =>
                  Object.keys(json)
                  .reduce((acc, key, i) => ({...acc, [key]: i === 0 ? '' : null}), {})
                )
                .concat(jsons.slice(noOfNulls))
              )

              const chunks = noOfNulls === 0 ? (
                [Object.keys(_jsons[0]).join(delimiter)]
                .concat(_jsons.map(json => Object.values(json).join(delimiter)))
              ) : (
                [Object.keys(_jsons[0]).join(delimiter)]
                .concat(
                  noOfNulls > 0 ? _jsons.slice(0, noOfNulls).map(() => '') : []
                )
                .concat(
                  _jsons.slice(noOfNulls).map(json => Object.values(json).join(delimiter))
                )
              )
              
              return {
                noOfNulls,
                err,
                jsons: _jsons,
                chunks,
                defaults: {
                  delimiter,
                  quote,
                  escape,
                  header:          '[]',
                  skipHeader:      false,
                  fixedLength:     false,
                  trimWhitespaces: false,
                  skipEmptyValues: false,
                  missingAsNull:   true,
                  emptyAsNull:     false,
                  skipNull:        false
                }
              }
            })
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaultsErr, (lines, {jsons, chunks, defaults, err}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file and skip null values', () => {
  const argv  = {verbose: 0}
  const lines = anything()

  const jsonsChunksDefaultsErr = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          unicodeStringJsonObjectListFixedLength([delimiter, quote, escape], 2).chain(jsons => 
            integer(0, jsons.length - 1).map(noOfNulls => {
              const err = []

              const _jsons = jsons.slice(noOfNulls)

              const chunks = noOfNulls === 0 ? (
                [Object.keys(jsons[0]).join(delimiter)]
                .concat(jsons.map(json => Object.values(json).join(delimiter)))
              ) : (
                [Object.keys(jsons[0]).join(delimiter)]
                .concat(jsons.slice(0, noOfNulls).map(() => null))
                .concat(jsons.slice(noOfNulls).map(json => Object.values(json).join(delimiter)))
              )
              
              return {
                noOfNulls,
                err,
                jsons: _jsons,
                chunks,
                defaults: {
                  delimiter,
                  quote,
                  escape,
                  header:          '[]',
                  skipHeader:      false,
                  fixedLength:     false,
                  trimWhitespaces: false,
                  skipEmptyValues: false,
                  missingAsNull:   false,
                  emptyAsNull:     false,
                  skipNull:        true
                }
              }
            })
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaultsErr, (lines, {jsons, chunks, defaults, err}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file with missing options and verbose 0', () => {
  const argv                = {verbose: 0}

  const err                 = [
    {msg: 'Please provide ddelimiter, delimiter or D option'},
    {msg: 'Please provide dquote, quote or Q option'},
    {msg: 'Please provide descape, escape or C option'},
    {msg: 'Please provide dheader, header or H option'}
  ]

  const lines               = anything()

  const jsonsChunksDefaults = (
    boolean().chain(fixedLength =>
      unicodeStringJsonObjectListFixedLength([]).map(jsons => {
        const chunks = (
          [Object.keys(jsons[0]).join(',')]
          .concat(jsons.map(json => Object.values(json).join(',')))
        )

        return {
          jsons: [],
          chunks,
          defaults: {
            skipHeader:      false,
            fixedLength,
            trimWhitespaces: false,
            skipEmptyValues: false,
            missingAsNull:   false,
            emptyAsNull:     false,
            skipNull:        false
          }
        }
      })
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file with missing options and verbose 1', () => {
  const argv                = {verbose: 1}

  const err                 = [
    {msg: 'Please provide ddelimiter, delimiter or D option', line: -1},
    {msg: 'Please provide dquote, quote or Q option',         line: -1},
    {msg: 'Please provide descape, escape or C option',       line: -1},
    {msg: 'Please provide dheader, header or H option',       line: -1}
  ]

  const lines               = anything()

  const jsonsChunksDefaults = (
    boolean().chain(fixedLength =>
      unicodeStringJsonObjectListFixedLength([]).map(jsons => {
        const chunks = (
          [Object.keys(jsons[0]).join(',')]
          .concat(jsons.map(json => Object.values(json).join(',')))
        )

        return {
          jsons: [],
          chunks,
          defaults: {
            skipHeader:      false,
            fixedLength,
            trimWhitespaces: false,
            skipEmptyValues: false,
            missingAsNull:   false,
            emptyAsNull:     false,
            skipNull:        false
          }
        }
      })
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('deserializes a dsv file with missing options and verbose 2', () => {
  const argv                = {verbose: 2}

  const err                 = [
    {msg: 'Please provide ddelimiter, delimiter or D option', line: -1, info: JSON.stringify(argv)},
    {msg: 'Please provide dquote, quote or Q option',         line: -1, info: JSON.stringify(argv)},
    {msg: 'Please provide descape, escape or C option',       line: -1, info: JSON.stringify(argv)},
    {msg: 'Please provide dheader, header or H option',       line: -1, info: JSON.stringify(argv)}
  ]

  const lines               = anything()

  const jsonsChunksDefaults = (
    boolean().chain(fixedLength =>
      unicodeStringJsonObjectListFixedLength([]).map(jsons => {
        const chunks = (
          [Object.keys(jsons[0]).join(',')]
          .concat(jsons.map(json => Object.values(json).join(',')))
        )

        return {
          jsons: [],
          chunks,
          defaults: {
            skipHeader:      false,
            fixedLength,
            trimWhitespaces: false,
            skipEmptyValues: false,
            missingAsNull:   false,
            emptyAsNull:     false,
            skipNull:        false
          }
        }
      })
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('removes quotes around values', () => {
  const err                 = []

  const argv                = {verbose: 0}
  const lines               = anything()

  const jsonsChunksDefaults = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          boolean().chain(fixedLength =>
            unicodeStringJsonObjectListFixedLength([delimiter, quote, escape]).map(jsons => {
              const chunks = (
                [Object.keys(jsons[0]).join(delimiter)]
                .concat(jsons.map(json => Object.values(json).map(value => quote + value + quote).join(delimiter)))
              )
  
              return {
                jsons,
                chunks,
                defaults: {
                  delimiter,
                  quote,
                  escape,
                  header:          '[]',
                  skipHeader:      false,
                  fixedLength,
                  trimWhitespaces: false,
                  skipEmptyValues: false,
                  missingAsNull:   false,
                  emptyAsNull:     false,
                  skipNull:        false
                }
              }
            })
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})

test('ignores delimiters and escaped quotes in quoted values', () => {
  const err                 = []

  const argv                = {verbose: 0}
  const lines               = anything()

  const jsonsChunksDefaults = (
    oneof(...delimiters).chain(delimiter =>
      oneof(...quoteOrEscape).chain(quote =>
        oneof(...quoteOrEscape).chain(escape =>
          boolean().chain(fixedLength =>
            unicodeStringJsonObjectListFixedLength([delimiter, quote, escape]).map(jsons => {
              const _jsons = jsons.map(json =>
                Object.keys(json)
                .reduce(
                  (acc, key, i) => {
                    const value = Object.values(json)[i]
                    return ({
                      ...acc,
                      [key]: (
                        value.slice(0, value.length / 3) +
                        quote +
                        value.slice(value.length / 3, value.length / 3 * 2) +
                        delimiter +
                        value.slice(value.length / 3 * 2)
                      )
                    })
                  },
                  {}
                )
              )
              
              const chunks = (
                [Object.keys(jsons[0]).join(delimiter)]
                .concat(
                  jsons.map(json =>
                    Object.values(json)
                    .map(value =>
                      quote +
                      value.slice(0, value.length / 3) +
                      escape + quote +
                      value.slice(value.length / 3, value.length / 3 * 2) +
                      delimiter +
                      value.slice(value.length / 3 * 2) +
                      quote
                    )
                    .join(delimiter)
                  )
                )
              )

              return {
                jsons: _jsons,
                chunks,
                defaults: {
                  delimiter,
                  quote,
                  escape,
                  header:          '[]',
                  skipHeader:      false,
                  fixedLength,
                  trimWhitespaces: false,
                  skipEmptyValues: false,
                  missingAsNull:   false,
                  emptyAsNull:     false,
                  skipNull:        false
                }
              }
            })
          )
        )
      )
    )
  )
  
  assert(
    property(lines, jsonsChunksDefaults, (lines, {jsons, chunks, defaults}) =>
      expect(
        deserializerFactory(defaults)(argv)(chunks, lines)
      ).toStrictEqual(
        {err, jsons}
      )
    )
  )
})
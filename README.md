![pxi-dsv teaser][teaser]

🧚`pxi-dsv` is a delimiter-separated values plugin for `pxi` (pixie), the small, fast, and magical command-line data processor.

See the [`pxi` github repository][pxi] for more details!

[![node version][shield-node]][node]
[![npm version][shield-npm]][npm-package]
[![license][shield-license]][license]
[![PRs Welcome][shield-prs]][contribute]
[![linux unit tests status][shield-unit-tests-linux]][actions]
[![macos unit tests status][shield-unit-tests-macos]][actions]
[![windows unit tests status][shield-unit-tests-windows]][actions]

## Installation

> :ok_hand: `pxi-dsv` comes preinstalled in `pxi`.
> No installation necessary.
> If you still want to install it, proceed as described below.

`pxi-dsv` is installed in `~/.pxi/` as follows:

```bash
npm install pxi-dsv
```

The plugin is included in `~/.pxi/index.js` as follows:

```js
const dsv = require('pxi-dsv')

module.exports = {
  plugins:  [dsv],
  context:  {},
  defaults: {}
}
```

For a much more detailed description, see the [`.pxi` module documentation][pxi-module].

## Extensions

This plugin comes with the following `pxi` extensions:

|                    | Description                                                                                                                                                       |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `dsv` deserializer | Deserializes delimiter-separated values files. The delimiter, quote, and escape characters, as well as several other options make it very flexible.                     |
| `csv` deserializer | Deserializes comma-separated values files. Follows RFC4180 for the most part. Uses `dsv` internally and accepts the same options.                                       |
| `tsv` deserializer | Deserializes tab-separated values files. Useful for processing tabular database and spreadsheet data. Uses `dsv` internally and accepts the same options.               |
| `ssv` deserializer | Deserializes space-separated values files. Useful for processing command line output from `ls`, `ps`, and the like. Uses `dsv` internally and accepts the same options. |
| `csv` serializer   | Serializes JSON into CSV format.                                                                                                                                  |

## Known Limitations

This plugin has the following limitations:

1.  **No type casting**:
    The deserializers do not cast strings to other data types, like numbers or booleans.
    This is intentional.
    Since different use cases need different data types, and some use cases need their integers to be strings,
    e.g. in case of IDs, there is no way to know for sure when to cast a string to another type.
    If you need different types, you may cast strings by using functions.
2.  **Integer header order**:
    Headers that are integers are always printed before other headers.
    This is an implementation detail of the way JavaScript orders object keys internally.
    Although this is an inconvenience, this behaviour will stay for now, since changing it would reduce performance.
    If you have a good way to solve this and retain performance, please let me know.
3.  **Non-optimal tsv (de-)serializer implementations**:
    The `tsv` deserializer is implemented in terms of the `dsv` deserializer and thus supports quotes and escaping tabs.
    Other implementations of `tsv` deserializers do not allow tabs in values and thus have no need of quotes and escapes.
    This means, the current `tsv` implementation works just fine, but an implementation without quotes should be faster.
    Such an implementation may come at some point in the future.
4.  **No multi-line CSV files**: The `csv` deserializer does not appear to support multi-line values, aka values with line breaks inside quotes.
    Actually, no `pxi` deserializer could support this feature alone,
    since it is the chunkers' responsibility to chunk data.
    Currently there is no dedicated chunker that supports chunking multi-line csv files, but there may be in the future.

## Reporting Issues

Please report issues [in the tracker][issues]!

## License

`pxi-dsv` is [MIT licensed][license].

[actions]: https://github.com/Yord/pxi-dsv/actions
[contribute]: https://github.com/Yord/pxi
[issues]: https://github.com/Yord/pxi/issues
[license]: https://github.com/Yord/pxi-dsv/blob/master/LICENSE
[node]: https://nodejs.org/
[npm-package]: https://www.npmjs.com/package/pxi-dsv
[pxi]: https://github.com/Yord/pxi
[pxi-module]: https://github.com/Yord/pxi#pxi-module
[shield-license]: https://img.shields.io/npm/l/pxi-dsv?color=yellow&labelColor=313A42
[shield-node]: https://img.shields.io/node/v/pxi-dsv?color=red&labelColor=313A42
[shield-npm]: https://img.shields.io/npm/v/pxi-dsv.svg?color=orange&labelColor=313A42
[shield-prs]: https://img.shields.io/badge/PRs-welcome-green.svg?labelColor=313A42
[shield-unit-tests-linux]: https://github.com/Yord/pxi-dsv/workflows/linux/badge.svg?branch=master
[shield-unit-tests-macos]: https://github.com/Yord/pxi-dsv/workflows/macos/badge.svg?branch=master
[shield-unit-tests-windows]: https://github.com/Yord/pxi-dsv/workflows/windows/badge.svg?branch=master
[teaser]: https://github.com/Yord/pxi/blob/master/teaser.gif?raw=true
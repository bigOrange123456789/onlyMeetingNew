'use strict';

;(function () {
  'use strict';

  var DEFAULT = 8;

  var charsets = function () {
    var nums = '123456789';
    var lowerC = 'abcdefghijklmonpqrstuvwxyz';
    var syms = '$!';

    return {
      numbers: nums.split(''),
      lowerCaseLetters: lowerC.split(''),
      symbols: syms.split(''),
      upperCaseLetters: lowerC.split('').map(function (x) {
        return x.toUpperCase();
      })
    };
  }();

  // Utilities / Helpers
  // -------------------

  // The main `Engine`.
  // Accepts an array of characters `chars` and returns a random string
  // of `n` length using only those characters
  function randomGen(n, chars) {
    return range(n || DEFAULT).reduce(function (result) {
      return result + sample(chars)[0];
    }, '');
  }

  // Provides a random int between 0 and n
  // Expects to be provided the `length` of whatever
  // charset is used to get a full spectrum of indices
  function possibleIndex(n) {
    return Math.floor(Math.random() * n);
  }

  // Takes any amount of arrays and concatenates them into one array
  function concatAll() {
    return args(arguments).reduce(function (a, b) {
      return a.concat(b);
    }, []);
  }

  // Pull a `n || 1` random elements from `arr`
  function sample(arr, n) {
    var res = [];
    var length = arr.length;
    // Default to a single item
    n || (n = 1);
    // For the length of `n`, push a random element to the results list
    times(n, function () {
      res.push(arr[possibleIndex(length)]);
    });
    return res;
  }

  function times(n, fn) {
    if (!n) return;
    fn(n);
    return times(n - 1, fn);
  }

  // Used internally to get a real array from the `arguments` object
  function args() {
    return Array.prototype.slice.call(arguments[0]);
  }

  // Internal helper to generate an array of `n` elements
  function range(n) {
    var res = [],
        i = 1;
    while (i <= n) {
      res.push(i);
      i++;
    }
    return res;
  }

  var PublicApi = function (chars) {

    // Default Charsets
    var lowerCaseLetters = chars.lowerCaseLetters;
    var upperCaseLetters = chars.upperCaseLetters;
    var numbers = chars.numbers;
    var symbols = chars.symbols;


    return {
      alphaNum: function alphaNum(n) {
        return randomGen(n, concatAll(lowerCaseLetters, upperCaseLetters, numbers));
      },
      any: function any(n) {
        return randomGen(n, concatAll(lowerCaseLetters, upperCaseLetters, numbers, symbols));
      },
      id: function id() {
        return this.any(16);
      },
      integer: function integer(n) {
        return parseInt(this.number(n));
      },
      letters: function letters(n) {
        var array = concatAll(upperCaseLetters, lowerCaseLetters);
        return randomGen(n, concatAll(upperCaseLetters, lowerCaseLetters));
      },
      lower: function lower(n) {
        return randomGen(n, lowerCaseLetters);
      },
      number: function number(n, asInteger) {
        return asInteger ? parseInt(randomGen(n, numbers)) : randomGen(n, numbers);
      },
      upper: function upper(n) {
        return randomGen(n, upperCaseLetters);
      },
      mixin: function mixin(name, customChars, interceptor) {
        PublicApi[name] = function (n) {
          return interceptor ? interceptor(randomGen(n, customChars)) : randomGen(n, customChars);
        };
      }
    };
  }(charsets);

  if (typeof module !== 'undefined' && module.exports) {
    // node
    module.exports = PublicApi;
  } else if (typeof window !== 'undefined') {
    // browser
    window.random = PublicApi;
  } else {
    return PublicApi;
  }
})();
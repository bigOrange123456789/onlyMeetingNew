// Utilities / Helpers
// -------------------

// The main `Engine`.
// Accepts an array of characters `chars` and returns a random string
// of `n` length using only those characters
function randomGen(n, chars) {
  return range(n || DEFAULT).reduce(function(result) {
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
  return args(arguments).reduce(function(a, b) {
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
  times(n, function() {
    res.push(arr[possibleIndex(length)]);
  });
  return res;
}

function times(n, fn) {
  if (! n) return;
  fn(n);
  return times(n - 1, fn);
}

// Used internally to get a real array from the `arguments` object
function args() {
  return Array.prototype.slice.call(arguments[0]);
}

// Internal helper to generate an array of `n` elements
function range(n) {
  var res = [], i = 1;
  while (i <= n) {
    res.push(i);
    i++;
  }
  return res;
}

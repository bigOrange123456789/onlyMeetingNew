var PublicApi = (function(chars) {

  // Default Charsets
  let {
    lowerCaseLetters,
    upperCaseLetters,
    numbers,
    symbols
  } = chars;

  return {
    alphaNum(n) {
      return randomGen(n, concatAll(
        lowerCaseLetters,
        upperCaseLetters,
        numbers
      ));
    },
    any(n) {
      return randomGen(n, concatAll(
        lowerCaseLetters,
        upperCaseLetters,
        numbers,
        symbols
      ));
    },
    id() {
      return this.any(16);
    },
    integer(n) {
      return parseInt(this.number(n));
    },
    letters(n) {
      var array = concatAll( upperCaseLetters, lowerCaseLetters );
      return randomGen(n, concatAll(
        upperCaseLetters,
        lowerCaseLetters
      ));
    },
    lower(n) {
      return randomGen(n, lowerCaseLetters);
    },
    number(n, asInteger) {
      return asInteger
      ? parseInt(randomGen(n, numbers))
      : randomGen(n, numbers);
    },
    upper(n) {
      return randomGen(n, upperCaseLetters);
    },
    mixin(name, customChars, interceptor) {
      PublicApi[name] = function(n) {
        return interceptor
          ? interceptor(randomGen(n, customChars))
          : randomGen(n, customChars);
      };
    }
  };
}(charsets));

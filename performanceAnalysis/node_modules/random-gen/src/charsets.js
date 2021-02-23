var charsets = (function() {
  var nums = '123456789';
  var lowerC = 'abcdefghijklmonpqrstuvwxyz';
  var syms = '$!';

  return {
    numbers: nums.split(''),
    lowerCaseLetters: lowerC.split(''),
    symbols: syms.split(''),
    upperCaseLetters: lowerC
      .split('').map(x => x.toUpperCase())
  };
}());

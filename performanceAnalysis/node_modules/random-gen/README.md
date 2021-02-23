# random-gen

Easily create random strings of any length.


*New in v0.1.0*
#### Easily add your own charsets to random with mixins!
---

#### *API*      
`random.number(n)`        
`random.lower(n)`        
`random.upper(n)`        
`random.letters(n)`        
`random.alphaNum(n)`        
`random.any(n)`        
`random.id()`        
`random.mixin(name, charset, [interceptor])`        

`n` represents the desired length of the string, but `random` will use 8 by default if you choose not to pass anything.         



#### *DOCS*       
---
`random.number(n)`      

Returns an integer of `n` length
```JavaScript
random.number(16)
//=> "7753750611098561"
```
---
`random.lower(n)`      

Returns a lowercase string of `n` length
```JavaScript
random.lower(16)
//=> "mcgjmlihofwxjfsx"
```
---
`random.upper(n)`      

Returns an uppercase string of `n` length
```JavaScript
random.upper(16)
//=> "TKTTVSDZYEGBVMMV"
```
---
`random.letters(n)`      

Returns an upper / lower case string of `n` length
```JavaScript
random.letters(16)
//=> "ahWfDPoyOrVSaKYg"
```
---
`random.alphaNum(n)`      

Returns an alpha-numeric string of `n` length
```JavaScript
random.alphaNum(16)
//=> "lEJYcbYznCU5ORdj"
```
---
`random.any(n)`      

Same as `random.alphaNum` with the addition of the `$ and !` characters
```JavaScript
random.any(16)
//=> "f$KgcADOIrEyxE!o"
```
---
`random.id()`      

A convenient shorthand for calling `random.any(16)`
```JavaScript
random.id()
//=> "f$KgcADOIrEyxE!o"
```
---
`random.mixin(name, charsets, [interceptor])`      

Extend `random` with your own charsets. Pass an optional interceptor to manipulate the result before returning to the client.          
*NOTE* If you pass an interceptor, you MUST return the result when you are done
```JavaScript
var foos = 'foobarbazbing'.split('');
random.mixin('foo', foos);
// Now foo is a property on the `random` object,
// and behaves the same as the rest of the API,
// accepting the length of the result,
// or defaulting to 8.
random.foo(1) //=> 'o'
random.foo(3) //=> 'orb'
random.foo(16) //=> 'fzgngorbzbbooorn'
```
If you would like to change the result before it's returned to the client, pass an interceptor function. This function accepts the result, and must RETURN SOMETHING.
```JavaScript
var foos = 'foobarbazbing'.split('');
random.mixin('foo', foos, function(result) {
  return result.toUpperCase();
});

random.foo() //=> 'ABRBBOZO'
```

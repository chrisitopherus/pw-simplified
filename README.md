# pw-simplified

## Pw-Simplified making working with passwords easy

---

## What is Pw-Simplified?

Pw-Simplified is a fast and small JavaScript / Typescript library. Its API is easy and intuitive and really shines with Typescript.

### Note: It uses Math.random(). Since this modules purpose was to be used in the front-end as well. But if you want to use the crypto module then use the provided CryptoPassword Class

---

## Core Features

1. Password generation
2. Password validation
3. Password shuffling

---

## Why Pw-Simplified?

It was created due to my own laziness and because I did not want to reapeat myself over and over again. So I thought about making a small module which is compact and leightweight.

## Whats new in version 0.2.0 (shuffle)

### Added

* shuffle() - METHOD

### Changed

* **README.md** - Added Advanced Usage + New Version

---

## A Brief Look

### Installation

```cmd
npm i pw-simplified
```

### Import

#### Note: No longer with default import

```javascript
// with require
const {Password, CryptoPassword} = require('pw-simplified');
// ofc you can give the classes any alias you want, like
const {Password: Pass, CryptoPassword: CPass} = require('pw-simplified');

// with import
import {Password, CryptoPassword} from 'pw-simplified';
// ofc you can give the classes any alias you want, like
import {Password as Pass, CryptoPassword as CPass}
```

### Configuration

The constructor needs two objects for configuration.

1. For generating passwords
2. For validating passwords

```javascript
const pw = new Pass({
    length: 8, // must set
    lowercase: true, // optional
    uppercase: true, // optional
    numbers: true, // optional
    special: true // optional also possible to add own "" with symbols - when true: ~`!@#$%^&*()_-+={[}]|\:;"'<,>.?/
}, {
    minLength: 8, // must set
    maxLength: 20, // optional
    lowercase: true, // optional
    uppercase: true, // optional
    numbers: true, // optional
    special: true // optional
});
```

### Usage

```javascript
// using the instance created in the configuration example above

// generating a new Password
const generatedPw = pw.generate(); // returns generated Password as a string
// example output: M2mZ!SdX

// validating a Password
if (pw.validate(generatedPw)) { // returns a boolean
    // if valid
} else {
    // if not valid
}
// output with M2mZ!SdX would be true

// shuffle a Password
const shuffledPw = pw.shuffle(generatedPw, 'Fisher Yates');
// output would be for example: mXdZM2S!

// if no second parameter is passed in, it will use 'Fisher Yates' as a standard value
// the option would be 'Sort', which uses the .sort() method
```

### Advanced Usage

#### genConfig and valConfig

Using the setter of the genConfig / valConfig, gives you the possibility to partially change the config

```javascript
// assuming that the instance is named pw
pw.genConfig = {numbers: true} // this will update the numbers prop and the rest will beunchanged
// so assuming the all props were false and length was 8, the new config would be
/*
  {
    length: 8,
    lowercase: false,
    uppercase: false,
    numbers: true,
    specials: false
  }
*/

// the setter of the valConfig also regenerates the valRegEx everytime it is set.
```

#### valRegEx

If you want to define your own RegEx for validating Passwords, just use the setter valRegEx.

```javascript
// if you decided to change the current valRegEx, then you could that like:
pw.valRegEx = new RegExp(".+","g");
// this overwrites the current RegEx and replaces it. Now the validate method uses the RegEx.

// if you want to regenerate the modules RegEx simply use the valConfig setter and assign an empty object or an object with new values if wanted
pw.valConfig = {}
// this will trigger the method for generating the RegEx
```

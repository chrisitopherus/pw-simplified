# 0.3.0 (placeholder)

## Added

* New Shuffle Options - Riffle and Overhand

```javascript
// assuming that the instance is called pw
pw.shuffle(password, 'Riffle');
pw.shuffle(password, 'Overhand');
```

* CryptoPassword - Class (using crpyto module for randomizing)
* generateMany - Method (allows to generate multiple passwords)

```javascript
// assuming that the instance is called pw
pw.generateMany(5);
// example result:
[ "f=2&3R'O", 'W:mCZN28', ',9C/7{+p', '673Q34x{', 'C5B5#9w0' ] 
```

```typescript
// for typescript users, the method will return a tuple
pw.generateMany(2);
// type result:
[string, string]

pw.generateMany(5);
// type result:
[string, string, string, string, string]
```

## Fixed

## Changed

* Importing the module

```javascript
// with require
const {Password, CryptoPassword} = require('pw-simplified');
// ofc you can give the classes any alias you want, like
const {Password: Pass, CryptoPassword: CPass} = require('pw-simplified');

// with import
import {Password, CryptoPassword} from 'pw-simplified';
// ofc you can give the classes any alias you want, like
import {Password as Pass, CryptoPassword as CPass} from 'pw-simplified';
```

* Config `numbers` property to `number`

## Removed

---

## 0.2.0 (shuffle)

### Added

* shuffle() - METHOD

### Changed

* **README.md** - Added Advanced Usage + New Version

---

## 0.1.4 (removed log)

### Fixed

* Removed a debugging log.

---

## 0.1.3 (quick fix)

### Fixed

* **README.md** - small typos and added some information

---

### 0.1.2 (quality of life)

### Added

* Getter / Setter for RegEx
  
  ```javascript
  // assuming that the instance is called pw
  pw.valRegEx // Getter, returns current RegEx for validating
  pw.valRegEx = new RegExp(); // Setter, accepts only RegExp instances
  ```

### Changed

* **Getter** / **Setter** of Config
  
  Now you also can just provide only partial information alias update props without needing to provide all props

  example with the genConfig:

  ```javascript
  // assuming that the instance is named pw
  pw.genConfig = {numbers: true} // this will update the numbers prop and the rest will be unchanged
  ```

  Note: The Getters will **ALWAYS** return a shallow copy of the original. When you use **Typescript** then it will also return as **READONLY**

---

## 0.1.1 (fixed some issues)

### Fixed

* **README.md** - small typos and added some information

---

## 0.1.0 (initial release)

### Added

* generate() - METHOD
* validate() - METHOD

### Removed

* none

---

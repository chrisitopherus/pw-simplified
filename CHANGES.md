# 0.2.0 (shuffle)

## Added

* shuffle() - METHOD

## Changed

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

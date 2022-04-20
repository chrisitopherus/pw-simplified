// import util
import { randomMath, randomCrypto } from "./util/random.js";

// import types
import { GenConfig, ValConfig, GenConfigPartial, ValConfigPartial } from "./types/config";
import { Counter } from "./types/counter";
import { ShuffleOptions } from './types/options';

/**
 * @class
 * Class to instanciate new instances with configurable Options.
 */
class Password {
    protected _genConfig: GenConfig;
    protected _valConfig: ValConfig;
    protected _valRegEx: RegExp;
    /**
     * @constructor
     * @param genConfig Configuration Object for generating Passwords
     * @param valConfig Configuration Object for validating Passwords. Its worth noting that it will be checked if the true values exist at least once. All other characters are also allowed.
     */
    constructor(genConfig: GenConfig, valConfig: ValConfig) {
        this._genConfig = genConfig;
        this._valConfig = valConfig;
        this._valRegEx = this.createRegEx(valConfig);
    }

    /**
     * Method that validates a given Password.
     * @param password Password as a string that should be validated.
     */
    validate(password: string) {
        const match = password.match(this._valRegEx);
        if (match) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Method that generates a Password with the saved genConfig.
     */
    generate() {
        if (this._genConfig.length && this._genConfig.length > 0) { // if value was set and bigger than 0
            let pw = '';
            const letters = 'abcdefghijklmnopqrstuvwxyz';
            const specials = `~\`!@#$%^&*()_-+={[}]|\\:;"'<,>.?/`;
            const counter: Counter = this.createGenerationCounters();
            const availableCounters = Object.keys(counter);
            const count = availableCounters.length;
            const removedCounters: string[] = [];
            for (let i = 0; i < this._genConfig.length; ++i) {
                const key = availableCounters[randomMath(0, availableCounters.length - 1)];
                if (key === 'lowercase') {
                    pw += letters.toLowerCase()[randomMath(0, letters.length - 1)];
                    counter.lowercase!++;
                } else if (key === 'uppercase') {
                    pw += letters.toUpperCase()[randomMath(0, letters.length - 1)];
                    counter.uppercase!++;
                } else if (key === 'numbers') {
                    pw += randomMath(0, 9).toString();
                    counter.numbers!++;
                } else { // symbols
                    if (typeof this._genConfig.special === 'boolean') { // use predefined specials
                        if (this._genConfig.special) pw += specials[randomMath(0, specials.length - 1)];
                        else pw += ' ';
                    } else { // use user defined specials
                        if (this._genConfig.special) {
                            pw += this._genConfig.special[randomMath(0, this._genConfig.special.length - 1)];
                        } else { // user defined nothing so just use spaces
                            pw += ' ';
                        }
                    }
                    counter.special!++;
                }
                if (this._genConfig.length - availableCounters.length - 1 < i) {
                    // 1. iterate through all counters
                    let used: string[] = [];
                    for (let i = 0; i < availableCounters.length; ++i) {
                        if (counter[availableCounters[i]] !== 0) { // already used 
                            used.push(availableCounters[i]);
                        }
                    }
                    if (used.length !== count) { // when there are things not used already
                        // remove one of the already used things out of the pool and add it to the removed pool
                        removedCounters.push(...availableCounters.splice(availableCounters.indexOf(used[randomMath(0, used.length - 1)]), 1));
                    } else { // everything already used -> restore availableCounters
                        availableCounters.push(...removedCounters.splice(0));
                    }
                }
            }
            return pw;
        }
        else {
            if (this._genConfig.length === 0) { // just return empty string
                return "";
            }
            if (this._genConfig.length < 0) { // throw error that invalid length
                throw new Error(`${this._genConfig.length} is not a valid length. Provide a positive Number.`)
            }
            throw new Error(`Invalid length property value "${this._genConfig.length}".`);
        }
    }

    /**
     * Method that shuffles a given Password.
     * @param password - Password that should be shuffled.
     * @param type - Shuffle type as a string.
     * 
     * Possible Values: 'Fisher-Yates' | 'Sort' (Sort meaning that it uses the Array.prototype.sort method)
     * 
     * Default Value is 'Fisher-Yates'
     */
    shuffle(password: string, type: ShuffleOptions = 'Fisher-Yates') {
        let pw: string = '';
        let array = [...password];
        switch (type) {
            case 'Fisher-Yates':
                for (let i = array.length - 1; i > 0; --i) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                pw = array.join('');
                break;
            case 'Sort':
                array.sort(() => Math.random() - 0.5);
                pw = array.join('');
                break;
        }
        return pw;
    }

    /**
     * Method that creates the counter Object.
     */
    protected createGenerationCounters() {
        const counter: Counter = {};
        if (this._genConfig.lowercase) counter.lowercase = 0;
        if (this._genConfig.numbers) counter.numbers = 0;
        if (this._genConfig.uppercase) counter.uppercase = 0;
        if (this._genConfig.special) counter.special = 0;
        return counter;
    }

    /**
     * Method that creates a RegEx out of the Validation Config Object.
     * @param config Configuration Object for validating Passwords.
     */
    protected createRegEx(config: ValConfig) {
        let regString = "^";
        if (config.lowercase || config.numbers || config.uppercase || config.special) {
            if (config.lowercase) regString += "(?=.*[a-z])";
            if (config.uppercase) regString += "(?=.*[A-Z])";
            if (config.numbers) regString += "(?=.*\\\d)";
            if (config.special) {
                if (typeof config.special === 'boolean') { // if true use default value
                    regString += `(?=.*[~\\\`!@#$%^&*()_\\\-+={\\\[}\\\]|\\\\:;"'<,>\\\.?\\\/])`;
                } else { // use user defined value
                    regString += config.special;
                }
            }
            regString += ".{";
        }
        else {
            regString += ".{";
        }
        regString += config.minLength;
        if (config.maxLength) {
            regString += `,${config.maxLength}}$`;
        }
        else {
            regString += ",}$";
        }
        return new RegExp(regString, "g");
    }

    /**
     * Setter / Getter - Regular Expression for validating Passwords.
     * 
     * Note: If you set a new RegEx then you decided to not use the modules validation config as well as the RegEx.
     * 
     * In order to reactivate the usage of the modules RegEx, just use the setter for the valConfig and set either all changes or just an empty {}. The module will regenerate the RegEx.
     * @example Setter
     * ```javascript
     * // assuming that the instance is called pw
     * pw.valRegEx = new RegExp();
     * // example for regenerate the modules RegEx
     * pw.valConfig = {}
     * ```
     */
    set valRegEx(newRegEx: RegExp) {
        if (newRegEx instanceof RegExp) this._valRegEx = newRegEx;
        else throw new Error(`Type "${typeof newRegEx}" is not a valid option. Setter valRegEx only accepts instances of RegExp.`)
    }

    /**
     * Getter - returns the regular Expression that is currently used for validating Passwords.
     */
    get valRegEx() {
        return this._valRegEx;
    }

    /**
     * Setter / Getter - Config for generating Passwords.
     * 
     * Note: Overwrites only properties that are set in the new config, other properties will stay unchanged.
     * 
     * @example Setter - Assuming that all props were true and a length was 8.
     * ```javascript
     * pw.genConfig = {numbers: false}
     * // results in
     * console.log(pw.genConfig) // {length: 8, uppercase: true, lowercase: true, numbers: false, special: true}
     * ```
     */
    set genConfig(newConfig: GenConfigPartial) {
        if (newConfig instanceof Object && !(newConfig instanceof Array)) {
            this._genConfig = { ...this._genConfig, ...newConfig };
        }
    }

    /**
     * Getter - returns a shallow copy of the current config for generating Passwords.
     */
    get genConfig(): Readonly<GenConfig> {
        return Object.freeze(Object.assign({}, this._genConfig));
    }

    /**
     * Setter / Getter - Config for validating Passwords.
     * 
     * Note: Overwrites only properties that are set in the new config, other properties will stay unchanged.
     * 
     * @example Setter - Assuming that all props were true and only a minLength was 8.
     * ```javascript
     * pw.valConfig = {numbers: false}
     * // results in
     * console.log(pw.valConfig) // {minLength: 8, uppercase: true, lowercase: true, numbers: false, special: true}
     * ```
     */
    set valConfig(newConfig: ValConfigPartial) {
        if (newConfig instanceof Object && !(newConfig instanceof Array)) {
            this._valConfig = { ...this._valConfig, ...newConfig };
            this._valRegEx = this.createRegEx(this._valConfig);
        }
    }

    /**
     * Getter - returns a shallow copy of the current config for validating Passwords.
     */
    get valConfig(): Readonly<ValConfig> {
        return Object.freeze(Object.assign({}, this._valConfig));
    }
}

// ! CryptoPassword should extend Password in order to prevent DRY
// ? Everywhere the Password Class uses Math.random, reimplement function for usage of crypto.randomInt();
/**
 * @class
 * Class to instanciate new instances with configurable Options that uses the crypto Module.
 */
class CryptoPassword extends Password {
    /**
     * @constructor
     * @param genConfig Configuration Object for generating Passwords
     * @param valConfig Configuration Object for validating Passwords. Its worth noting that it will be checked if the true values exist at least once. All other characters are also allowed.
     */
    constructor(genConfig: GenConfig, valConfig: ValConfig) {
        super(genConfig, valConfig);
    }

    /**
     * Method that generates a Password with the saved genConfig.
     */
    generate() {
        if (this._genConfig.length && this._genConfig.length > 0) { // if value was set and bigger than 0
            let pw = '';
            const letters = 'abcdefghijklmnopqrstuvwxyz';
            const specials = `~\`!@#$%^&*()_-+={[}]|\\:;"'<,>.?/`;
            const counter: Counter = this.createGenerationCounters();
            const availableCounters = Object.keys(counter);
            const count = availableCounters.length;
            const removedCounters: string[] = [];
            for (let i = 0; i < this._genConfig.length; ++i) {
                const key = availableCounters[randomCrypto(0, availableCounters.length - 1)];
                if (key === 'lowercase') {
                    pw += letters.toLowerCase()[randomCrypto(0, letters.length - 1)];
                    counter.lowercase!++;
                } else if (key === 'uppercase') {
                    pw += letters.toUpperCase()[randomCrypto(0, letters.length - 1)];
                    counter.uppercase!++;
                } else if (key === 'numbers') {
                    pw += randomCrypto(0, 9).toString();
                    counter.numbers!++;
                } else { // symbols
                    if (typeof this._genConfig.special === 'boolean') { // use predefined specials
                        if (this._genConfig.special) pw += specials[randomCrypto(0, specials.length - 1)];
                        else pw += ' ';
                    } else { // use user defined specials
                        if (this._genConfig.special) {
                            pw += this._genConfig.special[randomCrypto(0, this._genConfig.special.length - 1)];
                        } else { // user defined nothing so just use spaces
                            pw += ' ';
                        }
                    }
                    counter.special!++;
                }
                if (this._genConfig.length - availableCounters.length - 1 < i) {
                    // 1. iterate through all counters
                    let used: string[] = [];
                    for (let i = 0; i < availableCounters.length; ++i) {
                        if (counter[availableCounters[i]] !== 0) { // already used 
                            used.push(availableCounters[i]);
                        }
                    }
                    if (used.length !== count) { // when there are things not used already
                        // remove one of the already used things out of the pool and add it to the removed pool
                        removedCounters.push(...availableCounters.splice(availableCounters.indexOf(used[randomCrypto(0, used.length - 1)]), 1));
                    } else { // everything already used -> restore availableCounters
                        availableCounters.push(...removedCounters.splice(0));
                    }
                }
            }
            return pw;
        }
        else {
            if (this._genConfig.length === 0) { // just return empty string
                return "";
            }
            if (this._genConfig.length < 0) { // throw error that invalid length
                throw new Error(`${this._genConfig.length} is not a valid length. Provide a positive Number.`)
            }
            throw new Error(`Invalid length property value "${this._genConfig.length}".`);
        }
    }

}

export { Password, CryptoPassword };

const pw = new CryptoPassword({
    length: 8,
    lowercase: true,
    numbers: true,
    special: true,
    uppercase: true
}, {
    minLength: 8
})
console.log(pw.genConfig);
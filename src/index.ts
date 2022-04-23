// import classes
import { Rater } from "./classes/rate.js";

// import util
import { randomMath, randomCrypto } from "./util/random.js";

// import types
import { GenConfig, ValConfig, GenConfigPartial, ValConfigPartial, RateConfig, RateConfigPartial } from "./types/config";
import { Counter } from "./types/counter";
import { ScanObject, ScanTuple } from "./types/general";
import { Tuple } from "./types/util";

/**
 * @class
 * Class to instanciate new instances with configurable Options.
 */
class Password {
    protected _genConfig: GenConfig;
    protected _valConfig: ValConfig;
    protected _valRegEx: RegExp;
    protected _raterInstance?: Rater;
    /**
     * @constructor
     * @param genConfig Configuration Object for generating Passwords
     * @param valConfig Configuration Object for validating Passwords. Its worth noting that it will be checked if the true values exist at least once. All other characters are also allowed.
     */
    constructor(genConfig: GenConfig, valConfig: ValConfig, rateConfig?: RateConfig) {
        this._genConfig = genConfig;
        this._valConfig = valConfig;
        this._valRegEx = this.createRegEx(valConfig);
        if (rateConfig) {
            this._raterInstance = new Rater(rateConfig);
        }
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
            const specials = `~\`!@#€$%^&*()_-+={[}]|\\:;"'<,>.?/`;
            const counter: Counter = this.createCounters();
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
                } else if (key === 'number') {
                    pw += randomMath(0, 9).toString();
                    counter.number!++;
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

    generateMany<T extends number>(count: T) {
        const pwArray: string[] = [];
        for (let i = 0; i < count; ++i) {
            pwArray.push(this.generate());
        }
        return pwArray as Tuple<string, T>;
    }

    /**
     * Method that rates a given Password.
     * @param password Password that should be rated.
     */
    rate(password: string) {

    }

    /**
     * Method that scans a given Password.
     * @param password Password that should be scanned.
     */
    scan(password: string, out: "tup"): ScanTuple;
    scan(password: string, out: "csv"): string;
    scan(password: string, out: "obj"): ScanObject;
    scan(password: string, out: "tup" | "csv" | "obj") {
        const regs = {
            U: new RegExp("[A-Z]", "g"),
            L: new RegExp("[a-z]", "g"),
            N: new RegExp("[0-9]", "g"),
            S: new RegExp(`[~\\\`!@#$€%^&*()_\\\-+={\\\[}\\\]|\\\\:;"'<,>\\\.?\\\/]`, "g")
        }
        const counters: Required<Counter> & { unknown: number } = {
            lowercase: 0,
            number: 0,
            special: 0,
            uppercase: 0,
            unknown: 0
        };
        const start = new Date().getTime();
        for (let i = 0; i < password.length; ++i) {
            if (password[i].match(regs.U)) counters.uppercase++;
            else if (password[i].match(regs.L)) counters.lowercase++;
            else if (password[i].match(regs.N)) counters.number++;
            else if (password[i].match(regs.S)) counters.special++;
            else counters.unknown++;
        }
        const time = new Date().getTime() - start;
        switch (out) {
            case "obj":
                return {
                    length: password.length,
                    lowercase: counters.lowercase,
                    uppercase: counters.uppercase,
                    number: counters.number,
                    special: counters.special,
                    unknown: counters.unknown,
                    time
                };
            case "csv":
                const keys = Object.keys(counters);
                // creating header line
                let csv = `length;`;
                for (let i = 0; i < 6; ++i) {
                    if (i === 0) {
                        for (let i = 0; i < keys.length; ++i) csv += keys[i] + ";";
                        csv += `time\n${password.length};`;
                    }
                    if (i !== 5) {
                        csv += `${counters[keys[i]]};`;
                    } else {
                        csv += `${time};`;
                    }
                }
                return csv;
            case "tup":
                return [
                    ["length", password.length],
                    ["lowercase", counters.lowercase],
                    ["uppercase", counters.uppercase],
                    ["number", counters.number],
                    ["special", counters.special],
                    ["unknown", counters.unknown],
                    ["time", time]
                ]
        }
    }

    /**
     * Method that shuffles a given Password.
     * @param password - Password that should be shuffled.
     * @param type - Shuffle type as a string.
     * 
     * Possible Values: 'Fisher-Yates' | 'Sort' | 'Overhand' | 'Riffle'
     * 
     * Default Value is 'Fisher-Yates'
     */
    shuffle(password: string, type: 'Fisher-Yates' | 'Sort' | 'Overhand' | 'Riffle' = 'Fisher-Yates') {
        let pw: string = '';
        let array = [...password];
        const len = array.length;
        switch (type) {
            case 'Fisher-Yates':
                // * well known implementation of the Fisher Yates Shuffle
                for (let i = array.length - 1; i > 0; --i) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                pw = array.join('');
                break;
            case 'Sort':
                // * Shuffle with javascript built in sort method
                array.sort(() => Math.random() - 0.5);
                pw = array.join('');
                break;
            case "Overhand":
                // * well known overhand shuffle
                // take some cards from the bottom (1 - 50%)
                // then drop a random amount to the top
                // repeat till no cards are left
                // this proccess will be repeated 12x

                // outer loop, defines the amount of shuffles
                for (let i = 0; i < 12; ++i) {
                    // take a stack of letters from the bottom
                    const stack = array.splice(Math.abs(array.length - randomMath(1, Math.round(array.length / 2))));
                    let finished = false;
                    while (!finished) {
                        if (stack.length === 0) { // stack is empty
                            finished = true;
                        } else {
                            // take random amount of elements of the stack
                            array.unshift(...stack.splice(0, randomMath(1, stack.length)))
                        }
                    }
                }
                pw = array.join('');
                break;
            case "Riffle":
                // * well known riffle shuffle
                // Split into halves
                // then interleave them
                // 12x

                // outer loop, defines the amount of shuffles
                for (let i = 0; i < 12; ++i) {
                    // copy the current array
                    const copy = [...array];
                    // splitting the copy into two halves
                    const half1 = copy.splice(0, len % 2 === 0 ? len / 2 : Math.ceil(len / 2));
                    const half2 = copy;
                    const tempArr: string[] = [];
                    let j = 0;
                    let finished = false;
                    // inner loop, controls the shuffle
                    while (!finished) {
                        let temp: string[];
                        // one of the halves empty -> put the other half on the bottom
                        if (half1.length === 0 || half2.length === 0) {
                            if (half1.length === 0) {
                                tempArr.push(...half2);
                            } else {
                                tempArr.push(...half1);
                            }
                            finished = true;
                        } else {
                            // in the first round decide who starts
                            if (j === 0) temp = randomMath(0, 1) === 0 ? half1.splice(0, randomMath(0, half1.length)) : half2.splice(0, randomMath(1, half2.length));
                            // in other rounds go by modulo
                            else temp = j % 2 === 0 ? half1.splice(0, randomMath(1, half1.length)) : half2.splice(0, randomMath(0, half2.length));
                            tempArr.push(...temp);
                        }
                        ++j;
                    }
                    array = tempArr;
                }
                pw = array.join('');
                break;
        }
        return pw;
    }

    /**
     * Method that creates the counter Object.
     */
    protected createCounters() {
        const counter: Counter = {};
        if (this._genConfig.lowercase) counter.lowercase = 0;
        if (this._genConfig.number) counter.number = 0;
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
        if (config.lowercase || config.number || config.uppercase || config.special) {
            if (config.lowercase) regString += "(?=.*[a-z])";
            if (config.uppercase) regString += "(?=.*[A-Z])";
            if (config.number) regString += "(?=.*\\\d)";
            if (config.special) {
                if (typeof config.special === 'boolean') { // if true use default value
                    regString += `(?=.*[~\\\`!@#€$%^&*()_\\\-+={\\\[}\\\]|\\\\:;"'<,>\\\.?\\\/])`;
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
     * pw.genConfig = {number: false}
     * // results in
     * console.log(pw.genConfig) // {length: 8, uppercase: true, lowercase: true, number: false, special: true}
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
     * pw.valConfig = {number: false}
     * // results in
     * console.log(pw.valConfig) // {minLength: 8, uppercase: true, lowercase: true, number: false, special: true}
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

    set rateConfig(newConfig: RateConfigPartial) {
        if (this._raterInstance) {
            // if there is already an instance
        } else {
            // create a new instance
            this._raterInstance = new Rater(newConfig);
        }
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
    constructor(genConfig: GenConfig, valConfig: ValConfig, rateConfig?: RateConfig) {
        super(genConfig, valConfig, rateConfig);
    }

    /**
     * Method that generates a Password with the saved genConfig.
     */
    generate() {
        if (this._genConfig.length && this._genConfig.length > 0) { // if value was set and bigger than 0
            let pw = '';
            const letters = 'abcdefghijklmnopqrstuvwxyz';
            const specials = `~\`!@#$%^&*()_-+={[}]|\\:;"'<,>.?/`;
            const counter: Counter = this.createCounters();
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
                } else if (key === 'number') {
                    pw += randomCrypto(0, 9).toString();
                    counter.number!++;
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

    /**
     * Method that shuffles a given Password.
     * @param password - Password that should be shuffled.
     * @param type - Shuffle type as a string.
     * 
     * Possible Values: 'Fisher-Yates' | 'Sort' | 'Overhand' | 'Riffle'
     * 
     * Default Value is 'Fisher-Yates'
     */
    shuffle(password: string, type: 'Fisher-Yates' | 'Sort' | 'Overhand' | 'Riffle' = 'Fisher-Yates') {
        let pw: string = '';
        let array = [...password];
        const len = array.length;
        switch (type) {
            case 'Fisher-Yates':
                // * well known implementation of the Fisher Yates Shuffle
                for (let i = array.length - 1; i > 0; --i) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                pw = array.join('');
                break;
            case 'Sort':
                // * Shuffle with javascript built in sort method
                array.sort(() => randomCrypto(0, 1) === 0 ? 1 : -1);
                pw = array.join('');
                break;
            case "Overhand":
                // * well known overhand shuffle
                // take some cards from the bottom (1 - 50%)
                // then drop a random amount to the top
                // repeat till no cards are left
                // this proccess will be repeated 12x

                // outer loop, defines the amount of shuffles
                for (let i = 0; i < 12; ++i) {
                    // take a stack of letters from the bottom
                    const stack = array.splice(Math.abs(array.length - randomCrypto(1, Math.round(array.length / 2))));
                    let finished = false;
                    while (!finished) {
                        if (stack.length === 0) { // stack is empty
                            finished = true;
                        } else {
                            // take random amount of elements of the stack
                            array.unshift(...stack.splice(0, randomCrypto(1, stack.length)))
                        }
                    }
                }
                pw = array.join('');
                break;
            case "Riffle":
                // * well known riffle shuffle
                // Split into halves
                // then interleave them
                // 12x

                // outer loop, defines the amount of shuffles
                for (let i = 0; i < 12; ++i) {
                    // copy the current array
                    const copy = [...array];
                    // splitting the copy into two halves
                    const half1 = copy.splice(0, len % 2 === 0 ? len / 2 : Math.ceil(len / 2));
                    const half2 = copy;
                    const tempArr: string[] = [];
                    let j = 0;
                    let finished = false;
                    // inner loop, controls the shuffle
                    while (!finished) {
                        let temp: string[];
                        // one of the halves empty -> put the other half on the bottom
                        if (half1.length === 0 || half2.length === 0) {
                            if (half1.length === 0) {
                                tempArr.push(...half2);
                            } else {
                                tempArr.push(...half1);
                            }
                            finished = true;
                        } else {
                            // in the first round decide who starts
                            if (j === 0) temp = randomCrypto(0, 1) === 0 ? half1.splice(0, randomCrypto(0, half1.length)) : half2.splice(0, randomCrypto(1, half2.length));
                            // in other rounds go by modulo
                            else temp = j % 2 === 0 ? half1.splice(0, randomCrypto(1, half1.length)) : half2.splice(0, randomCrypto(0, half2.length));
                            tempArr.push(...temp);
                        }
                        ++j;
                    }
                    array = tempArr;
                }
                pw = array.join('');
                break;
        }
        return pw;
    }

}

export { Password, CryptoPassword };

const pw = new Password({
    length: 8,
    lowercase: true,
    number: true,
    special: true,
    uppercase: true
}, {
    minLength: 1
});
const pass = pw.generate();
console.log({ pass });
const tup = pw.scan(pass, "tup");
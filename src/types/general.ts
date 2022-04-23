type ScanObject = {
    /**
     * length of scanned password.
     */
    length: number,
    /**
     * amount of lowercase letters.
     */
    lowercase: number,
    /**
     * amount of uppercase letters.
     */
    uppercase: number,
    /**
     * amount of numbers.
     */
    number: number,
    /**
     * amount of special characters.
     */
    special: number,
    /**
     * amount of unknown characters.
     */
    unknown: number
    /**
     * time in milliseconds of the scanning.
     */
    time: number,
};

type ScanTuple = [
    ["length", number],
    ["lowercase", number],
    ["uppercase", number],
    ["number", number],
    ["special", number],
    ["unknown", number],
    ["time", number]
];

export { ScanObject, ScanTuple };
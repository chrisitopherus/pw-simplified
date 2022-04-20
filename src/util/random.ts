// import modules
import { randomInt } from 'crypto';

const randomMath = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomCrypto = (min: number, max: number) => randomInt(min, max + 1);

export { randomMath, randomCrypto };
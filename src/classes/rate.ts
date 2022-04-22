import { RateConfig } from "../types/config"
export class Rater {
    private _rateConfig: RateConfig;
    constructor(rateConfig: RateConfig) {
        this._rateConfig = rateConfig;
    }

    get rateConfig(): Readonly<RateConfig> {
        return Object.freeze(Object.assign({}, this._rateConfig));
    }

    set rateConfig(newConfig: RateConfig) {

    }
}
/**
 * @interface GenConfig
 */
interface GenConfig {
    length: number;
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    special?: string | boolean;
}

type GenConfigPartial = Partial<GenConfig>;

/**
 * @interface ValConfig
 */
interface ValConfig {
    minLength: number;
    maxLength?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    special?: boolean;
}

type ValConfigPartial = Partial<ValConfig>;

/**
 * @interface RateConfig
 */
interface RateConfig {

}

export { GenConfig, GenConfigPartial, ValConfig, ValConfigPartial };
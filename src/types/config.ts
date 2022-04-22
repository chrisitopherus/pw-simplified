/**
 * @interface GenConfig
 */
interface GenConfig {
    /**
     * defines the length of the generated password.
     */
    length: number;
    /**
     * defines if the generated password should include uppercase letters.
     */
    uppercase?: boolean;
    /**
     * defines if the generated password should include lowercase letters.
     */
    lowercase?: boolean;
    /**
     * defines if the generated password should include numbers.
     */
    number?: boolean;
    /**
     * defines if the generated password should include special characters.
     */
    special?: string | boolean;
};

type GenConfigPartial = Partial<GenConfig>;

/**
 * @interface ValConfig
 */
interface ValConfig {
    /**
     * defines the minimum length of a valid password.
     */
    minLength: number;
    /**
     * defines the maximum length of a valid password.
     * 
     * if not provided or undefined, then there is no max.
     */
    maxLength?: number;
    /**
     * defines that a valid password must include at least one uppercase letter.
     */
    uppercase?: boolean;
    /**
     * defines that a valid password must include at least one lowercase letter.
     */
    lowercase?: boolean;
    /**
     * defines that a valid password must include at least one number.
     */
    number?: boolean;
    /**
     * defines that a valid password must include at least one special character.
     */
    special?: boolean;
};

type ValConfigPartial = Partial<ValConfig>;

type PointRange = {
    /**
     * defines min points for getting this grade.
     */
    from: number,
    /**
     * defines max points for getting this grade.
     */
    to: number,
    /**
     * defines the order of this grade.
     * 
     * Lower number meaning lower grade, regardless of the range.
     */
    order: number
};

type PointMax = {
    /**
     * defines the amount of occurences to receive the defined points.
     */
    amount: number,
    /**
     * defines the maximum points that are given for matching the amount.
     */
    points: number
};

/**
 * @interface RateConfig
 * 
 * In order to provide an easy to use Config, I came up with the idea of giving points and setting point boundaries.
 */
interface RateConfig {
    /**
     * defines the form of how the rating output should look like.
     * 
     * from very weak to very strong
     * 
     * `numeric` - 1,2,3,4,5
     * 
     * `symbol` - #,##,###,####,#####
     * 
     * `full` - "very weak", "weak", "medium", "strong", "very strong"
     */
    type?: "numeric" | "symbol" | "full",
    /**
     * define your own system within this property.
     * 
     * If not set or undefined the default system is used.
     */
    system?: {
        /**
         * defines how many points are given for certain symbols.
         */
        pointsEach?: {
            /**
             * defines how many points should be given for each character of a password.
             */
            character: number,
            /**
             * defines how many points should be given for each lowercase letter of a password.
             */
            lowercase: number,
            /**
             * defines how many points should be given for each uppercase letter of a password.
             */
            uppercase: number,
            /**
             * defines how many points should be given for each number of a password.
             */
            number: number,
            /**
             * defines how many points should be given for each special of a password.
             */
            special: number
        },
        /**
         * defines how many maximum points given for specific amount of occurences.
         */
        points?: {
            /**
             * defines maximum points given for a specific amount of characters.
             */
            character: PointMax,
            /**
             * defines maximum points given for a specific amount of lowercase letters.
             */
            lowercase: PointMax,
            /**
             * defines maximum points given for a specific amount of uppercase letters.
             */
            uppercase: PointMax,
            /**
             * defines maximum points given for a specific amount of numbers.
             */
            number: PointMax,
            /**
             * defines maximum points given for a specific amount of special characters.
             */
            special: PointMax
        }
        /**
         * defines the name of the grades as well as their point ranges and order.
         */
        ranges: {
            /**
             * A grade for the password.
             */
            [grade: string]: PointRange
        },
        /**
         * defines the form of how the rating output should look like.
         * 
         * `numeric` - 1,2,3,...
         * 
         * `full` - will use the defined grade names in `system.ranges`.
         */
        type: "numeric" | "full"
    }
};

export { GenConfig, GenConfigPartial, ValConfig, ValConfigPartial, RateConfig, PointRange, PointMax };
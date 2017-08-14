// @flow
declare module 'bignumber.js' {

    declare export type AnyNumber = number | string | BigNumber

    declare type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

    declare export type Format = {
        decimalSeparator: string,
        groupSeparator: string,
        groupSize: number,
        secondaryGroupSize: number,
        fractionGroupSeparator: string,
        fractionGroupSize: number
    }

    declare export type Config = {
        DECIMAL_PLACES: number,
        ROUNDING_MODE: RoundingMode,
        EXPONENTIAL_AT: number | [number, number],
        RANGE: number | [number, number],
        ERRORS: boolean | 0 | 1,
        CRYPTO: boolean | 0 | 1,
        MODULO_MODE: RoundingMode | 9,
        POW_PRECISION: number,
        FORMAT: Format
    }

    declare class BigNumber {
        static ROUND_UP: 0;
        static ROUND_DOWN: 1;
        static ROUND_CEIL: 2;
        static ROUND_FLOOR: 3;
        static ROUND_HALF_UP: 4;
        static ROUND_HALF_DOWN: 5;
        static ROUND_HALF_EVEN: 6;
        static ROUND_HALF_CEIL: 7;
        static ROUND_HALF_FLOOR: 8;

        static another(config?: Config): Class<BigNumber>;
        static config(config?: Config): Config;
        static set(config: Config): void;
        static min(...nums: AnyNumber[]): BigNumber;
        static max(...nums: AnyNumber[]): BigNumber;
        static random(dp?: number): BigNumber;

        static(value: AnyNumber, base?: number): BigNumber;
        constructor(value: AnyNumber, base?: number): BigNumber;

        absoluteValue(): BigNumber;
        abs(): BigNumber;

        ceil(): BigNumber;

        comparedTo(n: AnyNumber, base?: number): null | -1 | 0 | 1;
        cmp(n: AnyNumber, base?: number): null | -1 | 0 | 1;

        decimalPlaces(): ?number;
        dp(): ?number;

        dividedBy(n: AnyNumber, base?: number): BigNumber;
        div(n: AnyNumber, base?: number): BigNumber;

        dividedToIntegerBy(n: AnyNumber, base?: number): BigNumber;
        divToInt(n: AnyNumber, base?: number): BigNumber;

        equals(n: AnyNumber, base?: number): boolean;
        eq(n: AnyNumber, base?: number): boolean;

        floor(): BigNumber;

        greaterThan(n: AnyNumber, base?: number): boolean;
        gt(n: AnyNumber, base?: number): boolean;

        greaterThanOrEqualTo(n: AnyNumber, base?: number): boolean;
        gte(n: AnyNumber, base?: number): boolean;

        isFinite(): boolean;

        isInteger(): boolean;

        isNaN(): boolean;

        isNegative(): boolean;

        isZero(): boolean;

        lessThan(n: AnyNumber, base?: number): boolean;
        lt(n: AnyNumber, base?: number): boolean;

        lessThanOrEqualTo(n: AnyNumber, base?: number): boolean;
        lte(n: AnyNumber, base?: number): boolean;

        minus(n: AnyNumber, base?: number): BigNumber;

        modulo(n: AnyNumber, base?: number): BigNumber;
        mod(n: AnyNumber, base?: number): BigNumber;

        negated(): BigNumber;
        neg(): BigNumber;

        plus(n: AnyNumber, base?: number): BigNumber;

        precision(z?: boolean| 0 | 1): number;
        sd(z?: boolean| 0 | 1): number;

        round(dp?: number, rm?: RoundingMode): BigNumber;

        shift(n: number): BigNumber;

        squareRoot(): BigNumber;
        sqrt(): BigNumber;

        times(n: AnyNumber, base?: number): BigNumber;

        toDigits(dp?: number, rm?: RoundingMode): BigNumber;

        toExponential(dp?: number, rm?: RoundingMode): string;

        toFixed(dp?: number, rm?: RoundingMode): string;

        toFormat(dp?: number, rm?: RoundingMode): string;

        toFraction(max?: AnyNumber): [string, string];

        toJSON(): string;

        toNumber(): number;

        toPower(n: number, m?: AnyNumber): BigNumber;
        pow(n: number, m?: AnyNumber): BigNumber;

        toPrecision(sd?: number, rm?: RoundingMode): string;

        toString(base?: number): string;

        valueOf(): string;

        c: number[];
        e: number;
        s: number;
    }

    declare module.exports: typeof BigNumber;
}
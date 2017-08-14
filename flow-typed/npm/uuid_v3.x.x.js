// flow-typed signature: 963ee02a34dbe8a30fd13393dcd292bf
// flow-typed version: b43dff3e0e/uuid_v3.x.x/flow_>=v0.32.x

declare module 'uuid' {
  declare function v1(options?: {|
    node?: number[],
    clockseq?: number,
    msecs?: number | Date,
    nsecs?: number,
  |}, buffer?: number[] | Buffer, offset?: number): string;
  declare function v4(options?: {|
    random?: number[],
    rng?: () => number[] | Buffer,
  |}, buffer?: number[] | Buffer, offset?: number): string;
}

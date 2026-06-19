type BuildTuple<
  Length extends number,
  Accumulator extends unknown[] = []
> = Accumulator["length"] extends Length
  ? Accumulator
  : BuildTuple<Length, [...Accumulator, unknown]>;

type Add<A extends number, B extends number> = [
  ...BuildTuple<A>,
  ...BuildTuple<B>
]["length"];

type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

type Example = DeepReadonly<{
  user: {
    id: string;
    profile: {
      name: string;
      tags: string[];
      nested: {
        score: Add<20, 22>;
      };
    };
  };
}>;

const example: Example = {
  user: {
    id: "demo",
    profile: {
      name: "TSPerf",
      tags: ["typescript", "performance"],
      nested: {
        score: 42
      }
    }
  }
};

example.user.profile.nested.score;


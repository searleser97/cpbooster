import Util from "../Util";

describe("sequence creation", () => {
  test("common scenario", () => {
    expect(Util.sequence(0, 3)).toEqual([0, 1, 2]);
    expect(Util.sequence(2, 5)).toEqual([2, 3, 4]);
  });

  it("should return empty when start > end", () => {
    expect(Util.sequence(3, 1)).toEqual([]);
  });

  it("should return empty when start == end", () => {
    expect(Util.sequence(3, 3)).toEqual([]);
  });

  it("should return correct sequence even with negative numbers", () => {
    expect(Util.sequence(-5, 5)).toEqual([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
  });

  it("should return sequence of size one when `end` is equal to `start + 1`", () => {
    expect(Util.sequence(3, 4)).toEqual([3]);
    expect(Util.sequence(0, 1)).toEqual([0]);
  });
});

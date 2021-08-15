import Util from "../Util";

describe("Util.test", () => {
  describe("sequence creation", () => {
    it("should return increasing sequence", () => {
      expect(Util.sequence(-10, -5)).toEqual([-10, -9, -8, -7, -6]);
      expect(Util.sequence(-5, 5)).toEqual([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4]);
      expect(Util.sequence(0, 3)).toEqual([0, 1, 2]);
    });

    it("should return decreasing sequence", () => {
      expect(Util.sequence(3, 0)).toEqual([3, 2, 1]);
      expect(Util.sequence(3, -3)).toEqual([3, 2, 1, 0, -1, -2]);
      expect(Util.sequence(-5, -10)).toEqual([-5, -6, -7, -8, -9]);
    });

    it("should return empty array when start == end", () => {
      expect(Util.sequence(3, 3)).toEqual([]);
      expect(Util.sequence(0, 0)).toEqual([]);
      expect(Util.sequence(-2, -2)).toEqual([]);
    });

    it("should return sequence of size one containing just `start` when end - start == 1", () => {
      expect(Util.sequence(3, 4)).toEqual([3]);
      expect(Util.sequence(-1, 0)).toEqual([-1]);
      expect(Util.sequence(-2, -1)).toEqual([-2]);
    });

    it("should return sequence of size one containing just `start` when start - end == 1", () => {
      expect(Util.sequence(4, 3)).toEqual([4]);
      expect(Util.sequence(0, -1)).toEqual([0]);
      expect(Util.sequence(-1, -2)).toEqual([-1]);
    });
  });

  describe("replaceExtraDotsWithUnderscore()", () => {
    test("common scenario", () => {
      expect(Util.replaceExtraDotsWithUnderscore("A.DistanceAndAxis.cpp")).toEqual(
        "A_DistanceAndAxis.cpp"
      );
    });

    it("should keep the same name if no dots in it", () => {
      expect(Util.replaceExtraDotsWithUnderscore("A_DistanceAndAxis.cpp")).toEqual(
        "A_DistanceAndAxis.cpp"
      );
    });

    it("should replace all dots with underscore except extension", () => {
      expect(Util.replaceExtraDotsWithUnderscore("A.Distance.And.Axis.cpp")).toEqual(
        "A_Distance_And_Axis.cpp"
      );
    });
  });
});

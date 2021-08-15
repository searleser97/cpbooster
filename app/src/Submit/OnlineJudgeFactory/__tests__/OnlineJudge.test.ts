import Config from "../../../Config/Config";

describe("OnlineJudge.ts", () => {
  describe("test languages Record<string, LangConfig>", () => {
    it("should return undefined when key does not exists in languages", () => {
      const config = new Config();
      expect(config.languages["unknownExtension"]).toEqual(undefined);
    });
  });
});

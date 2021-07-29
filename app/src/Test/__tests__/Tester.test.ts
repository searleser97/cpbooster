import Tester from "../TesterFactory/Tester";
import * as fs from "fs";

jest.mock("fs");

describe("test getMaxTestCaseId", () => {
  const problemName = "problemName";
  const problemFilePath = `${problemName}.cpp`;
  const readdirSyncMock = fs.readdirSync as jest.Mock;
  beforeEach(() => {
    readdirSyncMock.mockReset();
  });
  test("common scenario", () => {
    readdirSyncMock.mockReturnValue([
      `${problemName}.in1`,
      `${problemName}.ans1`,
      `${problemName}.in2`,
      `${problemName}.ans2`,
      `${problemName}.in3`,
      `${problemName}.ans3`
    ]);
    expect(Tester.getMaxTestCaseId(problemFilePath)).toEqual(3);
  });

  it("should return 0 when there are no testcases files", () => {
    readdirSyncMock.mockReturnValue([]);
    expect(Tester.getMaxTestCaseId(problemName)).toEqual(0);
  });

  it("should return the max id even when the sequence is not continuous", () => {
    readdirSyncMock.mockReturnValue([
      `${problemName}.in1`,
      `${problemName}.ans1`,
      `${problemName}.in3`,
      `${problemName}.ans3`,
      `${problemName}.in6`,
      `${problemName}.ans6`
    ]);
    expect(Tester.getMaxTestCaseId(problemFilePath)).toEqual(6);
  });
});

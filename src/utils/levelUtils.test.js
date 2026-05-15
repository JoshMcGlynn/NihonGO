import { describe, it, expect } from "vitest";
import { calculateLevelData } from "./levelUtils";

describe("calculateLevelData", () => {
  it("returns level 1 for 0 XP", () => {
    const result = calculateLevelData(0);

    expect(result.level).toBe(1);
    expect(result.xpIntoLevel).toBe(0);
    expect(result.progressPercent).toBe(0);
    expect(result.xpNeeded).toBe(100);
  });

  it("keeps the user at level 1 below 100XP", () => {
    const result = calculateLevelData(99);

    expect(result.level).toBe(1);
    expect(result.xpIntoLevel).toBe(99);
    expect(result.progressPercent).toBe(99);
    });

  it("returns level 2 at exactly 100 XP", () => {
    const result = calculateLevelData(100);

    expect(result.level).toBe(2);
    expect(result.xpIntoLevel).toBe(0);
    expect(result.progressPercent).toBe(0);
  });

  it("calculates progress correctly within a level", () => {
    const result = calculateLevelData(1450);

    expect(result.level).toBe(15);
    expect(result.xpIntoLevel).toBe(50);
    expect(result.progressPercent).toBe(50);
  });

  it("returns level 16 at 1500XP", () => {
    const result = calculateLevelData(1500);

    expect(result.level).toBe(16);
    expect(result.xpIntoLevel).toBe(0);
    expect(result.progressPercent).toBe(0);
  });

});
jest.mock("@/services/api", () => ({
  api: { patch: jest.fn() },
}));

import { api } from "@/services/api";
import { ReadingStreakService } from "@/services/ReadingStreakService";

const mockedApi = api as jest.Mocked<typeof api>;

const streakData = {
  currentStreak: 5,
  longestStreak: 10,
  lastReadAt: "2026-06-29",
  alreadyDoneToday: false,
};

describe("ReadingStreakService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("faz PATCH para /members/reading-streak e retorna os dados", async () => {
    mockedApi.patch.mockResolvedValue({ data: { data: streakData } });
    const result = await ReadingStreakService.markToday();
    expect(mockedApi.patch).toHaveBeenCalledWith("/members/reading-streak");
    expect(result).toEqual(streakData);
  });

  it("propaga erro de rede", async () => {
    mockedApi.patch.mockRejectedValue(new Error("timeout"));
    await expect(ReadingStreakService.markToday()).rejects.toThrow("timeout");
  });
});

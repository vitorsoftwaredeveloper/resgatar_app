import { api } from "./api";

export interface IReadingStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadAt: string | null;
  alreadyDoneToday: boolean;
}

export const ReadingStreakService = {
  async markToday(): Promise<IReadingStreak> {
    const { data } = await api.patch("/members/reading-streak");
    return data.data;
  },
};

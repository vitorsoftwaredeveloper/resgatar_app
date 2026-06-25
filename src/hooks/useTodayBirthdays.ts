import { MemberServices } from "@/services/MemberService";
import { IMember } from "@/types/Member";
import { useEffect, useState } from "react";

function parseBirthDate(dateOfBirth: string | number): { day: number; month: number } | null {
  if (!dateOfBirth) return null;
  const numeric = Number(dateOfBirth);
  const ts = !isNaN(numeric) ? numeric : Date.parse(dateOfBirth as string);
  if (isNaN(ts)) return null;
  const d = new Date(ts);
  return { day: d.getUTCDate(), month: d.getUTCMonth() };
}

export function useTodayBirthdays(): number {
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();

    MemberServices.listBirthdayMembers()
      .then((data: IMember[]) => {
        const count = data.filter((m) => {
          const parsed = parseBirthDate(m.dateOfBirth);
          return parsed !== null && parsed.day === currentDay && parsed.month === currentMonth;
        }).length;
        setTodayCount(count);
      })
      .catch(() => {});
  }, []);

  return todayCount;
}

import { useEffect, useState } from "react";

function isHKMarketOpen(day: number, hour: number, minute: number): boolean {
  if (day === 0 || day === 6) return false;
  const minutes = hour * 60 + minute;
  const morning = minutes >= 9 * 60 + 30 && minutes < 12 * 60;
  const afternoon = minutes >= 13 * 60 && minutes < 16 * 60;
  return morning || afternoon;
}

export function HKClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hkFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Hong_Kong",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const hkTimeString = hkFormatter.format(now);

  const parts = hkFormatter.formatToParts(now);
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Hong_Kong",
    weekday: "short",
  });
  const dayIndexMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  const hkDay = dayIndexMap[dayFormatter.format(now)] ?? 0;
  const open = isHKMarketOpen(hkDay, hour, minute);

  return (
    <div className="hk-clock">
      <span className={`hk-clock__dot ${open ? "hk-clock__dot--live" : ""}`} />
      <div className="hk-clock__text">
        <span className="hk-clock__label">HKT</span>
        <span className="hk-clock__time">{hkTimeString}</span>
      </div>
    </div>
  );
}

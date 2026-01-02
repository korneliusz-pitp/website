export interface EventDateTimeInfo {
  startDateTime: Date | null;
  endDateTime: Date | null;
  formattedDate: string | null;
  formattedTimeRange: string | null;
  isUpcoming: boolean;
  isPast: boolean;
}

export const getEventDateTime = (
  eventDate?: string,
  eventTime?: { start?: string; end?: string }
): EventDateTimeInfo => {
  const startDateTime = (() => {
    if (!eventDate) return null;
    const datePart = eventDate;
    const start = eventTime?.start ?? "00:00:00";
    const isoString = `${datePart}T${start}${start.includes("Z") ? "" : "Z"}`;
    const dt = new Date(isoString);
    return Number.isNaN(dt.getTime()) ? null : dt;
  })();

  const endDateTime = (() => {
    if (!eventDate || !eventTime?.end) return null;
    const datePart = eventDate;
    const end = eventTime.end;
    const isoString = `${datePart}T${end}${end.includes("Z") ? "" : "Z"}`;
    const dt = new Date(isoString);
    return Number.isNaN(dt.getTime()) ? null : dt;
  })();

  const formattedDate = (() => {
    const dt =
      startDateTime || (eventDate ? new Date(`${eventDate}T00:00:00Z`) : null);
    if (!dt) return null;
    return dt.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  })();

  const formattedTimeRange = (() => {
    const formatTime = (dt: Date) =>
      dt.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

    if (startDateTime && endDateTime) {
      return `${formatTime(startDateTime)} – ${formatTime(endDateTime)}`;
    }
    if (startDateTime) {
      return formatTime(startDateTime);
    }
    if (endDateTime) {
      return formatTime(endDateTime);
    }
    return null;
  })();

  const now = new Date();
  const isUpcoming = startDateTime ? startDateTime >= now : true;
  const isPast = startDateTime ? startDateTime < now : false;

  return {
    startDateTime,
    endDateTime,
    formattedDate,
    formattedTimeRange,
    isUpcoming,
    isPast,
  };
};

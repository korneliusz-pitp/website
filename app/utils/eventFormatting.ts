export interface EventDateTimeInfo {
  startDateTime: Date | null
  endDateTime: Date | null
  formattedDate: string | null
  formattedTimeRange: string | null
  isUpcoming: boolean
  isPast: boolean
}

const EVENT_TIME_ZONE = 'Europe/London'

const normalizeDate = (value?: string): string | null => {
  if (!value) return null
  const datePart = value.split('T')[0] || ''
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : null
}

const parseTime = (
  value?: string,
): { hour: number, minute: number, second: number, isUtc: boolean } | null => {
  if (!value) return null
  const isUtc = value.endsWith('Z')
  const cleanValue = isUtc ? value.slice(0, -1) : value
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(cleanValue)
  if (!match) return null
  return {
    hour: Number(match[1]),
    minute: Number(match[2]),
    second: Number(match[3] ?? '0'),
    isUtc,
  }
}

const getTimeZoneOffsetMinutes = (date: Date, timeZone: string): number => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const values = Object.fromEntries(
    parts
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, part.value]),
  ) as Record<string, string>

  const localIso = `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}Z`
  const localAsUtc = new Date(localIso)

  return (localAsUtc.getTime() - date.getTime()) / 60000
}

const buildEventDateTime = (
  eventDate?: string,
  eventTime?: string,
): Date | null => {
  const datePart = normalizeDate(eventDate)
  if (!datePart) return null

  const parsedTime = parseTime(eventTime ?? '00:00:00')
  if (!parsedTime) return null

  const [year, month, day] = datePart.split('-').map(Number)
  if (!year || !month || !day) return null

  if (parsedTime.isUtc) {
    const iso = `${datePart}T${String(parsedTime.hour).padStart(2, '0')}:${String(parsedTime.minute).padStart(2, '0')}:${String(parsedTime.second).padStart(2, '0')}Z`
    const dt = new Date(iso)
    return Number.isNaN(dt.getTime()) ? null : dt
  }

  const baseUtc = new Date(
    Date.UTC(year, month - 1, day, parsedTime.hour, parsedTime.minute, parsedTime.second),
  )
  const offsetMinutes = getTimeZoneOffsetMinutes(baseUtc, EVENT_TIME_ZONE)
  const dt = new Date(baseUtc.getTime() - offsetMinutes * 60000)
  return Number.isNaN(dt.getTime()) ? null : dt
}

export const getEventDateTime = (
  eventDate?: string,
  eventTime?: { start?: string, end?: string },
): EventDateTimeInfo => {
  const startDateTime = buildEventDateTime(eventDate, eventTime?.start)
  const endDateTime = buildEventDateTime(eventDate, eventTime?.end)

  const formattedDate = (() => {
    const datePart = normalizeDate(eventDate)
    const dt = startDateTime || (datePart ? buildEventDateTime(datePart) : null)
    if (!dt) return null
    return dt.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: EVENT_TIME_ZONE,
    })
  })()

  const formattedTimeRange = (() => {
    const formatTime = (dt: Date) =>
      dt.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: EVENT_TIME_ZONE,
        hour12: false,
      })

    if (startDateTime && endDateTime) {
      return `${formatTime(startDateTime)} – ${formatTime(endDateTime)}`
    }
    if (startDateTime) {
      return formatTime(startDateTime)
    }
    if (endDateTime) {
      return formatTime(endDateTime)
    }
    return null
  })()

  const now = new Date()
  const isUpcoming = startDateTime ? startDateTime >= now : true
  const isPast = startDateTime ? startDateTime < now : false

  return {
    startDateTime,
    endDateTime,
    formattedDate,
    formattedTimeRange,
    isUpcoming,
    isPast,
  }
}

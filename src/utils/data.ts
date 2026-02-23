// UTC 시간을 KST로 변환하는 함수
export function formatUtcToKst(utcDateString: string): string {
  if (!utcDateString || utcDateString === "마감일 없음") return utcDateString;

  try {
    const dateInUtc: Date = new Date(utcDateString);
    if (isNaN(dateInUtc.getTime())) return utcDateString;

    const kstString: string = dateInUtc.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      hour12: false,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    return kstString;
  } catch (error) {
    console.warn('Error converting UTC to KST:', error);
    return utcDateString;
  }
}

// 날짜만 포맷팅 (YYYY-MM-DD)
export function formatUtcToKstDate(utcDateString: string): string {
  if (!utcDateString || utcDateString === "마감일 없음") return utcDateString;

  try {
    const dateInUtc: Date = new Date(utcDateString);
    if (isNaN(dateInUtc.getTime())) return utcDateString;

    return dateInUtc.toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Error converting UTC to KST date:', error);
    return utcDateString;
  }
}
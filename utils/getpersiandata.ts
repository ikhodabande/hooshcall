export const getPersianDateAndTime = (gmtString: string) => {
  const date = new Date(gmtString);

  const persianDate = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);

  const persianTime = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

  return {
    date: persianDate,
    time: persianTime,
  };
};

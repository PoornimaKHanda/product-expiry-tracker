export const isWithinNextDays = (dateStr: string, days: number) => {
    const today = new Date();
    const target = new Date(dateStr);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 0 && diffDays <= days;
};

export const formatDate = (dateStr: string) => {
    return new Date(dateStr).toDateString();
};

export function addYears(dateStr: string, years: number): string {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setFullYear(date.getFullYear() + years);
    const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${formattedMonth}-${formattedDay}`;
}

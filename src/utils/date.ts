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

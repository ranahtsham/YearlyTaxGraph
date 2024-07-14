export function calculateTaxPercentage(total: number, tax: number): number {
    if (total <= 0 || tax < 0) {
        return 0;
    }

    if (tax > total){
        return 100;
    }

    return (tax / total) * 100;
}

export const getTotalDaysInYear = (year: number): number => {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    const diff = end.getTime() - start.getTime();
    return diff / (1000 * 60 * 60 * 24);
};


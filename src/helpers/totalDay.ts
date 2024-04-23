export function getDayByMonthAndYear(year: number, month: number) {
    const totalDay = new Date(year, month, 0).getDate();

    const listDay = [];

    for (let day = 1; day <= totalDay; day++) {
        listDay.push(new Date(year, month - 1, day).getDate());
    }

    return listDay;
}

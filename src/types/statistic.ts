export interface IStatisticCount {
    deliveredCount: number;
    orderedCount: number;
    registeredCount: number;
    shippingCount: number;
}

export interface IStaticMonth {
    apr: number;
    aug: number;
    dec: number;
    feb: number;
    jan: number;
    jul: number;
    jun: number;
    mar: number;
    may: number;
    nov: number;
    oct: number;
    sep: number;
}

export interface IStatisticStatusOrder {
    canceled: number;
    deliveried: number;
    ordered: number;
    processing: number;
    shipping: number;
    wait_for_pay: number;
}

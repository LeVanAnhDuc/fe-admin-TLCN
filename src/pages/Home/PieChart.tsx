import { PieChart } from '@mui/x-charts/PieChart';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { getOrderStatisticByDaily, getOrderStatisticByMonth, getOrderStatisticByYear } from '../../apis/statisticApi';
import { IStatisticStatusOrder } from '../../interface/statistic';
import helpers from '../../helpers';
import { convertNumberToTwoChar } from '../../utils/convertData';

export default function BasicPie() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();
    const totalYearSincePay = currentYear - 2023 + 1;

    const [data, setData] = useState<IStatisticStatusOrder>();
    const [year, setYear] = useState<number>(currentYear);
    const [month, setMonth] = useState<number>(currentMonth);
    const [day, setDay] = useState<number>(currentDay);
    const [daysOfMonthYear, setDaysOfMonthYear] = useState<number[]>([]);

    const handleChangeYear = (event: SelectChangeEvent) => {
        setYear(parseInt(event.target.value));
    };

    const handleChangeMonth = (event: SelectChangeEvent) => {
        setMonth(parseInt(event.target.value));
    };

    const handleChangeDay = (event: SelectChangeEvent) => {
        setDay(parseInt(event.target.value));
    };

    const handleGetDataStatisticByDaily = async (date: string) => {
        try {
            const response = await getOrderStatisticByDaily(date);

            if (response.status === 200) {
                setData(response.data);
            } else {
                toast.error(response.data.message | response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleGetDataStatisticByMonth = async (monthSelect: number, yearSelect: number) => {
        try {
            const response = await getOrderStatisticByMonth(monthSelect, yearSelect);

            if (response.status === 200) {
                setData(response.data);
            } else {
                toast.error(response.data.message | response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleGetDataStatisticByYear = async (yearSelect: number) => {
        try {
            const response = await getOrderStatisticByYear(yearSelect);

            if (response.status === 200) {
                setData(response.data);
            } else {
                toast.error(response.data.message | response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    useEffect(() => {
        if (!day) {
            if (!month) {
                handleGetDataStatisticByYear(year);
            } else {
                handleGetDataStatisticByMonth(month, year);
            }
        } else {
            const dateConvert: string = `${convertNumberToTwoChar(day)}/${convertNumberToTwoChar(month)}/${year}`;
            handleGetDataStatisticByDaily(dateConvert);
        }
    }, [year, month, day]);

    useEffect(() => {
        setDaysOfMonthYear(helpers.getDayByMonthAndYear(year, month));
    }, [year, month]);

    if (!data) {
        return null;
    }

    return (
        <>
            <div className="grid gap-3">
                <div className="w-full grid grid-cols-3 gap-4">
                    <FormControl fullWidth>
                        <InputLabel>Năm</InputLabel>
                        <Select className="text-center" value={year.toString()} label="Năm" onChange={handleChangeYear}>
                            {Array(totalYearSincePay)
                                .fill(null)
                                .map((_, index) => {
                                    const year = currentYear - index;
                                    return (
                                        <MenuItem value={year} key={index}>
                                            {year}
                                        </MenuItem>
                                    );
                                })}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Tháng</InputLabel>
                        <Select
                            className="text-center"
                            value={month.toString()}
                            label="Tháng"
                            onChange={handleChangeMonth}
                        >
                            <MenuItem value={''}>Bỏ chọn</MenuItem>
                            {Array(12)
                                .fill(null)
                                .map((_, index) => (
                                    <MenuItem value={index + 1} key={index}>
                                        Tháng {index + 1}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Ngày</InputLabel>
                        <Select className="text-center" value={day.toString()} label="Ngày" onChange={handleChangeDay}>
                            <MenuItem value={''}>Bỏ chọn</MenuItem>
                            {daysOfMonthYear.map((item, index) => (
                                <MenuItem value={item} key={index}>
                                    Ngày {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="w-full text-center font-bold">
                    Biểu đồ thông kê đơn hàng năm {convertNumberToTwoChar(day)}-{convertNumberToTwoChar(month)}-{year}
                </div>
            </div>
            <PieChart
                series={[
                    {
                        data: [
                            { id: 0, value: data.wait_for_pay, label: 'Chờ thanh toán' },
                            { id: 1, value: data.ordered, label: 'Đã đặt hàng' },
                            { id: 2, value: data.processing, label: 'Đang xử lý' },
                            { id: 3, value: data.shipping, label: 'Đang giao' },
                            { id: 4, value: data.deliveried, label: 'Đã giao' },
                            { id: 5, value: data.canceled, label: 'Đã hủy' },
                        ],
                        cornerRadius: 5,
                        innerRadius: 30,
                        outerRadius: 100,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                ]}
                slotProps={{
                    legend: {
                        labelStyle: {
                            fontSize: 16,
                            fontWeight: 600,
                        },
                    },
                }}
                height={200}
            />
        </>
    );
}

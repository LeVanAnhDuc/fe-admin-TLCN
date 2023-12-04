import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import LockOpenTwoTone from '@mui/icons-material/LockOpenTwoTone';
import LockTwoTone from '@mui/icons-material/LockTwoTone';
import InfoTwoTone from '@mui/icons-material/InfoTwoTone';
import { styled } from '@mui/material/styles';

import config from '../../config';
import Search from '../../components/Search/Search';
import { changeLockUnlockUserAccountByIDUser, getAllUserWithinPaginationSearch } from '../../apis/userApi';
import { toast } from 'react-toastify';
import IUser from '../../interface/user';
import MouseOverPopover from '../../components/MouseOverPopover/MouseOverPopover';
import { Avatar } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#B3A492',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        padding: 3,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ListCustomer = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // change page
    const [data, setData] = useState<Array<IUser>>([]); // Dữ liệu từ API
    const [page, setPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(11); // Tổng số trang
    const [search, setSearch] = useState<string>('');
    const itemsPerPage = 20;

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };
    // get all Customers
    const getAllCustomers = async (pageNo: number) => {
        try {
            const response = await getAllUserWithinPaginationSearch(pageNo, itemsPerPage, search);

            if (response.status === 200) {
                const { content, totalPages } = response.data;

                setData(content);
                setTotalPages(totalPages);
                if (totalPages > 0 && content.length <= 0) {
                    setPage((prev) => prev - 1);
                }
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error('Đang bảo trì quay lại sau');
        }
    };
    const handleLockAccount = async (idUser: number) => {
        const response = await changeLockUnlockUserAccountByIDUser(idUser);
        if (response.status === 200) {
            setIsLoading((prev) => !prev);
            if (response.data.locked) {
                toast.success('Tài khoản đã bị khóa');
            } else {
                toast.success('Tài khoản đã mở khóa');
            }
        } else {
            toast.error(response.data.message || response.data);
        }
    };

    useEffect(() => {
        getAllCustomers(page);
    }, [page, isLoading, search]);
    return (
        <div>
            <div className="flex justify-between">
                <div className="text-lg font-semibold flex items-center">Quản lý người dùng</div>
            </div>
            <div className="flex justify-center m-auto my-4 md:w-7/12">
                <Search
                    setSearch={setSearch}
                    placeHolder="Tìm theo theo Tên tài khoản, tên, số điện thoại của người dùng"
                />
            </div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell></StyledTableCell>
                                <StyledTableCell align="left">Tên tài khoản</StyledTableCell>
                                <StyledTableCell align="left" sx={{ minWidth: '100px' }}>
                                    Tên
                                </StyledTableCell>
                                <StyledTableCell align="center">Giới tính</StyledTableCell>
                                <StyledTableCell align="left">Email</StyledTableCell>
                                <StyledTableCell align="center">SĐT</StyledTableCell>
                                <StyledTableCell align="center" sx={{ minWidth: '120px' }}></StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((item, index) => (
                                <StyledTableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <StyledTableCell
                                        align="center"
                                        component="th"
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Avatar src={item.avatarUrl} alt="Avatar" />
                                    </StyledTableCell>
                                    <StyledTableCell align="left">{item.username}</StyledTableCell>
                                    <StyledTableCell align="left">{item.name}</StyledTableCell>
                                    <StyledTableCell align="center">{item.gender}</StyledTableCell>
                                    <StyledTableCell align="left">{item.email}</StyledTableCell>
                                    <StyledTableCell align="center">{item.phoneNumber}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Link to={config.Routes.detailCustomer + '#' + item.id}>
                                            <IconButton>
                                                <MouseOverPopover content="Xem thông tin chi tiết">
                                                    <InfoTwoTone sx={{ color: '#0802A3', fontSize: 26 }} />
                                                </MouseOverPopover>
                                            </IconButton>
                                        </Link>
                                        <IconButton onClick={() => handleLockAccount(item.id)}>
                                            {item.locked ? (
                                                <MouseOverPopover content="Mở khóa tài khoản">
                                                    <LockTwoTone sx={{ color: '#E74646', fontSize: 26 }} />
                                                </MouseOverPopover>
                                            ) : (
                                                <MouseOverPopover content="Khóa tài khoản">
                                                    <LockOpenTwoTone sx={{ color: '#E74646', fontSize: 26 }} />
                                                </MouseOverPopover>
                                            )}
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <div className="w-full flex justify-center mt-5 ">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    boundaryCount={1}
                />
            </div>
        </div>
    );
};

export default ListCustomer;

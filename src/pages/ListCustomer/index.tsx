import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import LockOpenTwoTone from '@mui/icons-material/LockOpenTwoTone';
import LockTwoTone from '@mui/icons-material/LockTwoTone';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import config from '../../config';
import Search from '../../components/Search/Search';
import { changeLockUnlockUserAccountByIDUser, getAllUserWithinPaginationSearch } from '../../apis/userApi';
import IUser from '../../types/user';
import MouseOverPopover from '../../components/MouseOverPopover/MouseOverPopover';
import Error404 from '../Error404';
import Skeleton from '../../components/Skeleton';
import PopConfirm from '../../components/PopConfirm';

const TableRowCustom = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ListCustomer = () => {
    const navigate = useNavigate();
    const itemsPerPage = 20;

    const [loadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [firstLoadingAPIGet, setFirstLoadingAPIGet] = useState<boolean>(true);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [customers, setCustomers] = useState<Array<IUser>>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState<string>('');

    const getCustomers = async () => {
        try {
            firstLoadingAPIGet && setLoadingAPI(true);

            const [response] = await Promise.all([
                getAllUserWithinPaginationSearch(page, itemsPerPage, search),
                firstLoadingAPIGet && new Promise((resolve) => setTimeout(resolve, 250)),
            ]);

            firstLoadingAPIGet && setLoadingAPI(false);

            if (response.status === 200) {
                setFirstLoadingAPIGet(false);
                const { content, totalPages } = response.data;

                setCustomers(content);
                setTotalPages(totalPages);

                if (totalPages > 0 && content.length <= 0) {
                    setPage((prev) => prev - 1);
                }
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };
    const handleLockAccount = async (idUser: number) => {
        try {
            const response = await changeLockUnlockUserAccountByIDUser(idUser);
            if (response.status === 200) {
                getCustomers();
                if (response.data.locked) {
                    toast.success('Tài khoản đã bị khóa');
                } else {
                    toast.success('Tài khoản đã mở khóa');
                }
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            setErrorAPI(true);
        }
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleNavigateDetailUser = (userDetail: IUser) => {
        navigate(`${config.Routes.detailCustomer}/${userDetail.id}`, { state: { userDetail: userDetail } });
    };

    useEffect(() => {
        getCustomers();
    }, [page, search]);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <section className="space-y-5">
            <div className="flex justify-between">
                <div className="text-2xl font-bold flex items-center">Quản lý người dùng</div>
            </div>
            <div className="flex justify-start bg-white p-3 rounded-lg shadow">
                <Search
                    setSearch={setSearch}
                    placeHolder="Tìm theo theo Tên tài khoản, họ tên, số điện thoại của người dùng"
                />
            </div>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell className="!font-bold">Tên tài khoản</TableCell>
                                <TableCell className="!font-bold">Họ & Tên</TableCell>
                                <TableCell className="!font-bold">Giới tính</TableCell>
                                <TableCell className="!font-bold">Email</TableCell>
                                <TableCell className="!font-bold">SĐT</TableCell>
                                <TableCell align="center" className="!font-bold">
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loadingAPI
                                ? Array(10)
                                      .fill(null)
                                      .map((_, index) => (
                                          <TableRowCustom key={index}>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                              <TableCell>
                                                  <Skeleton className="h-12" />
                                              </TableCell>
                                          </TableRowCustom>
                                      ))
                                : customers.map((item) => (
                                      <TableRowCustom key={item.id} className="hover:!bg-primary-50">
                                          <TableCell
                                              className="cursor-pointer"
                                              onClick={() => handleNavigateDetailUser(item)}
                                          >
                                              <Avatar src={item.avatarUrl} alt="Avatar" className="size-full" />
                                          </TableCell>
                                          <TableCell
                                              className="cursor-pointer"
                                              onClick={() => handleNavigateDetailUser(item)}
                                          >
                                              {item.username}
                                          </TableCell>
                                          <TableCell
                                              className="cursor-pointer"
                                              onClick={() => handleNavigateDetailUser(item)}
                                          >
                                              <div className={`${item.name ? '' : 'text-gray-400'}`}>
                                                  {item.name || 'N/A'}
                                              </div>
                                          </TableCell>
                                          <TableCell
                                              className="cursor-pointer"
                                              onClick={() => handleNavigateDetailUser(item)}
                                          >
                                              <div className={`${item.gender ? '' : 'text-gray-400'}`}>
                                                  {item.gender || 'N/A'}
                                              </div>
                                          </TableCell>
                                          <TableCell
                                              align="left"
                                              className="cursor-pointer"
                                              onClick={() => handleNavigateDetailUser(item)}
                                          >
                                              {item.email}
                                          </TableCell>
                                          <TableCell
                                              align="left"
                                              className="cursor-pointer"
                                              onClick={() => handleNavigateDetailUser(item)}
                                          >
                                              <div className={`${item.phoneNumber ? '' : 'text-gray-400'}`}>
                                                  {item.phoneNumber || 'N/A'}
                                              </div>
                                          </TableCell>
                                          <TableCell align="center">
                                              <PopConfirm
                                                  content={
                                                      item.locked
                                                          ? `Mở khóa tài khoản ${item.username}`
                                                          : `Khóa tài khoản ${item.username}`
                                                  }
                                                  title={item.locked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                                                  onConfirm={() => handleLockAccount(item.id)}
                                              >
                                                  <IconButton>
                                                      <MouseOverPopover
                                                          content={item.locked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                                                      >
                                                          {item.locked ? (
                                                              <LockTwoTone sx={{ color: '#E74646', fontSize: 26 }} />
                                                          ) : (
                                                              <LockOpenTwoTone
                                                                  sx={{ color: '#E74646', fontSize: 26 }}
                                                              />
                                                          )}
                                                      </MouseOverPopover>
                                                  </IconButton>
                                              </PopConfirm>
                                          </TableCell>
                                      </TableRowCustom>
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
        </section>
    );
};

export default ListCustomer;

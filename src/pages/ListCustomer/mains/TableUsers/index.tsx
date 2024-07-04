// libs
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import LockOpenTwoTone from '@mui/icons-material/LockOpenTwoTone';
import LockTwoTone from '@mui/icons-material/LockTwoTone';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// types
import IUser from '@/types/user';
// components
import MouseOverPopover from '@/components/MouseOverPopover';
import Skeleton from '@/components/Skeleton';
import PopConfirm from '@/components/PopConfirm';
// apis
import { changeLockUnlockUserAccountByIDUser } from '@/apis/userApi';
// others
import config from '@/config';

const TableUsers = ({
    loadingAPI,
    customers,
    setBehaviorGetUsers,
    setErrorAPI,
}: {
    loadingAPI: boolean;
    customers: IUser[];
    setBehaviorGetUsers: React.Dispatch<React.SetStateAction<boolean>>;
    setErrorAPI: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const navigate = useNavigate();

    const handleLockAccount = async (idUser: number) => {
        try {
            const response = await changeLockUnlockUserAccountByIDUser(idUser);
            if (response.status === 200) {
                setBehaviorGetUsers((prev) => !prev);
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

    const handleNavigateDetailUser = (userDetail: IUser) => {
        navigate(`${config.Routes.detailCustomer}/${userDetail.id}`, { state: { userDetail: userDetail } });
    };

    return (
        <div className="bg-white rounded px-2">
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
                                      <TableRow key={index}>
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
                                      </TableRow>
                                  ))
                            : customers.map((item) => (
                                  <TableRow key={item.id} className="hover:!bg-primary-50">
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
                                                          <LockOpenTwoTone sx={{ color: '#E74646', fontSize: 26 }} />
                                                      )}
                                                  </MouseOverPopover>
                                              </IconButton>
                                          </PopConfirm>
                                      </TableCell>
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TableUsers;

// libs
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// types
import IOrder from '@/types/order';
// components
import Skeleton from '@/components/Skeleton';
import PopConfirm from '@/components/PopConfirm';
import Button from '@/components/Button';
import SelectStatus from '../ChangeStatusItem';
// apis
import { deleteOrderByAdmin } from '@/apis/orderApi';
// others
import config from '@/config';

const TableOrders = ({
    loadingAPI,
    orders,
    setBehaviorGetProducts,
}: {
    loadingAPI: boolean;
    orders: IOrder[];
    setBehaviorGetProducts: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const navigate = useNavigate();

    const handleNavigateDetailOrders = (orderDetail: IOrder) => {
        navigate(`${config.Routes.detailOrder}/${orderDetail.id}`, { state: { orderDetail: orderDetail } });
    };

    const handleCopyID = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${id}`);
    };

    const handleDeleteOrder = async (idOrder: number) => {
        try {
            const response = await deleteOrderByAdmin(idOrder);

            if (response.status === 200) {
                toast.success(response.data);
                setBehaviorGetProducts((prev) => !prev);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <div className="bg-white rounded px-2">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className="!font-bold">
                                ID
                            </TableCell>
                            <TableCell align="left" className="!font-bold">
                                Người đặt hàng
                            </TableCell>
                            <TableCell align="left" className="!font-bold">
                                Thành tiền
                            </TableCell>
                            <TableCell align="left" className="!font-bold">
                                Thời gian đặt
                            </TableCell>
                            <TableCell align="left" className="!font-bold">
                                Địa chỉ nhận hàng
                            </TableCell>
                            <TableCell align="center" className="!font-bold">
                                Trạng thái
                            </TableCell>
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
                            : orders.map((item) => (
                                  <TableRow key={item.id} className="hover:!bg-primary-50">
                                      <TableCell
                                          align="center"
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailOrders(item)}
                                      >
                                          <Tooltip title="Copy ID">
                                              <IconButton size="small" onClick={(e) => handleCopyID(item.id, e)}>
                                                  <FileCopyOutlinedIcon
                                                      fontSize="small"
                                                      sx={{ width: '16px', height: '16px' }}
                                                  />
                                              </IconButton>
                                          </Tooltip>
                                          {item.id}
                                      </TableCell>
                                      <TableCell
                                          align="left"
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailOrders(item)}
                                      >
                                          {item.user.username}
                                      </TableCell>
                                      <TableCell
                                          align="left"
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailOrders(item)}
                                      >
                                          {item.total.toLocaleString('vi-VN')}đ
                                      </TableCell>
                                      <TableCell
                                          align="left"
                                          className="truncate cursor-pointer"
                                          onClick={() => handleNavigateDetailOrders(item)}
                                      >
                                          {item.createdDate}
                                      </TableCell>

                                      <TableCell
                                          align="left"
                                          className="truncate cursor-pointer"
                                          onClick={() => handleNavigateDetailOrders(item)}
                                      >
                                          {item.address.ward}, {item.address.district}, {item.address.city}
                                      </TableCell>

                                      <TableCell align="center">
                                          <SelectStatus
                                              status={item.status}
                                              idOrder={item.id}
                                              setBehaviorGetProducts={setBehaviorGetProducts}
                                          />
                                      </TableCell>

                                      <TableCell align="center">
                                          <PopConfirm
                                              content=""
                                              title="Xác nhận xóa đơn hàng?"
                                              onConfirm={() => handleDeleteOrder(item.id)}
                                          >
                                              <Button className="text-sm font-semibold text-[#ff3131]">Xóa</Button>
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

export default TableOrders;

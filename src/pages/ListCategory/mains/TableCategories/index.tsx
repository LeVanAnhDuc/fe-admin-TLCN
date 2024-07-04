// libs
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
// types
import ICategory from '@/types/category';
// components
import Skeleton from '@/components/Skeleton';
import PopConfirm from '@/components/PopConfirm';
import Button from '@/components/Button';
// apis
import { deteleASingleCategory } from '@/apis/categoryApi';
// others
import config from '@/config';

const TableCategories = ({
    loadingAPI,
    categories,
    setBehaviorGetCategories,
}: {
    loadingAPI: boolean;
    categories: ICategory[];
    setBehaviorGetCategories: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const navigate = useNavigate();

    const handleDeleteItem = async (idItem: number) => {
        try {
            const response = await deteleASingleCategory(idItem);
            if (response.status === 200) {
                toast.success(response.data);
                setBehaviorGetCategories((prev) => !prev);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`Lỗi xóa: ${error} `);
        }
    };

    const handleNavigateDetailCategory = (categoryDetail: ICategory) => {
        navigate(`${config.Routes.detailCategory}/${categoryDetail.id}`);
    };

    const handleCopyID = (item: ICategory, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (item) {
            navigator.clipboard.writeText(`${item.id}`);
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
                            <TableCell className="!font-bold">Tên danh mục</TableCell>
                            <TableCell className="!font-bold">Mô tả</TableCell>
                            <TableCell className="!font-bold">Tổng sản phẩm</TableCell>
                            <TableCell align="left" className="!font-bold">
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
                                      </TableRow>
                                  ))
                            : categories.map((item) => (
                                  <TableRow key={item.id} className="hover:!bg-primary-50">
                                      <TableCell
                                          align="center"
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailCategory(item)}
                                      >
                                          <Tooltip title="Copy ID">
                                              <IconButton size="small" onClick={(e) => handleCopyID(item, e)}>
                                                  <FileCopyOutlinedIcon
                                                      fontSize="small"
                                                      sx={{ width: '16px', height: '16px' }}
                                                  />
                                              </IconButton>
                                          </Tooltip>
                                          {item.id}
                                      </TableCell>
                                      <TableCell
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailCategory(item)}
                                      >
                                          {item.name}
                                      </TableCell>
                                      <TableCell
                                          className="cursor-pointer max-w-[30rem] truncate"
                                          onClick={() => handleNavigateDetailCategory(item)}
                                      >
                                          {item.description}
                                      </TableCell>
                                      <TableCell
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailCategory(item)}
                                      >
                                          {item.productNumber}
                                      </TableCell>
                                      <TableCell align="right">
                                          <PopConfirm
                                              content=""
                                              title="Xác nhận xóa danh mục?"
                                              onConfirm={() => handleDeleteItem(item.id)}
                                          >
                                              <Button className="text-sm font-semibold scale-40 h-7 w-10 px-1 rounded text-[#ff3131]">
                                                  Xóa
                                              </Button>
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

export default TableCategories;

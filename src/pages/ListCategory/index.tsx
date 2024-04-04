import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DeleteTwoTone from '@mui/icons-material/DeleteTwoTone';
import { styled } from '@mui/material/styles';

import config from '../../config';
import ICategory from '../../interface/category';
import { deteleASingleCategory, getAllCategoryWithinPaginationSearch } from '../../apis/categoryApi';
import Search from '../../components/Search/Search';
import ModalAddNewCategory from './ModalAddNewCategory';
import MouseOverPopover from '../../components/MouseOverPopover/MouseOverPopover';
import Skeleton from '../../components/Skeleton';
import Error404 from '../Error404';
import PopConfirm from '../../components/PopComfirm';
import Button from '../../components/Button';

const TableRowCustom = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const ListCategory = () => {
    const navigate = useNavigate();
    const itemsPerPage = 20;

    const [loadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [categories, setCategories] = useState<Array<ICategory>>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [callAPICategories, setCallAPICategories] = useState<boolean>(false);

    const getCategories = async () => {
        try {
            setLoadingAPI(true);
            const response = await getAllCategoryWithinPaginationSearch(page, itemsPerPage, sortBy, search);
            setLoadingAPI(false);

            if (response.status === 200) {
                const { content, totalPages } = response.data;

                setCategories(content);
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

    const handleDeleteItem = async (idItem: number) => {
        try {
            const response = await deteleASingleCategory(idItem);
            if (response.status === 200) {
                toast.success(response.data);
                getCategories();
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`Lỗi xóa: ${error} `);
        }
    };

    const handleChangesetSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleOpenModal = useCallback(() => setOpenModal(true), []);
    const handleCloseModal = useCallback(() => setOpenModal(false), []);

    const handleNavigateDetailCategory = (categoryDetail: ICategory) => {
        navigate(`${config.Routes.detailCategory}/${categoryDetail.id}`);
    };

    useEffect(() => {
        getCategories();
    }, [page, search, sortBy, callAPICategories]);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <section className="space-y-5">
            <ModalAddNewCategory
                open={openModal}
                handleClose={handleCloseModal}
                setCallAPICategories={setCallAPICategories}
            />

            <div className="flex justify-between items-center">
                <div className="text-lg font-semibold flex items-center">Danh sách danh mục</div>
                <Button variant="fill" onClick={handleOpenModal}>
                    Thêm mới
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 bg-white p-3 rounded-lg shadow">
                <Search setSearch={setSearch} placeHolder="Tìm theo theo tên danh mục" />
                <FormControl fullWidth className="sm:!w-96">
                    <InputLabel>Sắp xếp</InputLabel>
                    <Select value={sortBy} label="Sắp xếp" onChange={handleChangesetSortBy}>
                        <MenuItem value={''}>Không sắp xếp</MenuItem>
                        <MenuItem value={config.SearchFilterCategory.idAsc}>Ngày tạo cũ nhất</MenuItem>
                        <MenuItem value={config.SearchFilterCategory.idDesc}>Ngày tạo mới nhất</MenuItem>
                        <MenuItem value={config.SearchFilterCategory.prod_countAsc}>Tổng sản phẩm tăng dần</MenuItem>
                        <MenuItem value={config.SearchFilterCategory.prod_countDesc}>Tổng sản phẩm giảm dần</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead className="!bg-primary-200 ">
                            <TableRow>
                                <TableCell align="center" className="!font-bold">
                                    ID
                                </TableCell>
                                <TableCell className="!font-bold">Tên danh mục</TableCell>
                                <TableCell className="!font-bold">Mô tả</TableCell>
                                <TableCell className="!font-bold">Tổng sản phẩm</TableCell>
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
                                          </TableRowCustom>
                                      ))
                                : categories.map((item) => (
                                      <TableRowCustom key={item.id} className="hover:!bg-primary-50">
                                          <TableCell
                                              align="center"
                                              className="cursor-pointer"
                                              onClick={() => handleNavigateDetailCategory(item)}
                                          >
                                              #{item.id}
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
                                          <TableCell align="center">
                                              <PopConfirm
                                                  content="Nếu xóa dữ liệu sẽ mất đi và không thể hoàn lại"
                                                  title="Xóa danh mục"
                                                  onConfirm={() => handleDeleteItem(item.id)}
                                              >
                                                  <MouseOverPopover content="Xóa danh mục">
                                                      <IconButton>
                                                          <DeleteTwoTone className="!text-red-500" />
                                                      </IconButton>
                                                  </MouseOverPopover>
                                              </PopConfirm>
                                          </TableCell>
                                      </TableRowCustom>
                                  ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <div className="w-full flex justify-center mt-5">
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

export default ListCategory;

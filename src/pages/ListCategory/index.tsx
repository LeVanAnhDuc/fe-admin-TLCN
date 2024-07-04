// libs
import { useState, useCallback } from 'react';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
// types
import ICategory from '@/types/category';
// components
import Search from '@/components/Search/Search';
import Error404 from '../Error404';
import Button from '@/components/Button';
import TableCategories from './mains/TableCategories';
import ModalAddNewCategory from './mains/ModalAddNewCategory';
// ghosts
import GetCategories from './ghosts/GetCategories';
// others
import config from '@/config';

const ListCategory = () => {
    const [loadingAPI, setLoadingAPI] = useState<boolean>(false);
    const [errorAPI, setErrorAPI] = useState<boolean>(false);
    const [categories, setCategories] = useState<Array<ICategory>>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('');
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [behaviorGetCategories, setBehaviorGetCategories] = useState<boolean>(false);

    const handleChangesetSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleOpenModal = useCallback(() => setOpenModal(true), []);
    const handleCloseModal = useCallback(() => setOpenModal(false), []);

    if (errorAPI) {
        return <Error404 />;
    }

    return (
        <>
            <GetCategories
                {...{
                    page,
                    sortBy,
                    search,
                    setLoadingAPI,
                    setCategories,
                    setTotalPages,
                    setPage,
                    setErrorAPI,
                    behaviorGetCategories,
                }}
            />

            <ModalAddNewCategory
                open={openModal}
                handleClose={handleCloseModal}
                setBehaviorGetCategories={setBehaviorGetCategories}
            />

            <section className="space-y-5">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold flex items-center">Danh mục sản phẩm</div>
                    <Button variant="fill" className="!h-9 text-sm" onClick={handleOpenModal}>
                        Thêm danh mục mới
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
                            <MenuItem value={config.SearchFilterCategory.prod_countAsc}>Tổng sản phẩm ↑</MenuItem>
                            <MenuItem value={config.SearchFilterCategory.prod_countDesc}>Tổng sản phẩm ↓</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <TableCategories
                    {...{
                        loadingAPI,
                        categories,
                        setBehaviorGetCategories,
                    }}
                />

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
        </>
    );
};

export default ListCategory;

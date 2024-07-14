// libs
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// types
import ICategory from '@/types/category';
// components
import Search from '@/components/Search/Search';
// others
import config from '@/config';

const FilterProducts = ({
    setSearch,
    setCate,
    setSortBy,
    cate,
    categories,
    sortBy,
}: {
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    setCate: React.Dispatch<React.SetStateAction<string>>;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
    cate: string;
    categories: ICategory[];
    sortBy: string;
}) => {
    const handleFilterCategory = (event: SelectChangeEvent) => {
        setCate(event.target.value as string);
    };

    const handleFilterSortBy = (event: SelectChangeEvent) => {
        setSortBy(event.target.value as string);
    };

    return (
        <>
            <div className="col-span-1 lg:col-span-6">
                <Search setSearch={setSearch} placeHolder="Tìm theo theo tên sản phẩm" />
            </div>

            <FormControl className="col-span-1 lg:col-span-3">
                <InputLabel>Lọc theo danh mục</InputLabel>
                <Select value={cate} label="Lọc theo danh mục" onChange={handleFilterCategory} defaultValue="">
                    <MenuItem value={''}>Không lọc</MenuItem>
                    {categories.map((item, index) => (
                        <MenuItem key={index} value={item.name}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl className="col-span-1 lg:col-span-3">
                <InputLabel>Sắp xếp</InputLabel>
                <Select value={sortBy} label="Sắp xếp" onChange={handleFilterSortBy}>
                    <MenuItem value={''}>Không sắp xếp</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.idAsc}>Cũ nhất</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.idDesc}>Mới nhất</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.priceAsc}>Giá ↑</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.priceDesc}>Giá ↓</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.ratingAsc}>Số sao ↑</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.ratingDesc}>Số sao ↓</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.soldAsc}> Số lượng đã bán ↑</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.soldDesc}>Số lượng đã bán ↓</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.availableAsc}>Số lượng có sẵn ↑</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.availableDesc}>Số lượng có sẵn ↓</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.reviewAsc}>Lượt đánh giá ↑</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.reviewDesc}>Lượt đánh giá ↓</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.favoriteAsc}>Lượt yêu thích ↑</MenuItem>
                    <MenuItem value={config.SearchFilterProduct.favoriteDesc}>Lượt yêu thích ↓</MenuItem>
                </Select>
            </FormControl>
        </>
    );
};

export default FilterProducts;

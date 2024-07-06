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
import Avatar from '@mui/material/Avatar';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
// types
import ICategory from '@/types/category';
import IProduct from '@/types/product';
// components
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import PopConfirm from '@/components/PopConfirm';
// apis
import { toggleIsActiveProduct, toggleIsSellingProduct } from '@/apis/productApi';
// others
import { convertNumberToVND } from '@/utils/convertData';
import config from '@/config';

const TableProducts = ({
    loadingAPIGetProducts,
    categories,
    products,
    setBehaviorGetCategories,
    setProductAddQuantity,
    setOpenModal,
}: {
    loadingAPIGetProducts: boolean;
    categories: ICategory[];
    products: IProduct[];
    setBehaviorGetCategories: React.Dispatch<React.SetStateAction<boolean>>;
    setProductAddQuantity: React.Dispatch<React.SetStateAction<IProduct | undefined>>;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const navigate = useNavigate();

    const handleNavigateDetailProduct = (productDetail: IProduct) => {
        navigate(`${config.Routes.detailProduct}/${productDetail.id}`, { state: { categories: categories } });
    };

    const handleCopy = (item: IProduct, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (item) {
            navigator.clipboard.writeText(`${item.id}`);
        }
    };

    const handleAddQuantityProduct = (product: IProduct) => {
        setProductAddQuantity(product);
        setOpenModal(true);
    };

    const handleDeleteProduct = async (idProduct: number) => {
        try {
            const response = await toggleIsActiveProduct(idProduct);
            if (response.status === 200) {
                toast.success('Xóa thành công');
                setBehaviorGetCategories((prev) => !prev);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    const handleToggleSellProduct = async (idProduct: number) => {
        const response = await toggleIsSellingProduct(idProduct);
        try {
            if (response.status === 200) {
                if (response.data.isSelling) {
                    toast.success('Mở bán thành công');
                } else {
                    toast.success('Ẩn bán thành công');
                }
                setBehaviorGetCategories((prev) => !prev);
            } else {
                toast.error(response.data.message || response.data);
            }
        } catch (error) {
            toast.error(`${error}`);
        }
    };

    return (
        <div className="bg-white rounded px-2">
            <TableContainer className="rounded-md">
                <Table>
                    <TableHead className="">
                        <TableRow>
                            <TableCell align="center" className="!font-bold text-nowrap">
                                ID
                            </TableCell>
                            <TableCell align="center" className="!font-bold text-nowrap">
                                Sản phẩm
                            </TableCell>
                            <TableCell className="!font-bold text-nowrap">Số lượng</TableCell>
                            <TableCell className="!font-bold text-nowrap">Đã bán</TableCell>
                            <TableCell className="!font-bold text-nowrap">Có sẵn</TableCell>
                            <TableCell className="!font-bold text-nowrap">Giá bán lẻ</TableCell>
                            <TableCell align="center" className="!font-bold text-nowrap">
                                Trạng thái
                            </TableCell>
                            <TableCell align="center" className="!font-bold text-nowrap">
                                Thao tác
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loadingAPIGetProducts
                            ? Array(10)
                                  .fill(null)
                                  .map((_, index) => (
                                      <TableRow key={index} className="h-10 bg-white">
                                          {Array(8)
                                              .fill(null)
                                              .map((_, index) => (
                                                  <TableCell key={index}>
                                                      <Skeleton className="h-10" />
                                                  </TableCell>
                                              ))}
                                      </TableRow>
                                  ))
                            : products.map((item) => (
                                  <TableRow key={item.id} className="hover:!bg-primary-50">
                                      <TableCell
                                          align="left"
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailProduct(item)}
                                      >
                                          <div className="flex items-center">
                                              <Tooltip title="Copy ID">
                                                  <IconButton size="small" onClick={(e) => handleCopy(item, e)}>
                                                      <FileCopyOutlinedIcon sx={{ width: '16px', height: '16px' }} />
                                                  </IconButton>
                                              </Tooltip>
                                              <span>{item.id}</span>
                                          </div>
                                      </TableCell>
                                      <TableCell
                                          align="left"
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailProduct(item)}
                                      >
                                          <div className="flex items-center gap-2">
                                              <Avatar
                                                  variant="rounded"
                                                  src={item.listImages[0]}
                                                  alt="Sản phẩm"
                                                  className="object-cover object-center size-full"
                                              />
                                              <div className="max-w-52 w-30 lg:max-w-72 truncate">{item.name}</div>
                                          </div>
                                      </TableCell>
                                      <TableCell
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailProduct(item)}
                                      >
                                          {item.quantity}
                                      </TableCell>
                                      <TableCell
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailProduct(item)}
                                      >
                                          {item.sold}
                                      </TableCell>
                                      <TableCell
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailProduct(item)}
                                      >
                                          {item.quantityAvailable}
                                      </TableCell>
                                      <TableCell
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailProduct(item)}
                                      >
                                          {convertNumberToVND(item.price)}đ
                                      </TableCell>
                                      <TableCell
                                          className="cursor-pointer"
                                          onClick={() => handleNavigateDetailProduct(item)}
                                      >
                                          <span className="font-semibold rounded-md space-x-1 flex items-center">
                                              {item.status === 'Đang hoạt động' && (
                                                  <span className="inline-block size-2 rounded-full bg-[#7fc066]"></span>
                                              )}
                                              <span
                                                  className={` ${
                                                      item.status === 'Đang hoạt động'
                                                          ? 'text-[#7fc066] bg-[#e8ffdb]'
                                                          : 'text-gray-400 bg-gray-200'
                                                  } rounded-md items-center px-2 truncate`}
                                              >
                                                  {item.status}
                                              </span>
                                          </span>
                                      </TableCell>
                                      <TableCell align="center">
                                          <div className="flex items-center justify-center">
                                              <Button
                                                  className="text-sm font-semibold text-[#5d51a7] rounded-3xl text-nowrap hover:bg-[rgba(0,0,0,0.04)]"
                                                  onClick={() => handleAddQuantityProduct(item)}
                                              >
                                                  Nhập hàng
                                              </Button>
                                              <span className="text-gray-400">|</span>
                                              <PopConfirm
                                                  title="Xác nhận xóa sản phẩm?"
                                                  content=""
                                                  onConfirm={() => handleDeleteProduct(item.id)}
                                              >
                                                  <Button className="text-sm font-semibold rounded-3xl text-[#ff3131] hover:bg-[rgba(0,0,0,0.04)]">
                                                      Xóa
                                                  </Button>
                                              </PopConfirm>
                                              <span className="text-gray-400">|</span>
                                              <div onClick={() => handleToggleSellProduct(item.id)}>
                                                  {item.isSelling ? (
                                                      <Button className="text-sm font-semibold rounded-3xl bg-gray-400 text-while-500 text-nowrap hover:bg-[rgba(0,0,0,0.04)]">
                                                          Dừng đăng bán
                                                      </Button>
                                                  ) : (
                                                      <Button className="text-sm font-semibold rounded-3xl bg-blue-400 text-[#5d51a7] text-nowrap hover:bg-[rgba(0,0,0,0.04)]">
                                                          Đăng bán ngay
                                                      </Button>
                                                  )}
                                              </div>
                                          </div>
                                      </TableCell>
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TableProducts;

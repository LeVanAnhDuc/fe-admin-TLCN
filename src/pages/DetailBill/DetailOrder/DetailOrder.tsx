// import Collapse from '@mui/material/Collapse';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import { useState } from 'react';
// import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import Image from '../../../components/Image';
import IProductCart from '../../../interface/productCart';

interface Iprops {
    products: Array<IProductCart>;
}

const DetailOrder = (props: Iprops) => {
    const { products } = props;
    // toggle
    // const [open, setOpen] = useState(true);
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '30px' }}>
            <TableContainer>
                <Table stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Danh sách sản phẩm</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: open ? '#FFF8EA' : '' }}>
                            <TableCell>
                                <Button variant="outlined" onClick={() => setOpen(!open)} fullWidth>
                                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </Button>
                            </TableCell>
                        </TableRow> */}
                        <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                {/* <Collapse in={open} timeout="auto" unmountOnExit> */}
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Sản phẩm</TableCell>
                                            <TableCell align="left">Tên</TableCell>
                                            <TableCell align="left">Số lượng</TableCell>
                                            <TableCell align="left">Giá</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {products.map((item, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    '&:last-child td, &:last-child th': {
                                                        border: 0,
                                                    },
                                                }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Image
                                                        src={item.imageUrl}
                                                        className="sm:h-24 sm:w-24 lg:h-36 lg:w-36  h-16 w-16"
                                                    />
                                                </TableCell>
                                                <TableCell align="left">
                                                    <div className="text-md font-medium">{item.product.name}</div>
                                                    {item.sku.optionValues.map((item2, index2) => (
                                                        <span key={index2}>
                                                            {item2.valueName}
                                                            {index2 < item.sku.optionValues.length - 1 ? ' - ' : ''}
                                                        </span>
                                                    ))}
                                                </TableCell>
                                                <TableCell align="left">{item.quantity} </TableCell>
                                                <TableCell align="left" sx={{ color: 'red' }}>
                                                    {item.subTotal.toLocaleString('vi-VN')} VNĐ
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {/* </Collapse> */}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default DetailOrder;

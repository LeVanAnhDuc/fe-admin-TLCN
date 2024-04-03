const Routes = {
    home: '/trang-chu',
    revenue: '/thong-ke-doanh-thu',
    logIn: '/',
    forgotPass: '/quen-mat-khau/OTP',
    profileSetting: '/thong-tin-ca-nhan',
    error: '*',
    listBill: '/danh-sach-hoa-don',
    detailOrder: '/chi-tiet-hoa-don',
    detailOrderID: '/chi-tiet-hoa-don/:idProduct',

    listCustomer: '/danh-sach-khach-hang',
    detailCustomer: '/chi-tiet-khach-hang',
    detailCustomerID: '/chi-tiet-khach-hang/:idUser',

    listCategory: '/danh-sach-loai',
    detailCategory: '/chi-tiet-loai',
    listProduct: '/danh-sach-san-pham',
    addProduct: '/them-san-pham',
    detailProduct: '/chi-tiet-san-pham',
};

export default Routes;

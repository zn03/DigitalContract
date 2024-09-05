const ChuSo = [' không', ' một', ' hai', ' ba', ' bốn', ' năm', ' sáu', ' bảy', ' tám', ' chín'];
const Tien = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];

const DocTienBangChu = (SoTien, strTail) => {
    let lan, i, so, KetQua = '', tmp = '';
    let ViTri = new Array(6);
    if (SoTien < 0) return 'Số tiền âm !';
    if (SoTien == 0) return 'Không đồng !';
    if (SoTien > 0) {
        so = SoTien;
    }
    else {
        so = -SoTien;
    }
    //Kiểm tra số quá lớn
    if (SoTien > 8999999999999999) {
        SoTien = 0;
        return '';
    }
    ViTri[5] = Math.floor(parseInt(so) / 1000000000000000);
    so = so - parseInt(ViTri[5].toString()) * 1000000000000000;
    ViTri[4] = Math.floor(parseInt(so) / 1000000000000);
    so = so - parseInt(ViTri[4].toString()) * +1000000000000;
    ViTri[3] = Math.floor(parseInt(so) / 1000000000);
    so = so - parseInt(ViTri[3].toString()) * 1000000000;
    ViTri[2] = Math.floor(parseInt(so) / 1000000);
    ViTri[1] = Math.floor((parseInt(so) % 1000000) / 1000);
    ViTri[0] = Math.floor(parseInt(so) % 1000);
    if (ViTri[5] > 0) {
        lan = 5;
    }
    else if (ViTri[4] > 0) {
        lan = 4;
    }
    else if (ViTri[3] > 0) {
        lan = 3;
    }
    else if (ViTri[2] > 0) {
        lan = 2;
    }
    else if (ViTri[1] > 0) {
        lan = 1;
    }
    else {
        lan = 0;
    }
    for (i = lan; i >= 0; i--) {
        tmp = DocSo3ChuSo(ViTri[i]);
        KetQua += tmp;
        if (ViTri[i] != 0) KetQua += Tien[i];
        if ((i > 0) && (!tmp && tmp != ``)) KetQua += ',';//&& (!string.IsNullOrEmpty(tmp))
    }
    if (KetQua.substring(KetQua.Length - 1, 1) == ',') KetQua = KetQua.substring(0, KetQua.Length - 1);
    if(strTail === undefined) strTail= ' đồng';
    KetQua = KetQua.trim() + strTail;
    return KetQua.substring(0, 1).toUpperCase() + KetQua.substring(1);
}

const DocSo3ChuSo = (baso) => {
    let tram, chuc, donvi, KetQua = '';
    tram = parseInt(baso / 100);
    chuc = parseInt((baso % 100) / 10);
    donvi = baso % 10;
    if ((tram == 0) && (chuc == 0) && (donvi == 0)) return '';
    if (tram != 0) {
        KetQua += ChuSo[tram] + ' trăm';
        if ((chuc == 0) && (donvi != 0)) KetQua += ' linh';
    }
    if ((chuc != 0) && (chuc != 1)) {
        KetQua += ChuSo[chuc] + ' mươi';
        if ((chuc == 0) && (donvi != 0)) KetQua = KetQua + ' linh';
    }
    if (chuc == 1) KetQua += ' mười';
    switch (donvi) {
        case 1:
            if ((chuc != 0) && (chuc != 1)) {
                KetQua += ' mốt';
            }
            else {
                KetQua += ChuSo[donvi];
            }
            break;
        case 5:
            if (chuc == 0) {
                KetQua += ChuSo[donvi];
            }
            else {
                KetQua += ' lăm';
            }
            break;
        default:
            if (donvi != 0) {
                KetQua += ChuSo[donvi];
            }
            break;
    }
    return KetQua;
};

const convertToHyphenatedString = (str) => {
    // Replace all spaces with hyphens
    return str.replace(/\s+/g, '-');
};

module.exports = {
    DocTienBangChu,
    convertToHyphenatedString,
}
require('dotenv').config();

module.exports.getDateNow = () => {
    const date = new Date();
    date.setHours(date.getHours() + parseInt(process.env.GMT))
    return date;
}

module.exports.getDateTomorrow = () => {
    const date = this.getDateNow();
    date.setDate(date.getDate() + 1);
    return date;
}

module.exports.convertToStringTime = (date) => {
    let stringDate;
    if (date instanceof Date) {
        stringDate = date.toISOString().split('.')[0];

    } else {
        stringDate = date.split('.')[0];
    }
    return `${stringDate.split('T')[0]} ${stringDate.split('T')[1]}`
}

module.exports.convertToStringDate = (date) => {
    if (date != null) {
        let stringDate;
        if (date instanceof Date) {
            stringDate = date.toISOString().split('.')[0].split('T')[0].split('-');

        } else {
            stringDate = date.split('.')[0].split('T')[0].split('-');
        }
        if (stringDate.length == 3) {
            return `${stringDate[2]}/${stringDate[1]}/${stringDate[0]}`;
        } else {
            return date;
        }
    } else {
        return date;
    }

}
module.exports.dmy2dbdate = function (date) {
    if (date == '') return '';
    date = date.replaceAll('_', '')
    var arr = date.split('/');
    return `${arr[2]}-${arr[1]}-${arr[0]}`;
}

module.exports.dmY2YMd = function (date) {
    if (date == '') return '';

    var strdate = date.replace('/', '_').replace('/', '_');
    strdate = strdate.replace('-', '_').replace('-', '_');
    var arr = strdate.split('_');
    return `${arr[2]}-${arr[1]}-${arr[0]}`;
}

module.exports.now2String = function () {
    var strdate = '';
    var arr = [];
    var date = new Date();
    var year = date.getFullYear();
    var currmonth = date.getMonth() + 1;
    var month = ('' + currmonth).length == 1 ? '0' + currmonth : currmonth;
    var day = ('' + date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate();
    var hour = ('' + date.getHours()).length == 1 ? '0' + date.getHours() : date.getHours();
    var min = ('' + date.getMinutes()).length == 1 ? '0' + date.getMinutes() : date.getMinutes();
    var sec = ('' + date.getSeconds()).length == 1 ? '0' + date.getSeconds() : date.getSeconds();

    strdate = `${year}${month}${day}${hour}${min}${sec}`;
    arr.push(strdate);
    strdate = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    arr.push(strdate);
    strdate = `${year}-${month}-${day}`;
    arr.push(strdate);
    return arr;
};

module.exports.convertYMD = function (indate) {

    var str = String(indate);
    var datearr = str.split('_');
    return datearr[2] + '-' + datearr[1] + '-' + datearr[0];
}

module.exports.convertYMDWithMinus = function (indate) {
    var str = String(indate);
    var datearr = str.split('_');
    return datearr[2] + '-' + datearr[1] + '-' + datearr[0];
}

module.exports.getSignedDate = function (signedDate, createDate, dateSign) {
    var _signedDate = this.c2DatetimeDB(signedDate);
    var _createDate = this.c2DatetimeDB(createDate);
    var _dateSign = this.c2DatetimeDB(dateSign);

    var signedDate_ = new Date(_signedDate.replaceAll('-', ','));
    var createDate_ = new Date(_createDate.replaceAll('-', ','));
    var dateSign_ = new Date(_dateSign.replaceAll('-', ','));
    if (dateSign_ < signedDate_) dateSign = signedDate;
    if (dateSign_ < createDate_) dateSign = createDate;
    // var day = (dateSign.getDate() + '').length ==1?('0' + dateSign.getDate()):dateSign.getDate();
    // var month = ((dateSign.getMonth() + 1) + '').length == 1?'0' + (dateSign.getMonth() + 1):(dateSign.getMonth() + 1);
    // var year = dateSign.getFullYear();
    return dateSign;
}

module.exports.c2DatetimeDB = function (indate) {
    if (indate == '') return '';
    var strdate = indate.replaceAll('/', '-');
    strdate = strdate.replaceAll('_', '-');
    var arr = strdate.split('-');
    if (arr[0].length != 4) {
        strdate = `${arr[2]}-${('0' + arr[1]).slice(-2)}-${('0' + arr[0]).slice(-2)}`;
    } else {
        strdate = `${arr[0]}-${('0' + arr[1]).slice(-2)}-${('0' + arr[2]).slice(-2)}`;
    }
    return strdate;
}
module.exports.c2DatetimeLocal = function (indate) {
    if (indate == '' || indate === undefined) return '';
    var strdate = indate.replaceAll('/', '-');
    strdate = strdate.replaceAll('_', '-');
    var arr = strdate.split('-');
    if (arr[0].length == 4) {
        strdate = `${('0' + arr[2]).slice(-2)}-${('0' + arr[1]).slice(-2)}-${arr[0]}`;
    }
    return strdate;
}
module.exports.newDateTime = function () {
    var date = new Date();
    return `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}:${date.getMilliseconds().toString().slice(-2)}`;
}
module.exports.getToday = function () {
    var date = new Date();
    var month = '0' + (date.getMonth() + 1);
    var day = '0' + date.getDate();
    var ret = `${date.getFullYear()}-${month.slice(-2)}-${day.slice(-2)}`;
    return ret;
}
module.exports.getTodayLocal = function () {
    var date = new Date();
    var month = '0' + (date.getMonth() + 1);
    var day = '0' + date.getDate();
    var ret = `${day.slice(-2)}/${month.slice(-2)}/${date.getFullYear()}`;
    return ret;
}

module.exports.isToday = function (datein) {
    var today = this.getToday();
    var indate = this.c2DatetimeDB(datein);
    var ret = (today == indate ? true : false);
    return ret;
}

module.exports.compareDate = function (date1, date2) {
    var _date1 = this.c2DatetimeDB(date1);
    var _date2 = this.c2DatetimeDB(date2);
    var arr = _date1.split('-');
    date1 = new Date(`${arr[2]},${arr[1]},${arr[0]}`);
    arr = _date2.split('-');
    date2 = new Date(`${arr[2]},${arr[1]},${arr[0]}`);

    if (date1 < date2) return -1;
    if (date1 == date2) return 0;
    if (date1 > date2) return 1;
}
module.exports.compareDateGetMax = function (date1, date2) {
    var _date1 = this.c2DatetimeDB(date1);
    var _date2 = this.c2DatetimeDB(date2);
    var arr = _date1.split('-');
    var date1_ = new Date(_date1.replaceAll('-', ','));
    var date2_ = new Date(_date2.replaceAll('-', ','));
    // var date1_ = new Date(`${arr[2]},${arr[0]},${arr[1]}`);
    // arr = _date2.split('-');
    // var date2_ = new Date(`${arr[2]},${arr[0]},${arr[1]}`);

    if (date1_ < date2_) {
        return date2;
    } else if (date1_ > date2_) {
        return date1;
    } else {
        return date1;
    }
}
module.exports.compareToday = function (date1) {
    try {
        var _date1 = this.c2DatetimeDB(date1);
        var arr = _date1.split('-');
        date1 = new Date(_date1);
        var date2 = new Date();
        date1.setHours(0, 0, 0);
        date2.setHours(0, 0, 0);
        var msPerDay = 8.64e7;
        var ret = parseInt(Math.round((date1 - date2) / msPerDay));
        return ret;
    } catch (e) {
        return 0;
    }

}
module.exports.addDate = function (dateStr, days) {
    try {
        var result = new Date(new Date(dateStr).setDate(new Date(dateStr).getDate() + days));
        return result.toISOString().substring(0, 10);
    } catch (e) {
        return null;
    }

}


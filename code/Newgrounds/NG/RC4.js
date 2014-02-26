(function(exports){

    var sbox = new Array(0xFF);
    var mykey = new Array(0xFF);

    var encrypt = function(_arg1, _arg2){
        var _local3 = strToChars(_arg1);
        var _local4 = strToChars(_arg2);
        var _local5 = calculate(_local3, _local4);
        return (charsToHex(_local5));
    }
    var encryptbin = function(_arg1, _arg2){
        var _local3 = strToChars(_arg1);
        var _local4 = strToChars(_arg2);
        var _local5 = calculate(_local3, _local4);
        return (_local5);
    }
    var decrypt = function(_arg1, _arg2){
        var _local3 = hexToChars(_arg1);
        var _local4 = strToChars(_arg2);
        var _local5 = calculate(_local3, _local4);
        return (charsToStr(_local5));
    }
    var initialize = function(_arg1){
        var _local3 = 0;
        var _local2 = 0;
        var _local4 = _arg1.length;
        var _local5 = 0;
        while (_local5 <= 0xFF) {
            mykey[_local5] = _arg1[(_local5 % _local4)];
            sbox[_local5] = _local5;
            _local5++;
        };
        _local5 = 0;
        while (_local5 <= 0xFF) {
            _local2 = (((_local2 + sbox[_local5]) + mykey[_local5]) % 0x0100);
            _local3 = sbox[_local5];
            sbox[_local5] = sbox[_local2];
            sbox[_local2] = _local3;
            _local5++;
        };
    }
    var calculate = function(_arg1, _arg2){
        var _local6 = 0;
        var _local7 = 0;
        var _local8 = 0;
        var _local10 = 0;
        initialize(_arg2);
        var _local3 = 0;
        var _local4 = 0;
        var _local5 = new Array();
        var _local9 = 0;
        while (_local9 < _arg1.length) {
            _local3 = ((_local3 + 1) % 0x0100);
            _local4 = ((_local4 + sbox[_local3]) % 0x0100);
            _local7 = sbox[_local3];
            sbox[_local3] = sbox[_local4];
            sbox[_local4] = _local7;
            _local10 = ((sbox[_local3] + sbox[_local4]) % 0x0100);
            _local6 = sbox[_local10];
            _local8 = (_arg1[_local9] ^ _local6);
            _local5.push(_local8);
            _local9++;
        };
        return (_local5);
    }
    var charsToHex = function(_arg1){
        var _local2 = new String("");
        var _local3 = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
        var _local4 = 0;
        while (_local4 < _arg1.length) {
            _local2 = (_local2 + (_local3[(_arg1[_local4] >> 4)] + _local3[(_arg1[_local4] & 15)]));
            _local4++;
        };
        return (_local2);
    }
    var hexToChars = function(_arg1){
        var _local2 = new Array();
        var _local3 = ((_arg1.substr(0, 2))=="0x") ? 2 : 0;
        while (_local3 < _arg1.length) {
            _local2.push(parseint(_arg1.substr(_local3, 2), 16));
            _local3 = (_local3 + 2);
        };
        return (_local2);
    }
    var charsToStr = function(_arg1){
        var _local2 = new String("");
        var _local3 = 0;
        while (_local3 < _arg1.length) {
            _local2 = (_local2 + string.fromCharCode(_arg1[_local3]));
            _local3++;
        };
        return (_local2);
    }
    var strToChars = function(_arg1){
        var _local2 = new Array();
        var _local3 = 0;
        while (_local3 < _arg1.length) {
            _local2.push(_arg1.charCodeAt(_local3));
            _local3++;
        };
        return (_local2);
    }

    // PUBLIC

    exports.RC4 = {

        encrypt: encrypt,
        encryptbin: encryptbin,
        decrypt: decrypt

    };

})(window);
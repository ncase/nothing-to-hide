
function BaseN(_arg1){

    var DEFAULT_HASH = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~@#$%^&*()+|;/";

    var _hash;
    var _base;
    var _reverseHash;

    //function BaseN(_arg1){

    if (_arg1){
        this._hash = _arg1;
    } else {
        this._hash = DEFAULT_HASH;
    };
    this._base = this._hash.length;
    this._reverseHash = {};
    var _local2;
    while (_local2 < this._hash.length) {
        this._reverseHash[this._hash.charAt(_local2)] = _local2;
        _local2++;
    };

    //}

    this.encodeUint = function(_arg1, _arg2){
    	_arg2 = (_arg2===undefined) ? 1 : _arg2;
        var _local3 = "";
        var _local4 = _arg1;
        while (_local4 != 0) {
            _local3 = (this._hash.charAt((_local4 % this._base)) + _local3);
            _local4 = Math.floor(_local4 / this._base);
        };
        while (_local3.length < _arg2) {
            _local3 = (this._hash.charAt(0) + _local3);
        };
        return (_local3);
    }

    this.decodeUint = function(_arg1){
        var _local2;
        var _local3;
        while (_local3 < _arg1.length) {
            _local2 = (_local2 * this._base);
            _local2 = (_local2 + this._reverseHash[_arg1.charAt(_local3)]);
            _local3++;
        };
        return (_local2);
    }

}
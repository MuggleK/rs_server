_$a8t=[
    14,
    0.26,
    18,
    3395469782,
    68,
    90,
    52,
    0.8,
    360,
    25,
    99,
    4,
    127,
    40,
    100,
    12,
    45,
    92,
    126,
    79,
    239,
    3337565984,
    31,
    57,
    192,
    512,
    1859775393,
    11,
    67108864,
    524288,
    65537,
    5440,
    4294967296,
    60,
    255,
    19,
    63,
    1073741824,
    2048,
    268435455,
    50000,
    1001,
    65535,
    0.9,
    97,
    2000,
    268435456,
    0.2,
    51,
    36,
    -4,
    131072,
    45,
    31,
    63,
    0.01,
    2531011,
    -90,
    257,
    13,
    128,
    128,
    89,
    -100,
    40960,
    300000,
    32,
    224,
    59,
    2097151,
    5000,
    28,
    64,
    1100,
    16843008,
    248,
    2654435769,
    9,
    26,
    3,
    -0.01,
    -180,
    75,
    20000,
    8388608,
    201,
    90,
    1732584193,
    8192,
    200,
    3285377520,
    65,
    24,
    23,
    39,
    1518500249,
    103,
    2592000,
    102,
    4023233417,
    2047,
    33554432,
    -0.9,
    134217727,
    134217728,
    63,
    2,
    10,
    15,
    0.4,
    100,
    33,
    20,
    4294967295,
    30,
    8,
    46,
    93,
    29,
    254,
    252,
    0.5,
    0.35,
    37,
    256,
    34,
    -0.2,
    15,
    65535,
    203,
    1024,
    17,
    21,
    0.6,
    4096,
    255,
    22,
    283,
    2000000000,
    1048576,
    16384,
    3988292384,
    58,
    65536,
    1500,
    -0.26,
    80,
    100000,
    127,
    50,
    27,
    48,
    255,
    0.813264543,
    49,
    65280,
    2562383102,
    15,
    41,
    82,
    2097151,
    120,
    16777216,
    16777215,
    1000,
    122,
    10000,
    53,
    536870912,
    2400959708,
    7396,
    4294967295,
    254,
    15679,
    -1,
    271733878,
    0.1,
    86,
    16383,
    5,
    35,
    32768,
    6,
    38,
    43,
    240,
    16,
    262144,
    16843009,
    86400000,
    224,
    2147483648,
    7,
    91,
    180
]
function _$Nw() {
    this._$vx = _$do;
    this._$J6 = _$pJ;
    this._$bi = [_$a8t[87], _$a8t[99], _$a8t[156], _$a8t[175], _$a8t[90]];
    this._$hC = [_$a8t[95], _$a8t[26], _$a8t[169], _$a8t[3]];
    this._$qn = _$_J;
    this._$6h=[];
    function _$do(_$Pt) {
        if (typeof _$Pt === 'string')
            _$Pt = _$qRR(_$Pt);
        var _$P1 = this._$6h = this._$6h['concat'](_$Pt);
        this._$Kh += _$Pt.length;
        while (_$P1.length >= _$a8t[72]) {
            this._$qn(_$mFF(_$P1['splice'](0, _$a8t[72])));
        }
        return this;
    }
    function _$pJ() {
        var _$P1, _$gt, _$xZ = this._$6h, _$II = this._$gQ, _$zI = 'length';
        _$xZ.push(_$a8t[61]);
        for (_$P1 = _$xZ.length + _$a8t[106] * _$a8t[11]; _$P1 & _$a8t[54]; _$P1++) {
            _$xZ.push(0);
        }
        while (_$xZ[_$zI] >= _$a8t[72]) {
            this._$qn(_$mFF(_$xZ['splice'](0, _$a8t[72])));
        }
        _$xZ = _$mFF(_$xZ);
        _$xZ.push(Math.floor(this._$Kh * _$a8t[115] / _$a8t[32]));
        _$xZ.push(this._$Kh * _$a8t[115] | 0);
        this._$qn(_$xZ);
        _$zI = _$II.length;
        var _$iS = new Array(_$zI * _$a8t[11]);
        for (_$P1 = _$gt = 0; _$P1 < _$zI; ) {
            var _$BO = _$II[_$P1++];
            _$iS[_$gt++] = (_$BO >>> _$a8t[92]) & _$a8t[152];
            _$iS[_$gt++] = (_$BO >>> _$a8t[186]) & _$a8t[152];
            _$iS[_$gt++] = (_$BO >>> _$a8t[115]) & _$a8t[152];
            _$iS[_$gt++] = _$BO & _$a8t[152];
        }
        return _$iS;
    }
    function _$_J(_$Pt) {
        var _$P1, _$gt, _$xZ, _$II, _$zI, _$iS, _$BO, _$_J = _$Pt['slice'](0), _$FB = this._$gQ, _$FU, _$ka, _$do = 'floor';
        _$xZ = _$FB[0];
        _$II = _$FB[1];
        _$zI = _$FB[2];
        _$iS = _$FB[3];
        _$BO = _$FB[4];
        for (_$P1 = 0; _$P1 <= _$a8t[19]; _$P1++) {
            if (_$P1 >= _$a8t[186]) {
                _$FU = _$_J[_$P1 - _$a8t[79]] ^ _$_J[_$P1 - _$a8t[115]] ^ _$_J[_$P1 - _$a8t[0]] ^ _$_J[_$P1 - _$a8t[186]];
                _$_J[_$P1] = (_$FU << 1) | (_$FU >>> _$a8t[53]);
            }
            _$FU = (_$xZ << _$a8t[179]) | (_$xZ >>> _$a8t[150]);
            if (_$P1 <= _$a8t[35]) {
                _$ka = (_$II & _$zI) | (~_$II & _$iS);
            } else if (_$P1 <= _$a8t[94]) {
                _$ka = _$II ^ _$zI ^ _$iS;
            } else if (_$P1 <= _$a8t[68]) {
                _$ka = (_$II & _$zI) | (_$II & _$iS) | (_$zI & _$iS);
            } else if (_$P1 <= _$a8t[19]) {
                _$ka = _$II ^ _$zI ^ _$iS;
            }
            _$gt = (_$FU + _$ka + _$BO + _$_J[_$P1] + this._$hC[Math[_$do](_$P1 / _$a8t[112])]) | 0;
            _$BO = _$iS;
            _$iS = _$zI;
            _$zI = (_$II << _$a8t[114]) | (_$II >>> _$a8t[106]);
            _$II = _$xZ;
            _$xZ = _$gt;
        }
        _$FB[0] = (_$FB[0] + _$xZ) | 0;
        _$FB[1] = (_$FB[1] + _$II) | 0;
        _$FB[2] = (_$FB[2] + _$zI) | 0;
        _$FB[3] = (_$FB[3] + _$iS) | 0;
        _$FB[4] = (_$FB[4] + _$BO) | 0;
    }
}

function _$mFF(_$vm) {
    var _$do = _$vm.length / _$a8t[11]
      , _$pJ = 0
      , _$_J = 0
      , _$FU = _$vm.length;
    var _$fW = new Array(_$do);
    while (_$pJ < _$FU) {
        _$fW[_$_J++] = ((_$vm[_$pJ++] << _$a8t[92]) | (_$vm[_$pJ++] << _$a8t[186]) | (_$vm[_$pJ++] << _$a8t[115]) | (_$vm[_$pJ++]));
    }
    return _$fW;
}

function _$CX() {
    this._$gQ = [_$a8t[87], _$a8t[99], _$a8t[156], _$a8t[175], _$a8t[90]]["slice"](0);
    this._$6h = [];
    this._$Kh = 0;
}
_$CX["prototype"] = new _$Nw()

function _$qn(_$vm) {
    if (!_$vm || typeof (_$vm) != 'string') {
        return [];
    }
    var _$do = _$vm.length
      , _$pJ = new Array(Math.floor(_$do * _$a8t[79] / _$a8t[11]));
    var _$_J, _$FU, _$fW, _$FB;
    var _$II = 0
      , _$Wv = 0
      , _$7h = _$do - _$a8t[79];
    for (_$II = 0; _$II < _$7h; ) {
        _$_J = String.prototype.charCodeAt.call(_$vm, _$II++);
        _$FU =String.prototype.charCodeAt.call(_$vm, _$II++);
        _$fW = String.prototype.charCodeAt.call(_$vm, _$II++);
        _$FB =String.prototype.charCodeAt.call(_$vm, _$II++);
        _$pJ[_$Wv++] = _$bts[_$_J] | _$oys[_$FU];
        _$pJ[_$Wv++] = _$vZv[_$FU] | _$ija[_$fW];
        _$pJ[_$Wv++] = _$e53[_$fW] | _$Dcb[_$FB];
    }
    if (_$II < _$do) {
        _$_J =String.prototype.charCodeAt.call(_$vm, _$II++);
        _$FU = String.prototype.charCodeAt.call(_$vm, _$II++);
        _$pJ[_$Wv++] = _$bts[_$_J] | _$oys[_$FU];
        if (_$II < _$do) {
            _$fW = String.prototype.charCodeAt.call(_$vm, _$II);
            _$pJ[_$Wv++] = _$vZv[_$FU] | _$ija[_$fW];
        }
    }
    return _$pJ;
}

_$bts = [], _$oys = [], _$vZv = [], _$ija = [], _$e53 = [], _$Dcb = [];
_$p26 = ["q","r","c","k","l","m","D","o","E","x","t","h","W","J","i","H","A","p","1","s","V","Y","K","U","3",
"R","F","M","Q","w","8","I","G","f","P","O","9","2","b","v","L","N","j",".","7","z","X","B","a","S","n","u","0",
"T","C","6","g","y","_","4","Z","e","5","d","{","}","|","~"," ","!","#","$","%","(",")","*","+",",","-",";","=",
"?","@","[","]","^"];
function _$Lc() {
    for (var _$do = 0; _$do <= _$a8t[135]; _$do++) {
        _$Dcb[_$do] = _$a8t[174];
    }
    for (var _$do = 0; _$do < _$p26.length; _$do++) {
        var _$pJ =String.prototype.charCodeAt.call(_$p26[_$do], 0);
        _$bts[_$pJ] = _$do << _$a8t[106];
        _$oys[_$pJ] = _$do >> _$a8t[11];
        _$vZv[_$pJ] = (_$do & _$a8t[108]) << _$a8t[11];
        _$ija[_$pJ] = _$do >> _$a8t[106];
        _$e53[_$pJ] = (_$do & _$a8t[79]) << _$a8t[182];
        _$Dcb[_$pJ] = _$do;
    }
}

function _$Jt(_$vm) {
    return unescape(encodeURIComponent(_$vm));
}

function _$qRR(_$vm) {
    var _$do, _$pJ = 0, _$_J;
    _$vm = _$Jt(_$vm);
    _$_J = _$vm.length;
    _$do = new Array(_$_J);
    _$_J -= _$a8t[79];
    while (_$pJ < _$_J) {
        _$do[_$pJ] = String.prototype.charCodeAt.call(_$vm, _$pJ++);
        _$do[_$pJ] = String.prototype.charCodeAt.call(_$vm, _$pJ++);
        _$do[_$pJ] = String.prototype.charCodeAt.call(_$vm, _$pJ++);
        _$do[_$pJ] = String.prototype.charCodeAt.call(_$vm, _$pJ++);
    }
    _$_J += _$a8t[79];
    while (_$pJ < _$_J)
        _$do[_$pJ] = String.prototype.charCodeAt.call(_$vm, _$pJ++);
    return _$do;
}

function _$$87(_$vm, _$8t) {
    if (typeof _$vm === "string")
        _$vm = _$qRR(_$vm);
    _$8t = _$8t || _$p26;
    var _$do, _$pJ = 0, _$_J = 0, _$FU = _$vm.length, _$fW, _$FB;
    _$do = new Array(Math["ceil"](_$FU * _$a8t[11] / _$a8t[79]));
    _$FU = _$vm.length - _$a8t[106];
    while (_$pJ < _$FU) {
        _$fW = _$vm[_$pJ++];
        _$do[_$_J++] = _$8t[_$fW >> _$a8t[106]];
        _$FB = _$vm[_$pJ++];
        _$do[_$_J++] = _$8t[((_$fW & _$a8t[79]) << _$a8t[11]) | (_$FB >> _$a8t[11])];
        _$fW = _$vm[_$pJ++];
        _$do[_$_J++] = _$8t[((_$FB & _$a8t[108]) << _$a8t[106]) | (_$fW >> _$a8t[182])];
        _$do[_$_J++] = _$8t[_$fW & _$a8t[105]];
    }
    if (_$pJ < _$vm.length) {
        _$fW = _$vm[_$pJ];
        _$do[_$_J++] = _$8t[_$fW >> _$a8t[106]];
        _$FB = _$vm[++_$pJ];
        _$do[_$_J++] = _$8t[((_$fW & _$a8t[79]) << _$a8t[11]) | (_$FB >> _$a8t[11])];
        if (_$FB !== undefined) {
            _$do[_$_J++] = _$8t[(_$FB & _$a8t[108]) << _$a8t[106]];
        }
    }
    return _$do.join('');
}

function _$gy() {
    var _$GZ = [[], [], [], [], []];
    var _$y0 = [[], [], [], [], []];
    _$gPX = _$do;
    function _$do(_$Pt) {
        return [_$GZ, _$y0];
    }
}
_$gy()

function _$qKT(_$7W) {
    return (new _$CX())._$vx(_$7W)._$J6();
}

_$Lc();

function get_fp_array(){
    array_0_1 = _$qn(_$$87(_$qKT(Math.random().toString())))
    array_0_2 = _$qn(_$$87(_$qKT(Math.random().toString())))
    array_0_3 = _$qn(_$$87(_$qKT(Math.random().toString())))
    array_0_4 = _$qn(_$$87(_$qKT(Math.random().toString())))
    array_0_5 = _$qn(_$$87(_$qKT(Math.random().toString())))
    // array_0=[47].concat(array_0_1).concat(array_0_2).concat(array_0_3).concat(array_0_4).concat(array_0_5)
    array_0 = [39].concat(array_0_1).concat(array_0_2).concat(array_0_3).concat(array_0_4)
    return array_0
}

module.exports = {
    get_fp_array,
}

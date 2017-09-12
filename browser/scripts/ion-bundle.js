(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ion = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IonBinaryReader_1 = require("./IonBinaryReader");
var IonConstants_1 = require("./IonConstants");
var IonSpan_1 = require("./IonSpan");
var IonTextReader_1 = require("./IonTextReader");
var IonTextWriter_1 = require("./IonTextWriter");
var IonWriteable_1 = require("./IonWriteable");
var IonBinaryWriter_1 = require("./IonBinaryWriter");
var IonLocalSymbolTable_1 = require("./IonLocalSymbolTable");
var e = {
    name: "IonError",
    where: undefined,
    msg: "error"
};
function get_buf_type(buf) {
    var firstByte = typeof buf === 'string' ? buf.charCodeAt(0) : buf[0];
    return firstByte === IonConstants_1.IVM.binary[0] ? 'binary' : 'text';
}
function makeBinaryReader(span, options) {
    return new IonBinaryReader_1.BinaryReader(span, options && options.catalog);
}
function makeTextReader(span, options) {
    return new IonTextReader_1.TextReader(span, options && options.catalog, options && options.raw_tokens);
}
function makeTextTokenizer(source) {
    var span = new IonSpan_1.StringSpan(source);
    var reader = new IonTextReader_1.TextReader(span, undefined, true);
    return reader.raw_parser();
}
exports.makeTextTokenizer = makeTextTokenizer;
function makeReader(buf, options) {
    var stype = options && isSourceType(options.sourceType) ? options.sourceType : get_buf_type(buf);
    var reader = stype === 'binary' ? makeBinaryReader(new IonSpan_1.BinarySpan(buf), options) : makeTextReader(new IonSpan_1.StringSpan(buf), options);
    return reader;
}
exports.makeReader = makeReader;
function isSourceType(val) {
    return val === 'text' || val === 'binary';
}
function makeTextWriter() {
    return new IonTextWriter_1.TextWriter(new IonWriteable_1.Writeable());
}
exports.makeTextWriter = makeTextWriter;
function makeBinaryWriter() {
    var localSymbolTable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IonLocalSymbolTable_1.defaultLocalSymbolTable();

    return new IonBinaryWriter_1.BinaryWriter(localSymbolTable, new IonWriteable_1.Writeable());
}
exports.makeBinaryWriter = makeBinaryWriter;
var IonCatalog_1 = require("./IonCatalog");
exports.Catalog = IonCatalog_1.Catalog;
var IonDecimal_1 = require("./IonDecimal");
exports.Decimal = IonDecimal_1.Decimal;
var IonLocalSymbolTable_2 = require("./IonLocalSymbolTable");
exports.defaultLocalSymbolTable = IonLocalSymbolTable_2.defaultLocalSymbolTable;
var IonTypes_1 = require("./IonTypes");
exports.IonTypes = IonTypes_1.IonTypes;
var IonPrecision_1 = require("./IonPrecision");
exports.Precision = IonPrecision_1.Precision;
var IonSharedSymbolTable_1 = require("./IonSharedSymbolTable");
exports.SharedSymbolTable = IonSharedSymbolTable_1.SharedSymbolTable;
var IonTimestamp_1 = require("./IonTimestamp");
exports.Timestamp = IonTimestamp_1.Timestamp;
var IonText_1 = require("./IonText");
exports.toBase64 = IonText_1.toBase64;
var IonBinary_1 = require("./IonBinary");
exports.TypeCodes = IonBinary_1.TypeCodes;
var IonParserTextRaw_1 = require("./IonParserTextRaw");
exports.getIonType = IonParserTextRaw_1.getIonType;


},{"./IonBinary":2,"./IonBinaryReader":3,"./IonBinaryWriter":4,"./IonCatalog":5,"./IonConstants":6,"./IonDecimal":7,"./IonLocalSymbolTable":9,"./IonParserTextRaw":13,"./IonPrecision":14,"./IonSharedSymbolTable":15,"./IonSpan":16,"./IonText":20,"./IonTextReader":21,"./IonTextWriter":22,"./IonTimestamp":23,"./IonTypes":25,"./IonWriteable":28}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NIBBLE_MASK = 0xf;
exports.BYTE_MASK = 0xff;
exports.TYPE_SHIFT = 4;
exports.BYTE_SHIFT = 8;
exports.LEN_MASK = 0xf;
exports.LEN_VAR = 14;
exports.LEN_NULL = 15;
exports.TB_NULL = 0;
exports.TB_BOOL = 1;
exports.TB_INT = 2;
exports.TB_NEG_INT = 3;
exports.TB_FLOAT = 4;
exports.TB_DECIMAL = 5;
exports.TB_TIMESTAMP = 6;
exports.TB_SYMBOL = 7;
exports.TB_STRING = 8;
exports.TB_CLOB = 9;
exports.TB_BLOB = 10;
exports.TB_LIST = 11;
exports.TB_SEXP = 12;
exports.TB_STRUCT = 13;
exports.TB_ANNOTATION = 14;
var TypeCodes;
(function (TypeCodes) {
    TypeCodes[TypeCodes["NULL"] = 0] = "NULL";
    TypeCodes[TypeCodes["BOOL"] = 1] = "BOOL";
    TypeCodes[TypeCodes["POSITIVE_INT"] = 2] = "POSITIVE_INT";
    TypeCodes[TypeCodes["NEGATIVE_INT"] = 3] = "NEGATIVE_INT";
    TypeCodes[TypeCodes["FLOAT"] = 4] = "FLOAT";
    TypeCodes[TypeCodes["DECIMAL"] = 5] = "DECIMAL";
    TypeCodes[TypeCodes["TIMESTAMP"] = 6] = "TIMESTAMP";
    TypeCodes[TypeCodes["SYMBOL"] = 7] = "SYMBOL";
    TypeCodes[TypeCodes["STRING"] = 8] = "STRING";
    TypeCodes[TypeCodes["CLOB"] = 9] = "CLOB";
    TypeCodes[TypeCodes["BLOB"] = 10] = "BLOB";
    TypeCodes[TypeCodes["LIST"] = 11] = "LIST";
    TypeCodes[TypeCodes["SEXP"] = 12] = "SEXP";
    TypeCodes[TypeCodes["STRUCT"] = 13] = "STRUCT";
    TypeCodes[TypeCodes["ANNOTATION"] = 14] = "ANNOTATION";
})(TypeCodes = exports.TypeCodes || (exports.TypeCodes = {}));


},{}],3:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonCatalog_1 = require("./IonCatalog");
var IonLocalSymbolTable_1 = require("./IonLocalSymbolTable");
var IonSymbols_1 = require("./IonSymbols");
var IonType_1 = require("./IonType");
var IonTypes_1 = require("./IonTypes");
var IonConstants_1 = require("./IonConstants");
var IonSymbols_2 = require("./IonSymbols");
var IonParserBinaryRaw_1 = require("./IonParserBinaryRaw");
var RAW_STRING = new IonType_1.IonType(-1, "raw_input", true, false, false, false);
var ERROR = -3;
var BOC = -2;
var EOF = -1;
var TB_NULL = 0;
var TB_BOOL = 1;
var TB_INT = 2;
var TB_NEG_INT = 3;
var TB_FLOAT = 4;
var TB_DECIMAL = 5;
var TB_TIMESTAMP = 6;
var TB_SYMBOL = 7;
var TB_STRING = 8;
var TB_CLOB = 9;
var TB_BLOB = 10;
var TB_SEXP = 11;
var TB_LIST = 12;
var TB_STRUCT = 13;
var TB_ANNOTATION = 14;
var TB_UNUSED__ = 15;
var TB_DATAGRAM = 20;
var TB_SEXP_CLOSE = 21;
var TB_LIST_CLOSE = 22;
var TB_STRUCT_CLOSE = 23;
function get_ion_type(t) {
    switch (t) {
        case TB_NULL:
            return IonTypes_1.IonTypes.NULL;
        case TB_BOOL:
            return IonTypes_1.IonTypes.BOOL;
        case TB_INT:
            return IonTypes_1.IonTypes.INT;
        case TB_NEG_INT:
            return IonTypes_1.IonTypes.INT;
        case TB_FLOAT:
            return IonTypes_1.IonTypes.FLOAT;
        case TB_DECIMAL:
            return IonTypes_1.IonTypes.DECIMAL;
        case TB_TIMESTAMP:
            return IonTypes_1.IonTypes.TIMESTAMP;
        case TB_SYMBOL:
            return IonTypes_1.IonTypes.SYMBOL;
        case TB_STRING:
            return IonTypes_1.IonTypes.STRING;
        case TB_CLOB:
            return IonTypes_1.IonTypes.CLOB;
        case TB_BLOB:
            return IonTypes_1.IonTypes.BLOB;
        case TB_SEXP:
            return IonTypes_1.IonTypes.SEXP;
        case TB_LIST:
            return IonTypes_1.IonTypes.LIST;
        case TB_STRUCT:
            return IonTypes_1.IonTypes.STRUCT;
        default:
            return undefined;
    }
    ;
}

var BinaryReader = function () {
    function BinaryReader(source, catalog) {
        (0, _classCallCheck3.default)(this, BinaryReader);

        this._parser = new IonParserBinaryRaw_1.ParserBinaryRaw(source);
        this._cat = catalog || new IonCatalog_1.Catalog();
        this._symtab = IonLocalSymbolTable_1.defaultLocalSymbolTable();
        this._raw_type = BOC;
    }

    (0, _createClass3.default)(BinaryReader, [{
        key: "next",
        value: function next() {
            var t = this;
            var p, rt;
            if (t._raw_type === EOF) return undefined;
            p = t._parser;
            for (;;) {
                t._raw_type = rt = p.next();
                if (t.depth() > 0) break;
                if (rt === TB_SYMBOL) {
                    var raw = p.numberValue();
                    if (raw !== IonConstants_1.IVM.sid) break;
                    t._symtab = IonLocalSymbolTable_1.defaultLocalSymbolTable();
                } else if (rt === TB_STRUCT) {
                    if (!p.hasAnnotations()) break;
                    if (p.getAnnotation(0) !== IonSymbols_1.ion_symbol_table_sid) break;
                    t._symtab = IonSymbols_2.makeSymbolTable(t._cat, t);
                } else {
                    break;
                }
            }
            return get_ion_type(rt);
        }
    }, {
        key: "stepIn",
        value: function stepIn() {
            var t = this;
            if (!get_ion_type(t._raw_type).container) {
                throw new Error("can't step in to a scalar value");
            }
            t._parser.stepIn();
            t._raw_type = BOC;
        }
    }, {
        key: "stepOut",
        value: function stepOut() {
            var t = this;
            t._parser.stepOut();
            t._raw_type = BOC;
        }
    }, {
        key: "valueType",
        value: function valueType() {
            return get_ion_type(this._raw_type);
        }
    }, {
        key: "depth",
        value: function depth() {
            return this._parser.depth();
        }
    }, {
        key: "fieldName",
        value: function fieldName() {
            var t = this;
            var n, s;
            n = t._parser.getFieldId();
            s = this.getSymbolString(n);
            return s;
        }
    }, {
        key: "hasAnnotations",
        value: function hasAnnotations() {
            return this._parser.hasAnnotations();
        }
    }, {
        key: "getAnnotation",
        value: function getAnnotation(index) {
            var t = this;
            var id, n;
            id = t._parser.getAnnotation(index);
            n = this.getSymbolString(id);
            return n;
        }
    }, {
        key: "isNull",
        value: function isNull() {
            var t = this;
            var is_null = t._raw_type === TB_NULL || t._parser.isNull();
            return is_null;
        }
    }, {
        key: "stringValue",
        value: function stringValue() {
            var t = this;
            var n,
                s,
                p = t._parser;
            if (t.isNull()) {
                s = "null";
                if (t._raw_type != TB_NULL) {
                    s += "." + get_ion_type(t._raw_type).name;
                }
            } else if (get_ion_type(t._raw_type).scalar) {
                if (t._raw_type === TB_SYMBOL) {
                    n = p.numberValue();
                    s = this.getSymbolString(n);
                } else {
                    s = p.stringValue();
                }
            }
            return s;
        }
    }, {
        key: "numberValue",
        value: function numberValue() {
            return this._parser.numberValue();
        }
    }, {
        key: "byteValue",
        value: function byteValue() {
            return this._parser.byteValue();
        }
    }, {
        key: "ionValue",
        value: function ionValue() {
            throw new Error("E_NOT_IMPL: ionValue");
        }
    }, {
        key: "booleanValue",
        value: function booleanValue() {
            return this._parser.booleanValue();
        }
    }, {
        key: "decimalValue",
        value: function decimalValue() {
            return this._parser.decimalValue();
        }
    }, {
        key: "timestampValue",
        value: function timestampValue() {
            return this._parser.timestampValue();
        }
    }, {
        key: "value",
        value: function value() {
            switch (this.valueType()) {
                case IonTypes_1.IonTypes.BLOB:
                case IonTypes_1.IonTypes.CLOB:
                    return this.byteValue();
                case IonTypes_1.IonTypes.BOOL:
                    return this.booleanValue();
                case IonTypes_1.IonTypes.DECIMAL:
                    return this.decimalValue();
                case IonTypes_1.IonTypes.FLOAT:
                case IonTypes_1.IonTypes.INT:
                    return this.numberValue();
                case IonTypes_1.IonTypes.STRING:
                case IonTypes_1.IonTypes.SYMBOL:
                    return this.stringValue();
                case IonTypes_1.IonTypes.TIMESTAMP:
                    return this.timestampValue();
                default:
                    return undefined;
            }
        }
    }, {
        key: "getSymbolString",
        value: function getSymbolString(symbolId) {
            var s = undefined;
            if (symbolId > 0) {
                s = this._symtab.getSymbol(symbolId);
                if (typeof s == 'undefined') {
                    s = "$" + symbolId.toString();
                }
            }
            return s;
        }
    }]);
    return BinaryReader;
}();

exports.BinaryReader = BinaryReader;


},{"./IonCatalog":5,"./IonConstants":6,"./IonLocalSymbolTable":9,"./IonParserBinaryRaw":12,"./IonSymbols":18,"./IonType":24,"./IonTypes":25,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],4:[function(require,module,exports){
"use strict";

var _get2 = require("babel-runtime/helpers/get");

var _get3 = _interopRequireDefault(_get2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonDecimal_1 = require("./IonDecimal");
var IonUnicode_1 = require("./IonUnicode");
var IonUtilities_1 = require("./IonUtilities");
var IonUtilities_2 = require("./IonUtilities");
var IonUtilities_3 = require("./IonUtilities");
var IonUtilities_4 = require("./IonUtilities");
var IonLongInt_1 = require("./IonLongInt");
var IonLowLevelBinaryWriter_1 = require("./IonLowLevelBinaryWriter");
var IonPrecision_1 = require("./IonPrecision");
var IonBinary_1 = require("./IonBinary");
var IonWriteable_1 = require("./IonWriteable");
var MAJOR_VERSION = 1;
var MINOR_VERSION = 0;
var MAX_VALUE_LENGTH = 14;
var MAX_VALUE_LENGTH_FLAG = 14;
var NULL_VALUE_FLAG = 15;
var TYPE_DESCRIPTOR_LENGTH = 1;
var States;
(function (States) {
    States[States["VALUE"] = 0] = "VALUE";
    States[States["STRUCT_FIELD"] = 1] = "STRUCT_FIELD";
    States[States["STRUCT_VALUE"] = 2] = "STRUCT_VALUE";
    States[States["CLOSED"] = 3] = "CLOSED";
})(States || (States = {}));

var BinaryWriter = function () {
    function BinaryWriter(symbolTable, writeable) {
        (0, _classCallCheck3.default)(this, BinaryWriter);

        this.datagram = [];
        this.containers = [];
        this.state = States.VALUE;
        this.symbolTable = symbolTable;
        this.writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(writeable);
    }

    (0, _createClass3.default)(BinaryWriter, [{
        key: "getBytes",
        value: function getBytes() {
            return this.writer.getBytes();
        }
    }, {
        key: "writeBlob",
        value: function writeBlob(value, annotations) {
            this.checkWriteValue();
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(IonBinary_1.TypeCodes.BLOB, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.BLOB, symbolIds, value));
        }
    }, {
        key: "writeBoolean",
        value: function writeBoolean(value, annotations) {
            this.checkWriteValue();
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(IonBinary_1.TypeCodes.BOOL, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            this.addNode(new BooleanNode(this.writer, this.getCurrentContainer(), symbolIds, value));
        }
    }, {
        key: "writeClob",
        value: function writeClob(value, annotations) {
            this.checkWriteValue();
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(IonBinary_1.TypeCodes.CLOB, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.CLOB, symbolIds, value));
        }
    }, {
        key: "writeDecimal",
        value: function writeDecimal(value, annotations) {
            this.checkWriteValue();
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(IonBinary_1.TypeCodes.DECIMAL, annotations);
                return;
            }
            if (IonUtilities_2.isString(value)) {
                value = IonDecimal_1.Decimal.parse(value);
            }
            var symbolIds = this.encodeAnnotations(annotations);
            var isPositiveZero = value.isZero() && !value.isNegative();
            if (isPositiveZero) {
                this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.DECIMAL, symbolIds, []));
                return;
            }
            var exponent = value.getExponent();
            var digits = value.getDigits().byteValue();
            if (value.isNegative()) {
                if (digits.length > 0) {
                    var signBitInUse = (digits[0] & 0x80) > 0;
                    if (signBitInUse) {
                        digits.unshift(0x80);
                    } else {
                        digits[0] |= 0x80;
                    }
                } else {
                    digits = [0x80];
                }
            }
            var writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getVariableLengthSignedIntSize(exponent) + digits.length);
            writer.writeVariableLengthSignedInt(exponent);
            writer.writeBytes(digits);
            this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.DECIMAL, symbolIds, writer.getBytes()));
        }
    }, {
        key: "writeFloat32",
        value: function writeFloat32(value, annotations) {
            this.checkWriteValue();
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(IonBinary_1.TypeCodes.FLOAT, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            var bytes = void 0;
            if (value === 0) {
                bytes = [];
            } else {
                var buffer = new ArrayBuffer(4);
                var dataview = new DataView(buffer);
                dataview.setFloat32(0, value, false);
                bytes = Array['from'](new Uint8Array(buffer));
            }
            this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.FLOAT, symbolIds, bytes));
        }
    }, {
        key: "writeFloat64",
        value: function writeFloat64(value, annotations) {
            this.checkWriteValue();
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(IonBinary_1.TypeCodes.FLOAT, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            var bytes = undefined;
            if (value === 0) {
                bytes = [];
            } else {
                var buffer = new ArrayBuffer(8);
                var dataview = new DataView(buffer);
                dataview.setFloat64(0, value, false);
                bytes = Array['from'](new Uint8Array(buffer));
            }
            this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.FLOAT, symbolIds, bytes));
        }
    }, {
        key: "writeInt",
        value: function writeInt(value, annotations) {
            this.checkWriteValue();
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(IonBinary_1.TypeCodes.POSITIVE_INT, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            var typeCode = void 0;
            var bytes = void 0;
            if (value === 0) {
                typeCode = IonBinary_1.TypeCodes.POSITIVE_INT;
                bytes = [];
            } else if (value > 0) {
                typeCode = IonBinary_1.TypeCodes.POSITIVE_INT;
                var writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getUnsignedIntSize(value));
                writer.writeUnsignedInt(value);
                bytes = writer.getBytes();
            } else {
                typeCode = IonBinary_1.TypeCodes.NEGATIVE_INT;
                var _writer2 = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getUnsignedIntSize(Math.abs(value)));
                _writer2.writeUnsignedInt(Math.abs(value));
                bytes = _writer2.getBytes();
            }
            this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), typeCode, symbolIds, bytes));
        }
    }, {
        key: "writeList",
        value: function writeList(annotations) {
            var isNull = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.checkWriteValue();
            if (isNull) {
                this.writeNull(IonBinary_1.TypeCodes.LIST, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            this.addNode(new SequenceNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.LIST, symbolIds));
        }
    }, {
        key: "writeNull",
        value: function writeNull() {
            var type_ = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IonBinary_1.TypeCodes.NULL;
            var annotations = arguments[1];

            this.checkWriteValue();
            var symbolIds = this.encodeAnnotations(annotations);
            this.addNode(new NullNode(this.writer, this.getCurrentContainer(), type_, symbolIds));
        }
    }, {
        key: "writeSexp",
        value: function writeSexp(annotations) {
            var isNull = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.checkWriteValue();
            if (isNull) {
                this.writeNull(IonBinary_1.TypeCodes.SEXP, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            this.addNode(new SequenceNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.SEXP, symbolIds));
        }
    }, {
        key: "writeString",
        value: function writeString(value, annotations) {
            this.checkWriteValue();
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(IonBinary_1.TypeCodes.STRING, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            var utf8 = IonUnicode_1.encodeUtf8(value);
            this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.STRING, symbolIds, utf8));
        }
    }, {
        key: "writeStruct",
        value: function writeStruct(annotations) {
            var isNull = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.checkWriteValue();
            if (isNull) {
                this.writeNull(IonBinary_1.TypeCodes.STRUCT, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            this.addNode(new StructNode(this.writer, this.getCurrentContainer(), symbolIds));
            this.state = States.STRUCT_FIELD;
        }
    }, {
        key: "writeSymbol",
        value: function writeSymbol(value, annotations) {
            this.checkWriteValue();
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(IonBinary_1.TypeCodes.SYMBOL, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            var symbolId = this.symbolTable.addSymbol(value);
            var writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getUnsignedIntSize(symbolId));
            writer.writeUnsignedInt(symbolId);
            this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.SYMBOL, symbolIds, writer.getBytes()));
        }
    }, {
        key: "writeTimestamp",
        value: function writeTimestamp(value, annotations) {
            this.checkWriteValue();
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(IonBinary_1.TypeCodes.TIMESTAMP, annotations);
                return;
            }
            var symbolIds = this.encodeAnnotations(annotations);
            var writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(12);
            writer.writeVariableLengthSignedInt(value.getOffset());
            writer.writeVariableLengthUnsignedInt(value.getZuluYear());
            if (value.getPrecision() >= IonPrecision_1.Precision.MONTH) {
                writer.writeVariableLengthUnsignedInt(value.getZuluMonth());
            }
            if (value.getPrecision() >= IonPrecision_1.Precision.DAY) {
                writer.writeVariableLengthUnsignedInt(value.getZuluDay());
            }
            if (value.getPrecision() >= IonPrecision_1.Precision.HOUR_AND_MINUTE) {
                writer.writeVariableLengthUnsignedInt(value.getZuluHour());
                writer.writeVariableLengthUnsignedInt(value.getZuluMinute());
            }
            if (value.getPrecision() >= IonPrecision_1.Precision.SECONDS) {
                var seconds = value.getZuluSeconds();
                var exponent = seconds.getExponent();
                if (exponent < 0) {
                    var decimalString = seconds.getDigits().stringValue();
                    var numberOfCharacteristicDigits = decimalString.length + exponent;
                    var characteristic = IonLongInt_1.LongInt.parse(decimalString.slice(0, numberOfCharacteristicDigits)).numberValue();
                    writer.writeVariableLengthUnsignedInt(characteristic);
                    writer.writeVariableLengthSignedInt(exponent);
                    var mantissa = IonLongInt_1.LongInt.parse(decimalString.slice(numberOfCharacteristicDigits)).byteValue();
                    var isLeftmostBitSet = (mantissa[0] & 0x80) > 0;
                    if (isLeftmostBitSet) {
                        mantissa.unshift(0);
                    }
                    writer.writeBytes(mantissa);
                } else {
                    writer.writeVariableLengthUnsignedInt(seconds.numberValue());
                }
            }
            this.addNode(new BytesNode(this.writer, this.getCurrentContainer(), IonBinary_1.TypeCodes.TIMESTAMP, symbolIds, writer.getBytes()));
        }
    }, {
        key: "endContainer",
        value: function endContainer() {
            if (this.isTopLevel()) {
                throw new Error("Not currently in a container");
            }
            if (this.state === States.STRUCT_VALUE) {
                throw new Error("Cannot exit a struct with a partially written field");
            }
            this.containers.pop();
            if (!this.isTopLevel()) {
                this.state = this.getCurrentContainer() instanceof StructNode ? States.STRUCT_FIELD : States.VALUE;
            } else {
                this.state = States.VALUE;
            }
        }
    }, {
        key: "writeIvm",
        value: function writeIvm() {
            this.writer.writeByte(0xE0);
            this.writer.writeByte(MAJOR_VERSION);
            this.writer.writeByte(MINOR_VERSION);
            this.writer.writeByte(0xEA);
        }
    }, {
        key: "writeFieldName",
        value: function writeFieldName(fieldName) {
            if (this.state !== States.STRUCT_FIELD) {
                throw new Error("Cannot write a field name outside of a struct");
            }
            var symbolId = this.encodeAnnotations([fieldName]);
            this.fieldName = symbolId;
            this.state = States.STRUCT_VALUE;
        }
    }, {
        key: "encodeAnnotations",
        value: function encodeAnnotations(annotations) {
            if (!annotations || annotations.length === 0) {
                return [];
            }
            var writeable = new IonWriteable_1.Writeable(annotations.length);
            var writer = new IonLowLevelBinaryWriter_1.LowLevelBinaryWriter(writeable);
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(annotations), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var annotation = _step.value;

                    var symbolId = this.symbolTable.addSymbol(annotation);
                    writer.writeVariableLengthUnsignedInt(symbolId);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return Array['from'](writeable.getBytes());
        }
    }, {
        key: "isTopLevel",
        value: function isTopLevel() {
            return this.containers.length === 0;
        }
    }, {
        key: "getCurrentContainer",
        value: function getCurrentContainer() {
            return IonUtilities_4.last(this.containers);
        }
    }, {
        key: "addNode",
        value: function addNode(node) {
            if (this.isTopLevel()) {
                this.datagram.push(node);
            } else {
                if (this.state === States.STRUCT_VALUE) {
                    this.getCurrentContainer().addChild(node, this.fieldName);
                    this.state = States.STRUCT_FIELD;
                } else {
                    this.getCurrentContainer().addChild(node);
                }
            }
            if (node.isContainer()) {
                this.containers.push(node);
                this.state = States.VALUE;
            }
        }
    }, {
        key: "close",
        value: function close() {
            this.checkClosed();
            while (!this.isTopLevel()) {
                this.endContainer();
            }
            this.writeIvm();
            var datagram = this.datagram;
            this.datagram = [];
            this.writeSymbolTable();
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = (0, _getIterator3.default)(datagram), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var node = _step2.value;

                    node.write();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.state = States.CLOSED;
        }
    }, {
        key: "checkWriteValue",
        value: function checkWriteValue() {
            this.checkClosed();
            if (this.state === States.STRUCT_FIELD) {
                throw new Error("Expected a struct field name instead of a value");
            }
        }
    }, {
        key: "checkClosed",
        value: function checkClosed() {
            if (this.state === States.CLOSED) {
                throw new Error("Writer is closed, no further operations are available");
            }
        }
    }, {
        key: "writeSymbolTable",
        value: function writeSymbolTable() {
            var hasImports = this.symbolTable.import.symbolTable.name != "$ion";
            var hasLocalSymbols = this.symbolTable.symbols.length > 0;
            if (!(hasImports || hasLocalSymbols)) {
                return;
            }
            this.writeStruct(['$ion_symbol_table']);
            if (hasImports) {
                this.writeFieldName('imports');
                this.writeList();
                this.writeImport(this.symbolTable.import);
                this.endContainer();
            }
            if (hasLocalSymbols) {
                this.writeFieldName('symbols');
                this.writeList();
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = (0, _getIterator3.default)(this.symbolTable.symbols), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var symbol_ = _step3.value;

                        if (!IonUtilities_3.isUndefined(symbol_)) {
                            this.writeString(symbol_);
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                this.endContainer();
            }
            this.endContainer();
            this.datagram[0].write();
        }
    }, {
        key: "writeImport",
        value: function writeImport(import_) {
            if (!import_) {
                return;
            }
            this.writeImport(import_.parent);
            this.writeStruct();
            this.writeFieldName('name');
            this.writeString(import_.symbolTable.name);
            this.writeFieldName('version');
            this.writeInt(import_.symbolTable.version);
            this.writeFieldName('max_id');
            this.writeInt(import_.length);
            this.endContainer();
        }
    }]);
    return BinaryWriter;
}();

exports.BinaryWriter = BinaryWriter;

var AbstractNode = function () {
    function AbstractNode(_writer, parent, _typeCode) {
        var annotations = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
        (0, _classCallCheck3.default)(this, AbstractNode);

        this._writer = _writer;
        this.parent = parent;
        this._typeCode = _typeCode;
        this.annotations = annotations;
    }

    (0, _createClass3.default)(AbstractNode, [{
        key: "hasAnnotations",
        value: function hasAnnotations() {
            return this.annotations.length > 0;
        }
    }, {
        key: "writeTypeDescriptorAndLength",
        value: function writeTypeDescriptorAndLength(typeCode, isNull, length) {
            var typeDescriptor = typeCode << 4;
            if (isNull) {
                typeDescriptor |= NULL_VALUE_FLAG;
                this.writer.writeByte(typeDescriptor);
            } else if (length < MAX_VALUE_LENGTH) {
                typeDescriptor |= length;
                this.writer.writeByte(typeDescriptor);
            } else {
                typeDescriptor |= MAX_VALUE_LENGTH_FLAG;
                this.writer.writeByte(typeDescriptor);
                this.writer.writeVariableLengthUnsignedInt(length);
            }
        }
    }, {
        key: "getLengthLength",
        value: function getLengthLength(length) {
            if (length < MAX_VALUE_LENGTH) {
                return 0;
            } else {
                return IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getVariableLengthUnsignedIntSize(length);
            }
        }
    }, {
        key: "getContainedValueLength",
        value: function getContainedValueLength() {
            var valueLength = this.getValueLength();
            var valueLengthLength = this.getLengthLength(valueLength);
            return TYPE_DESCRIPTOR_LENGTH + valueLengthLength + valueLength;
        }
    }, {
        key: "getAnnotatedContainerLength",
        value: function getAnnotatedContainerLength() {
            var annotationsLength = this.annotations.length;
            var annotationsLengthLength = IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getVariableLengthUnsignedIntSize(annotationsLength);
            var containedValueLength = this.getContainedValueLength();
            return annotationsLength + annotationsLengthLength + containedValueLength;
        }
    }, {
        key: "isNull",
        value: function isNull() {
            return false;
        }
    }, {
        key: "getAnnotationsLength",
        value: function getAnnotationsLength() {
            if (this.hasAnnotations()) {
                var annotationsLength = this.annotations.length;
                var annotationsLengthLength = IonLowLevelBinaryWriter_1.LowLevelBinaryWriter.getVariableLengthUnsignedIntSize(annotationsLength);
                var containedValueLength = this.getContainedValueLength();
                var containedValueLengthLength = this.getLengthLength(containedValueLength);
                return TYPE_DESCRIPTOR_LENGTH + containedValueLengthLength + annotationsLengthLength + annotationsLength;
            } else {
                return 0;
            }
        }
    }, {
        key: "getLength",
        value: function getLength() {
            var annotationsLength = this.getAnnotationsLength();
            var containedValueLength = this.getContainedValueLength();
            return annotationsLength + containedValueLength;
        }
    }, {
        key: "writeAnnotations",
        value: function writeAnnotations() {
            if (!this.hasAnnotations()) {
                return;
            }
            var annotatedContainerLength = this.getAnnotatedContainerLength();
            this.writeTypeDescriptorAndLength(IonBinary_1.TypeCodes.ANNOTATION, false, annotatedContainerLength);
            this.writer.writeVariableLengthUnsignedInt(this.annotations.length);
            this.writer.writeBytes(this.annotations);
        }
    }, {
        key: "typeCode",
        get: function get() {
            return this._typeCode;
        }
    }, {
        key: "writer",
        get: function get() {
            return this._writer;
        }
    }]);
    return AbstractNode;
}();

exports.AbstractNode = AbstractNode;

var ContainerNode = function (_AbstractNode) {
    (0, _inherits3.default)(ContainerNode, _AbstractNode);

    function ContainerNode(writer, parent, typeCode, annotations) {
        (0, _classCallCheck3.default)(this, ContainerNode);
        return (0, _possibleConstructorReturn3.default)(this, (ContainerNode.__proto__ || (0, _getPrototypeOf2.default)(ContainerNode)).call(this, writer, parent, typeCode, annotations));
    }

    (0, _createClass3.default)(ContainerNode, [{
        key: "isContainer",
        value: function isContainer() {
            return true;
        }
    }]);
    return ContainerNode;
}(AbstractNode);

var SequenceNode = function (_ContainerNode) {
    (0, _inherits3.default)(SequenceNode, _ContainerNode);

    function SequenceNode(writer, parent, typeCode, annotations) {
        (0, _classCallCheck3.default)(this, SequenceNode);

        var _this2 = (0, _possibleConstructorReturn3.default)(this, (SequenceNode.__proto__ || (0, _getPrototypeOf2.default)(SequenceNode)).call(this, writer, parent, typeCode, annotations));

        _this2.children = [];
        return _this2;
    }

    (0, _createClass3.default)(SequenceNode, [{
        key: "addChild",
        value: function addChild(child, name) {
            this.children.push(child);
        }
    }, {
        key: "write",
        value: function write() {
            this.writeAnnotations();
            this.writeTypeDescriptorAndLength(this.typeCode, false, this.getValueLength());
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = (0, _getIterator3.default)(this.children), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var child = _step4.value;

                    child.write();
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
        }
    }, {
        key: "getValueLength",
        value: function getValueLength() {
            var valueLength = 0;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = (0, _getIterator3.default)(this.children), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var child = _step5.value;

                    valueLength += child.getLength();
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            return valueLength;
        }
    }, {
        key: "getLength",
        value: function getLength() {
            if (IonUtilities_3.isUndefined(this.length)) {
                this.length = (0, _get3.default)(SequenceNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(SequenceNode.prototype), "getLength", this).call(this);
            }
            return this.length;
        }
    }]);
    return SequenceNode;
}(ContainerNode);

var StructNode = function (_ContainerNode2) {
    (0, _inherits3.default)(StructNode, _ContainerNode2);

    function StructNode(writer, parent, annotations) {
        (0, _classCallCheck3.default)(this, StructNode);

        var _this3 = (0, _possibleConstructorReturn3.default)(this, (StructNode.__proto__ || (0, _getPrototypeOf2.default)(StructNode)).call(this, writer, parent, IonBinary_1.TypeCodes.STRUCT, annotations));

        _this3.fields = [];
        return _this3;
    }

    (0, _createClass3.default)(StructNode, [{
        key: "addChild",
        value: function addChild(child, fieldName) {
            if (IonUtilities_1.isNullOrUndefined(fieldName)) {
                throw new Error("Cannot add a value to a struct without a field name");
            }
            this.fields.push({ name: fieldName, value: child });
        }
    }, {
        key: "getValueLength",
        value: function getValueLength() {
            var valueLength = 0;
            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = (0, _getIterator3.default)(this.fields), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var field = _step6.value;

                    valueLength += field.name.length;
                    valueLength += field.value.getLength();
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            return valueLength;
        }
    }, {
        key: "getLength",
        value: function getLength() {
            if (IonUtilities_3.isUndefined(this.length)) {
                this.length = (0, _get3.default)(StructNode.prototype.__proto__ || (0, _getPrototypeOf2.default)(StructNode.prototype), "getLength", this).call(this);
            }
            return this.length;
        }
    }, {
        key: "write",
        value: function write() {
            this.writeAnnotations();
            this.writeTypeDescriptorAndLength(this.typeCode, false, this.getValueLength());
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = (0, _getIterator3.default)(this.fields), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var field = _step7.value;

                    this.writer.writeBytes(field.name);
                    field.value.write();
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }
        }
    }]);
    return StructNode;
}(ContainerNode);

var LeafNode = function (_AbstractNode2) {
    (0, _inherits3.default)(LeafNode, _AbstractNode2);

    function LeafNode() {
        (0, _classCallCheck3.default)(this, LeafNode);
        return (0, _possibleConstructorReturn3.default)(this, (LeafNode.__proto__ || (0, _getPrototypeOf2.default)(LeafNode)).apply(this, arguments));
    }

    (0, _createClass3.default)(LeafNode, [{
        key: "addChild",
        value: function addChild(child, name) {
            throw new Error("Cannot add a child to a leaf node");
        }
    }, {
        key: "isContainer",
        value: function isContainer() {
            return false;
        }
    }]);
    return LeafNode;
}(AbstractNode);

exports.LeafNode = LeafNode;

var BooleanNode = function (_LeafNode) {
    (0, _inherits3.default)(BooleanNode, _LeafNode);

    function BooleanNode(writer, parent, annotations, value) {
        (0, _classCallCheck3.default)(this, BooleanNode);

        var _this5 = (0, _possibleConstructorReturn3.default)(this, (BooleanNode.__proto__ || (0, _getPrototypeOf2.default)(BooleanNode)).call(this, writer, parent, IonBinary_1.TypeCodes.BOOL, annotations));

        _this5.value = value;
        return _this5;
    }

    (0, _createClass3.default)(BooleanNode, [{
        key: "write",
        value: function write() {
            this.writeAnnotations();
            this.writeTypeDescriptorAndLength(this.typeCode, false, this.value ? 1 : 0);
        }
    }, {
        key: "getValueLength",
        value: function getValueLength() {
            return 0;
        }
    }]);
    return BooleanNode;
}(LeafNode);

var BytesNode = function (_LeafNode2) {
    (0, _inherits3.default)(BytesNode, _LeafNode2);

    function BytesNode(writer, parent, typeCode, annotations, value) {
        (0, _classCallCheck3.default)(this, BytesNode);

        var _this6 = (0, _possibleConstructorReturn3.default)(this, (BytesNode.__proto__ || (0, _getPrototypeOf2.default)(BytesNode)).call(this, writer, parent, typeCode, annotations));

        _this6.value = value;
        return _this6;
    }

    (0, _createClass3.default)(BytesNode, [{
        key: "write",
        value: function write() {
            this.writeAnnotations();
            this.writeTypeDescriptorAndLength(this.typeCode, false, this.value.length);
            this.writer.writeBytes(this.value);
        }
    }, {
        key: "getValueLength",
        value: function getValueLength() {
            return this.value.length;
        }
    }]);
    return BytesNode;
}(LeafNode);

var NullNode = function (_LeafNode3) {
    (0, _inherits3.default)(NullNode, _LeafNode3);

    function NullNode(writer, parent, typeCode, annotations) {
        (0, _classCallCheck3.default)(this, NullNode);
        return (0, _possibleConstructorReturn3.default)(this, (NullNode.__proto__ || (0, _getPrototypeOf2.default)(NullNode)).call(this, writer, parent, typeCode, annotations));
    }

    (0, _createClass3.default)(NullNode, [{
        key: "write",
        value: function write() {
            this.writeAnnotations();
            this.writeTypeDescriptorAndLength(this.typeCode, true, 0);
        }
    }, {
        key: "getValueLength",
        value: function getValueLength() {
            return 0;
        }
    }]);
    return NullNode;
}(LeafNode);

exports.NullNode = NullNode;


},{"./IonBinary":2,"./IonDecimal":7,"./IonLongInt":10,"./IonLowLevelBinaryWriter":11,"./IonPrecision":14,"./IonUnicode":26,"./IonUtilities":27,"./IonWriteable":28,"babel-runtime/core-js/get-iterator":29,"babel-runtime/core-js/object/get-prototype-of":34,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39,"babel-runtime/helpers/get":41,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/possibleConstructorReturn":43}],5:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonSystemSymbolTable_1 = require("./IonSystemSymbolTable");
var IonUtilities_1 = require("./IonUtilities");
var IonUtilities_2 = require("./IonUtilities");
function byVersion(x, y) {
    return x.version - y.version;
}

var Catalog = function () {
    function Catalog() {
        (0, _classCallCheck3.default)(this, Catalog);

        this.symbolTables = {};
        this.addSymbolTable(IonSystemSymbolTable_1.getSystemSymbolTable());
    }

    (0, _createClass3.default)(Catalog, [{
        key: "addSymbolTable",
        value: function addSymbolTable(symbolTable) {
            var versions = this.symbolTables[symbolTable.name];
            if (IonUtilities_1.isUndefined(versions)) {
                versions = [];
                this.symbolTables[symbolTable.name] = versions;
            }
            versions[symbolTable.version] = symbolTable;
        }
    }, {
        key: "findSpecificVersion",
        value: function findSpecificVersion(name, version) {
            var versions = this.symbolTables[name];
            return versions && versions[version] || undefined;
        }
    }, {
        key: "findLatestVersion",
        value: function findLatestVersion(name) {
            return IonUtilities_2.max(this.symbolTables[name], byVersion);
        }
    }]);
    return Catalog;
}();

exports.Catalog = Catalog;


},{"./IonSystemSymbolTable":19,"./IonUtilities":27,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EOF = -1;
exports.IVM = {
    text: "$ion_1_0",
    binary: [224, 1, 0, 234],
    sid: 3
};


},{}],7:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonText_1 = require("./IonText");
var IonLongInt_1 = require("./IonLongInt");

var Decimal = function () {
    function Decimal(_value, _exponent) {
        (0, _classCallCheck3.default)(this, Decimal);

        this._value = _value;
        this._exponent = _exponent;
    }

    (0, _createClass3.default)(Decimal, [{
        key: "isZero",
        value: function isZero() {
            if (this.isNull()) return false;
            return this._value.isZero();
        }
    }, {
        key: "isNegative",
        value: function isNegative() {
            return this._value.signum() === -1;
        }
    }, {
        key: "isNegativeZero",
        value: function isNegativeZero() {
            return this.isZero() && this.isNegative();
        }
    }, {
        key: "isZeroZero",
        value: function isZeroZero() {
            if (this.isZero()) {
                if (this._exponent >= -1) {
                    return this._value.signum() >= 0;
                }
            }
            return false;
        }
    }, {
        key: "numberValue",
        value: function numberValue() {
            var n = this._value.numberValue();
            n = n * Math.pow(10, this._exponent);
            return n;
        }
    }, {
        key: "getNumber",
        value: function getNumber() {
            return this.numberValue();
        }
    }, {
        key: "toString",
        value: function toString() {
            return this.stringValue();
        }
    }, {
        key: "stringValue",
        value: function stringValue() {
            if (this.isNull()) {
                return "null.decimal";
            }
            var s = this._exponent;
            var image = this._value.digits();
            if (s < 0) {
                if (image.length < s + 1) {
                    for (var i = s + 1 - image.length; i > 0; i--) {
                        image = "0" + image;
                    }
                }
                var decimal_location = image.length + s;
                if (decimal_location === 0) {
                    image = '0.' + image;
                } else {
                    image = image.substr(0, decimal_location) + "." + image.substr(decimal_location);
                }
            } else if (s > 0) {
                if (image.length > 1) {
                    s = s + image.length - 1;
                    image = image.substr(0, 1) + "." + image.substr(1);
                }
                image = image + "d" + s.toString();
            }
            if (this.isNegative()) {
                image = "-" + image;
            }
            return image;
        }
    }, {
        key: "isNull",
        value: function isNull() {
            var isnull = this._value === undefined;
            return isnull;
        }
    }, {
        key: "getDigits",
        value: function getDigits() {
            return this._value;
        }
    }, {
        key: "getExponent",
        value: function getExponent() {
            return this._exponent;
        }
    }], [{
        key: "parse",
        value: function parse(str) {
            var index = 0;
            var exponent = 0;
            var c = void 0;
            var isNegative = false;
            c = str.charCodeAt(index);
            if (c === '+'.charCodeAt(0)) {
                index++;
            } else if (c === '-'.charCodeAt(0)) {
                isNegative = true;
                index++;
            } else if (c === 'n'.charCodeAt(0)) {
                if (str == 'null' || str == 'null.decimal') {
                    return Decimal.NULL;
                }
            }
            var digits = Decimal.readDigits(str, index);
            index += digits.length;
            digits = Decimal.stripLeadingZeroes(digits);
            if (index === str.length) {
                var trimmedDigits = Decimal.stripTrailingZeroes(digits);
                exponent += digits.length - trimmedDigits.length;
                return new Decimal(new IonLongInt_1.LongInt(trimmedDigits, null, isNegative ? -1 : 1), exponent);
            }
            var hasDecimal = false;
            c = str.charCodeAt(index);
            if (c === '.'.charCodeAt(0)) {
                hasDecimal = true;
                index++;
                var mantissaDigits = Decimal.readDigits(str, index);
                index += mantissaDigits.length;
                exponent -= mantissaDigits.length;
                digits = digits.concat(mantissaDigits);
            }
            if (!hasDecimal) {
                var _trimmedDigits = Decimal.stripTrailingZeroes(digits);
                exponent += digits.length - _trimmedDigits.length;
                digits = _trimmedDigits;
            }
            if (index === str.length) {
                return new Decimal(new IonLongInt_1.LongInt(digits, null, isNegative ? -1 : 1), exponent);
            }
            c = str.charCodeAt(index);
            if (c !== 'd'.charCodeAt(0) && c !== 'D'.charCodeAt(0)) {
                throw new Error("Invalid decimal " + str);
            }
            index++;
            var isExplicitExponentNegative = false;
            c = str.charCodeAt(index);
            if (c === '+'.charCodeAt(0)) {
                index++;
            } else if (c === '-'.charCodeAt(0)) {
                isExplicitExponentNegative = true;
                index++;
            }
            var explicitExponentDigits = Decimal.readDigits(str, index);
            var explicitExponent = parseInt(explicitExponentDigits, 10);
            if (isExplicitExponentNegative) {
                explicitExponent = -explicitExponent;
            }
            exponent += explicitExponent;
            index += explicitExponentDigits.length;
            if (index !== str.length) {
                throw new Error("Invalid decimal " + str);
            }
            var decimal = new Decimal(new IonLongInt_1.LongInt(digits, null, isNegative ? -1 : 1), exponent);
            return decimal;
        }
    }, {
        key: "readDigits",
        value: function readDigits(s, offset) {
            var digits = 0;
            for (var i = offset; i < s.length; i++) {
                if (IonText_1.is_digit(s.charCodeAt(i))) {
                    digits++;
                } else {
                    break;
                }
            }
            return s.slice(offset, offset + digits);
        }
    }, {
        key: "stripLeadingZeroes",
        value: function stripLeadingZeroes(s) {
            var i = 0;
            for (; i < s.length - 1; i++) {
                if (s.charCodeAt(i) !== '0'.charCodeAt(0)) {
                    break;
                }
            }
            return i > 0 ? s.slice(i) : s;
        }
    }, {
        key: "stripTrailingZeroes",
        value: function stripTrailingZeroes(s) {
            var i = s.length - 1;
            for (; i >= 1; i--) {
                if (s.charCodeAt(i) !== '0'.charCodeAt(0)) {
                    break;
                }
            }
            return i < s.length - 1 ? s.slice(0, i + 1) : s;
        }
    }]);
    return Decimal;
}();

Decimal.NULL = new Decimal(undefined, undefined);
Decimal.ZERO = new Decimal(IonLongInt_1.LongInt.ZERO, 0);
exports.Decimal = Decimal;


},{"./IonLongInt":10,"./IonText":20,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],8:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonUtilities_1 = require("./IonUtilities");
var IonUtilities_2 = require("./IonUtilities");

var Import = function () {
    function Import(_parent, _symbolTable, length) {
        (0, _classCallCheck3.default)(this, Import);

        this._parent = _parent;
        this._symbolTable = _symbolTable;
        this.index = {};
        this._offset = _parent && _parent.offset + _parent.length || 1;
        this._length = length || _symbolTable.symbols.length;
        var symbols = _symbolTable.symbols;
        for (var i = 0; i < this._length; i++) {
            this.index[symbols[i]] = this._offset + i;
        }
    }

    (0, _createClass3.default)(Import, [{
        key: "getSymbol",
        value: function getSymbol(symbolId) {
            if (!IonUtilities_1.isNullOrUndefined(this.parent)) {
                var parentSymbol = this.parent.getSymbol(symbolId);
                if (!IonUtilities_2.isUndefined(parentSymbol)) {
                    return parentSymbol;
                }
            }
            var index = symbolId - this.offset;
            if (index < this.length) {
                return this.symbolTable.symbols[index];
            }
            return undefined;
        }
    }, {
        key: "getSymbolId",
        value: function getSymbolId(symbol_) {
            return this.parent && this.parent.getSymbolId(symbol_) || this.index[symbol_];
        }
    }, {
        key: "parent",
        get: function get() {
            return this._parent;
        }
    }, {
        key: "offset",
        get: function get() {
            return this._offset;
        }
    }, {
        key: "length",
        get: function get() {
            return this._length;
        }
    }, {
        key: "symbolTable",
        get: function get() {
            return this._symbolTable;
        }
    }]);
    return Import;
}();

exports.Import = Import;


},{"./IonUtilities":27,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],9:[function(require,module,exports){
"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonSystemSymbolTable_1 = require("./IonSystemSymbolTable");
var IonUtilities_1 = require("./IonUtilities");

var LocalSymbolTable = function () {
    function LocalSymbolTable() {
        var _import = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IonSystemSymbolTable_1.getSystemSymbolTableImport();

        var symbols = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        (0, _classCallCheck3.default)(this, LocalSymbolTable);

        this._import = _import;
        this._symbols = [];
        this.index = {};
        this.offset = _import.offset + _import.length;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(symbols), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var symbol_ = _step.value;

                this.addSymbol(symbol_);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }

    (0, _createClass3.default)(LocalSymbolTable, [{
        key: "getSymbolId",
        value: function getSymbolId(symbol_) {
            return this._import.getSymbolId(symbol_) || this.index[symbol_];
        }
    }, {
        key: "addSymbol",
        value: function addSymbol(symbol_) {
            var existingSymbolId = this.getSymbolId(symbol_);
            if (!IonUtilities_1.isUndefined(existingSymbolId)) {
                return existingSymbolId;
            }
            var symbolId = this.offset + this.symbols.length;
            this.symbols.push(symbol_);
            this.index[symbol_] = symbolId;
            return symbolId;
        }
    }, {
        key: "getSymbol",
        value: function getSymbol(symbolId) {
            var importedSymbol = this._import.getSymbol(symbolId);
            if (!IonUtilities_1.isUndefined(importedSymbol)) {
                return importedSymbol;
            }
            var index = symbolId - this.offset;
            if (index < this.symbols.length) {
                return this.symbols[index];
            }
            return undefined;
        }
    }, {
        key: "symbols",
        get: function get() {
            return this._symbols;
        }
    }, {
        key: "import",
        get: function get() {
            return this._import;
        }
    }]);
    return LocalSymbolTable;
}();

exports.LocalSymbolTable = LocalSymbolTable;
function defaultLocalSymbolTable() {
    return new LocalSymbolTable(IonSystemSymbolTable_1.getSystemSymbolTableImport());
}
exports.defaultLocalSymbolTable = defaultLocalSymbolTable;


},{"./IonSystemSymbolTable":19,"./IonUtilities":27,"babel-runtime/core-js/get-iterator":29,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],10:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonText_1 = require("./IonText");
var IonUtilities_1 = require("./IonUtilities");

var LongInt = function () {
    function LongInt(str, bytes, signum) {
        (0, _classCallCheck3.default)(this, LongInt);

        this.s = signum;
        this.d = str;
        this.b = bytes;
    }

    (0, _createClass3.default)(LongInt, [{
        key: "isNull",
        value: function isNull() {
            return this.b === undefined && this.d === undefined;
        }
    }, {
        key: "isZero",
        value: function isZero() {
            if (this.isNull()) return false;
            if (this.s === 0) return true;
            if (!IonUtilities_1.isNullOrUndefined(this.b)) {
                return LongInt._is_zero_bytes(this.b);
            }
            if (!IonUtilities_1.isNullOrUndefined(this.d)) {
                return this.d == '0';
            }
            return undefined;
        }
    }, {
        key: "isNegativeZero",
        value: function isNegativeZero() {
            return this.isZero() && this.s === -1;
        }
    }, {
        key: "_d",
        value: function _d() {
            var dec, str, bytes, len, dg, src, dst;
            if (IonUtilities_1.isNullOrUndefined(this.d)) {
                if (this.isZero()) {
                    this.d = LongInt.zero_string;
                } else {
                    bytes = LongInt._make_copy(this.b);
                    len = bytes.length;
                    dec = LongInt._make_zero_array(len * 3);
                    dst = 0;
                    for (;;) {
                        if (LongInt._is_zero_bytes(bytes)) break;
                        dg = LongInt._div_d(bytes, LongInt.string_base);
                        dec[dst++] = dg;
                    }
                    for (src = dst; src >= 0; src--) {
                        if (dec[src] > 0) break;
                    }
                    str = "";
                    for (; src >= 0; src--) {
                        str = str + dec[src].toString();
                    }
                    this.d = str;
                }
            }
        }
    }, {
        key: "_b",
        value: function _b() {
            if (IonUtilities_1.isNullOrUndefined(this.b)) {
                if (this.isZero()) {
                    this.b = LongInt.zero_bytes;
                    return;
                }
                var dec = this.d;
                var len = dec.length;
                var bytes = LongInt._make_zero_array(len);
                var src = 0;
                for (;;) {
                    var dg = dec.charCodeAt(src) - LongInt.char_zero;
                    LongInt._add(bytes, dg);
                    src++;
                    if (src >= len) {
                        break;
                    }
                    LongInt._mult(bytes, LongInt.string_base);
                }
                var firstNonzeroDigitIndex = 0;
                for (; firstNonzeroDigitIndex < len; firstNonzeroDigitIndex++) {
                    if (bytes[firstNonzeroDigitIndex] > 0) break;
                }
                this.b = bytes.slice(firstNonzeroDigitIndex);
            }
        }
    }, {
        key: "numberValue",
        value: function numberValue() {
            var ii, bytes, n, len;
            if (this.isNull()) {
                return undefined;
            }
            this._b();
            n = 0;
            bytes = this.b;
            len = bytes.length;
            for (ii = 0; ii < len; ii++) {
                n = n * LongInt.byte_base + bytes[ii];
            }
            return n * this.s;
        }
    }, {
        key: "toString",
        value: function toString() {
            if (this.isNull()) {
                return undefined;
            }
            this._d();
            return (this.s < 0 ? "-" : "") + this.d;
        }
    }, {
        key: "digits",
        value: function digits() {
            this._d();
            return this.d;
        }
    }, {
        key: "stringValue",
        value: function stringValue() {
            return this.toString();
        }
    }, {
        key: "byteValue",
        value: function byteValue() {
            if (this.isNull()) {
                return undefined;
            }
            this._b();
            return LongInt._make_copy(this.b);
        }
    }, {
        key: "signum",
        value: function signum() {
            return this.s;
        }
    }], [{
        key: "_make_zero_array",
        value: function _make_zero_array(len) {
            var bytes = [];
            for (var ii = len; ii > 0;) {
                ii--;
                bytes[ii] = 0;
            }
            return bytes;
        }
    }, {
        key: "_make_copy",
        value: function _make_copy(bytes) {
            var copy = [];
            for (var idx = bytes.length; idx > 0;) {
                idx--;
                copy[idx] = bytes[idx];
            }
            return copy;
        }
    }, {
        key: "_div_d",
        value: function _div_d(bytes, digit) {
            var tmp = void 0;
            var nd = void 0;
            var r = 0;
            var len = bytes.length;
            var idx = 0;
            if (digit >= LongInt.byte_base) {
                throw new Error("div_d can't divide by " + digit + ", max is one base " + LongInt.byte_base + " digit");
            }
            while (idx < len) {
                nd = bytes[idx] + r * LongInt.byte_base;
                tmp = Math.floor(nd / digit);
                bytes[idx] = tmp;
                r = nd - tmp * digit;
                idx++;
            }
            return r;
        }
    }, {
        key: "_add",
        value: function _add(bytes, v) {
            var l = bytes.length,
                dst,
                c,
                t;
            if (v >= LongInt.byte_base) {
                throw new Error("_add can't add " + v + ", max is one base " + LongInt.byte_base + " digit");
            }
            for (dst = l; dst >= 0;) {
                dst--;
                t = bytes[dst] + v;
                bytes[dst] = t & LongInt.byte_mask;
                v = t >> LongInt.byte_shift;
                if (v === 0) break;
            }
            if (v !== 0) {
                throw new Error("this add doesn't support increasing the number of digits");
            }
        }
    }, {
        key: "_mult",
        value: function _mult(bytes, v) {
            var l = bytes.length,
                dst,
                c,
                t;
            if (v >= LongInt.byte_base) {
                throw new Error("_mult can't add " + v + ", max is one base " + LongInt.byte_base + " digit");
            }
            c = 0;
            for (dst = l; dst >= 0;) {
                dst--;
                t = bytes[dst] * v + c;
                bytes[dst] = t & LongInt.byte_mask;
                c = t >> LongInt.byte_shift;
            }
            if (c !== 0) {
                throw new Error("this mult doesn't support increasing the number of digits");
            }
        }
    }, {
        key: "parse",
        value: function parse(str) {
            var t,
                ii,
                signum = 1,
                dec = str.trim();
            switch (dec.charCodeAt(0)) {
                case LongInt.char_little_n:
                    if (dec !== "null" && dec !== "null.int") {
                        throw new Error("invalid integer format");
                    }
                    dec = undefined;
                    signum = 0;
                    break;
                case LongInt.char_minus:
                    signum = -1;
                case LongInt.char_plus:
                    dec = dec.slice(1);
                default:
                    for (ii = 0; ii < dec.length; ii++) {
                        if (dec.charCodeAt(ii) !== LongInt.char_zero) break;
                    }
                    if (ii < dec.length) {
                        dec = dec.slice(ii);
                    }
                    for (ii = dec.length; ii > 0;) {
                        ii--;
                        if (IonText_1.is_digit(dec.charCodeAt(ii)) === false) {
                            throw new Error("invalid integer");
                        }
                    }
                    if (dec.length < 1) {
                        throw new Error("invalid integer");
                    }
            }
            t = new LongInt(dec, undefined, signum);
            return t;
        }
    }, {
        key: "fromBytes",
        value: function fromBytes(bytes, signum) {
            var t,
                ii,
                len = bytes.length;
            for (ii = 0; ii < len; ii++) {
                if (bytes[ii] !== 0) break;
            }
            if (ii >= len) {
                if (signum === 1) signum = 0;
                bytes = LongInt.zero_bytes;
            } else {
                bytes = bytes.slice(ii);
            }
            t = new LongInt(undefined, bytes, signum);
            return t;
        }
    }, {
        key: "fromNumber",
        value: function fromNumber(n) {
            var signum, d, t;
            if (isNaN(n)) {
                signum = 0;
            } else if (n === 0) {
                signum = 1 / n === 1 / -0.0 ? -1 : 0;
                d = LongInt.zero_string;
            } else {
                if (n < 0) {
                    signum = -1;
                    n = -n;
                } else {
                    signum = 1;
                }
                n = Math.floor(n);
                d = n.toString();
            }
            t = new LongInt(d, undefined, signum);
            return t;
        }
    }]);
    return LongInt;
}();

LongInt.zero_bytes = [0];
LongInt.zero_string = "0";
LongInt.byte_base = 256;
LongInt.byte_mask = 0xff;
LongInt.byte_shift = 8;
LongInt.string_base = 10;
LongInt.char_plus = '+'.charCodeAt(0);
LongInt.char_minus = '-'.charCodeAt(0);
LongInt.char_zero = '0'.charCodeAt(0);
LongInt.char_little_n = 'n'.charCodeAt(0);
LongInt.NULL = new LongInt(undefined, undefined, 0);
LongInt.ZERO = new LongInt(LongInt.zero_string, LongInt.zero_bytes, 0);
LongInt._is_zero_bytes = function (bytes) {
    var ii,
        len = bytes.length;
    for (ii = len; ii > 0;) {
        ii--;
        if (bytes[ii] > 0) return false;
    }
    return true;
};
exports.LongInt = LongInt;


},{"./IonText":20,"./IonUtilities":27,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],11:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonUtilities_1 = require("./IonUtilities");
var IonUtilities_2 = require("./IonUtilities");
var IonWriteable_1 = require("./IonWriteable");

var LowLevelBinaryWriter = function () {
    function LowLevelBinaryWriter(writeableOrLength) {
        (0, _classCallCheck3.default)(this, LowLevelBinaryWriter);

        this.numberBuffer = new Array(10);
        if (IonUtilities_1.isNumber(writeableOrLength)) {
            this.writeable = new IonWriteable_1.Writeable(writeableOrLength, 0);
        } else {
            this.writeable = writeableOrLength;
        }
    }

    (0, _createClass3.default)(LowLevelBinaryWriter, [{
        key: "writeSignedInt",
        value: function writeSignedInt(originalValue, length) {
            if (length > this.numberBuffer.length) {
                this.numberBuffer = new Array(length);
            }
            var value = Math.abs(originalValue);
            var i = this.numberBuffer.length;
            while (value >= 128) {
                this.numberBuffer[--i] = value & 0xFF;
                value >>>= 8;
            }
            this.numberBuffer[--i] = value;
            var bytesWritten = this.numberBuffer.length - i;
            for (var j = 0; j < length - bytesWritten; j++) {
                this.numberBuffer[--i] = 0;
            }
            if (bytesWritten > length) {
                throw new Error("Value " + value + " cannot fit into " + length + " bytes");
            }
            if (originalValue < 0) {
                this.numberBuffer[i] |= 0x80;
            }
            this.writeable.writeBytes(this.numberBuffer, i);
        }
    }, {
        key: "writeUnsignedInt",
        value: function writeUnsignedInt(originalValue, length) {
            if (IonUtilities_2.isUndefined(length)) {
                length = LowLevelBinaryWriter.getUnsignedIntSize(originalValue);
            }
            if (length > this.numberBuffer.length) {
                this.numberBuffer = new Array(length);
            }
            var value = originalValue;
            var i = this.numberBuffer.length;
            while (value > 0) {
                this.numberBuffer[--i] = value & 0xFF;
                value >>>= 8;
            }
            var bytesWritten = this.numberBuffer.length - i;
            for (var j = 0; j < length - bytesWritten; j++) {
                this.numberBuffer[--i] = 0;
            }
            if (bytesWritten > length) {
                throw new Error("Value " + value + " cannot fit into " + length + " bytes");
            }
            this.writeable.writeBytes(this.numberBuffer, i);
        }
    }, {
        key: "writeVariableLengthSignedInt",
        value: function writeVariableLengthSignedInt(originalValue) {
            if (!Number['isInteger'](originalValue)) {
                throw new Error("Cannot call writeVariableLengthSignedInt with non-integer value " + originalValue);
            }
            var value = Math.abs(originalValue);
            var i = this.numberBuffer.length - 1;
            while (value >= 64) {
                this.numberBuffer[i--] = value & 0x7F;
                value >>>= 7;
            }
            this.numberBuffer[i] = value;
            if (originalValue < 0) {
                this.numberBuffer[i] |= 0x40;
            }
            this.numberBuffer[this.numberBuffer.length - 1] |= 0x80;
            this.writeable.writeBytes(this.numberBuffer, i, this.numberBuffer.length - i);
        }
    }, {
        key: "writeVariableLengthUnsignedInt",
        value: function writeVariableLengthUnsignedInt(originalValue) {
            var value = originalValue;
            var i = this.numberBuffer.length;
            this.numberBuffer[--i] = value & 0x7F | 0x80;
            value >>>= 7;
            while (value > 0) {
                this.numberBuffer[--i] = value & 0x7F;
                value >>>= 7;
            }
            this.writeable.writeBytes(this.numberBuffer, i);
        }
    }, {
        key: "writeByte",
        value: function writeByte(byte) {
            this.writeable.writeByte(byte);
        }
    }, {
        key: "writeBytes",
        value: function writeBytes(bytes) {
            this.writeable.writeBytes(bytes);
        }
    }, {
        key: "getBytes",
        value: function getBytes() {
            return this.writeable.getBytes();
        }
    }], [{
        key: "getUnsignedIntSize",
        value: function getUnsignedIntSize(value) {
            if (value === 0) {
                return 1;
            }
            var numberOfBits = Math.floor(Math['log2'](value)) + 1;
            var numberOfBytes = Math.ceil(numberOfBits / 8);
            return numberOfBytes;
        }
    }, {
        key: "getVariableLengthSignedIntSize",
        value: function getVariableLengthSignedIntSize(value) {
            var absoluteValue = Math.abs(value);
            if (absoluteValue === 0) {
                return 1;
            }
            var valueBits = Math.floor(Math['log2'](absoluteValue)) + 1;
            var trailingStopBits = Math.floor(valueBits / 7);
            var leadingStopBit = 1;
            var signBit = 1;
            return Math.ceil((valueBits + trailingStopBits + leadingStopBit + signBit) / 8);
        }
    }, {
        key: "getVariableLengthUnsignedIntSize",
        value: function getVariableLengthUnsignedIntSize(value) {
            if (value === 0) {
                return 1;
            }
            var valueBits = Math.floor(Math['log2'](value)) + 1;
            var stopBits = Math.ceil(valueBits / 7);
            return Math.ceil((valueBits + stopBits) / 8);
        }
    }]);
    return LowLevelBinaryWriter;
}();

exports.LowLevelBinaryWriter = LowLevelBinaryWriter;


},{"./IonUtilities":27,"./IonWriteable":28,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],12:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonBinary = require("./IonBinary");
var IonDecimal_1 = require("./IonDecimal");
var IonTypes_1 = require("./IonTypes");
var IonConstants_1 = require("./IonConstants");
var IonLongInt_1 = require("./IonLongInt");
var IonPrecision_1 = require("./IonPrecision");
var IonTimestamp_1 = require("./IonTimestamp");
var DEBUG_FLAG = true;
function error(msg) {
    throw { message: msg, where: "IonParserBinaryRaw.ts" };
}
var EOF = -1;
var ERROR = -2;
var TB_UNUSED__ = 15;
var TB_DATAGRAM = 20;
var TB_SEXP_CLOSE = 21;
var TB_LIST_CLOSE = 22;
var TB_STRUCT_CLOSE = 23;
function get_ion_type(rt) {
    switch (rt) {
        case IonBinary.TB_NULL:
            return IonTypes_1.IonTypes.NULL;
        case IonBinary.TB_BOOL:
            return IonTypes_1.IonTypes.BOOL;
        case IonBinary.TB_INT:
            return IonTypes_1.IonTypes.INT;
        case IonBinary.TB_NEG_INT:
            return IonTypes_1.IonTypes.INT;
        case IonBinary.TB_FLOAT:
            return IonTypes_1.IonTypes.FLOAT;
        case IonBinary.TB_DECIMAL:
            return IonTypes_1.IonTypes.DECIMAL;
        case IonBinary.TB_TIMESTAMP:
            return IonTypes_1.IonTypes.TIMESTAMP;
        case IonBinary.TB_SYMBOL:
            return IonTypes_1.IonTypes.SYMBOL;
        case IonBinary.TB_STRING:
            return IonTypes_1.IonTypes.STRING;
        case IonBinary.TB_CLOB:
            return IonTypes_1.IonTypes.CLOB;
        case IonBinary.TB_BLOB:
            return IonTypes_1.IonTypes.BLOB;
        case IonBinary.TB_SEXP:
            return IonTypes_1.IonTypes.SEXP;
        case IonBinary.TB_LIST:
            return IonTypes_1.IonTypes.LIST;
        case IonBinary.TB_STRUCT:
            return IonTypes_1.IonTypes.STRUCT;
        default:
            return undefined;
    }
    ;
}
var TS_SHIFT = 5;
var TS_MASK = 0x1f;
function validate_ts(ts) {
    if (DEBUG_FLAG) {
        if (typeof ts !== 'number' || ts < 0 || ts > 0x30000000) {
            throw new Error("Debug fail - encode_type_stack");
        }
    }
}
function encode_type_stack(type_, len) {
    var ts = len << TS_SHIFT | type_ & TS_MASK;
    validate_ts(ts);
    return ts;
}
function decode_type_stack_type(ts) {
    var type_ = ts & TS_MASK;
    validate_ts(ts);
    return type_;
}
function decode_type_stack_len(ts) {
    var len = ts >>> TS_SHIFT;
    validate_ts(ts);
    return len;
}
var VINT_SHIFT = 7;
var VINT_MASK = 0x7f;
var VINT_FLAG = 0x80;
function high_nibble(tb) {
    return tb >> IonBinary.TYPE_SHIFT & IonBinary.NIBBLE_MASK;
}
function low_nibble(tb) {
    return tb & IonBinary.NIBBLE_MASK;
}
var UNICODE_MAX_ONE_BYTE_SCALAR = 0x0000007F;
var UNICODE_MAX_TWO_BYTE_SCALAR = 0x000007FF;
var UNICODE_MAX_THREE_BYTE_SCALAR = 0x0000FFFF;
var UNICODE_MAX_FOUR_BYTE_SCALAR = 0x0010FFFF;
var UNICODE_THREE_BYTES_OR_FEWER_MASK = 0xFFFF0000;
var UNICODE_ONE_BYTE_MASK = 0x7F;
var UNICODE_ONE_BYTE_HEADER = 0x00;
var UNICODE_TWO_BYTE_MASK = 0x1F;
var UNICODE_TWO_BYTE_HEADER = 0xC0;
var UNICODE_THREE_BYTE_HEADER = 0xE0;
var UNICODE_THREE_BYTE_MASK = 0x0F;
var UNICODE_FOUR_BYTE_HEADER = 0xF0;
var UNICODE_FOUR_BYTE_MASK = 0x07;
var UNICODE_CONTINUATION_BYTE_HEADER = 0x80;
var UNICODE_CONTINUATION_BYTE_MASK = 0x3F;
var UNICODE_CONTINUATION_SHIFT = 6;
var MAXIMUM_UTF16_1_CHAR_CODE_POINT = 0x0000FFFF;
var SURROGATE_OFFSET = 0x00010000;
var SURROGATE_MASK = 0xFFFFFC00;
var HIGH_SURROGATE = 0x0000D800;
var LOW_SURROGATE = 0x0000DC00;
var HIGH_SURROGATE_SHIFT = 10;
function utf8_is_multibyte_char(scalar) {
    var is_multi = (scalar & UNICODE_ONE_BYTE_MASK) !== UNICODE_ONE_BYTE_HEADER;
    return is_multi;
}
function utf8_length_from_first_byte(scalar) {
    switch (scalar >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            return 1;
        case 8:
        case 9:
        case 10:
        case 11:
            return 2;
        case 12:
        case 13:
            return 3;
        case 14:
            return 4;
        case 15:
            error("invalid utf8");
    }
}
function read_utf8_tail(span, c, len) {
    switch (len) {
        case 1:
            break;
        case 2:
            c = c & UNICODE_TWO_BYTE_MASK;
            c = c << 7 | span.next() & 0xff & UNICODE_CONTINUATION_BYTE_MASK;
            break;
        case 3:
            c = c & UNICODE_THREE_BYTE_MASK;
            c = c << 7 | span.next() & 0xff & UNICODE_CONTINUATION_BYTE_MASK;
            c = c << 7 | span.next() & 0xff & UNICODE_CONTINUATION_BYTE_MASK;
            break;
        case 4:
            c = c & UNICODE_FOUR_BYTE_MASK;
            c = c << 7 | span.next() & 0xff & UNICODE_CONTINUATION_BYTE_MASK;
            c = c << 7 | span.next() & 0xff & UNICODE_CONTINUATION_BYTE_MASK;
            c = c << 7 | span.next() & 0xff & UNICODE_CONTINUATION_BYTE_MASK;
            break;
        default:
            error("invalid UTF8");
    }
    return c;
}
function read_var_unsigned_int(span) {
    var b, v;
    do {
        b = span.next();
        v = v << 7 | b & 0x7f;
    } while ((b & 0x80) === 0);
    if (b === EOF) undefined;
    return v;
}
function read_var_unsigned_int_past(span, pos, limit) {
    var b, v;
    while (pos < limit) {
        b = span.valueAt(pos);
        pos++;
        v = v << 7 | b & 0x7f;
    }
    while ((b & 0x80) === 0) {}
    if (b === EOF) return undefined;
    return v;
}
function read_var_signed_int(span) {
    var b,
        v = 0,
        shift = 6,
        is_neg = false;
    b = span.next();
    if ((b & 0x40) !== 0) {
        b = b & (0x3f | 0x80);
        is_neg = true;
    }
    while ((b & 0x80) === 0) {
        v = v << shift;
        shift = 7;
        v = v | b & 0x7f;
        b = span.next();
    }
    if (b === EOF) undefined;
    if (shift > 0) {
        v = v << shift;
    }
    v = v | b & 0x7f;
    if (is_neg) v = -v;
    return v;
}
function read_var_signed_longint(span) {
    var b,
        v = 0,
        bytes = [],
        dst = [],
        bit_count,
        byte_count,
        bits_to_copy,
        to_copy,
        dst_idx,
        src_idx,
        src_offset,
        dst_offset,
        is_neg = false;
    b = span.next();
    if ((b & 0x40) !== 0) {
        b = b & (0x3f | 0x80);
        is_neg = true;
    }
    while ((b & 0x80) === 0) {
        bytes.push(b & 0x7f);
        b = span.next();
    }
    if (b === EOF) return undefined;
    bytes.push(b & 0x7f);
    bit_count = 6 + (bytes.length - 1) * 7;
    byte_count = Math.floor((bit_count + 1) / 8) + 1;
    dst_idx = byte_count - 1;
    src_idx = bytes.length - 1;
    src_offset = 0;
    dst_offset = 0;
    dst = [];
    dst[dst_idx] = 0;
    bits_to_copy = bit_count;
    while (bits_to_copy > 0) {
        to_copy = 7 - src_offset;
        if (to_copy > bits_to_copy) to_copy = bits_to_copy;
        v = bytes[src_idx] >> src_offset;
        v = v << dst_offset;
        dst[dst_idx] = (dst[dst_idx] | v) & 0xff;
        dst_offset += to_copy;
        if (dst_offset > 8) {
            dst_offset = 0;
            dst_idx--;
            dst[dst_idx] = 0;
        }
        src_offset += to_copy;
        if (src_offset > 7) {
            src_offset = 0;
            src_idx--;
        }
        bits_to_copy -= to_copy;
    }
    if (bits_to_copy > 0 || src_idx > 0 || dst_idx > 0) {
        error("invalid state");
    }
    return IonLongInt_1.LongInt.fromBytes(bytes, is_neg ? -1 : 1);
}
function read_signed_int(span, len) {
    var v = 0,
        b,
        is_neg = false;
    if (len < 1) return 0;
    b = span.next();
    len--;
    if ((b & 0x80) !== 0) {
        b = b & 0x7f;
        is_neg = true;
    }
    v = b & 0xff;
    while (len > 0) {
        b = span.next();
        len--;
        v = v << 8;
        v = v | b & 0xff;
    }
    if (b === EOF) return undefined;
    if (is_neg) v = -v;
    return v;
}
function read_signed_longint(span, len) {
    var v = [],
        b,
        signum = 1;
    if (len < 1) return IonLongInt_1.LongInt.ZERO;
    while (len > 0) {
        b = span.next();
        len--;
        v.push(b & 0xff);
    }
    if (b === EOF) undefined;
    if (v[0] & 0x80) {
        signum = -1;
        v[0] = v[0] & 0x7f;
    }
    return IonLongInt_1.LongInt.fromBytes(v, signum);
}
function read_unsigned_int(span, len) {
    var v = 0,
        b;
    if (len < 1) return 0;
    while (len > 0) {
        b = span.next();
        len--;
        v = v << 8;
        v = v | b & 0xff;
    }
    if (b === EOF) undefined;
    return v;
}
function read_unsigned_longint(span, len, signum) {
    var v = [],
        b;
    if (len < 1) throw new Error("no length supplied");
    while (len > 0) {
        b = span.next();
        len--;
        v.push(b & 0xff);
    }
    if (b === EOF) return undefined;
    return IonLongInt_1.LongInt.fromBytes(v, signum);
}
function read_decimal_value(span, len) {
    var pos, digits, exp, d;
    pos = span.position();
    exp = read_var_signed_longint(span);
    len = len - (span.position() - pos);
    digits = read_signed_longint(span, len);
    d = new IonDecimal_1.Decimal(digits, exp);
    return d;
}
function read_timestamp_value(span, len) {
    var v, pos, end, precision, offset, year, month, day, hour, minutes, seconds;
    if (len < 1) {
        precision = IonPrecision_1.Precision.NULL;
    } else {
        pos = span.position();
        end = pos + len;
        offset = read_var_signed_int(span);
        for (;;) {
            year = read_var_unsigned_int(span);
            precision = IonPrecision_1.Precision.YEAR;
            if (span.position() >= end) break;
            month = read_var_unsigned_int(span);
            precision = IonPrecision_1.Precision.MONTH;
            if (span.position() >= end) break;
            day = read_var_unsigned_int(span);
            precision = IonPrecision_1.Precision.DAY;
            if (span.position() >= end) break;
            hour = read_var_unsigned_int(span);
            precision = IonPrecision_1.Precision.HOUR_AND_MINUTE;
            if (span.position() >= end) break;
            minutes = read_var_unsigned_int(span);
            if (span.position() >= end) break;
            seconds = read_var_unsigned_int(span);
            precision = IonPrecision_1.Precision.SECONDS;
            if (span.position() >= end) break;
            seconds += read_decimal_value(span, end - span.position());
            break;
        }
    }
    v = new IonTimestamp_1.Timestamp(precision, offset, year, month, day, hour, minutes, seconds);
    return v;
}
var from_char_code_fn = String.fromCharCode;
function read_string_value(span, len) {
    var s,
        b,
        char_len,
        chars = [];
    if (len < 1) return "";
    while (len > 0) {
        b = span.next();
        char_len = utf8_length_from_first_byte(b);
        len -= char_len;
        if (char_len > 1) {
            b = read_utf8_tail(span, b, char_len);
            if (b > MAXIMUM_UTF16_1_CHAR_CODE_POINT) {
                chars.push((b - SURROGATE_OFFSET >> 10 | HIGH_SURROGATE) & 0xffff);
                b = (b - SURROGATE_OFFSET & 0x3ff | LOW_SURROGATE) & 0xffff;
            }
        }
        chars.push(b);
    }
    s = from_char_code_fn.apply(String, chars);
    return s;
}
var empty_array = [];
var ivm_sid = IonConstants_1.IVM.sid;
var ivm_image_0 = IonConstants_1.IVM.binary[0];
var ivm_image_1 = IonConstants_1.IVM.binary[1];
var ivm_image_2 = IonConstants_1.IVM.binary[2];
var ivm_image_3 = IonConstants_1.IVM.binary[3];
var MAX_BYTES_FOR_INT_IN_NUMBER = 6;
var ZERO_POINT_ZERO = new Float64Array([0.0]);

var ParserBinaryRaw = function () {
    function ParserBinaryRaw(source) {
        (0, _classCallCheck3.default)(this, ParserBinaryRaw);

        this.buf = new ArrayBuffer(8);
        this.buf_as_bytes = new Uint8Array(this.buf);
        this.buf_as_double = new Float64Array(this.buf);
        this._raw_type = EOF;
        this._len = -1;
        this._curr = undefined;
        this._null = false;
        this._fid = -1;
        this._as = -1;
        this._ae = -1;
        this._a = [];
        this._ts = [TB_DATAGRAM];
        this._in_struct = false;
        this._in = source;
    }

    (0, _createClass3.default)(ParserBinaryRaw, [{
        key: "read_binary_float",
        value: function read_binary_float(span, len) {
            var ii;
            if (len === IonBinary.LEN_NULL) return undefined;
            if (len === 0) return ZERO_POINT_ZERO;
            if (len !== 8) error("only 8 byte floats (aka double) is supported");
            for (ii = len; ii > 0;) {
                ii--;
                this.buf_as_double[ii] = span.next() & 0xff;
            }
            return this.buf_as_double;
        }
    }, {
        key: "clear_value",
        value: function clear_value() {
            this._raw_type = EOF;
            this._curr = undefined;
            this._a = empty_array;
            this._as = -1;
            this._null = false;
            this._fid = -1;
            this._len = -1;
        }
    }, {
        key: "load_length",
        value: function load_length(tb) {
            var t = this;
            t._len = low_nibble(tb);
            switch (t._len) {
                case 1:
                    if (high_nibble(tb) === IonBinary.TB_STRUCT) {
                        t._len = read_var_unsigned_int(t._in);
                    }
                    t._null = false;
                    break;
                case IonBinary.LEN_VAR:
                    t._null = false;
                    t._len = read_var_unsigned_int(t._in);
                    break;
                case IonBinary.LEN_NULL:
                    t._null = true;
                    t._len = 0;
                    break;
                default:
                    t._null = false;
                    break;
            }
        }
    }, {
        key: "load_next",
        value: function load_next() {
            var t = this;
            var rt, tb;
            t._as = -1;
            if (t._in.is_empty()) {
                t.clear_value();
                return undefined;
            }
            tb = t._in.next();
            rt = high_nibble(tb);
            t.load_length(tb);
            if (rt === IonBinary.TB_ANNOTATION) {
                if (t._len < 1 && t.depth() === 0) {
                    rt = t.load_ivm();
                } else {
                    rt = t.load_annotations();
                }
            }
            if (rt === IonBinary.TB_NULL) {
                t._null = true;
            }
            t._raw_type = rt;
            return rt;
        }
    }, {
        key: "load_annotations",
        value: function load_annotations() {
            var t = this;
            var tb, type_, annotation_len;
            if (t._len < 1 && t.depth() === 0) {
                type_ = t.load_ivm();
            } else {
                annotation_len = read_var_unsigned_int(t._in);
                t._as = t._in.position();
                t._in.skip(annotation_len);
                t._ae = t._in.position();
                tb = t._in.next();
                t.load_length(tb);
                type_ = high_nibble(tb);
            }
            return type_;
        }
    }, {
        key: "load_ivm",
        value: function load_ivm() {
            var t = this;
            var span = t._in;
            if (span.next() !== ivm_image_1) throw new Error("invalid binary Ion at " + span.position());
            if (span.next() !== ivm_image_2) throw new Error("invalid binary Ion at " + span.position());
            if (span.next() !== ivm_image_3) throw new Error("invalid binary Ion at " + span.position());
            t._curr = ivm_sid;
            t._len = 0;
            return IonBinary.TB_SYMBOL;
        }
    }, {
        key: "load_annotation_values",
        value: function load_annotation_values() {
            var t = this;
            var a, b, pos, limit, arr;
            if ((pos = t._as) < 0) return;
            arr = [];
            limit = t._ae;
            a = 0;
            while (pos < limit) {
                b = t._in.valueAt(pos);
                pos++;
                a = a << VINT_SHIFT | b & VINT_MASK;
                if ((b & VINT_FLAG) !== 0) {
                    arr.push(a);
                    a = 0;
                }
            }
            t._a = arr;
        }
    }, {
        key: "load_value",
        value: function load_value() {
            var t = this;
            var b, c, len;
            if (t.isNull() || t._curr !== undefined) return;
            switch (t._raw_type) {
                case IonBinary.TB_BOOL:
                    c = t._len === 1 ? true : false;
                    break;
                case IonBinary.TB_INT:
                    if (t._len === 0) {
                        c = 0;
                    } else if (t._len < MAX_BYTES_FOR_INT_IN_NUMBER) {
                        c = read_unsigned_int(t._in, t._len);
                    } else {
                        c = read_unsigned_longint(t._in, t._len, 1);
                    }
                    break;
                case IonBinary.TB_NEG_INT:
                    if (t._len === 0) {
                        c = 0;
                    } else if (t._len < MAX_BYTES_FOR_INT_IN_NUMBER) {
                        c = -read_unsigned_int(t._in, t._len);
                    } else {
                        c = read_unsigned_longint(t._in, t._len, -1);
                    }
                    break;
                case IonBinary.TB_FLOAT:
                    if (t._len != 8) {
                        error("unsupported floating point type (only 64bit, len of 8, is supported), len = " + t._len);
                    }
                    c = t.read_binary_float(t._in, t._len);
                    break;
                case IonBinary.TB_DECIMAL:
                    if (t._len === 0) {
                        c = IonDecimal_1.Decimal.ZERO;
                    } else {
                        c = read_decimal_value(t._in, t._len);
                    }
                    break;
                case IonBinary.TB_TIMESTAMP:
                    c = read_timestamp_value(t._in, t._len);
                    break;
                case IonBinary.TB_SYMBOL:
                    c = "$" + read_unsigned_int(t._in, t._len).toString();
                    break;
                case IonBinary.TB_STRING:
                    c = read_string_value(t._in, t._len);
                    break;
                case IonBinary.TB_CLOB:
                case IonBinary.TB_BLOB:
                    if (t.isNull()) break;
                    len = t._len;
                    c = [];
                    while (len--) {
                        b = t._in.next();
                        c.unshift(b & IonBinary.BYTE_MASK);
                    }
                    break;
                default:
                    break;
            }
            t._curr = c;
        }
    }, {
        key: "next",
        value: function next() {
            var rt,
                t = this;
            if (t._curr === undefined && t._len > 0) {
                t._in.skip(t._len);
            } else {
                t.clear_value();
            }
            if (t._in_struct) {
                t._fid = read_var_unsigned_int(t._in);
                if (t._fid === undefined) {
                    return undefined;
                }
            }
            rt = t.load_next();
            return rt;
        }
    }, {
        key: "stepIn",
        value: function stepIn() {
            var len,
                ts,
                t = this;
            switch (t._raw_type) {
                case IonBinary.TB_STRUCT:
                case IonBinary.TB_LIST:
                case IonBinary.TB_SEXP:
                    break;
                default:
                    throw new Error("you can only 'stepIn' to a container");
            }
            len = t._in.getRemaining() - t._len;
            ts = encode_type_stack(t._raw_type, len);
            t._ts.push(ts);
            t._in_struct = t._raw_type === IonBinary.TB_STRUCT;
            t._in.setRemaining(t._len);
            t.clear_value();
        }
    }, {
        key: "stepOut",
        value: function stepOut() {
            var parent_type,
                ts,
                l,
                r,
                t = this;
            if (t._ts.length < 2) {
                error("you can't stepOut unless you stepped in");
            }
            ts = t._ts.pop();
            l = decode_type_stack_len(ts);
            parent_type = decode_type_stack_type(t._ts[t._ts.length - 1]);
            t._in_struct = parent_type === IonBinary.TB_STRUCT;
            t.clear_value();
            r = t._in.getRemaining();
            t._in.skip(r);
            t._in.setRemaining(l);
        }
    }, {
        key: "isNull",
        value: function isNull() {
            return this._null;
        }
    }, {
        key: "depth",
        value: function depth() {
            return this._ts.length - 1;
        }
    }, {
        key: "getFieldId",
        value: function getFieldId() {
            return this._fid;
        }
    }, {
        key: "hasAnnotations",
        value: function hasAnnotations() {
            return this._as >= 0;
        }
    }, {
        key: "getAnnotation",
        value: function getAnnotation(index) {
            var a,
                t = this;
            if (t._a === undefined || t._a.length === 0) {
                t.load_annotation_values();
            }
            a = t._a[index];
            return a;
        }
    }, {
        key: "ionType",
        value: function ionType() {
            return get_ion_type(this._raw_type);
        }
    }, {
        key: "getValue",
        value: function getValue() {
            throw new Error("E_NOT_IMPL");
        }
    }, {
        key: "numberValue",
        value: function numberValue() {
            var n = undefined,
                t = this;
            if (!t.isNull()) {
                t.load_value();
                switch (t._raw_type) {
                    case IonBinary.TB_INT:
                    case IonBinary.TB_NEG_INT:
                    case IonBinary.TB_FLOAT:
                    case IonBinary.TB_SYMBOL:
                        n = t._curr;
                        break;
                    case IonBinary.TB_DECIMAL:
                        n = t._curr.getNumber();
                        break;
                    default:
                        break;
                }
            }
            return n;
        }
    }, {
        key: "stringValue",
        value: function stringValue() {
            var s = undefined,
                t = this;
            switch (t._raw_type) {
                case IonBinary.TB_NULL:
                case IonBinary.TB_BOOL:
                case IonBinary.TB_INT:
                case IonBinary.TB_NEG_INT:
                case IonBinary.TB_FLOAT:
                case IonBinary.TB_DECIMAL:
                case IonBinary.TB_TIMESTAMP:
                case IonBinary.TB_SYMBOL:
                case IonBinary.TB_STRING:
                    break;
                default:
                    return s;
            }
            if (t.isNull()) {
                s = "null";
                switch (t._raw_type) {
                    case IonBinary.TB_BOOL:
                    case IonBinary.TB_INT:
                    case IonBinary.TB_NEG_INT:
                    case IonBinary.TB_FLOAT:
                    case IonBinary.TB_DECIMAL:
                    case IonBinary.TB_TIMESTAMP:
                    case IonBinary.TB_SYMBOL:
                    case IonBinary.TB_STRING:
                        s = s + "." + t.ionType().name;
                        break;
                }
            } else {
                t.load_value();
                switch (t._raw_type) {
                    case IonBinary.TB_BOOL:
                    case IonBinary.TB_INT:
                    case IonBinary.TB_NEG_INT:
                    case IonBinary.TB_DECIMAL:
                    case IonBinary.TB_TIMESTAMP:
                        s = t._curr.toString();
                        break;
                    case IonBinary.TB_FLOAT:
                        s = t.numberValue().toString();
                        if (s.indexof("e") === -1) {
                            s = s + "e0";
                        }
                        break;
                    case IonBinary.TB_STRING:
                        s = t._curr;
                        break;
                }
            }
            return s;
        }
    }, {
        key: "decimalValue",
        value: function decimalValue() {
            var n = undefined,
                t = this;
            if (!t.isNull() && t._raw_type === IonBinary.TB_DECIMAL) {
                t.load_value();
                n = t._curr;
            }
            return n;
        }
    }, {
        key: "timestampValue",
        value: function timestampValue() {
            var n = undefined,
                t = this;
            if (!t.isNull() && t._raw_type === IonBinary.TB_TIMESTAMP) {
                t.load_value();
                n = t._curr;
            }
            return n;
        }
    }, {
        key: "byteValue",
        value: function byteValue() {
            var bytes = undefined,
                t = this;
            switch (t._raw_type) {
                case IonBinary.TB_CLOB:
                case IonBinary.TB_BLOB:
                    if (t.isNull()) break;
                    t.load_value();
                    bytes = t._curr;
                    break;
                default:
                    break;
            }
            return bytes;
        }
    }, {
        key: "booleanValue",
        value: function booleanValue() {
            if (this._raw_type === IonBinary.TB_BOOL) {
                return this._curr;
            } else {
                return undefined;
            }
        }
    }]);
    return ParserBinaryRaw;
}();

exports.ParserBinaryRaw = ParserBinaryRaw;


},{"./IonBinary":2,"./IonConstants":6,"./IonDecimal":7,"./IonLongInt":10,"./IonPrecision":14,"./IonTimestamp":23,"./IonTypes":25,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],13:[function(require,module,exports){
"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonText = require("./IonText");
var IonTypes_1 = require("./IonTypes");
var EOF = -1;
var ERROR = -2;
var T_NULL = 1;
var T_BOOL = 2;
var T_INT = 3;
var T_HEXINT = 4;
var T_FLOAT = 5;
var T_FLOAT_SPECIAL = 6;
var T_DECIMAL = 7;
var T_TIMESTAMP = 8;
var T_IDENTIFIER = 9;
var T_OPERATOR = 10;
var T_STRING1 = 11;
var T_STRING2 = 12;
var T_STRING3 = 13;
var T_CLOB2 = 14;
var T_CLOB3 = 15;
var T_BLOB = 16;
var T_SEXP = 17;
var T_LIST = 18;
var T_STRUCT = 19;
var CH_CR = 13;
var CH_NL = 10;
var CH_BS = 92;
var CH_FORWARD_SLASH = "/".charCodeAt(0);
var CH_AS = 42;
var CH_SQ = 39;
var CH_DOUBLE_QUOTE = "\"".charCodeAt(0);
var CH_CM = 44;
var CH_OP = 40;
var CH_CP = 41;
var CH_LEFT_CURLY = "{".charCodeAt(0);
var CH_CC = 125;
var CH_OS = 91;
var CH_CS = 93;
var CH_CL = 58;
var CH_DT = 46;
var CH_EQ = 61;
var CH_PS = 43;
var CH_MS = 45;
var CH_0 = 48;
var CH_D = 68;
var CH_E = 69;
var CH_F = 70;
var CH_T = 84;
var CH_X = 88;
var CH_Z = 90;
var CH_d = 100;
var CH_e = 101;
var CH_f = 102;
var CH_i = 105;
var CH_n = 110;
var CH_x = 120;
var ESC_0 = 48;
var ESC_a = 97;
var ESC_b = 98;
var ESC_t = 116;
var ESC_nl = 110;
var ESC_ff = 102;
var ESC_cr = 114;
var ESC_v = 118;
var ESC_dq = CH_DOUBLE_QUOTE;
var ESC_sq = CH_SQ;
var ESC_qm = 63;
var ESC_bs = 92;
var ESC_fs = 47;
var ESC_nl2 = 10;
var ESC_nl3 = 13;
var ESC_x = CH_x;
var ESC_u = 117;
var ESC_U = 85;
var empty_array = [];
var INF = [CH_i, CH_n, CH_f];
function getIonType(t) {
    switch (t) {
        case EOF:
            return undefined;
        case ERROR:
            return undefined;
        case T_NULL:
            return IonTypes_1.IonTypes.NULL;
        case T_BOOL:
            return IonTypes_1.IonTypes.BOOL;
        case T_INT:
            return IonTypes_1.IonTypes.INT;
        case T_HEXINT:
            return IonTypes_1.IonTypes.INT;
        case T_FLOAT:
            return IonTypes_1.IonTypes.FLOAT;
        case T_FLOAT_SPECIAL:
            return IonTypes_1.IonTypes.FLOAT;
        case T_DECIMAL:
            return IonTypes_1.IonTypes.DECIMAL;
        case T_TIMESTAMP:
            return IonTypes_1.IonTypes.TIMESTAMP;
        case T_IDENTIFIER:
            return IonTypes_1.IonTypes.SYMBOL;
        case T_OPERATOR:
            return IonTypes_1.IonTypes.SYMBOL;
        case T_STRING1:
            return IonTypes_1.IonTypes.SYMBOL;
        case T_STRING2:
            return IonTypes_1.IonTypes.STRING;
        case T_STRING3:
            return IonTypes_1.IonTypes.STRING;
        case T_CLOB2:
            return IonTypes_1.IonTypes.CLOB;
        case T_CLOB3:
            return IonTypes_1.IonTypes.CLOB;
        case T_BLOB:
            return IonTypes_1.IonTypes.BLOB;
        case T_SEXP:
            return IonTypes_1.IonTypes.SEXP;
        case T_LIST:
            return IonTypes_1.IonTypes.LIST;
        case T_STRUCT:
            return IonTypes_1.IonTypes.STRUCT;
        default:
            return undefined;
    }
}
exports.getIonType = getIonType;
function get_keyword_type(str) {
    if (str === "null") return T_NULL;
    if (str === "true") return T_BOOL;
    if (str === "false") return T_BOOL;
    if (str === "nan") return T_FLOAT_SPECIAL;
    if (str === "+inf") return T_FLOAT_SPECIAL;
    if (str === "-inf") return T_FLOAT_SPECIAL;
    return undefined;
}
function get_type_from_name(str) {
    if (str === "null") return T_NULL;
    if (str === "bool") return T_BOOL;
    if (str === "int") return T_INT;
    if (str === "float") return T_FLOAT;
    if (str === "decimal") return T_DECIMAL;
    if (str === "timestamp") return T_TIMESTAMP;
    if (str === "symbol") return T_IDENTIFIER;
    if (str === "string") return T_STRING1;
    if (str === "clob") return T_CLOB2;
    if (str === "blob") return T_BLOB;
    if (str === "sexp") return T_SEXP;
    if (str === "list") return T_LIST;
    if (str === "struct") return T_STRUCT;
    return undefined;
}
function is_keyword(str) {
    return get_keyword_type(str) != undefined;
}
function get_hex_value(ch) {
    switch (ch) {
        case 48:
            return 0;
        case 49:
            return 1;
        case 50:
            return 2;
        case 51:
            return 3;
        case 52:
            return 4;
        case 53:
            return 5;
        case 54:
            return 6;
        case 55:
            return 7;
        case 56:
            return 8;
        case 57:
            return 9;
        case 97:
            return 10;
        case 98:
            return 11;
        case 99:
            return 12;
        case 100:
            return 13;
        case 101:
            return 14;
        case 102:
            return 15;
        case 65:
            return 10;
        case 66:
            return 11;
        case 67:
            return 12;
        case 68:
            return 13;
        case 69:
            return 14;
        case 70:
            return 15;
    }
    throw new Error("unexpected bad hex digit in checked data");
}
function is_valid_base64_length(char_length, trailer_length) {
    if (trailer_length > 2) return false;
    if ((char_length + trailer_length & 0x3) != 0) return false;
    return true;
}
function is_valid_string_char(ch, allow_new_line) {
    if (ch == CH_CR) return allow_new_line;
    if (ch == CH_NL) return allow_new_line;
    if (IonText.is_whitespace(ch)) return true;
    if (ch < 32) return false;
    return true;
}

var ParserTextRaw = function () {
    function ParserTextRaw(source, raw_tokens_only) {
        (0, _classCallCheck3.default)(this, ParserTextRaw);

        this._read_value_helper_minus = function (ch1, accept_operator_symbols, calling_op) {
            var op = undefined,
                ch2 = this._peek();
            if (ch2 == CH_i) {
                ch2 = this._peek("inf");
                if (IonText.is_numeric_terminator(ch2)) {
                    op = this._read_minus_inf;
                } else if (accept_operator_symbols) {
                    op = this._read_operator_symbol;
                }
            } else if (IonText.is_digit(ch2)) {
                op = this._read_number;
            } else if (accept_operator_symbols) {
                op = this._read_operator_symbol;
            }
            if (op != undefined) {
                this._ops.unshift(op);
                this._unread(ch1);
            } else {
                this._error("operator symbols are not valid outside of sexp's");
            }
        };
        this._read_string_helper = function (terminator, allow_new_line) {
            var ch;
            for (;;) {
                ch = this._read();
                if (ch == CH_BS) {
                    this._read_string_escape_sequence();
                } else if (ch == terminator) {
                    break;
                } else if (!is_valid_string_char(ch, allow_new_line)) {
                    this._error("invalid character in string: " + String.fromCharCode(ch));
                    break;
                }
            }
        };
        this._in = source;
        this._raw = raw_tokens_only;
        if (raw_tokens_only) {
            this._ops = [this._read_token];
        } else {
            this._ops = [this._read_datagram_values];
        }
        this._value_type = ERROR;
        this._value = [];
        this._start = -1;
        this._end = -1;
        this._esc_len = -1;
        this._curr = EOF;
        this._ann = empty_array;
        this._msg = "";
        function remap(map) {
            var ret = {};
            for (var s in map) {
                var val = map[s];
                for (var i = 0; i < s.length; i++) {
                    ret[s.charCodeAt(i)] = val;
                }
            }
            return ret;
        }
        var helpers = remap({
            "0123456789": this._read_value_helper_digit,
            "_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ": this._read_value_helper_letter,
            "!#%&*./;<=>?@^`|~": this._read_value_helper_operator,
            "+": this._read_value_helper_plus,
            "-": this._read_value_helper_minus,
            "'": this._read_value_helper_single,
            '"': this._read_value_helper_double,
            '{': this._read_value_helper_curly
        });
        this._read_value_helper_helpers = (0, _extends3.default)({}, helpers, remap({
            '(': this._read_value_helper_paren,
            '[': this._read_value_helper_square
        }));
        this._read_token_helper_helpers = (0, _extends3.default)({}, helpers, remap({
            ':': this._read_token_helper_colon,
            '()[]};,': this._read_value_helper_operator
        }));
    }

    (0, _createClass3.default)(ParserTextRaw, [{
        key: "fieldName",
        value: function fieldName() {
            return this._fieldname;
        }
    }, {
        key: "annotations",
        value: function annotations() {
            return this._ann;
        }
    }, {
        key: "start",
        value: function start() {
            return this._start;
        }
    }, {
        key: "end",
        value: function end() {
            return this._end;
        }
    }, {
        key: "locator",
        value: function locator(start) {
            return this._in.locator(start);
        }
    }, {
        key: "error_line",
        value: function error_line(start, end) {
            return this._in.error_line(start, end);
        }
    }, {
        key: "_read_datagram_values",
        value: function _read_datagram_values() {
            var ch = this._peek();
            if (ch == EOF) {
                this._value_push(EOF);
            } else {
                this._ops.unshift(this._read_datagram_values);
                this._ops.unshift(this._read_value);
            }
        }
    }, {
        key: "_read_sexp_values",
        value: function _read_sexp_values() {
            var ch = this._read_after_whitespace(true);
            if (ch == CH_CP) {
                this._value_push(EOF);
            } else {
                this._unread(ch);
                this._ops.unshift(this._read_sexp_values);
                this._ops.unshift(this._read_sexp_value);
            }
        }
    }, {
        key: "_read_list_values",
        value: function _read_list_values() {
            var ch = this._read_after_whitespace(true);
            if (ch == CH_CS) {
                this._value_push(EOF);
            } else {
                this._unread(ch);
                this._ops.unshift(this._read_list_comma);
                this._ops.unshift(this._read_value);
            }
        }
    }, {
        key: "_read_struct_values",
        value: function _read_struct_values() {
            var op = this._done_with_error,
                ch = this._read_after_whitespace(true);
            switch (ch) {
                case CH_SQ:
                    op = this._read_string1;
                    if (this._peek("\'\'") != ERROR) {
                        op = this._read_string3;
                    }
                    break;
                case CH_DOUBLE_QUOTE:
                    op = this._read_string2;
                    break;
                case CH_CC:
                    this._value_push(EOF);
                    return;
                default:
                    if (IonText.is_letter(ch)) {
                        op = this._read_symbol;
                    }
                    break;
            }
            if (op === this._done_with_error) {
                this._error("expected field name (or close struct '}') not found");
            } else {
                op.call(this);
                this._load_field_name();
                ch = this._read_after_whitespace(true);
                if (ch != CH_CL) this._error("expected ':'");
                this._ops.unshift(this._read_struct_comma);
                this._ops.unshift(this._read_value);
            }
        }
    }, {
        key: "_read_list_comma",
        value: function _read_list_comma() {
            var ch = this._read_after_whitespace(true);
            if (ch == CH_CM) {
                ch = this._read_after_whitespace(true);
                if (ch == CH_CS) {
                    this._value_push(EOF);
                } else {
                    this._unread(ch);
                    this._ops.unshift(this._read_list_comma);
                    this._ops.unshift(this._read_value);
                }
            } else if (ch == CH_CS) {
                this._value_push(EOF);
            } else {
                this._error("expected ',' or ']'");
            }
        }
    }, {
        key: "_read_struct_comma",
        value: function _read_struct_comma() {
            var ch = this._read_after_whitespace(true);
            if (ch == CH_CM) {
                ch = this._read_after_whitespace(true);
                if (ch == CH_CC) {
                    this._value_push(EOF);
                } else {
                    this._unread(ch);
                    this._ops.unshift(this._read_struct_values);
                }
            } else if (ch == CH_CC) {
                this._value_push(EOF);
            } else {
                this._error("expected ',' or '}'");
            }
        }
    }, {
        key: "_load_field_name",
        value: function _load_field_name() {
            var v = this._value_pop(),
                s = this.get_value_as_string(v);
            switch (v) {
                case T_IDENTIFIER:
                    if (is_keyword(s)) {
                        this._tok_error("can't use '" + s + "' as a fieldname without quotes");
                        break;
                    }
                case T_STRING1:
                case T_STRING2:
                case T_STRING3:
                    this._fieldname = s;
                    break;
                default:
                    this._tok_error("invalid fieldname");
                    break;
            }
        }
    }, {
        key: "_read_value",
        value: function _read_value() {
            this._read_value_helper(false, this._read_value);
        }
    }, {
        key: "_read_sexp_value",
        value: function _read_sexp_value() {
            this._read_value_helper(true, this._read_sexp_value);
        }
    }, {
        key: "_read_value_helper",
        value: function _read_value_helper(accept_operator_symbols, calling_op) {
            var ch = this._read_after_whitespace(true);
            if (ch == EOF) {
                this._read_value_helper_EOF(ch, accept_operator_symbols, calling_op);
            } else {
                var fn = this._read_value_helper_helpers[ch];
                if (fn != undefined) {
                    fn.call(this, ch, accept_operator_symbols, calling_op);
                } else {
                    this._error("unexpected character '" + IonText.asAscii(ch) + "'");
                }
            }
        }
    }, {
        key: "_read_token",
        value: function _read_token() {
            var ch = this._read_after_whitespace(true);
            if (ch == EOF) {
                this._read_value_helper_EOF(ch, true, this._read_token);
            } else {
                this._start = this._in.position() - 1;
                var fn = this._read_token_helper_helpers[ch];
                if (fn != undefined) {
                    fn.call(this, ch, true, this._read_token);
                } else {
                    this._error("unexpected character '" + IonText.asAscii(ch) + "'");
                }
            }
        }
    }, {
        key: "_read_value_helper_EOF",
        value: function _read_value_helper_EOF(ch1, accept_operator_symbols, calling_op) {
            this._ops.unshift(this._done);
        }
    }, {
        key: "_read_value_helper_paren",
        value: function _read_value_helper_paren(ch1, accept_operator_symbols, calling_op) {
            this._value_push(T_SEXP);
            this._ops.unshift(this._read_sexp_values);
        }
    }, {
        key: "_read_value_helper_square",
        value: function _read_value_helper_square(ch1, accept_operator_symbols, calling_op) {
            this._value_push(T_LIST);
            this._ops.unshift(this._read_list_values);
        }
    }, {
        key: "_read_value_helper_curly",
        value: function _read_value_helper_curly(ch1, accept_operator_symbols, calling_op) {
            var ch3,
                ch2 = this._read();
            if (ch2 == CH_LEFT_CURLY) {
                ch3 = this._read_after_whitespace(false);
                if (ch3 == CH_SQ) {
                    this._ops.unshift(this._read_clob_string3);
                } else if (ch3 == CH_DOUBLE_QUOTE) {
                    this._ops.unshift(this._read_clob_string2);
                } else {
                    this._unread(ch3);
                    this._ops.unshift(this._read_blob);
                }
            } else {
                this._unread(ch2);
                if (this._raw) {
                    this._end = this._in.position();
                    this._value_push(T_OPERATOR);
                } else {
                    this._value_push(T_STRUCT);
                    this._ops.unshift(this._read_struct_values);
                }
            }
        }
    }, {
        key: "_read_value_helper_plus",
        value: function _read_value_helper_plus(ch1, accept_operator_symbols, calling_op) {
            var ch2 = this._peek("inf");
            this._unread(ch1);
            if (ch2 != ERROR) {
                this._ops.unshift(this._read_plus_inf);
            } else if (accept_operator_symbols) {
                this._ops.unshift(this._read_operator_symbol);
            } else {
                this._read();
                this._error("unexpected '+'");
            }
        }
    }, {
        key: "_read_value_helper_digit",
        value: function _read_value_helper_digit(ch1, accept_operator_symbols, calling_op) {
            var ch2 = this._peek_4_digits(ch1);
            this._unread(ch1);
            if (ch2 == CH_T || ch2 == CH_MS) {
                this._ops.unshift(this._read_timestamp);
            } else {
                this._ops.unshift(this._read_number);
            }
        }
    }, {
        key: "_read_value_helper_single",
        value: function _read_value_helper_single(ch1, accept_operator_symbols, calling_op) {
            var op;
            if (this._peek("\'\'") != ERROR) {
                op = this._read_string3;
            } else {
                op = this._read_string1;
            }
            op.call(this);
            if (!this._raw && this._test_string_as_annotation(op)) {
                this._ops.unshift(calling_op);
            }
        }
    }, {
        key: "_read_value_helper_double",
        value: function _read_value_helper_double(ch1, accept_operator_symbols, calling_op) {
            this._ops.unshift(this._read_string2);
        }
    }, {
        key: "_read_value_helper_letter",
        value: function _read_value_helper_letter(ch1, accept_operator_symbols, calling_op) {
            this._read_symbol();
            if (this._raw) {
                this._check_for_special_symbol();
            } else {
                if (this._test_symbol_as_annotation()) {
                    this._ops.unshift(calling_op);
                }
            }
        }
    }, {
        key: "_read_value_helper_operator",
        value: function _read_value_helper_operator(ch1, accept_operator_symbols, calling_op) {
            if (accept_operator_symbols) {
                if (IonText.is_single_operator_char(ch1)) {
                    this._end = this._in.position();
                    this._value_push(T_OPERATOR);
                } else {
                    this._ops.unshift(this._read_operator_symbol);
                }
            } else {
                this._error("unexpected operator character");
            }
        }
    }, {
        key: "_read_token_helper_colon",
        value: function _read_token_helper_colon(ch1, accept_operator_symbols, calling_op) {
            var ch = this._peek();
            if (ch == CH_CL) {
                this._read();
            }
            this._end = this._in.position();
            this._value_push(T_OPERATOR);
        }
    }, {
        key: "_done",
        value: function _done() {
            this._value_push(EOF);
        }
    }, {
        key: "_done_with_error",
        value: function _done_with_error() {
            this._value_push(ERROR);
            throw new Error(this._error_msg);
        }
    }, {
        key: "_read_number",
        value: function _read_number() {
            var ch, t;
            this._start = this._in.position();
            ch = this._read();
            if (ch == CH_MS) ch = this._read();
            if (ch == CH_0) {
                ch = this._peek();
                if (ch == CH_x || ch == CH_X) {
                    this._read_hex_int();
                    return;
                }
                if (IonText.is_digit(ch)) {
                    this._error("leading zeroes are not allowed");
                }
                ch = CH_0;
            }
            t = T_INT;
            ch = this._read_required_digits(ch);
            if (ch == CH_DT) {
                t = T_DECIMAL;
                ch = this._read_optional_digits(this._read());
            }
            if (!IonText.is_numeric_terminator(ch)) {
                if (ch == CH_d || ch == CH_D) {
                    t = T_DECIMAL;
                    ch = this._read_exponent();
                } else if (ch == CH_e || ch == CH_E || ch == CH_f || ch == CH_F) {
                    t = T_FLOAT;
                    ch = this._read_exponent();
                }
            }
            if (!this._raw && !IonText.is_numeric_terminator(ch)) {
                this._error("invalid character after number");
            } else {
                this._unread(ch);
                this._end = this._in.position();
                this._value_push(t);
            }
        }
    }, {
        key: "_read_hex_int",
        value: function _read_hex_int() {
            var ch = this._read();
            if (ch == CH_x || ch == CH_X) {
                ch = this._read();
                ch = this._read_required_hex_digits(ch);
            }
            if (this._raw || IonText.is_numeric_terminator(ch)) {
                this._unread(ch);
                this._end = this._in.position();
                this._value_push(T_HEXINT);
            } else {
                this._error("invalid character after number");
            }
        }
    }, {
        key: "_read_exponent",
        value: function _read_exponent() {
            var ch = this._read();
            if (ch == CH_MS || ch == CH_PS) {
                ch = this._read();
            }
            ch = this._read_required_digits(ch);
            return ch;
        }
    }, {
        key: "_read_plus_inf",
        value: function _read_plus_inf() {
            if (this._read() == CH_PS) {
                this._read_inf_helper();
            } else {
                this._error("expected +inf");
            }
        }
    }, {
        key: "_read_minus_inf",
        value: function _read_minus_inf() {
            if (this._read() == CH_MS) {
                this._read_inf_helper();
            } else {
                this._error("expected -inf");
            }
        }
    }, {
        key: "_read_inf_helper",
        value: function _read_inf_helper() {
            var ii, ch;
            for (ii = 0; ii < 3; ii++) {
                ch = this._read();
                if (ch != INF[ii]) {
                    this._error("expected 'inf'");
                    return;
                }
            }
            if (this._raw || IonText.is_numeric_terminator(this._peek())) {
                this._end = this._in.position();
                this._start = this._end - 4;
                this._value_push(T_FLOAT_SPECIAL);
            } else {
                this._read();
                this._error("invalid numeric terminator after 'inf'");
            }
        }
    }, {
        key: "_read_timestamp",
        value: function _read_timestamp() {
            var ch;
            this._start = this._in.position();
            ch = this._read_N_digits(4);
            if (ch == CH_T) {
                ch = this._read();
            } else if (ch == CH_MS) {
                ch = this._read_N_digits(2);
                if (ch == CH_MS) {
                    ch = this._read_N_digits(2);
                }
                ch = this._read_optional_time(ch);
            }
            ch = this._read_optional_time_offset(ch);
            if (this._raw || IonText.is_numeric_terminator(ch)) {
                this._unread(ch);
                this._end = this._in.position();
                this._value_push(T_TIMESTAMP);
            } else {
                this._error("invalid character after timestamp");
            }
        }
    }, {
        key: "_read_optional_time",
        value: function _read_optional_time(ch) {
            if (ch != CH_T) return ch;
            ch = this._read();
            if (!IonText.is_numeric_terminator(ch)) {
                ch = this._read_hours_and_minutes(ch);
                if (ch == CH_CL) {
                    ch = this._read_N_digits(2);
                    if (ch == CH_DT) {
                        ch = this._read();
                        ch = this._read_required_digits(ch);
                    }
                }
            }
            return ch;
        }
    }, {
        key: "_read_optional_time_offset",
        value: function _read_optional_time_offset(ch) {
            if (ch == CH_MS || ch == CH_PS) {
                ch = this._read();
                ch = this._read_hours_and_minutes(ch);
            } else if (ch == CH_Z) {
                ch = this._read();
            }
            return ch;
        }
    }, {
        key: "_read_symbol",
        value: function _read_symbol() {
            var ch;
            this._start = this._in.position() - 1;
            for (;;) {
                ch = this._read();
                if (!IonText.is_letter_or_digit(ch)) break;
            }
            this._end = this._in.position() - 1;
            this._unread(ch);
            this._value_push(T_IDENTIFIER);
        }
    }, {
        key: "_read_operator_symbol",
        value: function _read_operator_symbol() {
            var ch;
            for (;;) {
                ch = this._read();
                if (!IonText.is_operator_char(ch) || IonText.is_single_operator_char(ch)) {
                    this._unread(ch);
                    break;
                }
            }
            this._end = this._in.position();
            this._value_push(T_OPERATOR);
        }
    }, {
        key: "_read_string1",
        value: function _read_string1() {
            this._read_string_helper(CH_SQ, false);
            this._end = this._in.position();
            this._value_push(T_STRING1);
        }
    }, {
        key: "_read_string2",
        value: function _read_string2() {
            this._read_string_helper(CH_DOUBLE_QUOTE, false);
            this._end = this._in.position();
            this._value_push(T_STRING2);
        }
    }, {
        key: "_read_string3",
        value: function _read_string3() {
            var ch;
            this._start = this._in.position() - 1;
            if (this._read() != CH_SQ || this._read() != CH_SQ) {
                this._error("expected triple quote");
            }
            for (;;) {
                for (;;) {
                    this._read_string_helper(CH_SQ, true);
                    if (this._read() == CH_SQ && this._read() == CH_SQ) {
                        break;
                    }
                }
                ch = this._read_after_whitespace(true);
                if (ch != CH_SQ) {
                    this._unread(ch);
                    break;
                }
                if (this._peek("\'\'") == ERROR) {
                    break;
                }
                this._read();
                this._read();
            }
            this._end = this._in.position();
            this._value_push(T_STRING3);
        }
    }, {
        key: "_read_string_escape_sequence",
        value: function _read_string_escape_sequence() {
            var ch = this._read();
            switch (ch) {
                case ESC_0:
                case ESC_a:
                case ESC_b:
                case ESC_t:
                case ESC_nl:
                case ESC_ff:
                case ESC_cr:
                case ESC_v:
                case ESC_dq:
                case ESC_sq:
                case ESC_qm:
                case ESC_bs:
                case ESC_fs:
                case ESC_nl2:
                    break;
                case ESC_nl3:
                    ch = this._read();
                    if (ch != ESC_nl2) this._unread(ch);
                    break;
                case ESC_x:
                    ch = this._read_N_hexdigits(2);
                    this._unread(ch);
                    break;
                case ESC_u:
                    ch = this._read_N_hexdigits(4);
                    this._unread(ch);
                    break;
                case ESC_U:
                    ch = this._read_N_hexdigits(8);
                    this._unread(ch);
                    break;
                default:
                    this._error("unexpected character after escape slash");
            }
        }
    }, {
        key: "_test_string_as_annotation",
        value: function _test_string_as_annotation(op) {
            var s,
                ch,
                is_ann,
                t = this._value_pop();
            if (t != T_STRING1 && t != T_STRING3) this._error("expecting quoted symbol here");
            s = this.get_value_as_string(t);
            ch = this._read_after_whitespace(true);
            if (ch == CH_CL && this._peek() == CH_CL) {
                this._read();
                this._ann.push(s);
                is_ann = true;
            } else {
                this._unread(ch);
                this._value_push(t);
                is_ann = false;
            }
            return is_ann;
        }
    }, {
        key: "_test_symbol_as_annotation",
        value: function _test_symbol_as_annotation() {
            var s,
                ii,
                ch,
                kwt,
                is_ann = true,
                t = this._value_pop();
            if (t != T_IDENTIFIER) this._error("expecting symbol here");
            s = this.get_value_as_string(t);
            kwt = get_keyword_type(s);
            var ch2 = this._peek();
            ch = this._read_after_whitespace(true);
            if (ch == CH_CL && this._peek() == CH_CL) {
                if (kwt != undefined) this._error("the keyword '" + s + "' can't be used as an annotation without quotes");
                this._read();
                this._ann.push(s);
                is_ann = true;
            } else {
                if (kwt == undefined) kwt = T_IDENTIFIER;
                this._unread(ch);
                is_ann = false;
                if (kwt === T_NULL) {
                    this._value_null = true;
                    if (ch2 === CH_DT) {
                        this._read();
                        ch = this._read();
                        if (IonText.is_letter(ch) !== true) {
                            this._error("expected type name after 'null.'");
                            return undefined;
                        }
                        this._read_symbol();
                        if (this._value_pop() != T_IDENTIFIER) {
                            this._tok_error("expected type name after 'null.'");
                            return undefined;
                        }
                        s = this.get_value_as_string(T_IDENTIFIER);
                        kwt = get_type_from_name(s);
                        if (kwt === undefined) {
                            this._tok_error("expected type name after 'null.'");
                            return undefined;
                        }
                    }
                    this._start = -1;
                    this._end = -1;
                }
                this._value_push(kwt);
            }
            return is_ann;
        }
    }, {
        key: "_check_for_special_symbol",
        value: function _check_for_special_symbol() {
            var s,
                ii,
                ch,
                kwt,
                is_ann = true,
                t = this._value_pop();
            if (t != T_IDENTIFIER) this._tok_error("expecting symbol here");
            s = this.get_value_as_string(t);
            kwt = get_keyword_type(s);
            if (kwt === T_NULL) {
                this._value_null = true;
                ch = this._peek();
                if (ch === CH_DT) {
                    this._read();
                    ch = this._read();
                    if (IonText.is_letter(ch) !== true) {
                        this._error("expected type name after 'null.'");
                        return;
                    }
                    var save_start = this._start;
                    this._read_symbol();
                    if (this._value_pop() != T_IDENTIFIER) {
                        this._error("expected type name after 'null.'");
                        return;
                    }
                    s = this.get_value_as_string(T_IDENTIFIER);
                    kwt = get_type_from_name(s);
                    if (kwt === undefined) {
                        this._error("expected type name after 'null.'");
                        return;
                    }
                    this._start = save_start;
                    this._end = this._in.position();
                }
                this._value_push(T_NULL);
            } else if (kwt === T_BOOL) {
                this._value_push(T_BOOL);
            } else if (kwt === T_FLOAT_SPECIAL) {
                this._value_push(T_FLOAT_SPECIAL);
            } else {
                this._value_push(T_IDENTIFIER);
            }
        }
    }, {
        key: "_read_clob_string2",
        value: function _read_clob_string2() {
            var t;
            var save_start = this._start;
            this._read_string2();
            t = this._value_pop();
            if (t != T_STRING2) this._error("string expected");
            this._start = save_start;
            this._value_push(T_CLOB2);
            this._read_close_double_brace();
            this._end = this._in.position();
        }
    }, {
        key: "_read_clob_string3",
        value: function _read_clob_string3() {
            var t;
            var save_start = this._start;
            this._read_string3();
            t = this._value_pop();
            if (t != T_STRING3) this._error("string expected");
            this._start = save_start;
            this._value_push(T_CLOB3);
            this._read_close_double_brace();
            this._end = this._in.position();
        }
    }, {
        key: "_read_blob",
        value: function _read_blob() {
            var ch,
                base64_chars = 0,
                trailers = 0;
            for (;;) {
                ch = this._read();
                if (IonText.is_base64_char(ch)) {
                    base64_chars++;
                } else if (!IonText.is_whitespace(ch)) {
                    break;
                }
            }
            while (ch == CH_EQ) {
                trailers++;
                ch = this._read_after_whitespace(false);
            }
            if (ch != CH_CC || this._read() != CH_CC) {
                this._error("invalid blob");
            } else {
                if (!is_valid_base64_length(base64_chars, trailers)) {
                    this._error("invalid base64 value");
                } else {
                    this._end = this._in.position();
                    this._value_push(T_BLOB);
                }
            }
        }
    }, {
        key: "_read_comma",
        value: function _read_comma() {
            var ch = this._read_after_whitespace(true);
            if (ch != CH_CM) this._error("expected ','");
        }
    }, {
        key: "_read_close_double_brace",
        value: function _read_close_double_brace() {
            var ch = this._read_after_whitespace(true);
            if (ch != CH_CC || this._read() != CH_CC) {
                this._error("expected '}}'");
            }
        }
    }, {
        key: "isNull",
        value: function isNull() {
            return this._curr_null;
        }
    }, {
        key: "numberValue",
        value: function numberValue() {
            var n,
                s = this.get_value_as_string(this._curr);
            switch (this._curr) {
                case T_INT:
                case T_HEXINT:
                case T_FLOAT:
                    n = Number(s);
                    break;
                case T_FLOAT_SPECIAL:
                    if (s == "+inf") n = Number.POSITIVE_INFINITY;else if (s == "-inf") n = Number.NEGATIVE_INFINITY;else if (s == "nan") n = Number.NaN;else throw new Error("can't convert to number");
                    break;
                default:
                    throw new Error("can't convert to number");
            }
            return n;
        }
    }, {
        key: "booleanValue",
        value: function booleanValue() {
            if (this._curr !== T_BOOL) {
                return undefined;
            }
            var s = this.get_value_as_string(T_BOOL);
            if (s == "true") {
                return true;
            } else if (s == "false") {
                return false;
            } else {
                return undefined;
            }
        }
    }, {
        key: "get_raw_token",
        value: function get_raw_token() {
            return this.get_value_as_string(T_BLOB);
        }
    }, {
        key: "get_value_as_string",
        value: function get_value_as_string(t) {
            var start,
                end,
                ii,
                ch,
                s = "";
            switch (t) {
                case T_NULL:
                case T_BOOL:
                case T_INT:
                case T_HEXINT:
                case T_FLOAT:
                case T_FLOAT_SPECIAL:
                case T_DECIMAL:
                case T_TIMESTAMP:
                case T_IDENTIFIER:
                case T_OPERATOR:
                case T_BLOB:
                    for (ii = this._start; ii < this._end; ii++) {
                        s += String.fromCharCode(this._in.valueAt(ii));
                    }
                    break;
                case T_STRING1:
                case T_STRING2:
                    s = this._get_string2(this._start, this._end);
                    break;
                case T_CLOB2:
                    start = this._start + 2;
                    while (IonText.is_whitespace(this._in.valueAt(start))) {
                        start++;
                    }end = this._end - 2;
                    while (end > start && IonText.is_whitespace(this._in.valueAt(end - 1))) {
                        end--;
                    }s = this._get_string2(start, end);
                    break;
                case T_CLOB3:
                    start = this._start + 2;
                    while (IonText.is_whitespace(this._in.valueAt(start))) {
                        start++;
                    }end = this._end - 2;
                    while (end > start && IonText.is_whitespace(this._in.valueAt(end - 1))) {
                        end--;
                    }s = this._get_string3(start, end);
                    break;
                case T_STRING3:
                    s = this._get_string3(this._start, this._end);
                    break;
                default:
                    this._error("can't get this value as a string");
                    break;
            }
            return s;
        }
    }, {
        key: "_get_string2",
        value: function _get_string2(start, end) {
            start++;
            end--;
            var s = "";
            for (var ii = start; ii < end; ii++) {
                var ch = this._in.valueAt(ii);
                if (ch == CH_BS) {
                    s += String.fromCharCode(this._read_escape_sequence(ii, this._end));
                    ii += this._esc_len;
                } else {
                    s += String.fromCharCode(ch);
                }
            }
            return s;
        }
    }, {
        key: "_get_string3",
        value: function _get_string3(start, end) {
            var s = "";
            var ii = 0;
            start += 3;
            end -= 3;
            for (ii = start; ii < end; ii++) {
                var ch = this._in.valueAt(ii);
                if (ch == CH_SQ) {
                    if (ii + 2 < end && this._in.valueAt(ii + 1) == CH_SQ && this._in.valueAt(ii + 2) == CH_SQ) {
                        ii = this._skip_triple_quote_gap(ii, end);
                    } else {
                        s += "\'";
                    }
                } else if (ch == CH_BS) {
                    s += String.fromCharCode(this._read_escape_sequence(ii, end));
                    ii += this._esc_len;
                } else {
                    s += String.fromCharCode(ch);
                }
            }
            return s;
        }
    }, {
        key: "_skip_triple_quote_gap",
        value: function _skip_triple_quote_gap(ii, end) {
            ii += 3;
            while (ii < end) {
                var ch = this._in.valueAt(ii);
                if (IonText.is_whitespace(ch)) {
                    ii++;
                } else if (ch == CH_SQ && ii + 2 < end && this._in.valueAt(ii + 1) == CH_SQ && this._in.valueAt(ii + 1) == CH_SQ) {
                    return ii + 2;
                } else if (ch == CH_FORWARD_SLASH && ii + 1 < end && this._in.valueAt(ii + 1) == CH_FORWARD_SLASH) {
                    ii += 2;
                    while (ii < end) {
                        ch = this._in.valueAt(ii++);
                        if (ch == CH_NL) break;
                    }
                } else if (ch == CH_FORWARD_SLASH && ii + 1 < end && this._in.valueAt(ii + 1) == CH_AS) {
                    ii += 2;
                    while (ii < end) {
                        ch = this._in.valueAt(ii++);
                        if (ch == CH_AS && ii < end && this._in.valueAt(ii) == CH_FORWARD_SLASH) {
                            ii++;
                            break;
                        }
                    }
                } else {
                    this._errorAt("unexpected character: " + String.fromCharCode(ch), ii, ii + 1);
                    break;
                }
            }
            return ii;
        }
    }, {
        key: "_read_escape_sequence",
        value: function _read_escape_sequence(ii, end) {
            var ch;
            if (ii + 1 >= end) {
                this._error("invalid escape sequence");
                return;
            }
            ch = this._in.valueAt(ii + 1);
            this._esc_len = 1;
            switch (ch) {
                case ESC_0:
                    return 0;
                case ESC_a:
                    return 7;
                case ESC_b:
                    return 8;
                case ESC_t:
                    return 9;
                case ESC_nl:
                    return 10;
                case ESC_ff:
                    return 12;
                case ESC_cr:
                    return 13;
                case ESC_v:
                    return 11;
                case ESC_dq:
                    return 34;
                case ESC_sq:
                    return 39;
                case ESC_qm:
                    return 63;
                case ESC_bs:
                    return 92;
                case ESC_fs:
                    return 47;
                case ESC_nl2:
                    return -1;
                case ESC_nl3:
                    if (ii + 3 < end && this._in.valueAt(ii + 3) == CH_NL) {
                        this._esc_len = 2;
                    }
                    return IonText.ESCAPED_NEWLINE;
                case ESC_x:
                    if (ii + 3 >= end) {
                        this._error("invalid escape sequence");
                        return;
                    }
                    ch = this._get_N_hexdigits(ii + 2, ii + 4);
                    this._esc_len = 3;
                    break;
                case ESC_u:
                    if (ii + 5 >= end) {
                        this._error("invalid escape sequence");
                        return;
                    }
                    ch = this._get_N_hexdigits(ii + 2, ii + 6);
                    this._esc_len = 5;
                    break;
                case ESC_U:
                    if (ii + 9 >= end) {
                        this._error("invalid escape sequence");
                        return;
                    }
                    ch = this._get_N_hexdigits(ii + 2, ii + 10);
                    this._esc_len = 9;
                    break;
                default:
                    this._error("unexpected character after escape slash");
            }
            return;
        }
    }, {
        key: "_get_N_hexdigits",
        value: function _get_N_hexdigits(ii, end) {
            var ch,
                v = 0;
            while (ii < end) {
                ch = this._in.valueAt(ii);
                v = v * 16 + get_hex_value(ch);
                ii++;
            }
            return v;
        }
    }, {
        key: "_value_push",
        value: function _value_push(t) {
            if (this._value_type !== ERROR) {
                this._error("unexpected double push of value type!");
            }
            this._value_type = t;
        }
    }, {
        key: "_value_pop",
        value: function _value_pop() {
            var t = this._value_type;
            this._value_type = ERROR;
            return t;
        }
    }, {
        key: "next",
        value: function next() {
            if (this._raw) {
                this._ops = [this._read_token];
            }
            if (this._value_type === ERROR) {
                this._run();
            }
            this._curr = this._value_pop();
            var t = void 0;
            if (this._curr === ERROR) {
                this._value.push(ERROR);
                t = undefined;
            } else {
                t = this._curr;
            }
            this._curr_null = this._value_null;
            this._value_null = false;
            return t;
        }
    }, {
        key: "_run",
        value: function _run() {
            var op;
            while (this._ops.length > 0 && this._value_type === ERROR) {
                op = this._ops.shift();
                op.call(this);
            }
        }
    }, {
        key: "_read",
        value: function _read() {
            var ch = this._in.next();
            return ch;
        }
    }, {
        key: "_read_skipping_comments",
        value: function _read_skipping_comments() {
            var ch = this._read();
            if (ch == CH_FORWARD_SLASH) {
                ch = this._read();
                if (ch == CH_FORWARD_SLASH) {
                    this._read_to_newline();
                    ch = IonText.WHITESPACE_COMMENT1;
                } else if (ch == CH_AS) {
                    this._read_to_close_comment();
                    ch = IonText.WHITESPACE_COMMENT2;
                } else {
                    this._unread(ch);
                    ch = CH_FORWARD_SLASH;
                }
            }
            return ch;
        }
    }, {
        key: "_read_to_newline",
        value: function _read_to_newline() {
            var ch;
            for (;;) {
                ch = this._read();
                if (ch == EOF) break;
                if (ch == CH_NL) break;
                if (ch == CH_CR) {
                    ch = this._read();
                    if (ch != CH_NL) this._unread(ch);
                    break;
                }
            }
        }
    }, {
        key: "_read_to_close_comment",
        value: function _read_to_close_comment() {
            var ch;
            for (;;) {
                ch = this._read();
                if (ch == EOF) break;
                if (ch == CH_AS) {
                    ch = this._read();
                    if (ch == CH_FORWARD_SLASH) break;
                }
            }
        }
    }, {
        key: "_unread",
        value: function _unread(ch) {
            this._in.unread(ch);
        }
    }, {
        key: "_read_after_whitespace",
        value: function _read_after_whitespace(recognize_comments) {
            var ch;
            if (recognize_comments) {
                ch = this._read_skipping_comments();
                while (IonText.is_whitespace(ch)) {
                    ch = this._read_skipping_comments();
                }
            } else {
                ch = this._read();
                while (IonText.is_whitespace(ch)) {
                    ch = this._read();
                }
            }
            return ch;
        }
    }, {
        key: "_peek",
        value: function _peek(expected) {
            var ch,
                ii = 0;
            if (expected === undefined || expected.length < 1) {
                ch = this._read();
                this._unread(ch);
                return ch;
            }
            while (ii < expected.length) {
                ch = this._read();
                if (ch != expected.charCodeAt(ii)) break;
                ii++;
            }
            if (ii == expected.length) {
                ch = this._peek();
            } else {
                this._unread(ch);
                ch = ERROR;
            }
            while (ii > 0) {
                ii--;
                this._unread(expected.charCodeAt(ii));
            }
            return ch;
        }
    }, {
        key: "_peek_after_whitespace",
        value: function _peek_after_whitespace(recognize_comments) {
            var ch = this._read_after_whitespace(recognize_comments);
            this._unread(ch);
            return ch;
        }
    }, {
        key: "_peek_4_digits",
        value: function _peek_4_digits(ch1) {
            var ii,
                ch,
                is_digits = true,
                chars = [];
            if (!IonText.is_digit(ch1)) return ERROR;
            for (ii = 0; ii < 3; ii++) {
                ch = this._read();
                chars.push(ch);
                if (!IonText.is_digit(ch)) {
                    is_digits = false;
                    break;
                }
            }
            ch = is_digits && ii == 3 ? this._peek() : ERROR;
            while (chars.length > 0) {
                this._unread(chars.pop());
            }
            return ch;
        }
    }, {
        key: "_read_required_digits",
        value: function _read_required_digits(ch) {
            if (!IonText.is_digit(ch)) return ERROR;
            for (;;) {
                ch = this._read();
                if (!IonText.is_digit(ch)) break;
            }
            return ch;
        }
    }, {
        key: "_read_optional_digits",
        value: function _read_optional_digits(ch) {
            while (IonText.is_digit(ch)) {
                ch = this._read();
            }
            return ch;
        }
    }, {
        key: "_read_N_digits",
        value: function _read_N_digits(n) {
            var ch,
                ii = 0;
            while (ii < n) {
                ch = this._read();
                if (!IonText.is_digit(ch)) {
                    this._error("" + n + " digits required " + ii + " found");
                    return ERROR;
                }
                ii++;
            }
            return this._read();
        }
    }, {
        key: "_read_required_hex_digits",
        value: function _read_required_hex_digits(ch) {
            if (!IonText.is_hex_digit(ch)) return ERROR;
            for (;;) {
                ch = this._read();
                if (!IonText.is_hex_digit(ch)) break;
            }
            return ch;
        }
    }, {
        key: "_read_N_hexdigits",
        value: function _read_N_hexdigits(n) {
            var ch,
                ii = 0;
            while (ii < n) {
                ch = this._read();
                if (!IonText.is_hex_digit(ch)) {
                    this._error("" + n + " digits required " + ii + " found");
                    return ERROR;
                }
                ii++;
            }
            return ch;
        }
    }, {
        key: "_read_hours_and_minutes",
        value: function _read_hours_and_minutes(ch) {
            if (!IonText.is_digit(ch)) return ERROR;
            ch = this._read_N_digits(1);
            if (ch == CH_CL) {
                ch = this._read_N_digits(2);
            } else {
                ch = ERROR;
            }
            return ch;
        }
    }, {
        key: "_error",
        value: function _error(msg) {
            var pos = this._in.position();
            this._errorAt(msg, pos - 1, pos);
        }
    }, {
        key: "_tok_error",
        value: function _tok_error(msg) {
            this._errorAt(msg, this._start, this._end);
        }
    }, {
        key: "_errorAt",
        value: function _errorAt(msg, start, end) {
            var locator = this.locator(start);
            msg = msg + " at line " + locator[0] + ", column " + locator[1] + ":\n" + this.error_line(start, end).join('\n');
            this._ops.unshift(this._done_with_error);
            this._error_msg = msg;
        }
    }]);
    return ParserTextRaw;
}();

exports.ParserTextRaw = ParserTextRaw;


},{"./IonText":20,"./IonTypes":25,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39,"babel-runtime/helpers/extends":40}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Precision;
(function (Precision) {
    Precision[Precision["EMPTY"] = -1] = "EMPTY";
    Precision[Precision["NULL"] = 0] = "NULL";
    Precision[Precision["YEAR"] = 1] = "YEAR";
    Precision[Precision["MONTH"] = 2] = "MONTH";
    Precision[Precision["DAY"] = 3] = "DAY";
    Precision[Precision["HOUR_AND_MINUTE"] = 4] = "HOUR_AND_MINUTE";
    Precision[Precision["SECONDS"] = 5] = "SECONDS";
})(Precision = exports.Precision || (exports.Precision = {}));


},{}],15:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });

var SharedSymbolTable = function () {
    function SharedSymbolTable(_name, _version, _symbols) {
        (0, _classCallCheck3.default)(this, SharedSymbolTable);

        this._name = _name;
        this._version = _version;
        this._symbols = _symbols;
    }

    (0, _createClass3.default)(SharedSymbolTable, [{
        key: "name",
        get: function get() {
            return this._name;
        }
    }, {
        key: "version",
        get: function get() {
            return this._version;
        }
    }, {
        key: "symbols",
        get: function get() {
            return this._symbols;
        }
    }]);
    return SharedSymbolTable;
}();

exports.SharedSymbolTable = SharedSymbolTable;


},{"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],16:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonConstants_1 = require("./IonConstants");
var MAX_POS = 1024 * 1024 * 1024;
var LINE_FEED = 10;
var CARRIAGE_RETURN = 13;
var DEBUG_FLAG = true;

var StringSpan = function () {
    function StringSpan(src, start, len) {
        (0, _classCallCheck3.default)(this, StringSpan);

        this._line = 1;
        this._src = src;
        this._pos = 0;
        this._limit = src.length;
        if (start !== undefined) {
            this._pos = start;
            if (len !== undefined) {
                this._limit = start + len;
            }
        }
        this._start = this._pos;
        this._line_start = this._pos;
        this._old_line_start = 0;
    }

    (0, _createClass3.default)(StringSpan, [{
        key: "position",
        value: function position() {
            return this._pos - this._start;
        }
    }, {
        key: "getRemaining",
        value: function getRemaining() {
            return this._limit - this._pos;
        }
    }, {
        key: "setRemaining",
        value: function setRemaining(r) {
            this._limit = r + this._pos;
        }
    }, {
        key: "is_empty",
        value: function is_empty() {
            return this._pos >= this._limit;
        }
    }, {
        key: "next",
        value: function next() {
            var ch;
            if (this.is_empty()) {
                if (this._pos > MAX_POS) {
                    throw new Error("span position is out of bounds");
                }
                this._pos++;
                return IonConstants_1.EOF;
            }
            ch = this._src.charCodeAt(this._pos);
            if (ch === CARRIAGE_RETURN) {
                if (this.peek() != LINE_FEED) {
                    this._inc_line();
                }
            } else if (ch == LINE_FEED) {
                this._inc_line();
            }
            this._pos++;
            return ch;
        }
    }, {
        key: "_inc_line",
        value: function _inc_line() {
            this._old_line_start = this._line_start;
            this._line++;
            this._line_start = this._pos;
        }
    }, {
        key: "unread",
        value: function unread(ch) {
            if (this._pos <= this._start) throw new Error("span error");
            this._pos--;
            if (ch < 0) {
                if (this.is_empty() != true) throw new Error("span error");
                return;
            }
            if (this._pos == this._line_start) {
                this._line_start = this._old_line_start;
                this._line--;
            }
            if (ch != this.peek()) throw new Error("span error");
        }
    }, {
        key: "peek",
        value: function peek() {
            return this.valueAt(this._pos);
        }
    }, {
        key: "skip",
        value: function skip(dist) {
            this._pos += dist;
            if (this._pos > this._limit) {
                this._pos = this._limit;
            }
        }
    }, {
        key: "valueAt",
        value: function valueAt(ii) {
            if (ii < this._start || ii >= this._limit) return IonConstants_1.EOF;
            return this._src.charCodeAt(ii);
        }
    }, {
        key: "charAt",
        value: function charAt(ii) {
            if (ii < this._start || ii >= this._limit) return "";
            return this._src[ii];
        }
    }, {
        key: "offset",
        value: function offset() {
            return this._pos - this._line_start;
        }
    }, {
        key: "locator",
        value: function locator(pos) {
            var line = 1,
                column = 1;
            for (var i = 0; i < pos; i++) {
                var ch = this.valueAt(i);
                if (ch == LINE_FEED) {
                    line++;
                    column = 1;
                } else {
                    column++;
                }
            }
            return [line, column];
        }
    }, {
        key: "error_line",
        value: function error_line(start, end) {
            var line_start = start;
            while (line_start > 0 && this.valueAt(line_start - 1) != LINE_FEED) {
                line_start--;
            }
            var line_end = end;
            while (line_end < this._limit && this.valueAt(line_end) != LINE_FEED) {
                line_end++;
            }
            var str = "";
            for (var x = line_start; x < line_end; x++) {
                str += this.charAt(x);
            }
            var pointer = "";
            for (var y = line_start; y < start; y++) {
                pointer += " ";
            }
            for (; y < end; y++) {
                pointer += "^";
            }return [str, pointer];
        }
    }, {
        key: "clone",
        value: function clone(start, len) {
            var actual_len = this._limit - this._pos - start;
            if (actual_len > len) {
                actual_len = len;
            }
            return new StringSpan(this._src, this._pos, actual_len);
        }
    }]);
    return StringSpan;
}();

exports.StringSpan = StringSpan;

var BinarySpan = function () {
    function BinarySpan(src, start, len) {
        (0, _classCallCheck3.default)(this, BinarySpan);

        this._src = src;
        this._limit = src.length;
        this._start = start || 0;
        if (len !== undefined) {
            this._limit = start + len;
        }
        this._pos = this._start;
    }

    (0, _createClass3.default)(BinarySpan, [{
        key: "error_line",
        value: function error_line(start, end) {
            throw new Error("not implemented on binary spans");
        }
    }, {
        key: "locator",
        value: function locator(pos) {
            throw new Error("not implemented on binary spans");
        }
    }, {
        key: "position",
        value: function position() {
            return this._pos - this._start;
        }
    }, {
        key: "getRemaining",
        value: function getRemaining() {
            return this._limit - this._pos;
        }
    }, {
        key: "setRemaining",
        value: function setRemaining(r) {
            this._limit = r + this._pos;
        }
    }, {
        key: "is_empty",
        value: function is_empty() {
            return this._pos >= this._limit;
        }
    }, {
        key: "next",
        value: function next() {
            if (this.is_empty()) {
                if (this._pos > MAX_POS) {
                    throw new Error("span position is out of bounds");
                }
                this._pos++;
                return IonConstants_1.EOF;
            }
            var b = this._src[this._pos];
            this._pos++;
            return b & 0xFF;
        }
    }, {
        key: "unread",
        value: function unread(b) {
            if (this._pos <= this._start) throw new Error("span error");
            this._pos--;
            if (b == IonConstants_1.EOF) {
                if (this.is_empty() == false) throw new Error("span error");
            }
        }
    }, {
        key: "peek",
        value: function peek() {
            if (this.is_empty()) return IonConstants_1.EOF;
            return this._src[this._pos] & 0xFF;
        }
    }, {
        key: "skip",
        value: function skip(dist) {
            this._pos += dist;
            if (this._pos > this._limit) {
                this._pos = this._limit;
            }
        }
    }, {
        key: "valueAt",
        value: function valueAt(ii) {
            if (ii < this._start || ii >= this._limit) return undefined;
            return this._src[ii] & 0xFF;
        }
    }, {
        key: "clone",
        value: function clone(start, len) {
            var actual_len = this._limit - this._pos - start;
            if (actual_len > len) {
                actual_len = len;
            }
            return new BinarySpan(this._src, this._pos + start, actual_len);
        }
    }, {
        key: "write",
        value: function write(b) {
            throw new Error("not implemented");
        }
    }]);
    return BinarySpan;
}();

exports.BinarySpan = BinarySpan;


},{"./IonConstants":6,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],17:[function(require,module,exports){
"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonSharedSymbolTable_1 = require("./IonSharedSymbolTable");

var SubstituteSymbolTable = function (_IonSharedSymbolTable) {
    (0, _inherits3.default)(SubstituteSymbolTable, _IonSharedSymbolTable);

    function SubstituteSymbolTable(length) {
        (0, _classCallCheck3.default)(this, SubstituteSymbolTable);
        return (0, _possibleConstructorReturn3.default)(this, (SubstituteSymbolTable.__proto__ || (0, _getPrototypeOf2.default)(SubstituteSymbolTable)).call(this, null, undefined, new Array(length)));
    }

    return SubstituteSymbolTable;
}(IonSharedSymbolTable_1.SharedSymbolTable);

exports.SubstituteSymbolTable = SubstituteSymbolTable;


},{"./IonSharedSymbolTable":15,"babel-runtime/core-js/object/get-prototype-of":34,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/inherits":42,"babel-runtime/helpers/possibleConstructorReturn":43}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IonSystemSymbolTable_1 = require("./IonSystemSymbolTable");
var IonImport_1 = require("./IonImport");
var IonLocalSymbolTable_1 = require("./IonLocalSymbolTable");
var IonSubstituteSymbolTable_1 = require("./IonSubstituteSymbolTable");
exports.ion_symbol_table = "$ion_symbol_table";
exports.ion_symbol_table_sid = 3;
var empty_struct = {};
function load_imports(reader, catalog) {
    var import_ = IonSystemSymbolTable_1.getSystemSymbolTableImport();
    reader.stepIn();
    while (reader.next()) {
        reader.stepIn();
        var name = void 0;
        var version = 1;
        var maxId = void 0;
        while (reader.next()) {
            switch (reader.fieldName()) {
                case "name":
                    name = reader.stringValue();
                    break;
                case "version":
                    version = reader.numberValue();
                    break;
                case "max_id":
                    maxId = reader.numberValue();
            }
        }
        if (version < 1) {
            version = 1;
        }
        if (name && name != "$ion") {
            var symbolTable = catalog.findSpecificVersion(name, version);
            if (!symbolTable) {
                if (!maxId) {
                    throw new Error("No exact match found when trying to import symbol table " + name + " version " + version);
                } else {
                    symbolTable = catalog.findLatestVersion(name);
                }
            }
            if (!symbolTable) {
                symbolTable = new IonSubstituteSymbolTable_1.SubstituteSymbolTable(maxId);
            }
            import_ = new IonImport_1.Import(import_, symbolTable, maxId);
        }
        reader.stepOut();
    }
    reader.stepOut();
    return import_;
}
function load_symbols(reader) {
    var symbols = [];
    reader.stepIn();
    while (reader.next()) {
        symbols.push(reader.stringValue());
    }
    reader.stepOut();
    return symbols;
}
function makeSymbolTable(catalog, reader) {
    var import_ = void 0;
    var symbols = void 0;
    var maxId = void 0;
    reader.stepIn();
    while (reader.next()) {
        switch (reader.fieldName()) {
            case "imports":
                import_ = load_imports(reader, catalog);
                break;
            case "symbols":
                symbols = load_symbols(reader);
                break;
        }
    }
    reader.stepOut();
    return new IonLocalSymbolTable_1.LocalSymbolTable(import_, symbols);
}
exports.makeSymbolTable = makeSymbolTable;


},{"./IonImport":8,"./IonLocalSymbolTable":9,"./IonSubstituteSymbolTable":17,"./IonSystemSymbolTable":19}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IonImport_1 = require("./IonImport");
var IonSharedSymbolTable_1 = require("./IonSharedSymbolTable");
var systemSymbolTable = new IonSharedSymbolTable_1.SharedSymbolTable("$ion", 1, ["$ion", "$ion_1_0", "$ion_symbol_table", "name", "version", "imports", "symbols", "max_id", "$ion_shared_symbol_table"]);
function getSystemSymbolTable() {
    return systemSymbolTable;
}
exports.getSystemSymbolTable = getSystemSymbolTable;
function getSystemSymbolTableImport() {
    return new IonImport_1.Import(null, getSystemSymbolTable());
}
exports.getSystemSymbolTableImport = getSystemSymbolTableImport;


},{"./IonImport":8,"./IonSharedSymbolTable":15}],20:[function(require,module,exports){
"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(escape);

Object.defineProperty(exports, "__esModule", { value: true });
var IonUtilities_1 = require("./IonUtilities");
exports.WHITESPACE_COMMENT1 = -2;
exports.WHITESPACE_COMMENT2 = -3;
exports.ESCAPED_NEWLINE = -4;
var DOUBLE_QUOTE = 34;
var SINGLE_QUOTE = 39;
var SLASH = 92;
var _escapeStrings = {
    0: "\\0",
    8: "\\b",
    9: "\\t",
    10: "\\n",
    13: "\\r",
    DOUBLE_QUOTE: "\\\"",
    SINGLE_QUOTE: "\\\'",
    SLASH: "\\\\"
};
function _make_bool_array(str) {
    var i = str.length;
    var a = [];
    a[128] = false;
    while (i > 0) {
        --i;
        a[str.charCodeAt(i)] = true;
    }
    return a;
}
var _is_base64_char = _make_bool_array("+/0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
var _is_hex_digit = _make_bool_array("0123456789abcdefABCDEF");
var _is_letter = _make_bool_array("_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
var _is_letter_or_digit = _make_bool_array("_$0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
var _is_numeric_terminator = _make_bool_array("{}[](),\"' \t\n\r\f");
var _is_operator_char = _make_bool_array("!#%&*+-./;<=>?@^`|~");
var _is_single_operator_char = _make_bool_array("()[],.;?^`~");
var _is_whitespace = _make_bool_array(" \t\r\n\x0B\f");
var isIdentifierArray = _make_bool_array("_$0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
function is_digit(ch) {
    if (ch < 48 || ch > 57) return false;
    return true;
}
exports.is_digit = is_digit;
function asAscii(s) {
    if (typeof s === 'undefined') {
        s = "undefined::null";
    } else if (typeof s == 'number') {
        s = String.fromCharCode(s);
    } else if (typeof s != 'string') {
        var esc = nextEscape(s, s.length);
        if (esc >= 0) {
            s = escapeString(s, esc);
        }
    }
    return s;
}
exports.asAscii = asAscii;
function nextEscape(s, prev) {
    while (prev-- > 0) {
        if (needsEscape(s.charCodeAt(prev))) break;
    }
    return prev;
}
exports.nextEscape = nextEscape;
function needsEscape(c) {
    if (c < 32) return true;
    if (c > 126) return true;
    if (c === DOUBLE_QUOTE || c === SINGLE_QUOTE || c === SLASH) return true;
    return false;
}
exports.needsEscape = needsEscape;
function escapeString(s, pos) {
    var fixes = [],
        c,
        old_len,
        new_len,
        ii,
        s2;
    while (pos >= 0) {
        c = s.charCodeAt(pos);
        if (!needsEscape(c)) break;
        fixes.push([pos, c]);
        pos = nextEscape(s, pos);
    }
    if (fixes.length > 0) {
        s2 = "";
        ii = fixes.length;
        pos = s.length;
        while (ii--) {
            var fix = fixes[ii];
            var tail_len = pos - fix[0] - 1;
            if (tail_len > 0) {
                s2 = escapeSequence(fix[1]) + s.substring(fix[0] + 1, pos) + s2;
            } else {
                s2 = s.substring(fix[0] + 1, pos) + s2;
            }
            pos = fix[0] - 1;
        }
        if (pos >= 0) {
            s2 = s.substring(0, pos) + s2;
        }
        s = s2;
    }
    return s;
}
exports.escapeString = escapeString;
function escapeSequence(c) {
    var s = _escapeStrings[c];
    if (typeof s === 'undefined') {
        if (c < 256) {
            s = "\\x" + toHex(c, 2);
        } else if (c <= 0xFFFF) {
            s = "\\u" + toHex(c, 4);
        } else {
            s = "\\U" + toHex(c, 8);
        }
    }
    return s;
}
exports.escapeSequence = escapeSequence;
function toHex(c, len) {
    var s = "";
    while (c > 0) {
        s += "0123456789ABCDEF".charAt(c && 0xf);
        c = c / 16;
    }
    if (s.length < len) {
        s = "000000000" + s;
        s = s.substring(s.length - len, s.length);
    }
    return s;
}
exports.toHex = toHex;
function is_letter(ch) {
    return _is_letter[ch];
}
exports.is_letter = is_letter;
function is_numeric_terminator(ch) {
    if (ch == -1) return true;
    return _is_numeric_terminator[ch];
}
exports.is_numeric_terminator = is_numeric_terminator;
function is_letter_or_digit(ch) {
    return _is_letter_or_digit[ch];
}
exports.is_letter_or_digit = is_letter_or_digit;
function is_operator_char(ch) {
    return _is_operator_char[ch];
}
exports.is_operator_char = is_operator_char;
function is_single_operator_char(ch) {
    return _is_single_operator_char[ch];
}
exports.is_single_operator_char = is_single_operator_char;
function is_whitespace(ch) {
    if (ch > 32) return false;
    if (ch == this.WHITESPACE_COMMENT1) return true;
    if (ch == this.WHITESPACE_COMMENT2) return true;
    if (ch == this.ESCAPED_NEWLINE) return true;
    return _is_whitespace[ch];
}
exports.is_whitespace = is_whitespace;
function is_base64_char(ch) {
    return _is_base64_char[ch];
}
exports.is_base64_char = is_base64_char;
function is_hex_digit(ch) {
    return _is_hex_digit[ch];
}
exports.is_hex_digit = is_hex_digit;
var BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var BASE64_PADDING = "=";
var TWO_BIT_MASK = 0x3;
var FOUR_BIT_MASK = 0xF;
var SIX_BIT_MASK = 0x3F;
function toBase64(value) {
    var result = "";
    var i = 0;
    for (; i < value.length - 2; i += 3) {
        var octet1 = value[i];
        var octet2 = value[i + 1];
        var octet3 = value[i + 2];
        var index1 = octet1 >>> 2 & SIX_BIT_MASK;
        var index2 = (octet1 & TWO_BIT_MASK) << 4 | octet2 >>> 4 & FOUR_BIT_MASK;
        var index3 = (octet2 & FOUR_BIT_MASK) << 2 | octet3 >>> 6 & TWO_BIT_MASK;
        var index4 = octet3 & SIX_BIT_MASK;
        result += BASE64[index1];
        result += BASE64[index2];
        result += BASE64[index3];
        result += BASE64[index4];
    }
    if (value.length - i === 2) {
        var _octet = value[i];
        var _octet2 = value[i + 1];
        var _index = _octet >>> 2 & SIX_BIT_MASK;
        var _index2 = (_octet & TWO_BIT_MASK) << 4 | _octet2 >>> 4 & FOUR_BIT_MASK;
        var _index3 = (_octet2 & FOUR_BIT_MASK) << 2;
        result += BASE64[_index];
        result += BASE64[_index2];
        result += BASE64[_index3];
        result += BASE64_PADDING;
    } else if (value.length - i === 1) {
        var _octet3 = value[i];
        var _index4 = _octet3 >>> 2 & SIX_BIT_MASK;
        var _index5 = (_octet3 & TWO_BIT_MASK) << 4;
        result += BASE64[_index4];
        result += BASE64[_index5];
        result += BASE64_PADDING;
        result += BASE64_PADDING;
    }
    return result;
}
exports.toBase64 = toBase64;
var CharCodes;
(function (CharCodes) {
    CharCodes[CharCodes["NULL"] = 0] = "NULL";
    CharCodes[CharCodes["BELL"] = 7] = "BELL";
    CharCodes[CharCodes["BACKSPACE"] = 8] = "BACKSPACE";
    CharCodes[CharCodes["HORIZONTAL_TAB"] = 9] = "HORIZONTAL_TAB";
    CharCodes[CharCodes["LINE_FEED"] = 10] = "LINE_FEED";
    CharCodes[CharCodes["VERTICAL_TAB"] = 11] = "VERTICAL_TAB";
    CharCodes[CharCodes["FORM_FEED"] = 12] = "FORM_FEED";
    CharCodes[CharCodes["CARRIAGE_RETURN"] = 13] = "CARRIAGE_RETURN";
    CharCodes[CharCodes["DOUBLE_QUOTE"] = 34] = "DOUBLE_QUOTE";
    CharCodes[CharCodes["SINGLE_QUOTE"] = 39] = "SINGLE_QUOTE";
    CharCodes[CharCodes["FORWARD_SLASH"] = 47] = "FORWARD_SLASH";
    CharCodes[CharCodes["QUESTION_MARK"] = 63] = "QUESTION_MARK";
    CharCodes[CharCodes["BACKSLASH"] = 92] = "BACKSLASH";
    CharCodes[CharCodes["LEFT_PARENTHESIS"] = '('.charCodeAt(0)] = "LEFT_PARENTHESIS";
    CharCodes[CharCodes["RIGHT_PARENTHESIS"] = ')'.charCodeAt(0)] = "RIGHT_PARENTHESIS";
    CharCodes[CharCodes["LEFT_BRACE"] = '{'.charCodeAt(0)] = "LEFT_BRACE";
    CharCodes[CharCodes["RIGHT_BRACE"] = '}'.charCodeAt(0)] = "RIGHT_BRACE";
    CharCodes[CharCodes["LEFT_BRACKET"] = '['.charCodeAt(0)] = "LEFT_BRACKET";
    CharCodes[CharCodes["RIGHT_BRACKET"] = ']'.charCodeAt(0)] = "RIGHT_BRACKET";
    CharCodes[CharCodes["COMMA"] = ','.charCodeAt(0)] = "COMMA";
    CharCodes[CharCodes["SPACE"] = ' '.charCodeAt(0)] = "SPACE";
    CharCodes[CharCodes["LOWERCASE_U"] = 'u'.charCodeAt(0)] = "LOWERCASE_U";
    CharCodes[CharCodes["COLON"] = ':'.charCodeAt(0)] = "COLON";
})(CharCodes = exports.CharCodes || (exports.CharCodes = {}));
function backslashEscape(s) {
    return [CharCodes.BACKSLASH, s.charCodeAt(0)];
}
function toCharCodes(s) {
    var charCodes = new Array(s.length);
    for (var i = 0; i < s.length; i++) {
        charCodes[i] = s.charCodeAt(i);
    }
    return charCodes;
}
function unicodeEscape(codePoint) {
    var prefix = [CharCodes.BACKSLASH, CharCodes.LOWERCASE_U];
    var hexEscape = codePoint.toString(16);
    while (hexEscape.length < 4) {
        hexEscape = "0" + hexEscape;
    }
    return prefix.concat(toCharCodes(hexEscape));
}
exports.ClobEscapes = {};
exports.ClobEscapes[CharCodes.NULL] = backslashEscape("0");
exports.ClobEscapes[CharCodes.BELL] = backslashEscape("a");
exports.ClobEscapes[CharCodes.BACKSPACE] = backslashEscape("b");
exports.ClobEscapes[CharCodes.HORIZONTAL_TAB] = backslashEscape("t");
exports.ClobEscapes[CharCodes.LINE_FEED] = backslashEscape("n");
exports.ClobEscapes[CharCodes.VERTICAL_TAB] = backslashEscape("v");
exports.ClobEscapes[CharCodes.FORM_FEED] = backslashEscape("f");
exports.ClobEscapes[CharCodes.CARRIAGE_RETURN] = backslashEscape("r");
exports.ClobEscapes[CharCodes.DOUBLE_QUOTE] = backslashEscape('"');
exports.ClobEscapes[CharCodes.SINGLE_QUOTE] = backslashEscape("'");
exports.ClobEscapes[CharCodes.FORWARD_SLASH] = backslashEscape("/");
exports.ClobEscapes[CharCodes.QUESTION_MARK] = backslashEscape("?");
exports.ClobEscapes[CharCodes.BACKSLASH] = backslashEscape("\\");
function unicodeEscapes(escapes, start, end) {
    if (IonUtilities_1.isUndefined(end)) {
        escapes[start] = unicodeEscape(start);
    } else {
        for (var i = start; i < end; i++) {
            escapes[i] = unicodeEscape(i);
        }
    }
}
var CommonEscapes = {};
CommonEscapes[CharCodes.NULL] = backslashEscape('0');
unicodeEscapes(CommonEscapes, 1, 6);
CommonEscapes[CharCodes.BELL] = backslashEscape('a');
CommonEscapes[CharCodes.BACKSPACE] = backslashEscape('b');
CommonEscapes[CharCodes.HORIZONTAL_TAB] = backslashEscape('t');
CommonEscapes[CharCodes.LINE_FEED] = backslashEscape('n');
CommonEscapes[CharCodes.VERTICAL_TAB] = backslashEscape('v');
CommonEscapes[CharCodes.FORM_FEED] = backslashEscape('f');
CommonEscapes[CharCodes.CARRIAGE_RETURN] = backslashEscape['r'];
CommonEscapes[CharCodes.BACKSLASH] = backslashEscape('\\');
exports.StringEscapes = (0, _extends3.default)({}, CommonEscapes);
exports.StringEscapes[CharCodes.DOUBLE_QUOTE] = backslashEscape('"');
exports.SymbolEscapes = (0, _extends3.default)({}, CommonEscapes);
exports.SymbolEscapes[CharCodes.SINGLE_QUOTE] = backslashEscape("'");
function isIdentifier(s) {
    if (is_digit(s.charCodeAt(0))) {
        return false;
    }
    for (var i = 0; i < s.length; i++) {
        var c = s.charCodeAt(i);
        var b = isIdentifierArray[c];
        if (!b) {
            return false;
        }
    }
    return true;
}
exports.isIdentifier = isIdentifier;
function isOperator(s) {
    for (var i = 0; i < s.length; i++) {
        var c = s.charCodeAt(i);
        var b = _is_operator_char[c];
        if (!b) {
            return false;
        }
    }
    return true;
}
exports.isOperator = isOperator;
function escape(s, escapes) {
    var i, charCode, _escape, j;

    return _regenerator2.default.wrap(function escape$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    i = 0;

                case 1:
                    if (!(i < s.length)) {
                        _context.next = 19;
                        break;
                    }

                    charCode = s.charCodeAt(i);
                    _escape = escapes[charCode];

                    if (IonUtilities_1.isUndefined(_escape)) {
                        _context.next = 14;
                        break;
                    }

                    j = 0;

                case 6:
                    if (!(j < _escape.length)) {
                        _context.next = 12;
                        break;
                    }

                    _context.next = 9;
                    return _escape[j];

                case 9:
                    j++;
                    _context.next = 6;
                    break;

                case 12:
                    _context.next = 16;
                    break;

                case 14:
                    _context.next = 16;
                    return charCode;

                case 16:
                    i++;
                    _context.next = 1;
                    break;

                case 19:
                case "end":
                    return _context.stop();
            }
        }
    }, _marked, this);
}
exports.escape = escape;


},{"./IonUtilities":27,"babel-runtime/helpers/extends":40,"babel-runtime/regenerator":45}],21:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonLocalSymbolTable_1 = require("./IonLocalSymbolTable");
var IonParserTextRaw_1 = require("./IonParserTextRaw");
var IonSymbols_1 = require("./IonSymbols");
var IonType_1 = require("./IonType");
var IonTypes_1 = require("./IonTypes");
var IonConstants_1 = require("./IonConstants");
var IonSymbols_2 = require("./IonSymbols");
var IonParserTextRaw_2 = require("./IonParserTextRaw");
var RAW_STRING = new IonType_1.IonType(-1, "raw_input", true, false, false, false);
var BEGINNING_OF_CONTAINER = -2;
var EOF = -1;
var T_IDENTIFIER = 9;
var T_STRUCT = 19;

var TextReader = function () {
    function TextReader(source, catalog, raw_tokens) {
        (0, _classCallCheck3.default)(this, TextReader);

        if (!source) {
            throw new Error("a source Span is required to make a reader");
        }
        this._parser = new IonParserTextRaw_2.ParserTextRaw(source, raw_tokens);
        this._depth = 0;
        this._cat = catalog;
        this._symtab = IonLocalSymbolTable_1.defaultLocalSymbolTable();
        this._type = undefined;
        this._raw_type = undefined;
        this._raw = undefined;
    }

    (0, _createClass3.default)(TextReader, [{
        key: "load_raw",
        value: function load_raw() {
            var t = this;
            if (t._raw !== undefined) return;
            if (t.isNull()) return;
            t._raw = t._parser.get_value_as_string(t._raw_type);
            return;
        }
    }, {
        key: "skip_past_container",
        value: function skip_past_container() {
            var type,
                d = 1,
                p = this._parser;
            while (d > 0) {
                type = p.next();
                if (type === EOF) {
                    d--;
                } else if (type.container) {
                    d++;
                }
            }
        }
    }, {
        key: "next",
        value: function next() {
            this._raw = undefined;
            if (this._raw_type === EOF) {
                return undefined;
            }
            var should_skip = this._raw_type !== BEGINNING_OF_CONTAINER && !this.isNull() && this._type && this._type.container;
            if (should_skip) {
                this.skip_past_container();
            }
            var p = this._parser;
            for (;;) {
                this._raw_type = p.next();
                if (this._depth > 0) break;
                if (this._raw_type === T_IDENTIFIER) {
                    this.load_raw();
                    if (this._raw != IonConstants_1.IVM.text) break;
                    this._symtab = IonLocalSymbolTable_1.defaultLocalSymbolTable();
                } else if (this._raw_type === T_STRUCT) {
                    if (p.annotations().length !== 1) break;
                    if (p.annotations()[0] != IonSymbols_1.ion_symbol_table) break;
                    this._symtab = IonSymbols_2.makeSymbolTable(this._cat, this);
                } else {
                    break;
                }
            }
            this._type = IonParserTextRaw_1.getIonType(this._raw_type);
            return this._type;
        }
    }, {
        key: "stepIn",
        value: function stepIn() {
            if (!this._type.container) {
                throw new Error("can't step in to a scalar value");
            }
            if (this.isNull()) {
                throw new Error("Can't step into a null container");
            }
            this._raw_type = BEGINNING_OF_CONTAINER;
            this._depth++;
        }
    }, {
        key: "stepOut",
        value: function stepOut() {
            var t = this;
            while (t._raw_type != EOF) {
                t.next();
            }
            t._raw_type = undefined;
            t._depth--;
        }
    }, {
        key: "valueType",
        value: function valueType() {
            return this._type;
        }
    }, {
        key: "depth",
        value: function depth() {
            return this._depth;
        }
    }, {
        key: "fieldName",
        value: function fieldName() {
            return this._parser.fieldName();
        }
    }, {
        key: "annotations",
        value: function annotations() {
            return this._parser.annotations();
        }
    }, {
        key: "isNull",
        value: function isNull() {
            if (this._type === IonTypes_1.IonTypes.NULL) return true;
            return this._parser.isNull();
        }
    }, {
        key: "stringValue",
        value: function stringValue() {
            var i,
                s,
                t = this;
            this.load_raw();
            if (t.isNull()) {
                s = "null";
                if (t._type != IonTypes_1.IonTypes.NULL) {
                    s += "." + t._type.name;
                }
            } else if (t._type.scalar) {
                if (t._type !== IonTypes_1.IonTypes.BLOB) {
                    s = t._raw;
                } else {
                    s = t._raw;
                }
            } else {
                i = t.ionValue();
                s = i.stringValue();
            }
            return s;
        }
    }, {
        key: "numberValue",
        value: function numberValue() {
            if (!this._type.num) {
                return undefined;
            }
            return this._parser.numberValue();
        }
    }, {
        key: "byteValue",
        value: function byteValue() {
            throw new Error("E_NOT_IMPL: byteValue");
        }
    }, {
        key: "booleanValue",
        value: function booleanValue() {
            if (this._type !== IonTypes_1.IonTypes.BOOL) {
                return undefined;
            }
            return this._parser.booleanValue();
        }
    }, {
        key: "decimalValue",
        value: function decimalValue() {
            throw new Error("E_NOT_IMPL: decimalValue");
        }
    }, {
        key: "timestampValue",
        value: function timestampValue() {
            throw new Error("E_NOT_IMPL: timestampValue");
        }
    }, {
        key: "value",
        value: function value() {
            throw new Error("E_NOT_IMPL: value");
        }
    }, {
        key: "ionValue",
        value: function ionValue() {
            throw new Error("E_NOT_IMPL: ionValue");
        }
    }, {
        key: "raw_parser",
        value: function raw_parser() {
            return this._parser;
        }
    }]);
    return TextReader;
}();

exports.TextReader = TextReader;


},{"./IonConstants":6,"./IonLocalSymbolTable":9,"./IonParserTextRaw":13,"./IonSymbols":18,"./IonType":24,"./IonTypes":25,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],22:[function(require,module,exports){
"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonText_1 = require("./IonText");
var IonText_2 = require("./IonText");
var IonUnicode_1 = require("./IonUnicode");
var IonUnicode_2 = require("./IonUnicode");
var IonText_3 = require("./IonText");
var IonText_4 = require("./IonText");
var IonUtilities_1 = require("./IonUtilities");
var IonText_5 = require("./IonText");
var IonUtilities_2 = require("./IonUtilities");
var IonUtilities_3 = require("./IonUtilities");
var IonText_6 = require("./IonText");
var IonText_7 = require("./IonText");
var IonText_8 = require("./IonText");
var IonBinary_1 = require("./IonBinary");
var State;
(function (State) {
    State[State["VALUE"] = 0] = "VALUE";
    State[State["STRUCT_FIELD"] = 1] = "STRUCT_FIELD";
    State[State["STRUCT_VALUE"] = 2] = "STRUCT_VALUE";
})(State || (State = {}));

var TextWriter = function () {
    function TextWriter(writeable) {
        (0, _classCallCheck3.default)(this, TextWriter);

        this.writeable = writeable;
        this.state = State.VALUE;
        this.isFirstValue = true;
        this.isFirstValueInContainer = false;
        this.containers = [];
    }

    (0, _createClass3.default)(TextWriter, [{
        key: "getBytes",
        value: function getBytes() {
            return this.writeable.getBytes();
        }
    }, {
        key: "writeBlob",
        value: function writeBlob(value, annotations) {
            var _this = this;

            this.writeValue(IonBinary_1.TypeCodes.BLOB, value, annotations, function (value) {
                _this.writeUtf8('{{');
                _this.writeable.writeBytes(IonUnicode_1.encodeUtf8(IonText_8.toBase64(value)));
                _this.writeUtf8('}}');
            });
        }
    }, {
        key: "writeBoolean",
        value: function writeBoolean(value, annotations) {
            var _this2 = this;

            this.writeValue(IonBinary_1.TypeCodes.BOOL, value, annotations, function (value) {
                _this2.writeUtf8(value ? "true" : "false");
            });
        }
    }, {
        key: "writeClob",
        value: function writeClob(value, annotations) {
            var _this3 = this;

            this.writeValue(IonBinary_1.TypeCodes.CLOB, value, annotations, function (value) {
                _this3.writeUtf8('{{');
                _this3.writeUtf8('"');
                for (var i = 0; i < value.length; i++) {
                    var c = value[i];
                    if (c >= 128) {
                        throw new Error("Illegal clob character " + c + " at index " + i);
                    }
                    var _escape = IonText_2.ClobEscapes[c];
                    if (IonUtilities_2.isUndefined(_escape)) {
                        _this3.writeable.writeByte(c);
                    } else {
                        _this3.writeable.writeBytes(_escape);
                    }
                }
                _this3.writeUtf8('"');
                _this3.writeUtf8('}}');
            });
        }
    }, {
        key: "writeDecimal",
        value: function writeDecimal(value, annotations) {
            var _this4 = this;

            this.writeValue(IonBinary_1.TypeCodes.DECIMAL, value, annotations, function (value) {
                _this4.writeUtf8(value.toString());
            });
        }
    }, {
        key: "writeFieldName",
        value: function writeFieldName(fieldName) {
            if (this.isTopLevel || this.currentContainer !== IonBinary_1.TypeCodes.STRUCT) {
                throw new Error("Cannot write field name outside of a struct");
            }
            if (this.state !== State.STRUCT_FIELD) {
                throw new Error("Expecting a struct value");
            }
            if (!this.isFirstValueInContainer) {
                this.writeable.writeByte(IonText_1.CharCodes.COMMA);
            }
            this.writeSymbolToken(fieldName);
            this.writeable.writeByte(IonText_1.CharCodes.COLON);
            this.state = State.STRUCT_VALUE;
        }
    }, {
        key: "writeFloat32",
        value: function writeFloat32(value, annotations) {
            var _this5 = this;

            this.writeValue(IonBinary_1.TypeCodes.FLOAT, value, annotations, function (value) {
                _this5.writeUtf8(value.toString(10));
            });
        }
    }, {
        key: "writeFloat64",
        value: function writeFloat64(value, annotations) {
            var _this6 = this;

            this.writeValue(IonBinary_1.TypeCodes.FLOAT, value, annotations, function (value) {
                _this6.writeUtf8(value.toString(10));
            });
        }
    }, {
        key: "writeInt",
        value: function writeInt(value, annotations) {
            var _this7 = this;

            this.writeValue(value >= 0 ? IonBinary_1.TypeCodes.POSITIVE_INT : IonBinary_1.TypeCodes.NEGATIVE_INT, value, annotations, function (value) {
                _this7.writeUtf8(value.toString(10));
            });
        }
    }, {
        key: "writeList",
        value: function writeList(annotations, isNull) {
            this.writeContainer(IonBinary_1.TypeCodes.LIST, IonText_1.CharCodes.LEFT_BRACKET, annotations, isNull);
        }
    }, {
        key: "writeNull",
        value: function writeNull(type_, annotations) {
            this.handleSeparator();
            this.writeAnnotations(annotations);
            var s = void 0;
            switch (type_) {
                case IonBinary_1.TypeCodes.NULL:
                    s = "null";
                    break;
                case IonBinary_1.TypeCodes.BOOL:
                    s = "bool";
                    break;
                case IonBinary_1.TypeCodes.POSITIVE_INT:
                case IonBinary_1.TypeCodes.NEGATIVE_INT:
                    s = "int";
                    break;
                case IonBinary_1.TypeCodes.FLOAT:
                    s = "float";
                    break;
                case IonBinary_1.TypeCodes.DECIMAL:
                    s = "decimal";
                    break;
                case IonBinary_1.TypeCodes.TIMESTAMP:
                    s = "timestamp";
                    break;
                case IonBinary_1.TypeCodes.SYMBOL:
                    s = "symbol";
                    break;
                case IonBinary_1.TypeCodes.STRING:
                    s = "string";
                    break;
                case IonBinary_1.TypeCodes.CLOB:
                    s = "clob";
                    break;
                case IonBinary_1.TypeCodes.BLOB:
                    s = "blob";
                    break;
                case IonBinary_1.TypeCodes.LIST:
                    s = "list";
                    break;
                case IonBinary_1.TypeCodes.SEXP:
                    s = "sexp";
                    break;
                case IonBinary_1.TypeCodes.STRUCT:
                    s = "struct";
                    break;
                default:
                    throw new Error("Cannot write null for type " + type_);
            }
            this.writeUtf8("null." + s);
        }
    }, {
        key: "writeSexp",
        value: function writeSexp(annotations, isNull) {
            this.writeContainer(IonBinary_1.TypeCodes.SEXP, IonText_1.CharCodes.LEFT_PARENTHESIS, annotations, isNull);
        }
    }, {
        key: "writeString",
        value: function writeString(value, annotations) {
            var _this8 = this;

            this.writeValue(IonBinary_1.TypeCodes.STRING, value, annotations, function (value) {
                _this8.writeable.writeByte(IonText_1.CharCodes.DOUBLE_QUOTE);
                _this8.writeable.writeStream(IonUnicode_2.encodeUtf8Stream(IonText_3.escape(value, IonText_6.StringEscapes)));
                _this8.writeable.writeByte(IonText_1.CharCodes.DOUBLE_QUOTE);
            });
        }
    }, {
        key: "writeStruct",
        value: function writeStruct(annotations, isNull) {
            this.writeContainer(IonBinary_1.TypeCodes.STRUCT, IonText_1.CharCodes.LEFT_BRACE, annotations, isNull);
            this.state = State.STRUCT_FIELD;
        }
    }, {
        key: "writeSymbol",
        value: function writeSymbol(value, annotations) {
            var _this9 = this;

            this.writeValue(IonBinary_1.TypeCodes.SYMBOL, value, annotations, function (value) {
                _this9.writeSymbolToken(value);
            });
        }
    }, {
        key: "writeTimestamp",
        value: function writeTimestamp(value, annotations) {
            var _this10 = this;

            this.writeValue(IonBinary_1.TypeCodes.TIMESTAMP, value, annotations, function (value) {
                _this10.writeUtf8(value.toString());
            });
        }
    }, {
        key: "endContainer",
        value: function endContainer() {
            if (this.isTopLevel) {
                throw new Error("Can't step out when not in a container");
            } else if (this.state === State.STRUCT_VALUE) {
                throw new Error("Expecting a struct value");
            }
            var container = this.containers.pop();
            switch (container) {
                case IonBinary_1.TypeCodes.LIST:
                    this.writeable.writeByte(IonText_1.CharCodes.RIGHT_BRACKET);
                    break;
                case IonBinary_1.TypeCodes.SEXP:
                    this.writeable.writeByte(IonText_1.CharCodes.RIGHT_PARENTHESIS);
                    break;
                case IonBinary_1.TypeCodes.STRUCT:
                    this.writeable.writeByte(IonText_1.CharCodes.RIGHT_BRACE);
                    break;
            }
            if (!this.isTopLevel) {
                if (this.currentContainer === IonBinary_1.TypeCodes.STRUCT) {
                    this.state = State.STRUCT_FIELD;
                }
                this.isFirstValueInContainer = false;
            }
        }
    }, {
        key: "close",
        value: function close() {
            while (!this.isTopLevel) {
                this.endContainer();
            }
        }
    }, {
        key: "writeValue",
        value: function writeValue(typeCode, value, annotations, serialize) {
            if (this.state === State.STRUCT_FIELD) {
                throw new Error("Expecting a struct field");
            }
            if (IonUtilities_1.isNullOrUndefined(value)) {
                this.writeNull(typeCode, annotations);
                return;
            }
            this.handleSeparator();
            this.writeAnnotations(annotations);
            serialize(value);
            if (this.state === State.STRUCT_VALUE) {
                this.state = State.STRUCT_FIELD;
            }
        }
    }, {
        key: "writeContainer",
        value: function writeContainer(typeCode, openingCharacter, annotations, isNull) {
            if (isNull) {
                this.writeNull(typeCode, annotations);
                return;
            }
            this.handleSeparator();
            this.writeAnnotations(annotations);
            this.writeable.writeByte(openingCharacter);
            this.stepIn(typeCode);
        }
    }, {
        key: "handleSeparator",
        value: function handleSeparator() {
            if (this.isTopLevel) {
                if (this.isFirstValue) {
                    this.isFirstValue = false;
                } else {
                    this.writeable.writeByte(IonText_1.CharCodes.LINE_FEED);
                }
            } else {
                if (this.isFirstValueInContainer) {
                    this.isFirstValueInContainer = false;
                } else {
                    switch (this.currentContainer) {
                        case IonBinary_1.TypeCodes.LIST:
                            this.writeable.writeByte(IonText_1.CharCodes.COMMA);
                            break;
                        case IonBinary_1.TypeCodes.SEXP:
                            this.writeable.writeByte(IonText_1.CharCodes.SPACE);
                            break;
                    }
                }
            }
        }
    }, {
        key: "writeUtf8",
        value: function writeUtf8(s) {
            this.writeable.writeBytes(IonUnicode_1.encodeUtf8(s));
        }
    }, {
        key: "writeAnnotations",
        value: function writeAnnotations(annotations) {
            if (IonUtilities_1.isNullOrUndefined(annotations)) {
                return;
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(annotations), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var annotation = _step.value;

                    this.writeSymbolToken(annotation);
                    this.writeUtf8('::');
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "stepIn",
        value: function stepIn(container) {
            this.containers.push(container);
            this.isFirstValueInContainer = true;
        }
    }, {
        key: "writeSymbolToken",
        value: function writeSymbolToken(s) {
            if (IonText_4.isIdentifier(s)) {
                this.writeUtf8(s);
            } else if (!this.isTopLevel && this.currentContainer === IonBinary_1.TypeCodes.SEXP && IonText_5.isOperator(s)) {
                this.writeUtf8(s);
            } else {
                this.writeable.writeByte(IonText_1.CharCodes.SINGLE_QUOTE);
                this.writeable.writeStream(IonUnicode_2.encodeUtf8Stream(IonText_3.escape(s, IonText_7.SymbolEscapes)));
                this.writeable.writeByte(IonText_1.CharCodes.SINGLE_QUOTE);
            }
        }
    }, {
        key: "isTopLevel",
        get: function get() {
            return this.containers.length === 0;
        }
    }, {
        key: "currentContainer",
        get: function get() {
            return IonUtilities_3.last(this.containers);
        }
    }]);
    return TextWriter;
}();

exports.TextWriter = TextWriter;


},{"./IonBinary":2,"./IonText":20,"./IonUnicode":26,"./IonUtilities":27,"babel-runtime/core-js/get-iterator":29,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],23:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonDecimal_1 = require("./IonDecimal");
var IonUtilities_1 = require("./IonUtilities");
var IonUtilities_2 = require("./IonUtilities");
var IonUtilities_3 = require("./IonUtilities");
var IonLongInt_1 = require("./IonLongInt");
var IonPrecision_1 = require("./IonPrecision");
var MIN_SECONDS = 0;
var MAX_SECONDS = 60;
var MIN_MINUTE = 0;
var MAX_MINUTE = 59;
var MIN_HOUR = 0;
var MAX_HOUR = 23;
var MIN_DAY = 1;
var MAX_DAY = 31;
var MIN_MONTH = 1;
var MAX_MONTH = 12;
var MIN_YEAR = 0;
var MAX_YEAR = 9999;
var MIN_OFFSET = -14 * 60;
var MAX_OFFSET = 14 * 60;
var DAYS_PER_MONTH = [-1, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var States;
(function (States) {
    States[States["YEAR"] = 0] = "YEAR";
    States[States["MONTH"] = 1] = "MONTH";
    States[States["DAY"] = 2] = "DAY";
    States[States["HOUR"] = 3] = "HOUR";
    States[States["MINUTE"] = 4] = "MINUTE";
    States[States["SECONDS"] = 5] = "SECONDS";
    States[States["FRACTIONAL_SECONDS"] = 6] = "FRACTIONAL_SECONDS";
    States[States["OFFSET"] = 7] = "OFFSET";
    States[States["OFFSET_POSITIVE"] = 8] = "OFFSET_POSITIVE";
    States[States["OFFSET_NEGATIVE"] = 9] = "OFFSET_NEGATIVE";
    States[States["OFFSET_MINUTES"] = 10] = "OFFSET_MINUTES";
    States[States["OFFSET_ZULU"] = 11] = "OFFSET_ZULU";
})(States || (States = {}));

var TimeParserState = function () {
    function TimeParserState(_f, _p, _len, _t) {
        (0, _classCallCheck3.default)(this, TimeParserState);

        this._f = _f;
        this._p = _p;
        this._len = _len;
        this._t = _t;
    }

    (0, _createClass3.default)(TimeParserState, [{
        key: "f",
        get: function get() {
            return this._f;
        }
    }, {
        key: "p",
        get: function get() {
            return this._p;
        }
    }, {
        key: "len",
        get: function get() {
            return this._len;
        }
    }, {
        key: "t",
        get: function get() {
            return this._t;
        }
    }]);
    return TimeParserState;
}();

var timeParserStates = {};
timeParserStates[States.YEAR] = new TimeParserState(States.YEAR, IonPrecision_1.Precision.YEAR, 4, {
    "T": States.OFFSET,
    "-": States.MONTH
});
timeParserStates[States.MONTH] = new TimeParserState(States.MONTH, IonPrecision_1.Precision.MONTH, 2, {
    "T": States.OFFSET,
    "-": States.DAY
});
timeParserStates[States.DAY] = new TimeParserState(States.DAY, IonPrecision_1.Precision.DAY, 2, {
    "T": States.HOUR
});
timeParserStates[States.HOUR] = new TimeParserState(States.HOUR, undefined, 2, {
    ":": States.MINUTE
});
timeParserStates[States.MINUTE] = new TimeParserState(States.MINUTE, IonPrecision_1.Precision.HOUR_AND_MINUTE, 2, {
    ":": States.SECONDS,
    "+": States.OFFSET_POSITIVE,
    "-": States.OFFSET_NEGATIVE,
    "Z": States.OFFSET_ZULU
});
timeParserStates[States.SECONDS] = new TimeParserState(States.SECONDS, IonPrecision_1.Precision.SECONDS, 2, {
    ".": States.FRACTIONAL_SECONDS,
    "+": States.OFFSET_POSITIVE,
    "-": States.OFFSET_NEGATIVE,
    "Z": States.OFFSET_ZULU
});
timeParserStates[States.FRACTIONAL_SECONDS] = new TimeParserState(States.FRACTIONAL_SECONDS, IonPrecision_1.Precision.SECONDS, undefined, {
    "+": States.OFFSET_POSITIVE,
    "-": States.OFFSET_NEGATIVE,
    "Z": States.OFFSET_ZULU
});
timeParserStates[States.OFFSET] = new TimeParserState(States.OFFSET, undefined, 0, {
    "+": States.OFFSET_POSITIVE,
    "-": States.OFFSET_NEGATIVE,
    "Z": States.OFFSET_ZULU
});
timeParserStates[States.OFFSET_POSITIVE] = new TimeParserState(States.OFFSET_POSITIVE, undefined, 2, {
    ":": States.OFFSET_MINUTES
});
timeParserStates[States.OFFSET_NEGATIVE] = new TimeParserState(States.OFFSET_NEGATIVE, undefined, 2, {
    ":": States.OFFSET_MINUTES
});
timeParserStates[States.OFFSET_MINUTES] = new TimeParserState(States.OFFSET_MINUTES, undefined, 2, undefined);
timeParserStates[States.OFFSET_ZULU] = new TimeParserState(States.OFFSET_ZULU, undefined, 0, undefined);
function _to_2_digits(v) {
    var s = v.toString();
    switch (s.length) {
        case 0:
            return "??";
        case 1:
            return "0" + s;
        case 2:
            return s;
        default:
            return s.substr(s.length - 2, 2);
    }
}
function to_4_digits(v) {
    var s = v.toString();
    switch (s.length) {
        case 0:
            return "??";
        case 1:
            return "000" + s;
        case 2:
            return "00" + s;
        case 3:
            return "0" + s;
        case 4:
            return s;
        default:
            return s.substr(s.length - 4, 4);
    }
}
function read_unknown_digits(str, pos) {
    var i = pos;
    for (; i < str.length; i++) {
        if (!IonUtilities_1.isNumber(parseInt(str[i], 10))) {
            break;
        }
    }
    return str.substring(pos, i);
}
function read_digits(str, pos, len) {
    var v = 0;
    for (var i = pos; i < pos + len; i++) {
        var c = str.charCodeAt(i) - 48;
        if (c < 0 && c > 9) {
            return -1;
        }
        v = v * 10 + c;
    }
    return v;
}
var SECS_PER_MIN = 60;
var SECS_PER_HOUR = 60 * 60;
var SECS_PER_DAY = 24 * 60 * 60;
var DAYS_TO_MONTH = function () {
    var d = 0;
    var a = [];
    for (var m = 1; m < 13; m++) {
        a.shift();
        d += DAYS_PER_MONTH[m];
    }
    return a;
}();
function is_leapyear(year) {
    if (year % 4 > 0) return false;
    if (year % 100 > 0) return true;
    return year % 1000 === 0;
}
function days_to_start_of_month(month, year) {
    var d = DAYS_TO_MONTH[month];
    if (month > 2 && !is_leapyear(year)) d -= 1;
    return d;
}
function days_to_start_of_year(year) {
    var d = year * 365;
    d += Math.floor(year / 4);
    d -= Math.floor(year / 100);
    d += Math.floor(year / 1000);
    return d;
}
var SECONDS_AT_EPOCH_START = function () {
    var d = days_to_start_of_year(1970) * SECS_PER_DAY;
    return d;
}();
function bad_timestamp(m) {
    if (IonUtilities_1.isNumber(m)) {
        m = "invalid format for timestamp at offset " + m;
    }
    throw new Error(m);
}

var Timestamp = function () {
    function Timestamp() {
        var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : IonPrecision_1.Precision.NULL;
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var year = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var month = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var day = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var hour = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var minute = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var seconds = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
        (0, _classCallCheck3.default)(this, Timestamp);

        this.precision = precision;
        this.offset = offset;
        this.year = year;
        this.month = month;
        this.day = day;
        this.hour = hour;
        this.minute = minute;
        if (IonUtilities_1.isNumber(seconds) && Math.floor(seconds) === seconds) {
            this.seconds = new IonDecimal_1.Decimal(IonLongInt_1.LongInt.fromNumber(seconds), 0);
        } else if (IonUtilities_2.isString(seconds)) {
            this.seconds = IonDecimal_1.Decimal.parse(seconds);
        } else {
            this.seconds = seconds;
        }
        this.checkValid();
    }

    (0, _createClass3.default)(Timestamp, [{
        key: "checkValid",
        value: function checkValid() {
            if (this.precision === IonPrecision_1.Precision.NULL) {
                return;
            }
            if (this.offset < MIN_OFFSET || this.offset > MAX_OFFSET) {
                throw new Error("Offset " + this.offset + " must be between " + MIN_OFFSET + " and " + MAX_OFFSET + " inclusive");
            }
            switch (this.precision) {
                default:
                    throw new Error("Unknown precision " + this.precision);
                case IonPrecision_1.Precision.SECONDS:
                    var seconds = this.seconds.numberValue();
                    if (seconds < MIN_SECONDS || seconds >= MAX_SECONDS) {
                        throw new Error("Seconds " + seconds + " must be between " + MIN_SECONDS + " inclusive and " + MAX_SECONDS + " exclusive");
                    }
                case IonPrecision_1.Precision.HOUR_AND_MINUTE:
                    if (this.minute < MIN_MINUTE || this.minute > MAX_MINUTE) {
                        throw new Error("Minute " + this.minute + " must be between " + MIN_MINUTE + " and " + MAX_MINUTE + " inclusive");
                    }
                    if (this.hour < MIN_HOUR || this.hour > MAX_HOUR) {
                        throw new Error("Hour " + this.hour + " must be between " + MIN_HOUR + " and " + MAX_HOUR + " inclusive");
                    }
                case IonPrecision_1.Precision.DAY:
                    if (this.day < MIN_DAY || this.day > MAX_DAY) {
                        throw new Error("Day " + this.day + " must be between " + MIN_DAY + " and " + MAX_DAY + " inclusive");
                    }
                case IonPrecision_1.Precision.MONTH:
                    if (this.month < MIN_MONTH || this.month > MAX_MONTH) {
                        throw new Error("Month " + this.month + " must be between " + MIN_MONTH + " and " + MAX_MONTH + " inclusive");
                    }
                case IonPrecision_1.Precision.YEAR:
                    if (this.year < MIN_YEAR || this.year > MAX_YEAR) {
                        throw new Error("Year " + this.year + " must be between " + MIN_YEAR + " and " + MAX_YEAR + " inclusive");
                    }
            }
            if (this.precision > IonPrecision_1.Precision.MONTH) {
                if (this.day > DAYS_PER_MONTH[this.month]) {
                    throw new Error("Month " + this.month + " has less than " + this.day + " days");
                }
                if (this.month === 2 && this.day === 29) {
                    if (!is_leapyear(this.year)) {
                        throw new Error("Given February 29th but year " + this.year + " is not a leap year");
                    }
                }
            }
        }
    }, {
        key: "getEpochMilliseconds",
        value: function getEpochMilliseconds() {
            var n = 0;
            switch (this.precision) {
                case IonPrecision_1.Precision.NULL:
                    return undefined;
                case IonPrecision_1.Precision.SECONDS:
                    n += this.seconds.getNumber();
                case IonPrecision_1.Precision.HOUR_AND_MINUTE:
                    n += this.minute * SECS_PER_MIN;
                    n += this.hour * SECS_PER_HOUR;
                case IonPrecision_1.Precision.DAY:
                    n += (this.day - 1) * SECS_PER_DAY;
                case IonPrecision_1.Precision.MONTH:
                    n += days_to_start_of_month(this.month, this.year) * SECS_PER_DAY;
                case IonPrecision_1.Precision.YEAR:
                    n += days_to_start_of_year(this.year) * SECS_PER_DAY;
            }
            n -= this.offset * 60;
            n -= SECONDS_AT_EPOCH_START;
            n *= 1000;
            return n;
        }
    }, {
        key: "stringValue",
        value: function stringValue() {
            var image = void 0;
            var t = this;
            switch (t.precision) {
                default:
                    throw { msg: "invalid value for timestamp precision", where: "IonValueSupport.timestamp.toString" };
                case IonPrecision_1.Precision.NULL:
                    return "null.timestamp";
                case IonPrecision_1.Precision.SECONDS:
                    image = t.seconds.toString();
                case IonPrecision_1.Precision.HOUR_AND_MINUTE:
                    image = _to_2_digits(t.minute) + (image ? ":" + image : "");
                    image = _to_2_digits(t.hour) + (image ? ":" + image : "");
                case IonPrecision_1.Precision.DAY:
                    image = _to_2_digits(t.day) + (image ? "T" + image : "");
                case IonPrecision_1.Precision.MONTH:
                    image = _to_2_digits(t.month) + (image ? "-" + image : "");
                case IonPrecision_1.Precision.YEAR:
                    if (t.precision === IonPrecision_1.Precision.YEAR) {
                        image = to_4_digits(t.year) + "T";
                    } else if (t.precision === IonPrecision_1.Precision.MONTH) {
                        image = to_4_digits(t.year) + "-" + image + "T";
                    } else {
                        image = to_4_digits(t.year) + "-" + image;
                    }
            }
            var o = t.offset;
            if (t.precision > IonPrecision_1.Precision.DAY || IonUtilities_3.isUndefined(o)) {
                if (IonUtilities_3.isUndefined(o) || o === -0.0) {
                    image = image + "Z";
                } else {
                    if (o < 0) {
                        o = -o;
                        image = image + "-";
                    } else {
                        image = image + "+";
                    }
                    image = image + _to_2_digits(Math.floor(o / 60));
                    image = image + ":" + _to_2_digits(o % 60);
                }
            }
            return image;
        }
    }, {
        key: "numberValue",
        value: function numberValue() {
            return this.getEpochMilliseconds();
        }
    }, {
        key: "toString",
        value: function toString() {
            return this.stringValue();
        }
    }, {
        key: "isNull",
        value: function isNull() {
            return this.precision === IonPrecision_1.Precision.NULL;
        }
    }, {
        key: "getZuluYear",
        value: function getZuluYear() {
            return this.precision >= IonPrecision_1.Precision.YEAR ? this.year : undefined;
        }
    }, {
        key: "getZuluMonth",
        value: function getZuluMonth() {
            return this.precision >= IonPrecision_1.Precision.MONTH ? this.month : undefined;
        }
    }, {
        key: "getZuluDay",
        value: function getZuluDay() {
            return this.precision >= IonPrecision_1.Precision.DAY ? this.day : undefined;
        }
    }, {
        key: "getZuluHour",
        value: function getZuluHour() {
            return this.precision >= IonPrecision_1.Precision.HOUR_AND_MINUTE ? this.hour : undefined;
        }
    }, {
        key: "getZuluMinute",
        value: function getZuluMinute() {
            return this.precision >= IonPrecision_1.Precision.HOUR_AND_MINUTE ? this.minute : undefined;
        }
    }, {
        key: "getZuluSeconds",
        value: function getZuluSeconds() {
            return this.precision >= IonPrecision_1.Precision.SECONDS ? this.seconds : undefined;
        }
    }, {
        key: "getOffset",
        value: function getOffset() {
            return this.precision > IonPrecision_1.Precision.NULL ? this.offset : undefined;
        }
    }, {
        key: "getPrecision",
        value: function getPrecision() {
            return this.precision;
        }
    }], [{
        key: "parse",
        value: function parse(str) {
            var precision;
            if (str.length < 1) return Timestamp.NULL;
            if (str.charCodeAt(0) === 110) {
                if (str === "null") return Timestamp.NULL;
                if (str === "null.timestamp") return Timestamp.NULL;
                bad_timestamp(0);
            }
            var offset = void 0;
            var year = void 0;
            var month = void 0;
            var day = void 0;
            var hour = void 0;
            var minute = void 0;
            var seconds = void 0;
            var pos = 0;
            var state = timeParserStates[States.YEAR];
            var limit = str.length;
            var v = void 0;
            while (pos < limit) {
                if (IonUtilities_3.isUndefined(state.len)) {
                    var digits = read_unknown_digits(str, pos);
                    if (digits.length === 0) {
                        bad_timestamp(pos);
                    }
                    v = parseInt(digits, 10);
                    pos += digits.length;
                } else if (state.len > 0) {
                    v = read_digits(str, pos, state.len);
                    if (v < 0) {
                        bad_timestamp(pos);
                    }
                    pos = pos + state.len;
                }
                switch (state.f) {
                    case States.YEAR:
                        year = v;
                        break;
                    case States.MONTH:
                        month = v;
                        break;
                    case States.DAY:
                        day = v;
                        break;
                    case States.HOUR:
                        hour = v;
                        break;
                    case States.MINUTE:
                        minute = v;
                        break;
                    case States.SECONDS:
                        seconds = v;
                        break;
                    case States.FRACTIONAL_SECONDS:
                        var START_POSITION_OF_SECONDS = 17;
                        seconds = IonDecimal_1.Decimal.parse(str.substring(START_POSITION_OF_SECONDS, pos));
                        break;
                    case States.OFFSET:
                        break;
                    case States.OFFSET_POSITIVE:
                        offset = v * 60;
                        break;
                    case States.OFFSET_NEGATIVE:
                        offset = -v * 60;
                        break;
                    case States.OFFSET_MINUTES:
                        offset += offset < -0 ? -v : v;
                        break;
                    case States.OFFSET_ZULU:
                        offset = -0.0;
                        break;
                    default:
                        bad_timestamp("invalid internal state");
                }
                if (!IonUtilities_3.isUndefined(state.p)) {
                    precision = state.p;
                    if (pos >= limit) {
                        break;
                    }
                }
                if (!IonUtilities_3.isUndefined(state.t)) {
                    var c = String.fromCharCode(str.charCodeAt(pos));
                    state = timeParserStates[state.t[c]];
                    if (IonUtilities_3.isUndefined(state)) {
                        debugger;
                        bad_timestamp(pos);
                    }
                }
                pos++;
            }
            var t = new Timestamp(precision, offset, year, month, day, hour, minute, seconds);
            return t;
        }
    }]);
    return Timestamp;
}();

Timestamp.NULL = new Timestamp(IonPrecision_1.Precision.NULL);
exports.Timestamp = Timestamp;


},{"./IonDecimal":7,"./IonLongInt":10,"./IonPrecision":14,"./IonUtilities":27,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],24:[function(require,module,exports){
"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });

var IonType = function IonType(bid, name, scalar, lob, num, container) {
    (0, _classCallCheck3.default)(this, IonType);

    this.bid = bid;
    this.name = name;
    this.scalar = scalar;
    this.lob = lob;
    this.num = num;
    this.container = container;
};

exports.IonType = IonType;


},{"babel-runtime/helpers/classCallCheck":38}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var IonType_1 = require("./IonType");
exports.IonTypes = {
    NULL: new IonType_1.IonType(0, "null", true, false, false, false),
    BOOL: new IonType_1.IonType(1, "bool", true, false, false, false),
    INT: new IonType_1.IonType(2, "int", true, false, true, false),
    FLOAT: new IonType_1.IonType(4, "float", true, false, true, false),
    DECIMAL: new IonType_1.IonType(5, "decimal", true, false, false, false),
    TIMESTAMP: new IonType_1.IonType(6, "timestamp", true, false, false, false),
    SYMBOL: new IonType_1.IonType(7, "symbol", true, false, false, false),
    STRING: new IonType_1.IonType(8, "string", true, false, false, false),
    CLOB: new IonType_1.IonType(9, "clob", true, true, false, false),
    BLOB: new IonType_1.IonType(10, "blob", true, true, false, false),
    LIST: new IonType_1.IonType(11, "list", false, false, false, true),
    SEXP: new IonType_1.IonType(12, "sexp", false, false, false, true),
    STRUCT: new IonType_1.IonType(13, "struct", false, false, false, true),
    DATAGRAM: new IonType_1.IonType(20, "datagram", false, false, false, true),
    BOC: new IonType_1.IonType(-2, "boc", false, false, false, false)
};


},{"./IonType":24}],26:[function(require,module,exports){
"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(encodeUtf8Stream),
    _marked2 = /*#__PURE__*/_regenerator2.default.mark(charCodes);

Object.defineProperty(exports, "__esModule", { value: true });
var IonWriteable_1 = require("./IonWriteable");
var SIX_BIT_MASK = 0x3F;
var TEN_BIT_MASK = 0x3FF;
var HIGH_SURROGATE_OFFSET = 0xD800;
var LOW_SURROGATE_MASK = 0xFC00;
var LOW_SURROGATE_OFFSET = 0xDC00;
var LOW_SURROGATE_END = 0xE000;
function isHighSurrogate(charCode) {
    return charCode >= HIGH_SURROGATE_OFFSET && charCode < LOW_SURROGATE_OFFSET;
}
function encodeUtf8(s) {
    var writeable = new IonWriteable_1.Writeable(s.length, s.length);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = (0, _getIterator3.default)(encodeUtf8Stream(charCodes(s))), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var b = _step.value;

            writeable.writeByte(b);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return writeable.getBytes();
}
exports.encodeUtf8 = encodeUtf8;
function encodeUtf8Stream(it) {
    var pushback, codePoint, r, r2, codePoint2, hasLowSurrogate, highSurrogate, lowSurrogate;
    return _regenerator2.default.wrap(function encodeUtf8Stream$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    pushback = -1;

                case 1:
                    codePoint = void 0;

                    if (!(pushback !== -1)) {
                        _context.next = 7;
                        break;
                    }

                    codePoint = pushback;
                    pushback = -1;
                    _context.next = 13;
                    break;

                case 7:
                    r = it.next();

                    if (!r.done) {
                        _context.next = 12;
                        break;
                    }

                    return _context.abrupt("return");

                case 12:
                    codePoint = r.value;

                case 13:
                    if (!(codePoint < 128)) {
                        _context.next = 18;
                        break;
                    }

                    _context.next = 16;
                    return codePoint;

                case 16:
                    _context.next = 87;
                    break;

                case 18:
                    if (!(codePoint < 2048)) {
                        _context.next = 25;
                        break;
                    }

                    _context.next = 21;
                    return 0xC0 | codePoint >>> 6;

                case 21:
                    _context.next = 23;
                    return 0x80 | codePoint & SIX_BIT_MASK;

                case 23:
                    _context.next = 87;
                    break;

                case 25:
                    if (!(codePoint < HIGH_SURROGATE_OFFSET)) {
                        _context.next = 34;
                        break;
                    }

                    _context.next = 28;
                    return 0xE0 | codePoint >>> 12;

                case 28:
                    _context.next = 30;
                    return 0x80 | codePoint >>> 6 & SIX_BIT_MASK;

                case 30:
                    _context.next = 32;
                    return 0x80 | codePoint & SIX_BIT_MASK;

                case 32:
                    _context.next = 87;
                    break;

                case 34:
                    if (!(codePoint < LOW_SURROGATE_OFFSET)) {
                        _context.next = 69;
                        break;
                    }

                    r2 = it.next();

                    if (!r2.done) {
                        _context.next = 44;
                        break;
                    }

                    _context.next = 39;
                    return 0xE0 | codePoint >>> 12;

                case 39:
                    _context.next = 41;
                    return 0x80 | codePoint >>> 6 & SIX_BIT_MASK;

                case 41:
                    _context.next = 43;
                    return 0x80 | codePoint & SIX_BIT_MASK;

                case 43:
                    return _context.abrupt("return");

                case 44:
                    codePoint2 = r2.value;
                    hasLowSurrogate = (codePoint2 & LOW_SURROGATE_MASK) === LOW_SURROGATE_OFFSET;

                    if (!hasLowSurrogate) {
                        _context.next = 60;
                        break;
                    }

                    highSurrogate = codePoint - HIGH_SURROGATE_OFFSET;
                    lowSurrogate = codePoint2 - LOW_SURROGATE_OFFSET;

                    codePoint = 0x10000 + (highSurrogate << 10) | lowSurrogate;
                    _context.next = 52;
                    return 0xF0 | codePoint >>> 18;

                case 52:
                    _context.next = 54;
                    return 0x80 | codePoint >>> 12 & SIX_BIT_MASK;

                case 54:
                    _context.next = 56;
                    return 0x80 | codePoint >>> 6 & SIX_BIT_MASK;

                case 56:
                    _context.next = 58;
                    return 0x80 | codePoint & SIX_BIT_MASK;

                case 58:
                    _context.next = 67;
                    break;

                case 60:
                    _context.next = 62;
                    return 0xE0 | codePoint >>> 12;

                case 62:
                    _context.next = 64;
                    return 0x80 | codePoint >>> 6 & SIX_BIT_MASK;

                case 64:
                    _context.next = 66;
                    return 0x80 | codePoint & SIX_BIT_MASK;

                case 66:
                    pushback = codePoint2;

                case 67:
                    _context.next = 87;
                    break;

                case 69:
                    if (!(codePoint < 65536)) {
                        _context.next = 78;
                        break;
                    }

                    _context.next = 72;
                    return 0xE0 | codePoint >>> 12;

                case 72:
                    _context.next = 74;
                    return 0x80 | codePoint >>> 6 & SIX_BIT_MASK;

                case 74:
                    _context.next = 76;
                    return 0x80 | codePoint & SIX_BIT_MASK;

                case 76:
                    _context.next = 87;
                    break;

                case 78:
                    if (!(codePoint < 2097152)) {
                        _context.next = 87;
                        break;
                    }

                    _context.next = 81;
                    return 0xF0 | codePoint >>> 18;

                case 81:
                    _context.next = 83;
                    return 0x80 | codePoint >>> 12 & SIX_BIT_MASK;

                case 83:
                    _context.next = 85;
                    return 0x80 | codePoint >>> 6 & SIX_BIT_MASK;

                case 85:
                    _context.next = 87;
                    return 0x80 | codePoint & SIX_BIT_MASK;

                case 87:
                    _context.next = 1;
                    break;

                case 89:
                case "end":
                    return _context.stop();
            }
        }
    }, _marked, this);
}
exports.encodeUtf8Stream = encodeUtf8Stream;
function charCodes(s) {
    var i;
    return _regenerator2.default.wrap(function charCodes$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    i = 0;

                case 1:
                    if (!(i < s.length)) {
                        _context2.next = 7;
                        break;
                    }

                    _context2.next = 4;
                    return s.charCodeAt(i);

                case 4:
                    i++;
                    _context2.next = 1;
                    break;

                case 7:
                case "end":
                    return _context2.stop();
            }
        }
    }, _marked2, this);
}


},{"./IonWriteable":28,"babel-runtime/core-js/get-iterator":29,"babel-runtime/regenerator":45}],27:[function(require,module,exports){
"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
function isNumber(value) {
    return typeof value == 'number' && !isNaN(value);
}
exports.isNumber = isNumber;
function isString(value) {
    return typeof value == 'string';
}
exports.isString = isString;
function isUndefined(value) {
    return typeof value == 'undefined';
}
exports.isUndefined = isUndefined;
function isNullOrUndefined(value) {
    return isUndefined(value) || value === null;
}
exports.isNullOrUndefined = isNullOrUndefined;
function last(array) {
    if (!array || array.length === 0) {
        return undefined;
    }
    return array[array.length - 1];
}
exports.last = last;
function max(array, comparator) {
    var best = void 0;
    if (array) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = (0, _getIterator3.default)(array), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var element = _step.value;

                if (!best || comparator(best, element) < 0) {
                    best = element;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return best;
}
exports.max = max;


},{"babel-runtime/core-js/get-iterator":29}],28:[function(require,module,exports){
"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var IonUtilities_1 = require("./IonUtilities");
var IonUtilities_2 = require("./IonUtilities");
var DEFAULT_BUFFER_SIZE = 4096;

var Writeable = function () {
    function Writeable() {
        var bufferInitialSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_BUFFER_SIZE;
        var bufferGrowthSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_BUFFER_SIZE;
        (0, _classCallCheck3.default)(this, Writeable);

        this.bufferGrowthSize = bufferGrowthSize;
        this.buffers = [new Array(bufferInitialSize)];
        this.index = 0;
        this.written = 0;
    }

    (0, _createClass3.default)(Writeable, [{
        key: "writeByte",
        value: function writeByte(b) {
            if (this.capacity() === 0) {
                this.allocate();
                IonUtilities_2.last(this.buffers)[0] = b;
                this.index = 1;
                this.written += 1;
            } else {
                IonUtilities_2.last(this.buffers)[this.index] = b;
                this.index += 1;
                this.written += 1;
            }
        }
    }, {
        key: "writeBytes",
        value: function writeBytes(b) {
            var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
            var length = arguments[2];

            if (IonUtilities_1.isUndefined(length)) {
                length = b.length - offset;
            }
            var remaining = length;
            while (remaining > 0) {
                if (this.capacity() == 0) {
                    this.allocate();
                    this.index = 0;
                }
                var buffer = IonUtilities_2.last(this.buffers);
                var limit = Math.min(remaining, this.capacity());
                for (var i = 0; i < limit; i++) {
                    buffer[this.index + i] = b[offset + i];
                }
                remaining -= limit;
                this.index += limit;
                this.written += limit;
            }
        }
    }, {
        key: "writeStream",
        value: function writeStream(it) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(it), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var b = _step.value;

                    this.writeByte(b);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
    }, {
        key: "capacity",
        value: function capacity() {
            return IonUtilities_2.last(this.buffers).length - this.index;
        }
    }, {
        key: "allocate",
        value: function allocate() {
            if (this.bufferGrowthSize === 0) {
                "Cannot allocate additional capacity in a fixed-size writeable";
            }
            this.buffers.push(new Array(this.bufferGrowthSize));
        }
    }, {
        key: "getBytes",
        value: function getBytes() {
            var singleFullBuffer = this.buffers.length == 1 && this.index == IonUtilities_2.last(this.buffers).length;
            if (singleFullBuffer) {
                return IonUtilities_2.last(this.buffers);
            }
            var result = new Array(this.written);
            var offset = 0;
            for (var i = 0; i < this.buffers.length; i++) {
                var buffer = this.buffers[i];
                var limit = Math.min(this.written - offset, buffer.length);
                for (var j = 0; j < limit; j++) {
                    result[offset++] = buffer[j];
                }
            }
            this.buffers = [result];
            this.index = this.written;
            return result;
        }
    }]);
    return Writeable;
}();

exports.Writeable = Writeable;


},{"./IonUtilities":27,"babel-runtime/core-js/get-iterator":29,"babel-runtime/helpers/classCallCheck":38,"babel-runtime/helpers/createClass":39}],29:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":46}],30:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":47}],31:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":48}],32:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":49}],33:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":50}],34:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":51}],35:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":52}],36:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":53}],37:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":54}],38:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],39:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":32}],40:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _assign = require("../core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};
},{"../core-js/object/assign":30}],41:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _getPrototypeOf = require("../core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = require("../core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};
},{"../core-js/object/get-own-property-descriptor":33,"../core-js/object/get-prototype-of":34}],42:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require("../core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("../core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
},{"../core-js/object/create":31,"../core-js/object/set-prototype-of":35,"../helpers/typeof":44}],43:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
},{"../helpers/typeof":44}],44:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol":36,"../core-js/symbol/iterator":37}],45:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":129}],46:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');

},{"../modules/core.get-iterator":115,"../modules/es6.string.iterator":124,"../modules/web.dom.iterable":128}],47:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;

},{"../../modules/_core":61,"../../modules/es6.object.assign":117}],48:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};

},{"../../modules/_core":61,"../../modules/es6.object.create":118}],49:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};

},{"../../modules/_core":61,"../../modules/es6.object.define-property":119}],50:[function(require,module,exports){
require('../../modules/es6.object.get-own-property-descriptor');
var $Object = require('../../modules/_core').Object;
module.exports = function getOwnPropertyDescriptor(it, key) {
  return $Object.getOwnPropertyDescriptor(it, key);
};

},{"../../modules/_core":61,"../../modules/es6.object.get-own-property-descriptor":120}],51:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;

},{"../../modules/_core":61,"../../modules/es6.object.get-prototype-of":121}],52:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/_core').Object.setPrototypeOf;

},{"../../modules/_core":61,"../../modules/es6.object.set-prototype-of":122}],53:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;

},{"../../modules/_core":61,"../../modules/es6.object.to-string":123,"../../modules/es6.symbol":125,"../../modules/es7.symbol.async-iterator":126,"../../modules/es7.symbol.observable":127}],54:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');

},{"../../modules/_wks-ext":112,"../../modules/es6.string.iterator":124,"../../modules/web.dom.iterable":128}],55:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],56:[function(require,module,exports){
module.exports = function () { /* empty */ };

},{}],57:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":77}],58:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":104,"./_to-iobject":106,"./_to-length":107}],59:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":60,"./_wks":113}],60:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],61:[function(require,module,exports){
var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],62:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":55}],63:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],64:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":69}],65:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":70,"./_is-object":77}],66:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],67:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":91,"./_object-keys":94,"./_object-pie":95}],68:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":61,"./_ctx":62,"./_global":70,"./_hide":72}],69:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],70:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],71:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],72:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":64,"./_object-dp":86,"./_property-desc":97}],73:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":70}],74:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":64,"./_dom-create":65,"./_fails":69}],75:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":60}],76:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":60}],77:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],78:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":72,"./_object-create":85,"./_property-desc":97,"./_set-to-string-tag":100,"./_wks":113}],79:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var has = require('./_has');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":68,"./_has":71,"./_hide":72,"./_iter-create":78,"./_iterators":81,"./_library":82,"./_object-gpo":92,"./_redefine":98,"./_set-to-string-tag":100,"./_wks":113}],80:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],81:[function(require,module,exports){
module.exports = {};

},{}],82:[function(require,module,exports){
module.exports = true;

},{}],83:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":69,"./_has":71,"./_is-object":77,"./_object-dp":86,"./_uid":110}],84:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":69,"./_iobject":75,"./_object-gops":91,"./_object-keys":94,"./_object-pie":95,"./_to-object":108}],85:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":57,"./_dom-create":65,"./_enum-bug-keys":66,"./_html":73,"./_object-dps":87,"./_shared-key":101}],86:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":57,"./_descriptors":64,"./_ie8-dom-define":74,"./_to-primitive":109}],87:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":57,"./_descriptors":64,"./_object-dp":86,"./_object-keys":94}],88:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":64,"./_has":71,"./_ie8-dom-define":74,"./_object-pie":95,"./_property-desc":97,"./_to-iobject":106,"./_to-primitive":109}],89:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":90,"./_to-iobject":106}],90:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":66,"./_object-keys-internal":93}],91:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],92:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":71,"./_shared-key":101,"./_to-object":108}],93:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":58,"./_has":71,"./_shared-key":101,"./_to-iobject":106}],94:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":66,"./_object-keys-internal":93}],95:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],96:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":61,"./_export":68,"./_fails":69}],97:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],98:[function(require,module,exports){
module.exports = require('./_hide');

},{"./_hide":72}],99:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":57,"./_ctx":62,"./_is-object":77,"./_object-gopd":88}],100:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":71,"./_object-dp":86,"./_wks":113}],101:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":102,"./_uid":110}],102:[function(require,module,exports){
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":70}],103:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":63,"./_to-integer":105}],104:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":105}],105:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],106:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":63,"./_iobject":75}],107:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":105}],108:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":63}],109:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":77}],110:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],111:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":61,"./_global":70,"./_library":82,"./_object-dp":86,"./_wks-ext":112}],112:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":113}],113:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":70,"./_shared":102,"./_uid":110}],114:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":59,"./_core":61,"./_iterators":81,"./_wks":113}],115:[function(require,module,exports){
var anObject = require('./_an-object');
var get = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function (it) {
  var iterFn = get(it);
  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};

},{"./_an-object":57,"./_core":61,"./core.get-iterator-method":114}],116:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":56,"./_iter-define":79,"./_iter-step":80,"./_iterators":81,"./_to-iobject":106}],117:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":68,"./_object-assign":84}],118:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":68,"./_object-create":85}],119:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":64,"./_export":68,"./_object-dp":86}],120:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./_to-iobject');
var $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

},{"./_object-gopd":88,"./_object-sap":96,"./_to-iobject":106}],121:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./_to-object');
var $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});

},{"./_object-gpo":92,"./_object-sap":96,"./_to-object":108}],122:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":68,"./_set-proto":99}],123:[function(require,module,exports){

},{}],124:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":79,"./_string-at":103}],125:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":57,"./_descriptors":64,"./_enum-keys":67,"./_export":68,"./_fails":69,"./_global":70,"./_has":71,"./_hide":72,"./_is-array":76,"./_library":82,"./_meta":83,"./_object-create":85,"./_object-dp":86,"./_object-gopd":88,"./_object-gopn":90,"./_object-gopn-ext":89,"./_object-gops":91,"./_object-keys":94,"./_object-pie":95,"./_property-desc":97,"./_redefine":98,"./_set-to-string-tag":100,"./_shared":102,"./_to-iobject":106,"./_to-primitive":109,"./_uid":110,"./_wks":113,"./_wks-define":111,"./_wks-ext":112}],126:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":111}],127:[function(require,module,exports){
require('./_wks-define')('observable');

},{"./_wks-define":111}],128:[function(require,module,exports){
require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./_global":70,"./_hide":72,"./_iterators":81,"./_wks":113,"./es6.array.iterator":116}],129:[function(require,module,exports){
// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

},{"./runtime":130}],130:[function(require,module,exports){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

},{}]},{},[1])(1)
});
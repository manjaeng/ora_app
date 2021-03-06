
/*!

JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function(a){"object"==typeof exports?module.exports=a():"function"==typeof define&&define.amd?define(a):"undefined"!=typeof window?window.JSZip=a():"undefined"!=typeof global?global.JSZip=a():"undefined"!=typeof self&&(self.JSZip=a())}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,f,g,h,i,j="",k=0;k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+d.charAt(f)+d.charAt(g)+d.charAt(h)+d.charAt(i);return j},c.decode=function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=d.indexOf(a.charAt(k++)),g=d.indexOf(a.charAt(k++)),h=d.indexOf(a.charAt(k++)),i=d.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(e));return j}},{}],2:[function(a,b){"use strict";function c(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null}c.prototype={getContent:function(){return null},getCompressedContent:function(){return null}},b.exports=c},{}],3:[function(a,b,c){"use strict";c.STORE={magic:"\x00\x00",compress:function(a){return a},uncompress:function(a){return a},compressInputType:null,uncompressInputType:null},c.DEFLATE=a("./flate")},{"./flate":6}],4:[function(a,b){"use strict";function c(){this.data=null,this.length=0,this.index=0}var d=a("./utils");c.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<a||0>a)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return d.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1)}},b.exports=c},{"./utils":14}],5:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.date=null,c.compression=null},{}],6:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,e=a("pako");c.uncompressInputType=d?"uint8array":"array",c.compressInputType=d?"uint8array":"array",c.magic="\b\x00",c.compress=function(a){return e.deflateRaw(a)},c.uncompress=function(a){return e.inflateRaw(a)}},{pako:19}],7:[function(a,b){"use strict";function c(a,b){return this instanceof c?(this.files={},this.root="",a&&this.load(a,b),void(this.clone=function(){var a=new c;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a})):new c(a,b)}c.prototype=a("./object"),c.prototype.load=a("./load"),c.support=a("./support"),c.defaults=a("./defaults"),c.utils=a("./utils"),c.base64=a("./base64"),c.compressions=a("./compressions"),b.exports=c},{"./base64":1,"./compressions":3,"./defaults":5,"./load":8,"./object":9,"./support":12,"./utils":14}],8:[function(a,b){"use strict";var c=a("./base64"),d=a("./zipEntries");b.exports=function(a,b){var e,f,g,h;for(b=b||{},b.base64&&(a=c.decode(a)),f=new d(a,b),e=f.files,g=0;g<e.length;g++)h=e[g],this.file(h.fileName,h.decompressed,{binary:!0,optimizedBinaryString:!0,date:h.date,dir:h.dir});return this}},{"./base64":1,"./zipEntries":15}],9:[function(a,b){"use strict";var c,d,e=a("./support"),f=a("./utils"),g=a("./signature"),h=a("./defaults"),i=a("./base64"),j=a("./compressions"),k=a("./compressedObject"),l=a("./nodeBuffer");e.uint8array&&"function"==typeof TextEncoder&&"function"==typeof TextDecoder&&(c=new TextEncoder("utf-8"),d=new TextDecoder("utf-8"));var m=function(a){if(a._data instanceof k&&(a._data=a._data.getContent(),a.options.binary=!0,a.options.base64=!1,"uint8array"===f.getTypeOf(a._data))){var b=a._data;a._data=new Uint8Array(b.length),0!==b.length&&a._data.set(b,0)}return a._data},n=function(a){var b=m(a),d=f.getTypeOf(b);if("string"===d){if(!a.options.binary){if(c)return c.encode(b);if(e.nodebuffer)return l(b,"utf-8")}return a.asBinary()}return b},o=function(a){var b=m(this);return null===b||"undefined"==typeof b?"":(this.options.base64&&(b=i.decode(b)),b=a&&this.options.binary?A.utf8decode(b):f.transformTo("string",b),a||this.options.binary||(b=A.utf8encode(b)),b)},p=function(a,b,c){this.name=a,this._data=b,this.options=c};p.prototype={asText:function(){return o.call(this,!0)},asBinary:function(){return o.call(this,!1)},asNodeBuffer:function(){var a=n(this);return f.transformTo("nodebuffer",a)},asUint8Array:function(){var a=n(this);return f.transformTo("uint8array",a)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var q=function(a,b){var c,d="";for(c=0;b>c;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},r=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},s=function(a){return a=a||{},a.base64!==!0||null!==a.binary&&void 0!==a.binary||(a.binary=!0),a=r(a,h),a.date=a.date||new Date,null!==a.compression&&(a.compression=a.compression.toUpperCase()),a},t=function(a,b,c){var d=u(a),e=f.getTypeOf(b);if(d&&v.call(this,d),c=s(c),c.dir||null===b||"undefined"==typeof b)c.base64=!1,c.binary=!1,b=null;else if("string"===e)c.binary&&!c.base64&&c.optimizedBinaryString!==!0&&(b=f.string2binary(b));else{if(c.base64=!1,c.binary=!0,!(e||b instanceof k))throw new Error("The data of '"+a+"' is in an unsupported format !");"arraybuffer"===e&&(b=f.transformTo("uint8array",b))}var g=new p(a,b,c);return this.files[a]=g,g},u=function(a){"/"==a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},v=function(a){return"/"!=a.slice(-1)&&(a+="/"),this.files[a]||t.call(this,a,null,{dir:!0}),this.files[a]},w=function(a,b){var c,d=new k;return a._data instanceof k?(d.uncompressedSize=a._data.uncompressedSize,d.crc32=a._data.crc32,0===d.uncompressedSize||a.options.dir?(b=j.STORE,d.compressedContent="",d.crc32=0):a._data.compressionMethod===b.magic?d.compressedContent=a._data.getCompressedContent():(c=a._data.getContent(),d.compressedContent=b.compress(f.transformTo(b.compressInputType,c)))):(c=n(a),(!c||0===c.length||a.options.dir)&&(b=j.STORE,c=""),d.uncompressedSize=c.length,d.crc32=this.crc32(c),d.compressedContent=b.compress(f.transformTo(b.compressInputType,c))),d.compressedSize=d.compressedContent.length,d.compressionMethod=b.magic,d},x=function(a,b,c,d){var e,f,h=(c.compressedContent,this.utf8encode(b.name)),i=h!==b.name,j=b.options,k="",l="";e=j.date.getHours(),e<<=6,e|=j.date.getMinutes(),e<<=5,e|=j.date.getSeconds()/2,f=j.date.getFullYear()-1980,f<<=4,f|=j.date.getMonth()+1,f<<=5,f|=j.date.getDate(),i&&(l=q(1,1)+q(this.crc32(h),4)+h,k+="up"+q(l.length,2)+l);var m="";m+="\n\x00",m+=i?"\x00\b":"\x00\x00",m+=c.compressionMethod,m+=q(e,2),m+=q(f,2),m+=q(c.crc32,4),m+=q(c.compressedSize,4),m+=q(c.uncompressedSize,4),m+=q(h.length,2),m+=q(k.length,2);var n=g.LOCAL_FILE_HEADER+m+h+k,o=g.CENTRAL_FILE_HEADER+"\x00"+m+"\x00\x00\x00\x00\x00\x00"+(b.options.dir===!0?"\x00\x00\x00":"\x00\x00\x00\x00")+q(d,4)+h+k;return{fileRecord:n,dirRecord:o,compressedObject:c}},y=function(){this.data=[]};y.prototype={append:function(a){a=f.transformTo("string",a),this.data.push(a)},finalize:function(){return this.data.join("")}};var z=function(a){this.data=new Uint8Array(a),this.index=0};z.prototype={append:function(a){0!==a.length&&(a=f.transformTo("uint8array",a),this.data.set(a,this.index),this.index+=a.length)},finalize:function(){return this.data}};var A={load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(a){var b,c,d,e,f=[];for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],e=new p(d.name,d._data,r(d.options)),c=b.slice(this.root.length,b.length),b.slice(0,this.root.length)===this.root&&a(c,e)&&f.push(e));return f},file:function(a,b,c){if(1===arguments.length){if(f.isRegExp(a)){var d=a;return this.filter(function(a,b){return!b.options.dir&&d.test(a)})}return this.filter(function(b,c){return!c.options.dir&&b===a})[0]||null}return a=this.root+a,t.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(f.isRegExp(a))return this.filter(function(b,c){return c.options.dir&&a.test(b)});var b=this.root+a,c=v.call(this,b),d=this.clone();return d.root=c.name,d},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!=a.slice(-1)&&(a+="/"),b=this.files[a]),b)if(b.options.dir)for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];else delete this.files[a];return this},generate:function(a){a=r(a||{},{base64:!0,compression:"STORE",type:"base64"}),f.checkSupport(a.type);var b,c,d=[],e=0,h=0;for(var k in this.files)if(this.files.hasOwnProperty(k)){var l=this.files[k],m=l.options.compression||a.compression.toUpperCase(),n=j[m];if(!n)throw new Error(m+" is not a valid compression method !");var o=w.call(this,l,n),p=x.call(this,k,l,o,e);e+=p.fileRecord.length+o.compressedSize,h+=p.dirRecord.length,d.push(p)}var s="";s=g.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+q(d.length,2)+q(d.length,2)+q(h,4)+q(e,4)+"\x00\x00";var t=a.type.toLowerCase();for(b="uint8array"===t||"arraybuffer"===t||"blob"===t||"nodebuffer"===t?new z(e+h+s.length):new y(e+h+s.length),c=0;c<d.length;c++)b.append(d[c].fileRecord),b.append(d[c].compressedObject.compressedContent);for(c=0;c<d.length;c++)b.append(d[c].dirRecord);b.append(s);var u=b.finalize();switch(a.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return f.transformTo(a.type.toLowerCase(),u);case"blob":return f.arrayBuffer2Blob(f.transformTo("arraybuffer",u));case"base64":return a.base64?i.encode(u):u;default:return u}},crc32:function(a,b){if("undefined"==typeof a||!a.length)return 0;var c="string"!==f.getTypeOf(a),d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];"undefined"==typeof b&&(b=0);var e=0,g=0,h=0;b=-1^b;for(var i=0,j=a.length;j>i;i++)h=c?a[i]:a.charCodeAt(i),g=255&(b^h),e=d[g],b=b>>>8^e;return-1^b},utf8encode:function(a){if(c){var b=c.encode(a);return f.transformTo("string",b)}if(e.nodebuffer)return f.transformTo("string",l(a,"utf-8"));for(var d=[],g=0,h=0;h<a.length;h++){var i=a.charCodeAt(h);128>i?d[g++]=String.fromCharCode(i):i>127&&2048>i?(d[g++]=String.fromCharCode(i>>6|192),d[g++]=String.fromCharCode(63&i|128)):(d[g++]=String.fromCharCode(i>>12|224),d[g++]=String.fromCharCode(i>>6&63|128),d[g++]=String.fromCharCode(63&i|128))}return d.join("")},utf8decode:function(a){var b=[],c=0,g=f.getTypeOf(a),h="string"!==g,i=0,j=0,k=0,l=0;if(d)return d.decode(f.transformTo("uint8array",a));if(e.nodebuffer)return f.transformTo("nodebuffer",a).toString("utf-8");for(;i<a.length;)j=h?a[i]:a.charCodeAt(i),128>j?(b[c++]=String.fromCharCode(j),i++):j>191&&224>j?(k=h?a[i+1]:a.charCodeAt(i+1),b[c++]=String.fromCharCode((31&j)<<6|63&k),i+=2):(k=h?a[i+1]:a.charCodeAt(i+1),l=h?a[i+2]:a.charCodeAt(i+2),b[c++]=String.fromCharCode((15&j)<<12|(63&k)<<6|63&l),i+=3);return b.join("")}};b.exports=A},{"./base64":1,"./compressedObject":2,"./compressions":3,"./defaults":5,"./nodeBuffer":17,"./signature":10,"./support":12,"./utils":14}],10:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],11:[function(a,b){"use strict";function c(a,b){this.data=a,b||(this.data=e.string2binary(this.data)),this.length=this.data.length,this.index=0}var d=a("./dataReader"),e=a("./utils");c.prototype=new d,c.prototype.byteAt=function(a){return this.data.charCodeAt(a)},c.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":4,"./utils":14}],12:[function(a,b,c){var d=a("__browserify_process");if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer=!d.browser,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var e=new ArrayBuffer(0);try{c.blob=0===new Blob([e],{type:"application/zip"}).size}catch(f){try{var g=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,h=new g;h.append(e),c.blob=0===h.getBlob("application/zip").size}catch(f){c.blob=!1}}}},{__browserify_process:18}],13:[function(a,b){"use strict";function c(a){a&&(this.data=a,this.length=this.data.length,this.index=0)}var d=a("./dataReader");c.prototype=new d,c.prototype.byteAt=function(a){return this.data[a]},c.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f;return-1},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.subarray(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":4}],14:[function(a,b,c){"use strict";function d(a){return a}function e(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function f(a){var b=65536,d=[],e=a.length,f=c.getTypeOf(a),g=0,h=!0;try{switch(f){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,j(0))}}catch(i){h=!1}if(!h){for(var k="",l=0;l<a.length;l++)k+=String.fromCharCode(a[l]);return k}for(;e>g&&b>1;)try{d.push("array"===f||"nodebuffer"===f?String.fromCharCode.apply(null,a.slice(g,Math.min(g+b,e))):String.fromCharCode.apply(null,a.subarray(g,Math.min(g+b,e)))),g+=b}catch(i){b=Math.floor(b/2)}return d.join("")}function g(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];return b}var h=a("./support"),i=a("./compressions"),j=a("./nodeBuffer");c.string2binary=function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c));return b},c.string2Uint8Array=function(a){return c.transformTo("uint8array",a)},c.uint8Array2String=function(a){return c.transformTo("string",a)},c.string2Blob=function(a){var b=c.transformTo("arraybuffer",a);return c.arrayBuffer2Blob(b)},c.arrayBuffer2Blob=function(a){c.checkSupport("blob");try{return new Blob([a],{type:"application/zip"})}catch(b){try{var d=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,e=new d;return e.append(a),e.getBlob("application/zip")}catch(b){throw new Error("Bug : can't construct the Blob.")}}};var k={};k.string={string:d,array:function(a){return e(a,new Array(a.length))},arraybuffer:function(a){return k.string.uint8array(a).buffer},uint8array:function(a){return e(a,new Uint8Array(a.length))},nodebuffer:function(a){return e(a,j(a.length))}},k.array={string:f,array:d,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(a)}},k.arraybuffer={string:function(a){return f(new Uint8Array(a))},array:function(a){return g(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:d,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(new Uint8Array(a))}},k.uint8array={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:d,nodebuffer:function(a){return j(a)}},k.nodebuffer={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return k.nodebuffer.uint8array(a).buffer},uint8array:function(a){return g(a,new Uint8Array(a.length))},nodebuffer:d},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=k[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":h.nodebuffer&&j.test(a)?"nodebuffer":h.uint8array&&a instanceof Uint8Array?"uint8array":h.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=h[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this browser")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(16>b?"0":"")+b.toString(16).toUpperCase();return d},c.findCompression=function(a){for(var b in i)if(i.hasOwnProperty(b)&&i[b].magic===a)return i[b];return null},c.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)}},{"./compressions":3,"./nodeBuffer":17,"./support":12}],15:[function(a,b){"use strict";function c(a,b){this.files=[],this.loadOptions=b,a&&this.load(a)}var d=a("./stringReader"),e=a("./nodeBufferReader"),f=a("./uint8ArrayReader"),g=a("./utils"),h=a("./signature"),i=a("./zipEntry"),j=a("./support");c.prototype={checkSignature:function(a){var b=this.reader.readString(4);if(b!==a)throw new Error("Corrupted zip or bug : unexpected signature ("+g.pretty(b)+", expected "+g.pretty(a)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;d>e;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readString(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(h.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===h.CENTRAL_FILE_HEADER;)a=new i({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(h.CENTRAL_DIRECTORY_END);if(-1===a)throw new Error("Corrupted zip : can't find end of central directory");if(this.reader.setIndex(a),this.checkSignature(h.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===g.MAX_VALUE_16BITS||this.diskWithCentralDirStart===g.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===g.MAX_VALUE_16BITS||this.centralDirRecords===g.MAX_VALUE_16BITS||this.centralDirSize===g.MAX_VALUE_32BITS||this.centralDirOffset===g.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===a)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(a),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(a){var b=g.getTypeOf(a);this.reader="string"!==b||j.uint8array?"nodebuffer"===b?new e(a):new f(g.transformTo("uint8array",a)):new d(a,this.loadOptions.optimizedBinaryString)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=c},{"./nodeBufferReader":17,"./signature":10,"./stringReader":11,"./support":12,"./uint8ArrayReader":13,"./utils":14,"./zipEntry":16}],16:[function(a,b){"use strict";function c(a,b){this.options=a,this.loadOptions=b}var d=a("./stringReader"),e=a("./utils"),f=a("./compressedObject"),g=a("./object");c.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(a,b,c){return function(){var d=a.index;a.setIndex(b);var e=a.readData(c);return a.setIndex(d),e}},prepareContent:function(a,b,c,d,f){return function(){var a=e.transformTo(d.uncompressInputType,this.getCompressedContent()),b=d.uncompress(a);if(b.length!==f)throw new Error("Bug : uncompressed data size mismatch");return b}},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readString(this.fileNameLength),a.skip(c),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(b=e.findCompression(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+e.pretty(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new f,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(a,a.index,this.compressedSize,b),this.decompressed.getContent=this.prepareContent(a,a.index,this.compressedSize,b,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=e.transformTo("string",this.decompressed.getContent()),g.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(a){if(this.versionMadeBy=a.readString(2),this.versionNeeded=a.readInt(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4),this.fileNameLength=a.readInt(2),this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=a.readString(this.fileNameLength),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readString(this.fileCommentLength),this.dir=16&this.externalFileAttributes?!0:!1},parseZIP64ExtraField:function(){if(this.extraFields[1]){var a=new d(this.extraFields[1].value);this.uncompressedSize===e.MAX_VALUE_32BITS&&(this.uncompressedSize=a.readInt(8)),this.compressedSize===e.MAX_VALUE_32BITS&&(this.compressedSize=a.readInt(8)),this.localHeaderOffset===e.MAX_VALUE_32BITS&&(this.localHeaderOffset=a.readInt(8)),this.diskNumberStart===e.MAX_VALUE_32BITS&&(this.diskNumberStart=a.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index;for(this.extraFields=this.extraFields||{};a.index<e+this.extraFieldsLength;)b=a.readInt(2),c=a.readInt(2),d=a.readString(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){if(this.useUTF8())this.fileName=g.utf8decode(this.fileName),this.fileComment=g.utf8decode(this.fileComment);else{var a=this.findExtraFieldUnicodePath();null!==a&&(this.fileName=a)}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileName)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null}},b.exports=c},{"./compressedObject":2,"./object":9,"./stringReader":11,"./utils":14}],17:[function(){},{}],18:[function(a,b){var c=b.exports={};c.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),c.title="browser",c.browser=!0,c.env={},c.argv=[],c.binding=function(){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(){throw new Error("process.chdir is not supported")}},{}],19:[function(a,b){"use strict";var c=a("./lib/zlib/utils").assign,d=a("./lib/deflate"),e=a("./lib/inflate"),f=a("./lib/zlib/constants"),g={};c(g,d,e,f),b.exports=g},{"./lib/deflate":20,"./lib/inflate":21,"./lib/zlib/constants":23,"./lib/zlib/utils":31}],20:[function(a,b,c){"use strict";function d(a,b){var c=new r(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}function f(a,b){return b=b||{},b.gzip=!0,d(a,b)}var g=a("./zlib/deflate.js"),h=a("./zlib/utils"),i=a("./zlib/messages"),j=a("./zlib/zstream"),k=0,l=4,m=0,n=1,o=-1,p=0,q=8,r=function(a){this.options=h.assign({level:o,method:q,chunkSize:16384,windowBits:15,memLevel:8,strategy:p},a||{});var b=this.options;b.raw&&b.windowBits>0?b.windowBits=-b.windowBits:b.gzip&&b.windowBits>0&&b.windowBits<16&&(b.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new j;var c=g.deflateInit2(this.strm,b.level,b.method,b.windowBits,b.memLevel,b.strategy);if(c!==m)throw new Error(i[c])};r.prototype.push=function(a,b){var c,d,e=this.strm,f=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?l:k,e.next_in=a,e.next_in_index=0,e.avail_in=e.next_in.length,e.next_out=new h.Buf8(f);do{if(e.avail_out=this.options.chunkSize,e.next_out_index=0,c=g.deflate(e,d),c!==n&&c!==m)return this.onEnd(c),this.ended=!0,!1;e.next_out_index&&(this.onData(h.shrinkBuf(e.next_out,e.next_out_index)),(e.avail_in>0||0===e.avail_out)&&(e.next_out=new h.Buf8(this.options.chunkSize)))}while(e.avail_in>0||0===e.avail_out);return d===l?(c=g.deflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===m):!0},r.prototype.onData=function(a){this.chunks.push(a)},r.prototype.onEnd=function(a){a===m&&(this.result=h.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Deflate=r,c.deflate=d,c.deflateRaw=e,c.gzip=f},{"./zlib/deflate.js":25,"./zlib/messages":29,"./zlib/utils":31,"./zlib/zstream":32}],21:[function(a,b,c){"use strict";function d(a,b){var c=new k(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}var f=a("./zlib/inflate.js"),g=a("./zlib/utils"),h=a("./zlib/constants"),i=a("./zlib/messages"),j=a("./zlib/zstream"),k=function(a){this.options=g.assign({chunkSize:16384,windowBits:0},a||{});var b=this.options;b.raw&&b.windowBits>=0&&b.windowBits<16&&(b.windowBits=-b.windowBits,0===b.windowBits&&(b.windowBits=-15)),!(b.windowBits>=0&&b.windowBits<16)||a&&a.windowBits||(b.windowBits+=32),b.windowBits>15&&b.windowBits<48&&0===(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new j;var c=f.inflateInit2(this.strm,b.windowBits);if(c!==h.Z_OK)throw new Error(i[c])};k.prototype.push=function(a,b){var c,d,e=this.strm,i=this.options.chunkSize;if(this.ended)return!1;d=h.Z_NO_FLUSH,e.next_in=a,e.next_in_index=0,e.avail_in=e.next_in.length,e.next_out=new g.Buf8(i);do{if(e.avail_out=this.options.chunkSize,e.next_out_index=0,c=f.inflate(e,d),c!==h.Z_STREAM_END&&c!==h.Z_OK)return this.onEnd(c),this.ended=!0,!1;e.next_out_index&&(this.onData(g.shrinkBuf(e.next_out,e.next_out_index)),(e.avail_in>0||0===e.avail_out)&&(e.next_out=new g.Buf8(this.options.chunkSize)))}while(e.avail_in>0||0===e.avail_out);return d=b===~~b?b:b===!0?h.Z_FINISH:h.Z_NO_FLUSH,d===h.Z_FINISH?(c=f.inflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===h.Z_OK):!0},k.prototype.onData=function(a){this.chunks.push(a)},k.prototype.onEnd=function(a){a===h.Z_OK&&(this.result=g.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Inflate=k,c.inflate=d,c.inflateRaw=e},{"./zlib/constants":23,"./zlib/inflate.js":27,"./zlib/messages":29,"./zlib/utils":31,"./zlib/zstream":32}],22:[function(a,b){"use strict";
function c(a,b,c,d){for(var e=65535&a|0,f=a>>>16&65535|0,g=0;0!==c;){g=c>2e3?2e3:c,c-=g;do e=e+b[d++]|0,f=f+e|0;while(--g);e%=65521,f%=65521}return e|f<<16|0}b.exports=c},{}],23:[function(a,b){b.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],24:[function(a,b){"use strict";function c(){for(var a,b=[],c=0;256>c;c++){a=c;for(var d=0;8>d;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function d(a,b,c,d){var f=e,g=d+c;a=-1^a;for(var h=d;g>h;h++)a=a>>>8^f[255&(a^b[h])];return-1^a}var e=c();b.exports=d},{}],25:[function(a,b,c){"use strict";function d(a,b){return a.msg=F[b],b}function e(a){return(a<<1)-(a>4?9:0)}function f(a){for(var b=a.length;--b;)a[b]=0}function g(a){var b=a.state,c=b.pending;c>a.avail_out&&(c=a.avail_out),0!==c&&(B.arraySet(a.next_out,b.pending_buf,b.pending_out,c,a.next_out_index),a.next_out_index+=c,b.pending_out+=c,a.total_out+=c,a.avail_out-=c,b.pending-=c,0===b.pending&&(b.pending_out=0))}function h(a,b){C._tr_flush_block(a,a.block_start>=0?a.block_start:-1,a.strstart-a.block_start,b),a.block_start=a.strstart,g(a.strm)}function i(a,b){a.pending_buf[a.pending++]=b}function j(a,b){a.pending_buf[a.pending++]=b>>>8&255,a.pending_buf[a.pending++]=255&b}function k(a,b,c,d){var e=a.avail_in;return e>d&&(e=d),0===e?0:(a.avail_in-=e,B.arraySet(b,a.next_in,a.next_in_index,e,c),1===a.state.wrap?a.adler=D(a.adler,b,e,c):2===a.state.wrap&&(a.adler=E(a.adler,b,e,c)),a.next_in_index+=e,a.total_in+=e,e)}function l(a,b){var c,d,e=a.max_chain_length,f=a.strstart,g=a.prev_length,h=a.nice_match,i=a.strstart>a.w_size-ib?a.strstart-(a.w_size-ib):0,j=a.window,k=a.w_mask,l=a.prev,m=a.strstart+hb,n=j[f+g-1],o=j[f+g];a.prev_length>=a.good_match&&(e>>=2),h>a.lookahead&&(h=a.lookahead);do if(c=b,j[c+g]===o&&j[c+g-1]===n&&j[c]===j[f]&&j[++c]===j[f+1]){f+=2,c++;do;while(j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&m>f);if(d=hb-(m-f),f=m-hb,d>g){if(a.match_start=b,g=d,d>=h)break;n=j[f+g-1],o=j[f+g]}}while((b=l[b&k])>i&&0!==--e);return g<=a.lookahead?g:a.lookahead}function m(a){var b,c,d,e,f,g=a.w_size;do{if(e=a.window_size-a.lookahead-a.strstart,a.strstart>=g+(g-ib)){B.arraySet(a.window,a.window,g,g,0),a.match_start-=g,a.strstart-=g,a.block_start-=g,c=a.hash_size,b=c;do d=a.head[--b],a.head[b]=d>=g?d-g:0;while(--c);c=g,b=c;do d=a.prev[--b],a.prev[b]=d>=g?d-g:0;while(--c);e+=g}if(0===a.strm.avail_in)break;if(c=k(a.strm,a.window,a.strstart+a.lookahead,e),a.lookahead+=c,a.lookahead+a.insert>=gb)for(f=a.strstart-a.insert,a.ins_h=a.window[f],a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+1])&a.hash_mask;a.insert&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+gb-1])&a.hash_mask,a.prev[f&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=f,f++,a.insert--,!(a.lookahead+a.insert<gb)););}while(a.lookahead<ib&&0!==a.strm.avail_in)}function n(a,b){var c=65535;for(c>a.pending_buf_size-5&&(c=a.pending_buf_size-5);;){if(a.lookahead<=1){if(m(a),0===a.lookahead&&b===G)return rb;if(0===a.lookahead)break}a.strstart+=a.lookahead,a.lookahead=0;var d=a.block_start+c;if((0===a.strstart||a.strstart>=d)&&(a.lookahead=a.strstart-d,a.strstart=d,h(a,!1),0===a.strm.avail_out))return rb;if(a.strstart-a.block_start>=a.w_size-ib&&(h(a,!1),0===a.strm.avail_out))return rb}return a.insert=0,b===J?(h(a,!0),0===a.strm.avail_out?tb:ub):a.strstart>a.block_start&&(h(a,!1),0===a.strm.avail_out)?rb:rb}function o(a,b){for(var c,d;;){if(a.lookahead<ib){if(m(a),a.lookahead<ib&&b===G)return rb;if(0===a.lookahead)break}if(c=0,a.lookahead>=gb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+gb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),0!==c&&a.strstart-c<=a.w_size-ib&&(a.match_length=l(a,c)),a.match_length>=gb)if(d=C._tr_tally(a,a.strstart-a.match_start,a.match_length-gb),a.lookahead-=a.match_length,a.match_length<=a.max_lazy_match&&a.lookahead>=gb){a.match_length--;do a.strstart++,a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+gb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart;while(0!==--a.match_length);a.strstart++}else a.strstart+=a.match_length,a.match_length=0,a.ins_h=a.window[a.strstart],a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+1])&a.hash_mask;else d=C._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++;if(d&&(h(a,!1),0===a.strm.avail_out))return rb}return a.insert=a.strstart<gb-1?a.strstart:gb-1,b===J?(h(a,!0),0===a.strm.avail_out?tb:ub):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?rb:sb}function p(a,b){for(var c,d,e;;){if(a.lookahead<ib){if(m(a),a.lookahead<ib&&b===G)return rb;if(0===a.lookahead)break}if(c=0,a.lookahead>=gb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+gb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),a.prev_length=a.match_length,a.prev_match=a.match_start,a.match_length=gb-1,0!==c&&a.prev_length<a.max_lazy_match&&a.strstart-c<=a.w_size-ib&&(a.match_length=l(a,c),a.match_length<=5&&(a.strategy===R||a.match_length===gb&&a.strstart-a.match_start>4096)&&(a.match_length=gb-1)),a.prev_length>=gb&&a.match_length<=a.prev_length){e=a.strstart+a.lookahead-gb,d=C._tr_tally(a,a.strstart-1-a.prev_match,a.prev_length-gb),a.lookahead-=a.prev_length-1,a.prev_length-=2;do++a.strstart<=e&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+gb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart);while(0!==--a.prev_length);if(a.match_available=0,a.match_length=gb-1,a.strstart++,d&&(h(a,!1),0===a.strm.avail_out))return rb}else if(a.match_available){if(d=C._tr_tally(a,0,a.window[a.strstart-1]),d&&h(a,!1),a.strstart++,a.lookahead--,0===a.strm.avail_out)return rb}else a.match_available=1,a.strstart++,a.lookahead--}return a.match_available&&(d=C._tr_tally(a,0,a.window[a.strstart-1]),a.match_available=0),a.insert=a.strstart<gb-1?a.strstart:gb-1,b===J?(h(a,!0),0===a.strm.avail_out?tb:ub):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?rb:sb}function q(a,b){for(var c,d,e,f,g=a.window;;){if(a.lookahead<=hb){if(m(a),a.lookahead<=hb&&b===G)return rb;if(0===a.lookahead)break}if(a.match_length=0,a.lookahead>=gb&&a.strstart>0&&(e=a.strstart-1,d=g[e],d===g[++e]&&d===g[++e]&&d===g[++e])){f=a.strstart+hb;do;while(d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&f>e);a.match_length=hb-(f-e),a.match_length>a.lookahead&&(a.match_length=a.lookahead)}if(a.match_length>=gb?(c=C._tr_tally(a,1,a.match_length-gb),a.lookahead-=a.match_length,a.strstart+=a.match_length,a.match_length=0):(c=C._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++),c&&(h(a,!1),0===a.strm.avail_out))return rb}return a.insert=0,b===J?(h(a,!0),0===a.strm.avail_out?tb:ub):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?rb:sb}function r(a,b){for(var c;;){if(0===a.lookahead&&(m(a),0===a.lookahead)){if(b===G)return rb;break}if(a.match_length=0,c=C._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++,c&&(h(a,!1),0===a.strm.avail_out))return rb}return a.insert=0,b===J?(h(a,!0),0===a.strm.avail_out?tb:ub):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?rb:sb}function s(a){a.window_size=2*a.w_size,f(a.head),a.max_lazy_match=A[a.level].max_lazy,a.good_match=A[a.level].good_length,a.nice_match=A[a.level].nice_length,a.max_chain_length=A[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=gb-1,a.match_available=0,a.ins_h=0}function t(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=X,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new B.Buf16(2*eb),this.dyn_dtree=new B.Buf16(2*(2*cb+1)),this.bl_tree=new B.Buf16(2*(2*db+1)),f(this.dyn_ltree),f(this.dyn_dtree),f(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new B.Buf16(fb+1),this.heap=new B.Buf16(2*bb+1),f(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new B.Buf16(2*bb+1),f(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0,this.high_water=0}function u(a){var b;return a&&a.state?(a.total_in=a.total_out=0,a.data_type=W,b=a.state,b.pending=0,b.pending_out=0,b.wrap<0&&(b.wrap=-b.wrap),b.status=b.wrap?kb:pb,a.adler=2===b.wrap?0:1,b.last_flush=G,C._tr_init(b),L):d(a,N)}function v(a){var b=u(a);return b===L&&s(a.state),b}function w(a,b,c,e,f,g){if(!a)return d(a,N);var h=1;if(b===Q&&(b=6),0>e?(h=0,e=-e):e>15&&(h=2,e-=16),1>f||f>Y||c!==X||8>e||e>15||0>b||b>9||0>g||g>U)return d(a,N);8===e&&(e=9);var i=new t;return a.state=i,i.strm=a,i.wrap=h,i.gzhead=null,i.w_bits=e,i.w_size=1<<i.w_bits,i.w_mask=i.w_size-1,i.hash_bits=f+7,i.hash_size=1<<i.hash_bits,i.hash_mask=i.hash_size-1,i.hash_shift=~~((i.hash_bits+gb-1)/gb),i.window=new B.Buf8(2*i.w_size),i.head=new B.Buf16(i.hash_size),i.prev=new B.Buf16(i.w_size),i.high_water=0,i.lit_bufsize=1<<f+6,i.pending_buf_size=4*i.lit_bufsize,i.pending_buf=new B.Buf8(i.pending_buf_size),i.d_buf=i.lit_bufsize>>1,i.l_buf=3*i.lit_bufsize,i.level=b,i.strategy=g,i.method=c,v(a)}function x(a,b){return w(a,b,X,Z,$,V)}function y(a,b){var c,h;if(!a||!a.state||b>K||0>b)return d(a,N);if(h=a.state,!a.next_out||!a.next_in&&0!==a.avail_in||h.status===qb&&b!==J)return d(a,0===a.avail_out?P:N);if(h.strm=a,c=h.last_flush,h.last_flush=b,h.status===kb)if(2===h.wrap){if(a.adler=0,i(h,31),i(h,139),i(h,8),h.gzhead)throw new Error("Custom GZIP headers not supported");i(h,0),i(h,0),i(h,0),i(h,0),i(h,0),i(h,9===h.level?2:h.strategy>=S||h.level<2?4:0),i(h,vb),h.status=pb}else{var k=X+(h.w_bits-8<<4)<<8,l=-1;l=h.strategy>=S||h.level<2?0:h.level<6?1:6===h.level?2:3,k|=l<<6,0!==h.strstart&&(k|=jb),k+=31-k%31,h.status=pb,j(h,k),0!==h.strstart&&(j(h,a.adler>>>16),j(h,65535&a.adler)),a.adler=1}if(0!==h.pending){if(g(a),0===a.avail_out)return h.last_flush=-1,L}else if(0===a.avail_in&&e(b)<=e(c)&&b!==J)return d(a,P);if(h.status===qb&&0!==a.avail_in)return d(a,P);if(0!==a.avail_in||0!==h.lookahead||b!==G&&h.status!==qb){var m=h.strategy===S?r(h,b):h.strategy===T?q(h,b):A[h.level].func(h,b);if((m===tb||m===ub)&&(h.status=qb),m===rb||m===tb)return 0===a.avail_out&&(h.last_flush=-1),L;if(m===sb&&(b===H?C._tr_align(h):b!==K&&(C._tr_stored_block(h,0,0,!1),b===I&&(f(h.head),0===h.lookahead&&(h.strstart=0,h.block_start=0,h.insert=0))),g(a),0===a.avail_out))return h.last_flush=-1,L}return b!==J?L:h.wrap<=0?M:(2===h.wrap?(i(h,255&a.adler),i(h,a.adler>>8&255),i(h,a.adler>>16&255),i(h,a.adler>>24&255),i(h,255&a.total_in),i(h,a.total_in>>8&255),i(h,a.total_in>>16&255),i(h,a.total_in>>24&255)):(j(h,a.adler>>>16),j(h,65535&a.adler)),g(a),h.wrap>0&&(h.wrap=-h.wrap),0!==h.pending?L:M)}function z(a){var b=a.state.status;return b!==kb&&b!==lb&&b!==mb&&b!==nb&&b!==ob&&b!==pb&&b!==qb?d(a,N):(a.state=null,b===pb?d(a,O):L)}var A,B=a("./utils"),C=a("./trees"),D=a("./adler32"),E=a("./crc32"),F=a("./messages"),G=0,H=1,I=3,J=4,K=5,L=0,M=1,N=-2,O=-3,P=-5,Q=-1,R=1,S=2,T=3,U=4,V=0,W=2,X=8,Y=9,Z=15,$=8,_=29,ab=256,bb=ab+1+_,cb=30,db=19,eb=2*bb+1,fb=15,gb=3,hb=258,ib=hb+gb+1,jb=32,kb=42,lb=69,mb=73,nb=91,ob=103,pb=113,qb=666,rb=1,sb=2,tb=3,ub=4,vb=3,wb=function(a,b,c,d,e){this.good_length=a,this.max_lazy=b,this.nice_length=c,this.max_chain=d,this.func=e};A=[new wb(0,0,0,0,n),new wb(4,4,8,4,o),new wb(4,5,16,8,o),new wb(4,6,32,32,o),new wb(4,4,16,16,p),new wb(8,16,32,32,p),new wb(8,16,128,128,p),new wb(8,32,128,256,p),new wb(32,128,258,1024,p),new wb(32,258,258,4096,p)],c.deflateInit=x,c.deflateInit2=w,c.deflateReset=v,c.deflate=y,c.deflateEnd=z,c.deflateInfo="pako deflate (from Nodeca project)"},{"./adler32":22,"./crc32":24,"./messages":29,"./trees":30,"./utils":31}],26:[function(a,b){"use strict";var c=30,d=12;b.exports=function(a,b){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;e=a.state,f=a.next_in_index,B=a.next_in,g=f+(a.avail_in-5),h=a.next_out_index,C=a.next_out,i=h-(b-a.avail_out),j=h+(a.avail_out-257),k=e.dmax,l=e.wsize,m=e.whave,n=e.wnext,o=e.window,p=e.hold,q=e.bits,r=e.lencode,s=e.distcode,t=(1<<e.lenbits)-1,u=(1<<e.distbits)-1;a:do{15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=r[p&t];b:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,0===w)C[h++]=65535&v;else{if(!(16&w)){if(0===(64&w)){v=r[(65535&v)+(p&(1<<w)-1)];continue b}if(32&w){e.mode=d;break a}a.msg="invalid literal/length code",e.mode=c;break a}x=65535&v,w&=15,w&&(w>q&&(p+=B[f++]<<q,q+=8),x+=p&(1<<w)-1,p>>>=w,q-=w),15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=s[p&u];c:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,!(16&w)){if(0===(64&w)){v=s[(65535&v)+(p&(1<<w)-1)];continue c}a.msg="invalid distance code",e.mode=c;break a}if(y=65535&v,w&=15,w>q&&(p+=B[f++]<<q,q+=8,w>q&&(p+=B[f++]<<q,q+=8)),y+=p&(1<<w)-1,y>k){a.msg="invalid distance too far back",e.mode=c;break a}if(p>>>=w,q-=w,w=h-i,y>w){if(w=y-w,w>m&&e.sane){a.msg="invalid distance too far back",e.mode=c;break a}if(z=0,A=o,0===n){if(z+=l-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}else if(w>n){if(z+=l+n-w,w-=n,x>w){x-=w;do C[h++]=o[z++];while(--w);if(z=0,x>n){w=n,x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}}else if(z+=n-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}for(;x>2;)C[h++]=A[z++],C[h++]=A[z++],C[h++]=A[z++],x-=3;x&&(C[h++]=A[z++],x>1&&(C[h++]=A[z++]))}else{z=h-y;do C[h++]=C[z++],C[h++]=C[z++],C[h++]=C[z++],x-=3;while(x>2);x&&(C[h++]=C[z++],x>1&&(C[h++]=C[z++]))}break}}break}}while(g>f&&j>h);x=q>>3,f-=x,q-=x<<3,p&=(1<<q)-1,a.next_in_index=f,a.next_out_index=h,a.avail_in=g>f?5+(g-f):5-(f-g),a.avail_out=j>h?257+(j-h):257-(h-j),e.hold=p,e.bits=q}},{}],27:[function(a,b,c){"use strict";function d(a){return(a>>>24&255)+(a>>>8&65280)+((65280&a)<<8)+((255&a)<<24)}function e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.next_index=0,this.lens=new s.Buf16(320),this.work=new s.Buf16(288),this.codes=new s.Buf32(rb),this.sane=0,this.back=0,this.was=0}function f(a,b,c,d,e,f,g,h){this.type=a,this.lens=b,this.lens_index=c,this.codes=d,this.table=e,this.table_index=f,this.bits=g,this.work=h}function g(a){var b;return a&&a.state?(b=a.state,a.total_in=a.total_out=b.total=0,b.wrap&&(a.adler=1&b.wrap),b.mode=L,b.last=0,b.havedict=0,b.dmax=32768,b.head=null,b.hold=0,b.bits=0,b.lencode=new s.Buf32(rb),b.distcode=new s.Buf32(rb),b.sane=1,b.back=-1,D):G}function h(a){var b;return a&&a.state?(b=a.state,b.wsize=0,b.whave=0,b.wnext=0,g(a)):G}function i(a,b){var c,d;return a&&a.state?(d=a.state,0>b?(c=0,b=-b):(c=(b>>4)+1,48>b&&(b&=15)),b&&(8>b||b>15)?G:(null!==d.window&&d.wbits!==b&&(d.window=null),d.wrap=c,d.wbits=b,h(a))):G}function j(a,b){var c,d;return a?(d=new e,a.state=d,d.window=null,c=i(a,b),c!==D&&(a.state=null),c):G}function k(a){return j(a,tb)}function l(a,b,c){var d;return a&&a.state?(d=a.state,0>b?(d.hold=0,d.bits=0,D):b>16||d.bits+b>32?G:(c&=(1<<b)-1,d.hold+=c<<d.bits,d.bits+=b,D)):G}function m(a){if(ub){var b,c;for(q=new s.Buf32(512),r=new s.Buf32(32),b=0;144>b;)a.lens[b++]=8;for(;256>b;)a.lens[b++]=9;for(;280>b;)a.lens[b++]=7;for(;288>b;)a.lens[b++]=8;for(c=9,w(new f(y,a.lens,0,288,q,0,c,a.work)),b=0;32>b;)a.lens[b++]=5;c=5,w(new f(z,a.lens,0,32,r,0,c,a.work)),ub=!1}a.lencode=q,a.lenbits=9,a.distcode=r,a.distbits=5}function n(a,b,c,d){var e,f=a.state;return null===f.window&&(f.wsize=1<<f.wbits,f.wnext=0,f.whave=0,f.window=new s.Buf8(f.wsize)),d>=f.wsize?(s.arraySet(f.window,b,c-f.wsize,f.wsize,0),f.wnext=0,f.whave=f.wsize):(e=f.wsize-f.wnext,e>d&&(e=d),s.arraySet(f.window,b,c-d,e,f.wnext),d-=e,d?(s.arraySet(f.window,b,c-d,d,0),f.wnext=d,f.whave=f.wsize):(f.wnext+=e,f.wnext===f.wsize&&(f.wnext=0),f.whave<f.wsize&&(f.whave+=e))),0}function o(a,b){var c,e,g,h,i,j,k,l,o,p,q,r,pb,qb,rb,sb,tb,ub,vb,wb,xb,yb,zb,Ab,Bb=0,Cb=new s.Buf8(4),Db=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];c=a.state,c.mode===W&&(c.mode=X),i=a.next_out_index,g=a.next_out,k=a.avail_out,h=a.next_in_index,e=a.next_in,j=a.avail_in,l=c.hold,o=c.bits,p=j,q=k,yb=D;a:for(;;)switch(c.mode){case L:if(0===c.wrap){c.mode=X;break}for(;16>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}if(2&c.wrap&&35615===l){c.check=0,Cb[0]=255&l,Cb[1]=l>>>8&255,c.check=u(c.check,Cb,2,0),l=0,o=0,c.mode=M;break}if(c.flags=0,c.head&&(c.head.done=-1),!(1&c.wrap)||(((255&l)<<8)+(l>>8))%31){a.msg="incorrect header check",c.mode=mb;break}if((15&l)!==K){a.msg="unknown compression method",c.mode=mb;break}if(l>>>=4,o-=4,xb=(15&l)+8,0===c.wbits)c.wbits=xb;else if(xb>c.wbits){a.msg="invalid window size",c.mode=mb;break}c.dmax=1<<xb,a.adler=c.check=1,c.mode=512&l?U:W,l=0,o=0;break;case M:for(;16>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}if(c.flags=l,(255&c.flags)!==K){a.msg="unknown compression method",c.mode=mb;break}if(57344&c.flags){a.msg="unknown header flags set",c.mode=mb;break}c.head&&(c.head.text=l>>8&1),512&c.flags&&(Cb[0]=255&l,Cb[1]=l>>>8&255,c.check=u(c.check,Cb,2,0)),l=0,o=0,c.mode=N;case N:for(;32>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}c.head&&(c.head.time=l),512&c.flags&&(Cb[0]=255&l,Cb[1]=l>>>8&255,Cb[2]=l>>>16&255,Cb[3]=l>>>24&255,c.check=u(c.check,Cb,4,0)),l=0,o=0,c.mode=O;case O:for(;16>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}c.head&&(c.head.xflags=255&l,c.head.os=l>>8),512&c.flags&&(Cb[0]=255&l,Cb[1]=l>>>8&255,c.check=u(c.check,Cb,2,0)),l=0,o=0,c.mode=P;case P:if(1024&c.flags){for(;16>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}c.length=l,c.head&&(c.head.extra_len=l),512&c.flags&&(Cb[0]=255&l,Cb[1]=l>>>8&255,c.check=u(c.check,Cb,2,0)),l=0,o=0}else c.head&&(c.head.extra=null);c.mode=Q;case Q:if(1024&c.flags){if(r=c.length,r>j&&(r=j),r){if(c.head&&c.head.extra)throw xb=c.head.extra_len-c.length,"Review & implement right";512&c.flags&&(c.check=u(c.check,e,r,h)),j-=r,h+=r,c.length-=r}if(c.length)break a}c.length=0,c.mode=R;case R:if(2048&c.flags){if(0===j)break a;r=0;do xb=e[h+r++],c.head&&c.head.name&&c.length<c.head.name_max&&(c.head.name[c.length++]=xb);while(xb&&j>r);if(512&c.flags&&(c.check=u(c.check,e,r,h)),j-=r,h+=r,xb)break a}else c.head&&(c.head.name=null);c.length=0,c.mode=S;case S:if(4096&c.flags){if(0===j)break a;r=0;do xb=e[h+r++],c.head&&c.head.comment&&c.length<c.head.comm_max&&(c.head.comment[c.length++]=xb);while(xb&&j>r);if(512&c.flags&&(c.check=u(c.check,e,r,h)),j-=r,h+=r,xb)break a}else c.head&&(c.head.comment=null);c.mode=T;case T:if(512&c.flags){for(;16>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}if(l!==(65535&c.check)){a.msg="header crc mismatch",c.mode=mb;break}l=0,o=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=1),a.adler=c.check=0,c.mode=W;break;case U:for(;32>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}a.adler=c.check=d(l),l=0,o=0,c.mode=V;case V:if(0===c.havedict)return a.next_out_index=i,a.avail_out=k,a.next_in_index=h,a.avail_in=j,c.hold=l,c.bits=o,F;a.adler=c.check=1,c.mode=W;case W:if(b===B||b===C)break a;case X:if(c.last){l>>>=7&o,o-=7&o,c.mode=jb;break}for(;3>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}switch(c.last=1&l,l>>>=1,o-=1,3&l){case 0:c.mode=Y;break;case 1:if(m(c),c.mode=cb,b===C){l>>>=2,o-=2;break a}break;case 2:c.mode=_;break;case 3:a.msg="invalid block type",c.mode=mb}l>>>=2,o-=2;break;case Y:for(l>>>=7&o,o-=7&o;32>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}if((65535&l)!==(l>>>16^65535)){a.msg="invalid stored block lengths",c.mode=mb;break}if(c.length=65535&l,l=0,o=0,c.mode=Z,b===C)break a;case Z:c.mode=$;case $:if(r=c.length){if(r>j&&(r=j),r>k&&(r=k),0===r)break a;s.arraySet(g,e,h,r,i),j-=r,h+=r,k-=r,i+=r,c.length-=r;break}c.mode=W;break;case _:for(;14>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}if(c.nlen=(31&l)+257,l>>>=5,o-=5,c.ndist=(31&l)+1,l>>>=5,o-=5,c.ncode=(15&l)+4,l>>>=4,o-=4,c.nlen>286||c.ndist>30){a.msg="too many length or distance symbols",c.mode=mb;break}c.have=0,c.mode=ab;case ab:for(;c.have<c.ncode;){for(;3>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}c.lens[Db[c.have++]]=7&l,l>>>=3,o-=3}for(;c.have<19;)c.lens[Db[c.have++]]=0;if(s.arraySet(c.lencode,c.codes,0,c.codes.length,0),c.lenbits=7,zb=new f(x,c.lens,0,19,c.lencode,0,c.lenbits,c.work),yb=w(zb),c.lenbits=zb.bits,yb){a.msg="invalid code lengths set",c.mode=mb;break}c.have=0,c.mode=bb;case bb:for(;c.have<c.nlen+c.ndist;){for(;Bb=c.lencode[l&(1<<c.lenbits)-1],rb=Bb>>>24,sb=Bb>>>16&255,tb=65535&Bb,!(o>=rb);){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}if(16>tb)l>>>=rb,o-=rb,c.lens[c.have++]=tb;else{if(16===tb){for(Ab=rb+2;Ab>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}if(l>>>=rb,o-=rb,0===c.have){a.msg="invalid bit length repeat",c.mode=mb;break}xb=c.lens[c.have-1],r=3+(3&l),l>>>=2,o-=2}else if(17===tb){for(Ab=rb+3;Ab>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}l>>>=rb,o-=rb,xb=0,r=3+(7&l),l>>>=3,o-=3}else{for(Ab=rb+7;Ab>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}l>>>=rb,o-=rb,xb=0,r=11+(127&l),l>>>=7,o-=7}if(c.have+r>c.nlen+c.ndist){a.msg="invalid bit length repeat",c.mode=mb;break}for(;r--;)c.lens[c.have++]=xb}}if(c.mode===mb)break;if(0===c.lens[256]){a.msg="invalid code -- missing end-of-block",c.mode=mb;break}if(s.arraySet(c.lencode,c.codes,0,c.codes.length,0),c.lenbits=9,zb=new f(y,c.lens,0,c.nlen,c.lencode,0,c.lenbits,c.work),yb=w(zb),c.lenbits=zb.bits,yb){a.msg="invalid literal/lengths set",c.mode=mb;break}if(c.distbits=6,s.arraySet(c.distcode,c.codes,0,c.codes.length,0),zb=new f(z,c.lens,c.nlen,c.ndist,c.distcode,0,c.distbits,c.work),yb=w(zb),c.distbits=zb.bits,yb){a.msg="invalid distances set",c.mode=mb;break}if(c.mode=cb,b===C)break a;case cb:c.mode=db;case db:if(j>=6&&k>=258){a.next_out_index=i,a.avail_out=k,a.next_in_index=h,a.avail_in=j,c.hold=l,c.bits=o,v(a,q),i=a.next_out_index,g=a.next_out,k=a.avail_out,h=a.next_in_index,e=a.next_in,j=a.avail_in,l=c.hold,o=c.bits,c.mode===W&&(c.back=-1);break}for(c.back=0;Bb=c.lencode[l&(1<<c.lenbits)-1],rb=Bb>>>24,sb=Bb>>>16&255,tb=65535&Bb,!(o>=rb);){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}if(sb&&0===(240&sb)){for(ub=rb,vb=sb,wb=tb;Bb=c.lencode[wb+((l&(1<<ub+vb)-1)>>ub)],rb=Bb>>>24,sb=Bb>>>16&255,tb=65535&Bb,!(o>=ub+rb);){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}l>>>=ub,o-=ub,c.back+=ub}if(l>>>=rb,o-=rb,c.back+=rb,c.length=tb,0===sb){c.mode=ib;break}if(32&sb){c.back=-1,c.mode=W;break}if(64&sb){a.msg="invalid literal/length code",c.mode=mb;break}c.extra=15&sb,c.mode=eb;case eb:if(c.extra){for(Ab=c.extra;Ab>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}c.length+=l&(1<<c.extra)-1,l>>>=c.extra,o-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=fb;case fb:for(;Bb=c.distcode[l&(1<<c.distbits)-1],rb=Bb>>>24,sb=Bb>>>16&255,tb=65535&Bb,!(o>=rb);){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}if(0===(240&sb)){for(ub=rb,vb=sb,wb=tb;Bb=c.distcode[wb+((l&(1<<ub+vb)-1)>>ub)],rb=Bb>>>24,sb=Bb>>>16&255,tb=65535&Bb,!(o>=ub+rb);){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}l>>>=ub,o-=ub,c.back+=ub}if(l>>>=rb,o-=rb,c.back+=rb,64&sb){a.msg="invalid distance code",c.mode=mb;break}c.offset=tb,c.extra=15&sb,c.mode=gb;case gb:if(c.extra){for(Ab=c.extra;Ab>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}c.offset+=l&(1<<c.extra)-1,l>>>=c.extra,o-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){a.msg="invalid distance too far back",c.mode=mb;break}c.mode=hb;case hb:if(0===k)break a;if(r=q-k,c.offset>r){if(r=c.offset-r,r>c.whave&&c.sane){a.msg="invalid distance too far back",c.mode=mb;break}r>c.wnext?(r-=c.wnext,pb=c.wsize-r):pb=c.wnext-r,r>c.length&&(r=c.length),qb=c.window}else qb=g,pb=i-c.offset,r=c.length;r>k&&(r=k),k-=r,c.length-=r;do g[i++]=qb[pb++];while(--r);0===c.length&&(c.mode=db);break;case ib:if(0===k)break a;g[i++]=c.length,k--,c.mode=db;break;case jb:if(c.wrap){for(;32>o;){if(0===j)break a;j--,l|=e[h++]<<o,o+=8}if(q-=k,a.total_out+=q,c.total+=q,q&&(a.adler=c.check=c.flags?u(c.check,g,q,i-q):t(c.check,g,q,i-q)),q=k,(c.flags?l:d(l))!==c.check){a.msg="incorrect data check",c.mode=mb;break}l=0,o=0}c.mode=kb;case kb:if(c.wrap&&c.flags){for(;32>o;){if(0===j)break a;j--,l+=e[h++]<<o,o+=8}if(l!==(4294967295&c.total)){a.msg="incorrect length check",c.mode=mb;break}l=0,o=0}c.mode=lb;case lb:yb=E;break a;case mb:yb=H;break a;case nb:return I;case ob:default:return G}return a.next_out_index=i,a.avail_out=k,a.next_in_index=h,a.avail_in=j,c.hold=l,c.bits=o,(c.wsize||q!==a.avail_out&&c.mode<mb&&(c.mode<jb||b!==A))&&n(a,a.next_out,a.next_out_index,q-a.avail_out)?(c.mode=nb,I):(p-=a.avail_in,q-=a.avail_out,a.total_in+=p,a.total_out+=q,c.total+=q,c.wrap&&q&&(a.adler=c.check=c.flags?u(c.check,g,q,a.next_out_index-q):t(c.check,g,q,a.next_out_index-q)),a.data_type=c.bits+(c.last?64:0)+(c.mode===W?128:0)+(c.mode===cb||c.mode===Z?256:0),(0===p&&0===q||b===A)&&yb===D&&(yb=J),yb)}function p(a){var b=a.state;return b.window&&(b.window=null),a.state=null,D}var q,r,s=a("./utils"),t=a("./adler32"),u=a("./crc32"),v=a("./inffast"),w=a("./inftrees"),x=0,y=1,z=2,A=4,B=5,C=6,D=0,E=1,F=2,G=-2,H=-3,I=-4,J=-5,K=8,L=1,M=2,N=3,O=4,P=5,Q=6,R=7,S=8,T=9,U=10,V=11,W=12,X=13,Y=14,Z=15,$=16,_=17,ab=18,bb=19,cb=20,db=21,eb=22,fb=23,gb=24,hb=25,ib=26,jb=27,kb=28,lb=29,mb=30,nb=31,ob=32,pb=852,qb=592,rb=pb+qb,sb=15,tb=sb,ub=!0;c.inflateReset=h,c.inflateReset2=i,c.inflateResetKeep=g,c.inflateInit=k,c.inflateInit2=j,c.inflatePrime=l,c.inflate=o,c.inflateEnd=p,c.inflateInfo="pako inflate (from Nodeca project)"},{"./adler32":22,"./crc32":24,"./inffast":26,"./inftrees":28,"./utils":31}],28:[function(a,b){"use strict";var c=a("./utils"),d=15,e=852,f=592,g=0,h=1,i=2,j=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],k=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],m=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];b.exports=function(a){var b,n,o,p,q,r,s,t,u,v=a.type,w=a.lens,x=a.codes,y=a.table,z=a.bits,A=a.work,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=null,M=0,N=new c.Buf16(d+1),O=new c.Buf16(d+1),P=null,Q=0;for(B=0;d>=B;B++)N[B]=0;for(C=0;x>C;C++)N[w[a.lens_index+C]]++;for(F=z,E=d;E>=1&&0===N[E];E--);if(F>E&&(F=E),0===E)return y[a.table_index++]=20971520,y[a.table_index++]=20971520,a.bits=1,0;for(D=1;E>D&&0===N[D];D++);for(D>F&&(F=D),I=1,B=1;d>=B;B++)if(I<<=1,I-=N[B],0>I)return-1;if(I>0&&(v===g||1!==E))return-1;for(O[1]=0,B=1;d>B;B++)O[B+1]=O[B]+N[B];for(C=0;x>C;C++)0!==w[a.lens_index+C]&&(A[O[w[a.lens_index+C]]++]=C);switch(v){case g:L=P=A,r=19;break;case h:L=j,M-=257,P=k,Q-=257,r=256;break;default:L=l,P=m,r=-1}if(K=0,C=0,B=D,q=a.table_index,G=F,H=0,o=-1,J=1<<F,p=J-1,v===h&&J>e||v===i&&J>f)return 1;for(var R=0;;){R++,s=B-H,A[C]<r?(t=0,u=A[C]):A[C]>r?(t=P[Q+A[C]],u=L[M+A[C]]):(t=96,u=0),b=1<<B-H,n=1<<G,D=n;do n-=b,y[q+(K>>H)+n]=s<<24|t<<16|u|0;while(0!==n);for(b=1<<B-1;K&b;)b>>=1;if(0!==b?(K&=b-1,K+=b):K=0,C++,0===--N[B]){if(B===E)break;B=w[a.lens_index+A[C]]}if(B>F&&(K&p)!==o){for(0===H&&(H=F),q+=D,G=B-H,I=1<<G;E>G+H&&(I-=N[G+H],!(0>=I));)G++,I<<=1;if(J+=1<<G,v===h&&J>e||v===i&&J>f)return 1;o=K&p,y[o]=F<<24|G<<16|q-a.table_index}}return 0!==K&&(y[q+K]=B-H<<24|64<<16|0),a.table_index+=J,a.bits=F,0}},{"./utils":31}],29:[function(a,b){"use strict";b.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],30:[function(a,b,c){"use strict";function d(a){for(var b=a.length;--b;)a[b]=0}function e(a){return 256>a?gb[a]:gb[256+(a>>>7)]}function f(a,b){a.pending_buf[a.pending++]=255&b,a.pending_buf[a.pending++]=b>>>8&255}function g(a,b,c){a.bi_valid>V-c?(a.bi_buf|=b<<a.bi_valid&65535,f(a,a.bi_buf),a.bi_buf=b>>V-a.bi_valid,a.bi_valid+=c-V):(a.bi_buf|=b<<a.bi_valid&65535,a.bi_valid+=c)}function h(a,b,c){g(a,c[2*b],c[2*b+1])}function i(a,b){var c=0;do c|=1&a,a>>>=1,c<<=1;while(--b>0);return c>>>1}function j(a){16===a.bi_valid?(f(a,a.bi_buf),a.bi_buf=0,a.bi_valid=0):a.bi_valid>=8&&(a.pending_buf[a.pending++]=255&a.bi_buf,a.bi_buf>>=8,a.bi_valid-=8)}function k(a,b){var c,d,e,f,g,h,i=b.dyn_tree,j=b.max_code,k=b.stat_desc.static_tree,l=b.stat_desc.has_stree,m=b.stat_desc.extra_bits,n=b.stat_desc.extra_base,o=b.stat_desc.max_length,p=0;for(f=0;U>=f;f++)a.bl_count[f]=0;for(i[2*a.heap[a.heap_max]+1]=0,c=a.heap_max+1;T>c;c++)d=a.heap[c],f=i[2*i[2*d+1]+1]+1,f>o&&(f=o,p++),i[2*d+1]=f,d>j||(a.bl_count[f]++,g=0,d>=n&&(g=m[d-n]),h=i[2*d],a.opt_len+=h*(f+g),l&&(a.static_len+=h*(k[2*d+1]+g)));if(0!==p){do{for(f=o-1;0===a.bl_count[f];)f--;a.bl_count[f]--,a.bl_count[f+1]+=2,a.bl_count[o]--,p-=2}while(p>0);for(f=o;0!==f;f--)for(d=a.bl_count[f];0!==d;)e=a.heap[--c],e>j||(i[2*e+1]!==f&&(a.opt_len+=(f-i[2*e+1])*i[2*e],i[2*e+1]=f),d--)}}function l(a,b,c){var d,e,f=new Array(U+1),g=0;for(d=1;U>=d;d++)f[d]=g=g+c[d-1]<<1;for(e=0;b>=e;e++){var h=a[2*e+1];0!==h&&(a[2*e]=i(f[h]++,h))}}function m(){var a,b,c,d,e,f=new Array(U+1);for(c=0,d=0;O-1>d;d++)for(ib[d]=c,a=0;a<1<<_[d];a++)hb[c++]=d;for(hb[c-1]=d,e=0,d=0;16>d;d++)for(jb[d]=e,a=0;a<1<<ab[d];a++)gb[e++]=d;for(e>>=7;R>d;d++)for(jb[d]=e<<7,a=0;a<1<<ab[d]-7;a++)gb[256+e++]=d;for(b=0;U>=b;b++)f[b]=0;for(a=0;143>=a;)eb[2*a+1]=8,a++,f[8]++;for(;255>=a;)eb[2*a+1]=9,a++,f[9]++;for(;279>=a;)eb[2*a+1]=7,a++,f[7]++;for(;287>=a;)eb[2*a+1]=8,a++,f[8]++;for(l(eb,Q+1,f),a=0;R>a;a++)fb[2*a+1]=5,fb[2*a]=i(a,5);kb=new nb(eb,_,P+1,Q,U),lb=new nb(fb,ab,0,R,U),mb=new nb(new Array(0),bb,0,S,W)}function n(a){var b;for(b=0;Q>b;b++)a.dyn_ltree[2*b]=0;for(b=0;R>b;b++)a.dyn_dtree[2*b]=0;for(b=0;S>b;b++)a.bl_tree[2*b]=0;a.dyn_ltree[2*X]=1,a.opt_len=a.static_len=0,a.last_lit=a.matches=0}function o(a){a.bi_valid>8?f(a,a.bi_buf):a.bi_valid>0&&(a.pending_buf[a.pending++]=a.bi_buf),a.bi_buf=0,a.bi_valid=0}function p(a,b,c,d){o(a),d&&(f(a,c),f(a,~c)),E.arraySet(a.pending_buf,a.window,b,c,a.pending),a.pending+=c}function q(a,b,c,d){var e=2*b,f=2*c;return a[e]<a[f]||a[e]===a[f]&&d[b]<=d[c]}function r(a,b,c){for(var d=a.heap[c],e=c<<1;e<=a.heap_len&&(e<a.heap_len&&q(b,a.heap[e+1],a.heap[e],a.depth)&&e++,!q(b,d,a.heap[e],a.depth));)a.heap[c]=a.heap[e],c=e,e<<=1;a.heap[c]=d}function s(a,b,c){var d,f,i,j,k=0;if(0!==a.last_lit)do d=a.pending_buf[a.d_buf+2*k]<<8|a.pending_buf[a.d_buf+2*k+1],f=a.pending_buf[a.l_buf+k],k++,0===d?h(a,f,b):(i=hb[f],h(a,i+P+1,b),j=_[i],0!==j&&(f-=ib[i],g(a,f,j)),d--,i=e(d),h(a,i,c),j=ab[i],0!==j&&(d-=jb[i],g(a,d,j)));while(k<a.last_lit);h(a,X,b)}function t(a,b){var c,d,e,f=b.dyn_tree,g=b.stat_desc.static_tree,h=b.stat_desc.has_stree,i=b.stat_desc.elems,j=-1;for(a.heap_len=0,a.heap_max=T,c=0;i>c;c++)0!==f[2*c]?(a.heap[++a.heap_len]=j=c,a.depth[c]=0):f[2*c+1]=0;for(;a.heap_len<2;)e=a.heap[++a.heap_len]=2>j?++j:0,f[2*e]=1,a.depth[e]=0,a.opt_len--,h&&(a.static_len-=g[2*e+1]);for(b.max_code=j,c=a.heap_len>>1;c>=1;c--)r(a,f,c);e=i;do c=a.heap[1],a.heap[1]=a.heap[a.heap_len--],r(a,f,1),d=a.heap[1],a.heap[--a.heap_max]=c,a.heap[--a.heap_max]=d,f[2*e]=f[2*c]+f[2*d],a.depth[e]=(a.depth[c]>=a.depth[d]?a.depth[c]:a.depth[d])+1,f[2*c+1]=f[2*d+1]=e,a.heap[1]=e++,r(a,f,1);while(a.heap_len>=2);a.heap[--a.heap_max]=a.heap[1],k(a,b),l(f,j,a.bl_count)}function u(a,b,c){var d,e,f=-1,g=b[1],h=0,i=7,j=4;for(0===g&&(i=138,j=3),b[2*(c+1)+1]=65535,d=0;c>=d;d++)e=g,g=b[2*(d+1)+1],++h<i&&e===g||(j>h?a.bl_tree[2*e]+=h:0!==e?(e!==f&&a.bl_tree[2*e]++,a.bl_tree[2*Y]++):10>=h?a.bl_tree[2*Z]++:a.bl_tree[2*$]++,h=0,f=e,0===g?(i=138,j=3):e===g?(i=6,j=3):(i=7,j=4))
}function v(a,b,c){var d,e,f=-1,i=b[1],j=0,k=7,l=4;for(0===i&&(k=138,l=3),d=0;c>=d;d++)if(e=i,i=b[2*(d+1)+1],!(++j<k&&e===i)){if(l>j){do h(a,e,a.bl_tree);while(0!==--j)}else 0!==e?(e!==f&&(h(a,e,a.bl_tree),j--),h(a,Y,a.bl_tree),g(a,j-3,2)):10>=j?(h(a,Z,a.bl_tree),g(a,j-3,3)):(h(a,$,a.bl_tree),g(a,j-11,7));j=0,f=e,0===i?(k=138,l=3):e===i?(k=6,l=3):(k=7,l=4)}}function w(a){var b;for(u(a,a.dyn_ltree,a.l_desc.max_code),u(a,a.dyn_dtree,a.d_desc.max_code),t(a,a.bl_desc),b=S-1;b>=3&&0===a.bl_tree[2*cb[b]+1];b--);return a.opt_len+=3*(b+1)+5+5+4,b}function x(a,b,c,d){var e;for(g(a,b-257,5),g(a,c-1,5),g(a,d-4,4),e=0;d>e;e++)g(a,a.bl_tree[2*cb[e]+1],3);v(a,a.dyn_ltree,b-1),v(a,a.dyn_dtree,c-1)}function y(a){var b,c=4093624447;for(b=0;31>=b;b++,c>>>=1)if(1&c&&0!==a.dyn_ltree[2*b])return G;if(0!==a.dyn_ltree[18]||0!==a.dyn_ltree[20]||0!==a.dyn_ltree[26])return H;for(b=32;P>b;b++)if(0!==a.dyn_ltree[2*b])return H;return G}function z(a){pb||(m(),pb=!0),a.l_desc=new ob(a.dyn_ltree,kb),a.d_desc=new ob(a.dyn_dtree,lb),a.bl_desc=new ob(a.bl_tree,mb),a.bi_buf=0,a.bi_valid=0,n(a)}function A(a,b,c,d){g(a,(J<<1)+(d?1:0),3),p(a,b,c,!0)}function B(a){g(a,K<<1,3),h(a,X,eb),j(a)}function C(a,b,c,d){var e,f,h=0;a.level>0?(a.strm.data_type===I&&(a.strm.data_type=y(a)),t(a,a.l_desc),t(a,a.d_desc),h=w(a),e=a.opt_len+3+7>>>3,f=a.static_len+3+7>>>3,e>=f&&(e=f)):e=f=c+5,e>=c+4&&-1!==b?A(a,b,c,d):a.strategy===F||f===e?(g(a,(K<<1)+(d?1:0),3),s(a,eb,fb)):(g(a,(L<<1)+(d?1:0),3),x(a,a.l_desc.max_code+1,a.d_desc.max_code+1,h+1),s(a,a.dyn_ltree,a.dyn_dtree)),n(a),d&&o(a)}function D(a,b,c){return a.pending_buf[a.d_buf+2*a.last_lit]=b>>>8&255,a.pending_buf[a.d_buf+2*a.last_lit+1]=255&b,a.pending_buf[a.l_buf+a.last_lit]=255&c,a.last_lit++,0===b?a.dyn_ltree[2*c]++:(a.matches++,b--,a.dyn_ltree[2*(hb[c]+P+1)]++,a.dyn_dtree[2*e(b)]++),a.last_lit===a.lit_bufsize-1}var E=a("./utils"),F=4,G=0,H=1,I=2,J=0,K=1,L=2,M=3,N=258,O=29,P=256,Q=P+1+O,R=30,S=19,T=2*Q+1,U=15,V=16,W=7,X=256,Y=16,Z=17,$=18,_=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ab=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],bb=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],db=512,eb=new Array(2*(Q+2));d(eb);var fb=new Array(2*R);d(fb);var gb=new Array(db);d(gb);var hb=new Array(N-M+1);d(hb);var ib=new Array(O);d(ib);var jb=new Array(R);d(jb);var kb,lb,mb,nb=function(a,b,c,d,e){this.static_tree=a,this.extra_bits=b,this.extra_base=c,this.elems=d,this.max_length=e,this.has_stree=a&&a.length},ob=function(a,b){this.dyn_tree=a,this.max_code=0,this.stat_desc=b},pb=!1;c._tr_init=z,c._tr_stored_block=A,c._tr_flush_block=C,c._tr_tally=D,c._tr_align=B},{"./utils":31}],31:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;c.assign=function(a){for(var b=Array.prototype.slice.call(arguments,1);b.length;){var c=b.shift();if(c){if("object"!=typeof c)throw new TypeError(c+"must be non-object");for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}}return a},c.shrinkBuf=function(a,b){return a.length===b?a:a.subarray?a.subarray(0,b):(a.length=b,a)};var e={arraySet:function(a,b,c,d,e){if(b.subarray)return void a.set(b.subarray(c,c+d),e);for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){var b,c,d,e,f,g;for(d=0,b=0,c=a.length;c>b;b++)d+=a[b].length;for(g=new Uint8Array(d),e=0,b=0,c=a.length;c>b;b++)f=a[b],g.set(f,e),e+=f.length;return g}},f={arraySet:function(a,b,c,d,e){for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){return[].concat.apply([],a)}};c.setTyped=function(a){a?(c.Buf8=Uint8Array,c.Buf16=Uint16Array,c.Buf32=Int32Array,c.assign(c,e)):(c.Buf8=Array,c.Buf16=Array,c.Buf32=Array,c.assign(c,f))},c.setTyped(d)},{}],32:[function(a,b){"use strict";function c(){this.next_in=null,this.next_in_index=0,this.avail_in=0,this.total_in=0,this.next_out=null,this.next_out_index=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}b.exports=c},{}]},{},[7])(7)});//----------------------------------------------------------

// Copyright (C) Microsoft Corporation. All rights reserved.
// Released under the Microsoft Office Extensible File License
// https://raw.github.com/stephen-hardy/xlsx.js/master/LICENSE.txt
//
// The library includes changes made by GrapeCity.
//
// 1.  Add row height / column width support for exporting.
//     We add the height property in the cells for exporting row height.
//     We add the width property in the cells for exporting column width.
// 2.  Add row/column visible support for exporting.
//     We add the rowVisible property in the first cell of each row to supporting the row visible feature.
//     We add the visible property in the cells for supporting the column visible feature.
// 3.  Add group header support for exporting/importing.
//     We add the groupLevel property in the cells for exporting group.
//     We read the outlineLevel property of the excel row for importing group.
// 4.  Add indent property for nested group for exporting.
//     We add the indent property in the cells of the group row for exporting the indentation for the nested groups.
// 5.  Modify the excel built-in format 'mm-dd-yy' to 'm/d/yyyy'.
// 6.  Add excel built-in format '$#,##0.00_);($#,##0.00)'.
// 7.  Fix issue that couldn't read rich text content of excel cell.
// 8.  Fix issue that couldn't read the excel cell content processed by the string processing function.
// 9.  Fix issue exporting empty sheet 'dimension ref' property incorrect.
// 10. Add frozen rows and columns supporting for exporting/importing.
//     We add frozenPane property that includes rows and columns sub properties in each worksheet.
//
//----------------------------------------------------------

if ((typeof JSZip === 'undefined' || !JSZip) && typeof require === 'function') {
	var JSZip = require('node-zip');
}

function xlsx(file) { 
	'use strict'; // v2.3.2

	var result, zip = new JSZip(), zipTime, processTime, s, content, f, i, j, k, l, t, w, sharedStrings, styles, index, data, val, style, borders, border, borderIndex, fonts, font, fontIndex,
		docProps, xl, xlWorksheets, worksheet, contentTypes = [[], []], props = [], xlRels = [], worksheets = [], id, columns, cols, colWidth, cell, row, merges, merged, rowStr, rowHeightSetting, groupLevelSetting, firstCell, rowVisible, hiddenColumns, idx, colIndex, groupLevel, frozenPane, frozenRows, frozenCols, 
		numFmts = ['General', '0', '0.00', '#,##0', '#,##0.00', , , '$#,##0.00_);($#,##0.00)' /* GrapeCity: Add built-in accounting format.*/, , '0%', '0.00%', '0.00E+00', '# ?/?', '# ??/??', 'm/d/yyyy' /* GrapeCity: Modify the built-in date format.*/, 'd-mmm-yy', 'd-mmm', 'mmm-yy', 'h:mm AM/PM', 'h:mm:ss AM/PM',
			'h:mm', 'h:mm:ss', 'm/d/yy h:mm',,,,,,,,,,,,,,, '#,##0 ;(#,##0)', '#,##0 ;[Red](#,##0)', '#,##0.00;(#,##0.00)', '#,##0.00;[Red](#,##0.00)',,,,, 'mm:ss', '[h]:mm:ss', 'mmss.0', '##0.0E+0', '@'],
		alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		defaultFontName = 'Calibri',
		defaultFontSize = 11;

	function numAlpha(i) {
		var t = Math.floor(i / 26) - 1; return (t > -1 ? numAlpha(t) : '') + alphabet.charAt(i % 26); 
	}

	function alphaNum(s) { 
		var t = 0; if (s.length === 2) { t = alphaNum(s.charAt(0)) + 1; } return t * 26 + alphabet.indexOf(s.substr(-1)); 
	}

	function convertDate(input) {
		var d = new Date(1900, 0, 0),
			isDateObject = typeof input === 'object',
			offset = ((isDateObject ? input.getTimezoneOffset() : (new Date()).getTimezoneOffset()) - d.getTimezoneOffset()) * 60000;
		return isDateObject ? ((input - d - offset ) / 86400000) + 1 : new Date(+d - offset + (input - 1) * 86400000);
	}

	function typeOf(obj) {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}
	
	function getAttr(s, n) { 
		s = s.substr(s.indexOf(n + '="') + n.length + 2); return s.substring(0, s.indexOf('"')); 
	}
	
	function escapeXML(s) { return typeof s === 'string' ? s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;') : ''; }
	
	function unescapeXML(s) { return typeof s === 'string' ? s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, '\'') : ''; }

   if (typeof file === 'string') { // Load
		zipTime = Date.now();
		zip = zip.load(file, { base64: true });
		result = { worksheets: [], zipTime: Date.now() - zipTime };
		processTime = Date.now();
		sharedStrings = [];
		styles = [];

		if (s = zip.file('xl/sharedStrings.xml')) { // Process sharedStrings
			// GrapeCity Begin: For fixing issue the content of cell is cut off if it is rich text with multiple style.
			// Do not process i === 0, because s[0] is the text before first t element
			s = s.asText().split(/<si.*?>/g); i = s.length;
			while (--i) {
				content = s[i].split(/<t.*?>/g); j = 1;
				sharedStrings[i - 1] = '';
				while (j < content.length) {
					sharedStrings[i - 1] += unescapeXML(content[j].substring(0, content[j].indexOf('</t>')));
					j++;
				}
			}
			// GrapeCity End
		}
		if (s = zip.file('docProps/core.xml')) { // Get file info from "docProps/core.xml"
			s = s.asText();
			s = s.substr(s.indexOf('<dc:creator>') + 12);
			result.creator = s.substring(0, s.indexOf('</dc:creator>'));
			s = s.substr(s.indexOf('<cp:lastModifiedBy>') + 19);
			result.lastModifiedBy = s.substring(0, s.indexOf('</cp:lastModifiedBy>'));
			s = s.substr(s.indexOf('<dcterms:created xsi:type="dcterms:W3CDTF">') + 43);
			result.created = new Date(s.substring(0, s.indexOf('</dcterms:created>')));
			s = s.substr(s.indexOf('<dcterms:modified xsi:type="dcterms:W3CDTF">') + 44);
			result.modified = new Date(s.substring(0, s.indexOf('</dcterms:modified>')));
		}
		if (s = zip.file('xl/workbook.xml')) { // Get workbook info from "xl/workbook.xml" - Worksheet names exist in other places, but "activeTab" attribute must be gathered from this file anyway
			s = s.asText(); index = s.indexOf('activeTab="');
			if (index > 0) {
				s = s.substr(index + 11); // Must eliminate first 11 characters before finding the index of " on the next line. Otherwise, it finds the " before the value.
				result.activeWorksheet = +s.substring(0, s.indexOf('"'));
			} else { 
				result.activeWorksheet = 0; 
			}
			s = s.split('<sheet '); i = s.length;
			while (--i) { // Do not process i === 0, because s[0] is the text before the first sheet element
				id = s[i].substr(s[i].indexOf('name="') + 6);
				result.worksheets.unshift({ name: id.substring(0, id.indexOf('"')), data: [] });
			}
		}
		if (s = zip.file('xl/styles.xml')) { // Get style info from "xl/styles.xml"
			s = s.asText().split('<numFmt '); i = s.length;
			while (--i) { t = s[i]; numFmts[+getAttr(t, 'numFmtId')] = getAttr(t, 'formatCode'); }
			s = s[s.length - 1]; s = s.substr(s.indexOf('cellXfs')).split('<xf '); i = s.length;
			while (--i) {
				id = getAttr(s[i], 'numFmtId'); f = numFmts[id];
				if (f.indexOf('m') > -1) { t = 'date'; }
				else if (f.indexOf('0') > -1) { t = 'number'; }
				else if (f === '@') { t = 'string'; }
				else { t = 'unknown'; }
				styles.unshift({ formatCode: f, type: t });
			}
		}

		// Get worksheet info from "xl/worksheets/sheetX.xml"
		i = result.worksheets.length;
		while (i--) {
			s = zip.file('xl/worksheets/sheet' + (i + 1) + '.xml' ).asText().split('<row ');
			w = result.worksheets[i];
			w.table = s[0].indexOf('<tableParts ') > 0;
			t = getAttr(s[0].substr(s[0].indexOf('<dimension')), 'ref');
			t = t.substr(t.indexOf(':') + 1);
			// GrapeCity Begin: Add hidden column processing. 
			cols = [];
			hiddenColumns = [];
			if (s.length > 0 && s[0].indexOf('<cols>') > -1) {
				cols = s[0].substring(s[0].indexOf('<cols>') + 6, s[0].indexOf('</cols>')).split('<col ');
				for (idx = cols.length - 1; idx > 0; idx--) {
					if (getAttr(cols[idx], 'hidden') === '1') {
						for (colIndex = parseInt(getAttr(cols[idx], 'min')) - 1; colIndex < parseInt(getAttr(cols[idx], 'max')) ; colIndex++) {
							if (hiddenColumns.indexOf(colIndex) === -1) {
								hiddenColumns.push(colIndex);
							}
						}
					}
				}
			}
			// GrapeCity End
			// GrapeCity Begin: Add frozen cols/rows processing. 
			if (s.length > 0 && s[0].indexOf('<pane') > -1) {
				if (getAttr(s[0].substr(s[0].indexOf('<pane')), 'state') === 'frozen') {
					frozenRows = getAttr(s[0].substr(s[0].indexOf('<pane')), 'ySplit');
					frozenRows = frozenRows ? +frozenRows : NaN;
					frozenCols = getAttr(s[0].substr(s[0].indexOf('<pane')), 'xSplit');
					frozenCols = frozenCols ? +frozenCols : NaN;
					w.frozenPane = {
						rows: frozenRows,
						columns: frozenCols
					};
				}
			}
			// GrapeCity End
			w.maxCol = alphaNum(t.match(/[a-zA-Z]*/g)[0]) + 1;
			w.maxRow = +t.match(/\d*/g).join('');
			// GrapeCity Begin: Check whether the Group Header is below the group content.
			w.isGroupBelow = getAttr(s[0], 'summaryBelow') === '0';
			// GrapeCity End
			w = w.data;
			j = s.length;
			while (--j) { // Don't process j === 0, because s[0] is the text before the first row element
				row = w[+getAttr(s[j], 'r') - 1] = [];
				// GrapeCity Begin: Check the visibility of the row.
				rowVisible = true;
				if (s[j].substring(0, s[j].indexOf('>')).indexOf('hidden') > -1 && getAttr(s[j], 'hidden') === '1') {
					rowVisible = false;
				}
				// GrapeCity End
				// GrapeCity Begin: Get the group level.
				groupLevel = getAttr(s[j], 'outlineLevel');
				groupLevel = groupLevel && groupLevel !== '' ? +groupLevel : NaN;
				// GrapeCity End
				columns = s[j].split('<c ');
				k = columns.length;
				while (--k) { // Don't process l === 0, because k[0] is the text before the first c (cell) element
					cell = columns[k];
					f = styles[+getAttr(cell, 's')] || { type: 'General', formatCode: 'General' };
					t = getAttr(cell, 't') || f.type;
					val = cell.substring(cell.indexOf('<v>') + 3, cell.indexOf('</v>'));
					// GrapeCity Begin: Fix issue that couldn't read the excel cell content processed by the string processing function.
					if (t !== 'str') { val = val ? +val : ''; } // turn non-zero into number when the type of the cell is not 'str'
					// GrapeCity End
					colIndex = alphaNum(getAttr(cell, 'r').match(/[a-zA-Z]*/g)[0]);
					switch (t) {
						case 's': val = sharedStrings[val]; break;
						case 'b': val = val === 1; break;
						case 'date': val = convertDate(val); break;
					}
					row[colIndex] = { value: val, formatCode: f.formatCode, visible: hiddenColumns.indexOf(colIndex) === -1 /* Add visible property for the cell */ };
				}
				// GrapeCity Begin: Add rowVisisble and groupLevel of the row in the first cell of the row.
				if (row[0]) {
					row[0].rowVisible = rowVisible;
					row[0].groupLevel = groupLevel;
				} else {
					row[0] = { value: undefined, visible: hiddenColumns.indexOf(0) === -1, rowVisible: rowVisible, groupLevel: groupLevel };
				}
				// GrapeCity End
			}
		}

		result.processTime = Date.now() - processTime;
	}
	else { // Save
		processTime = Date.now();
		sharedStrings = [[], 0];
		// Fully static
		zip.folder('_rels').file('.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
		docProps = zip.folder('docProps');

		xl = zip.folder('xl');
		xl.folder('theme').file('theme1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="1F497D"/></a:dk2><a:lt2><a:srgbClr val="EEECE1"/></a:lt2><a:accent1><a:srgbClr val="4F81BD"/></a:accent1><a:accent2><a:srgbClr val="C0504D"/></a:accent2><a:accent3><a:srgbClr val="9BBB59"/></a:accent3><a:accent4><a:srgbClr val="8064A2"/></a:accent4><a:accent5><a:srgbClr val="4BACC6"/></a:accent5><a:accent6><a:srgbClr val="F79646"/></a:accent6><a:hlink><a:srgbClr val="0000FF"/></a:hlink><a:folHlink><a:srgbClr val="800080"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Cambria"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS P????"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="MS P????"/><a:font script="Hang" typeface="?? ??"/><a:font script="Hans" typeface="??"/><a:font script="Hant" typeface="????"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="1"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:shade val="51000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="80000"><a:schemeClr val="phClr"><a:shade val="93000"/><a:satMod val="130000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="94000"/><a:satMod val="135000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="16200000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln><a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs></a:gsLst><a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/></a:theme>');
		xlWorksheets = xl.folder('worksheets');

		// Not content dependent
		docProps.file('core.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>'
			+ (file.creator || 'XLSX.js') + '</dc:creator><cp:lastModifiedBy>' + (file.lastModifiedBy || 'XLSX.js') + '</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">'
			+ (file.created || new Date()).toISOString() + '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' + (file.modified || new Date()).toISOString() + '</dcterms:modified></cp:coreProperties>');

		// Content dependent
		styles = new Array(1);
		borders = new Array(1);
		fonts = new Array(1);
		
		w = file.worksheets.length;
		while (w--) { 
			// Generate worksheet (gather sharedStrings), and possibly table files, then generate entries for constant files below
			id = w + 1;
			// Generate sheetX.xml in var s
			worksheet = file.worksheets[w]; data = worksheet.data;
			// GrapeCity Begin: Add frozen cols/rows processing. 
			frozenPane = '';
			if (worksheet.frozenPane && (worksheet.frozenPane.rows !== 0 || worksheet.frozenPane.columns !== 0)) {
				frozenPane = '<pane state="frozen" activePane="' +
					(worksheet.frozenPane.rows !== 0 && worksheet.frozenPane.columns !== 0 ? 'bottomRight' :
					(worksheet.frozenPane.rows !== 0 ? 'bottomLeft' : 'topRight')) +
					'" topLeftCell="' + numAlpha(worksheet.frozenPane.columns) + (worksheet.frozenPane.rows + 1) +
					'" ySplit="' + worksheet.frozenPane.rows + '" xSplit="' + worksheet.frozenPane.columns + '"/>';
			}
			// GrapeCity End
			s = '';
			columns = [];
			merges = [];
			i = -1; l = data.length;
			while (++i < l) {
				j = -1; k = data[i].length;
				// GrapeCity Begin: Add row visibility, row height and group level for current excel row.
				firstCell = undefined;
				rowHeightSetting = '';
				groupLevelSetting = '';
				if (k > 0) {
					firstCell = data[i][0];
					if (firstCell.height) {
						rowHeightSetting = 'customHeight="1" ht="' + data[i][0].height + '"';
					}
					if (firstCell.groupLevel) {
						groupLevelSetting = 'outlineLevel=' + '"' + data[i][0].groupLevel + '"';
					}
				}

				rowStr = '<row r="' + (i + 1) + '" {rowHeight} x14ac:dyDescent="0.25" {groupLevel} ' +
					(firstCell && !firstCell.rowVisible ? 'hidden="1"' : '') + '>';
				rowStr = rowStr.replace('{rowHeight}', rowHeightSetting);
				rowStr = rowStr.replace('{groupLevel}', groupLevelSetting);
				s += rowStr;
				// GrapeCity End
				while (++j < k) {
					cell = data[i][j]; val = cell.hasOwnProperty('value') ? cell.value : cell; t = '';
					style = { // supported styles: borders, hAlign, formatCode and font style
						borders: cell.borders, 
						hAlign: cell.hAlign,
						vAlign: cell.vAlign,
						bold: cell.bold,
						italic: cell.italic,
						fontName: cell.fontName,
						fontSize: cell.fontSize,
						formatCode: cell.formatCode || 'General',
						indent: cell.indent /* GrapeCity: Add indent property for nested group*/
					};
					colWidth = 0;

					if (val && typeof val === 'string' && !isFinite(val)) {
						// If value is string, and not string of just a number, place a sharedString reference instead of the value
						val = escapeXML(val);
						sharedStrings[1]++; // Increment total count, unique count derived from sharedStrings[0].length
						index = sharedStrings[0].indexOf(val);
						// GrapeCity: Add width property for the cell, that user can customize the width of the column for exporting.
						colWidth = cell.width || val.length;
						if (index < 0) {
							index = sharedStrings[0].push(val) - 1;
						}
						val = index;
						t = 's';
					}
					else if (typeof val === 'boolean') {
						val = (val ? 1 : 0); t = 'b';
						// GrapeCity: Add width property for the cell, that user can customize the width of the column for exporting.
						colWidth = cell.width || 1;
					}
					else if (typeOf(val) === 'date') {
						val = convertDate(val);
						style.formatCode = cell.formatCode || 'mm-dd-yy';
						// GrapeCity: Add width property for the cell, that user can customize the width of the column for exporting.
						colWidth = cell.width || val.length;
					}
					else if (typeof val === 'object') { val = null; } // unsupported value
					// GrapeCity: Add width property for the cell, that user can customize the width of the column for exporting.
					else { colWidth = cell.width || ('' + val).length; } // number, or string which is a number
					
					// use stringified version as unic and reproductible style signature
					style = JSON.stringify(style);
					index = styles.indexOf(style);
					if (index < 0) { style = styles.push(style) - 1; }
					else { style = index; }
					// keeps largest cell in column, and autoWidth flag that may be set on any cell
					if (columns[j] == null) { columns[j] = { autoWidth: false, max: 0, visible: true }; }
					if (cell.autoWidth) { columns[j].autoWidth = true; }
					if (colWidth > columns[j].max) { columns[j].max = colWidth; }
					// GrapeCity: Add column visibility in the columns array.
					if (!cell.visible) { columns[j].visible = cell.visible; }
					// store merges if needed and add missing cells. Cannot have rowSpan AND colSpan
					if (cell.colSpan > 1) {
						// horizontal merge. ex: B12:E12. Add missing cells (with same attribute but value) to current row
						merges.push([numAlpha(j) + (i + 1), numAlpha(j + cell.colSpan - 1) + (i + 1)]);
						merged = [j, 0]
						for (var m = 0; m < cell.colSpan-1; m++) {
							merged.push(cell);
						}
						data[i].splice.apply(data[i], merged);
						k += cell.colSpan-1;
					} else if (cell.rowSpan > 1) {
						// vertical merge. ex: B12:B15. Add missing cells (with same attribute but value) to next columns
						for (var m = 1; m < cell.rowSpan; m++) {
							if (data[i + m]) {
								data[i + m].splice(j, 0, cell)
							} else {
								// readh the end of data
								cell.rowSpan = m;
								break;
							}
						}
						merges.push([numAlpha(j) + (i + 1), numAlpha(j) + (i + cell.rowSpan)]);
					}
					if (cell.rowSpan > 1 ||cell.colSpan > 1) {
						// deletes value, rowSpan and colSpan from cell to avoid refering it from copied cells
						delete cell.value;
						delete cell.rowSpan;
						delete cell.colSpan;
					}
					s += '<c r="' + numAlpha(j) + (i + 1) + '"' + (style ? ' s="' + style + '"' : '') + (t ? ' t="' + t + '"' : '');
					if (val != null) {
						s += '>' + (cell.formula ? '<f>' + cell.formula + '</f>' : '') + '<v>' + val + '</v></c>';
					} else {
						s += '/>';
					}
				}
				s += '</row>';
			}

			cols = []
			for (i = 0; i < columns.length; i++) {
				// GrapeCity Begin: Add the column visibilty for the excel column
				if (columns[i].autoWidth) {
					cols.push('<col min="', i + 1, '" max="', i + 1, '" width="', columns[i].max, '" bestFit="1" ', 
						(columns[i].visible ? '' : 'hidden="1"'), '/>');
				} else if (!columns[i].visible) {
					cols.push('<col min="', i + 1, '" max="', i + 1, '" bestFit="1" hidden="1"/>');
				}
				// GrapeCity End
			}
			// only add cols definition if not empty
			if (cols.length > 0) {
				cols = ['<cols>'].concat(cols, ['</cols>']).join('');
			}

			s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'
				/* GrapeCity: Add summaryBelow property for displaying the group header above the group contents*/
				+ '<sheetPr><outlinePr summaryBelow="0"/></sheetPr>'
				/* GrapeCity: Fix issue exporting empty sheet 'dimension ref' property incorrect.*/
				+ '<dimension ref="A1' + (data[0].length > 0 ? ':' + numAlpha(data[0].length - 1) + (data.length) : '')
				+ '"/><sheetViews><sheetView ' + (w === file.activeWorksheet ? 'tabSelected="1" ' : '')
				/* GrapeCity: Add frozen pane setting.*/
				+ ' workbookViewId="0">' + frozenPane + '</sheetView>'
				+ '</sheetViews><sheetFormatPr defaultRowHeight="15" x14ac:dyDescent="0.25"/>'
				+ cols
				+ '<sheetData>'
				+ s 
				+ '</sheetData>';
			if (merges.length > 0) {
				s += '<mergeCells count="' + merges.length + '">';
				for (i = 0; i < merges.length; i++) {
					s += '<mergeCell ref="' + merges[i].join(':') + '"/>';
				}
				s += '</mergeCells>';
			}
			s += '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>';
			if (worksheet.table) { 
				s += '<tableParts count="1"><tablePart r:id="rId1"/></tableParts>'; 
			}
			xlWorksheets.file('sheet' + id + '.xml', s + '</worksheet>');

			if (worksheet.table) {
				i = -1; l = data[0].length;
				/* GrapeCity: Fix issue exporting empty sheet 'dimension ref' property incorrect.*/
				t = data[0].length > 0 ? ':' + numAlpha(data[0].length - 1) + data.length : '';
				s = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="' + id
					+ '" name="Table' + id + '" displayName="Table' + id + '" ref="A1' + t + '" totalsRowShown="0"><autoFilter ref="A1' + t + '"/><tableColumns count="' + data[0].length + '">';
				while (++i < l) { 
					s += '<tableColumn id="' + (i + 1) + '" name="' + (data[0][i].hasOwnProperty('value') ? data[0][i].value : data[0][i]) + '"/>'; 
				}
				s += '</tableColumns><tableStyleInfo name="TableStyleMedium2" showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0"/></table>';

				xl.folder('tables').file('table' + id + '.xml', s); 
				xlWorksheets.folder('_rels').file('sheet' + id + '.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table' + id + '.xml"/></Relationships>');
				contentTypes[1].unshift('<Override PartName="/xl/tables/table' + id + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>');
			}

			contentTypes[0].unshift('<Override PartName="/xl/worksheets/sheet' + id + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>');
			props.unshift(escapeXML(worksheet.name) || 'Sheet' + id);
			xlRels.unshift('<Relationship Id="rId' + id + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + id + '.xml"/>');
			worksheets.unshift('<sheet name="' + (escapeXML(worksheet.name) || 'Sheet' + id) + '" sheetId="' + id + '" r:id="rId' + id + '"/>');
		}

		// xl/styles.xml
		i = styles.length; t = [];
		while (--i) { 
			// Don't process index 0, already added
			style = JSON.parse(styles[i]);

			// cell formating, refer to it if necessary
			if (style.formatCode !== 'General') {
				index = numFmts.indexOf(style.formatCode);
				if (index < 0) { 
					index = 164 + t.length; 
					t.push('<numFmt formatCode="' + style.formatCode + '" numFmtId="' + index + '"/>'); 
				}
				style.formatCode = index
			} else {
				style.formatCode = 0
			}

			// border declaration: add a new declaration and refer to it in style
			borderIndex = 0
			if (style.borders) {
				border = ['<border>']
				// order is significative
				for (var edge in {left:0, right:0, top:0, bottom:0, diagonal:0}) {
					if (style.borders[edge]) {
						var color = style.borders[edge];
						// add transparency if missing
						if (color.length === 6) {
							color = 'FF'+color;
						}
						border.push('<', edge, ' style="thin">', '<color rgb="', style.borders[edge], '"/></', edge, '>');
					} else {
						border.push('<', edge, '/>');
					}
				}
				border.push('</border>');
				border = border.join('');
				// try to reuse existing border
				borderIndex = borders.indexOf(border);
				if (borderIndex < 0) {
					borderIndex = borders.push(border) - 1;
				}
			}

			// font declaration: add a new declaration and refer to it in style
			fontIndex = 0
			if (style.bold || style.italic || style.fontSize || style.fontName) {
				font = ['<font>']
				if (style.bold) {
					font.push('<b/>');
				}
				if (style.italic) {
					font.push('<i/>');
				}
				font.push('<sz val="', style.fontSize || defaultFontSize, '"/>');
				font.push('<color theme="1"/>');
				font.push('<name val="', style.fontName || defaultFontName, '"/>');
				font.push('<family val="2"/>', '</font>');
				font = font.join('');
				// try to reuse existing font
				fontIndex = fonts.indexOf(font);
				if (fontIndex < 0) {
					fontIndex = fonts.push(font) - 1;
				}
			}

			// declares style, and refer to optionnal formatCode, font and borders
			styles[i] = ['<xf xfId="0" fillId="0" borderId="', 
				borderIndex, 
				'" fontId="',
				fontIndex,
				'" numFmtId="',
				style.formatCode,
				'" ',
				(style.hAlign || style.vAlign? 'applyAlignment="1" ' : ' '),
				(style.formatCode > 0 ? 'applyNumberFormat="1" ' : ' '),
				(borderIndex > 0 ? 'applyBorder="1" ' : ' '),
				(fontIndex > 0 ? 'applyFont="1" ' : ' '),
				'>'
			];
			if (style.hAlign || style.vAlign || style.indent) {
				styles[i].push('<alignment');
				if (style.hAlign) {
					styles[i].push(' horizontal="', style.hAlign, '"');
				}
				if (style.vAlign) {
					styles[i].push(' vertical="', style.vAlign, '"');
				}
				// GrapeCity Begin: Add indent property for the nested group
				if (style.indent) {
					styles[i].push(' indent="', style.indent, '"');
				}
				// GrapeCity End
				styles[i].push('/>');
			}
			styles[i].push('</xf>');
			styles[i] = styles[i].join('');
		}
		t = t.length ? '<numFmts count="' + t.length + '">' + t.join('') + '</numFmts>' : '';

		xl.file('styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">'
			+ t + '<fonts count="'+ fonts.length + '" x14ac:knownFonts="1"><font><sz val="' + defaultFontSize + '"/><color theme="1"/><name val="' + defaultFontName + '"/><family val="2"/>'
			+ '<scheme val="minor"/></font>' + fonts.join('') + '</fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>'
			+ '<borders count="' + borders.length + '"><border><left/><right/><top/><bottom/><diagonal/></border>'
			+ borders.join('') + '</borders><cellStyleXfs count="1">'
			+ '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="' + styles.length + '"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
			+ styles.join('') + '</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles><dxfs count="0"/>'
			+ '<tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>'
			+ '<extLst><ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">'
			+ '<x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/></ext></extLst></styleSheet>');

		// [Content_Types].xml
		zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
			+ contentTypes[0].join('') + '<Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>'
			+ contentTypes[1].join('') + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>');

		// docProps/app.xml
		docProps.file('app.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>XLSX.js</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>'
			+ file.worksheets.length + '</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="' + props.length + '" baseType="lpstr"><vt:lpstr>' + props.join('</vt:lpstr><vt:lpstr>')
			+ '</vt:lpstr></vt:vector></TitlesOfParts><Manager></Manager><Company>Microsoft Corporation</Company><LinksUpToDate>false</LinksUpToDate><SharedDoc>false</SharedDoc><HyperlinksChanged>false</HyperlinksChanged><AppVersion>1.0</AppVersion></Properties>');

		// xl/_rels/workbook.xml.rels
		xl.folder('_rels').file('workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
			+ xlRels.join('') + '<Relationship Id="rId' + (xlRels.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>'
			+ '<Relationship Id="rId' + (xlRels.length + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
			+ '<Relationship Id="rId' + (xlRels.length + 3) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/></Relationships>');

		// xl/sharedStrings.xml
		xl.file('sharedStrings.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="'
			+ sharedStrings[1] + '" uniqueCount="' + sharedStrings[0].length + '"><si><t>' + sharedStrings[0].join('</t></si><si><t>') + '</t></si></sst>');

		// xl/workbook.xml
		xl.file('workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
			+ '<fileVersion appName="xl" lastEdited="5" lowestEdited="5" rupBuild="9303"/><workbookPr defaultThemeVersion="124226"/><bookViews><workbookView '
			+ (file.activeWorksheet ? 'activeTab="' + file.activeWorksheet + '" ' : '') + 'xWindow="480" yWindow="60" windowWidth="18195" windowHeight="8505"/></bookViews><sheets>'
			+ worksheets.join('') + '</sheets><calcPr fullCalcOnLoad="1"/></workbook>');

		processTime = Date.now() - processTime;
		zipTime = Date.now();
		result = {
			base64: zip.generate({ compression: 'DEFLATE' }), zipTime: Date.now() - zipTime, processTime: processTime,
			href: function() { return 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + this.base64; }
		};
	}
	return result;
}

if (typeof exports === 'object' && typeof module === 'object') { module.exports = xlsx; } // NodeJs export

var wijmo;
(function (wijmo) {
    (function (grid) {
        'use strict';

        /**
        * ExcelConverter class provides function exporting FlexGrid to xlsx file
        * and importing xlsx file to FlexGrid.
        */
        var ExcelConverter = (function () {
            function ExcelConverter() {
            }
            /**
            * export the FlexGrid to xlsx file
            *
            * @param flex the FlexGrid need be exported to xlsx file
            * @param includeColumnHeader indicates whether export the column header
            */
            ExcelConverter.export = function (flex, convertOption) {
                if (typeof convertOption === "undefined") { convertOption = { includeColumnHeader: true }; }
                var file = {
                    worksheets: [],
                    creator: 'Mike Lu',
                    created: new Date(),
                    lastModifiedBy: 'Mike Lu',
                    modified: new Date(),
                    activeWorksheet: 0
                }, result;

                if (wijmo.grid['sheet'] && wijmo.grid['sheet']['FlexSheet'] && flex instanceof wijmo.grid['sheet']['FlexSheet']) {
                    // export the FlexSheet to xlsx.
                    this._exportFlexSheet(flex, file);
                } else {
                    // export the FlexGrid to xlsx.
                    this._exportFlexGrid(flex, file, convertOption);
                }

                result = xlsx(file);

                result.base64Array = this._base64DecToArr(result.base64);

                return result;
            };

            /**
            * import the xlsx file
            *
            * @param file the base64 string converted from xlsx file
            * @param flex the Flex Grid need bind the data import from xlsx file
            * @param includeColumnHeader indicates whether imported the column header for the FlexGrid
            * @param callback provides an callback function after finishing importing excel to flex grid.
            */
            ExcelConverter.import = function (file, flex, convertOption) {
                if (typeof convertOption === "undefined") { convertOption = { includeColumnHeader: true }; }
                var fileData = this._base64EncArr(new Uint8Array(file)), fileObj = xlsx(fileData), currentIncludeRowHeader = convertOption.includeColumnHeader, sheetCount = 1, sheetIndex = 0, c = 0, r = 0, columns, columnSetting, column, columnHeader, sheetHeaders, sheetHeader, headerForamt, row, currentSheet, columnCount, isGroupHeader, item, nextRowIdx, nextRow, isGroupBelow, groupRow, frozenColumns, frozenRows, isFlexSheet = false;

                flex.columns.clear();
                flex.rows.clear();
                flex.frozenColumns = 0;
                flex.frozenRows = 0;

                if (fileObj.worksheets.length === 0) {
                    return;
                }

                if (wijmo.grid['sheet'] && wijmo.grid['sheet']['FlexSheet'] && flex instanceof wijmo.grid['sheet']['FlexSheet']) {
                    sheetCount = fileObj.worksheets.length;
                    isFlexSheet = true;
                }

                for (; sheetIndex < sheetCount; sheetIndex++) {
                    r = 0;
                    columns = [];
                    currentSheet = fileObj.worksheets[sheetIndex];

                    if (convertOption.includeColumnHeader) {
                        r = 1;
                        if (currentSheet.data.length <= 1) {
                            currentIncludeRowHeader = false;
                            r = 0;
                        }
                        sheetHeaders = currentSheet.data[0];
                    }
                    columnCount = this._getColumnCount(currentSheet.data);
                    isGroupBelow = currentSheet.isGroupBelow;

                    if (sheetIndex > 0) {
                        flex['addUnboundSheet'](currentSheet.name, currentSheet.data.length > 0 ? currentSheet.data.length : 50, columnCount > 0 ? columnCount : 10);
                    } else if (isFlexSheet) {
                        if (flex['currentSheet']['name'].toLowerCase() !== currentSheet.name.toLowerCase()) {
                            flex['currentSheet']['name'] = currentSheet.name;
                        }
                    }

                    for (c = 0; c < columnCount; c++) {
                        flex.columns.push(new wijmo.grid.Column());
                    }

                    for (; r < currentSheet.data.length; r++) {
                        isGroupHeader = false;
                        row = currentSheet.data[r];

                        if (row && row[0]) {
                            nextRowIdx = r + 1;
                            while (nextRowIdx < currentSheet.data.length) {
                                nextRow = currentSheet.data[nextRowIdx];
                                if (nextRow) {
                                    if ((isNaN(row[0].groupLevel) && !isNaN(nextRow[0].groupLevel)) || (!isNaN(row[0].groupLevel) && row[0].groupLevel < nextRow[0].groupLevel)) {
                                        isGroupHeader = true;
                                    }
                                    break;
                                } else {
                                    nextRowIdx++;
                                }
                            }
                        }

                        if (isGroupHeader && isGroupBelow) {
                            groupRow = new grid.GroupRow();
                            groupRow.level = isNaN(row[0].groupLevel) ? 0 : row[0].groupLevel;
                            flex.rows.push(groupRow);
                        } else {
                            flex.rows.push(new grid.Row());
                        }

                        for (c = 0; c < columnCount; c++) {
                            if (!row) {
                                flex.setCellData(currentIncludeRowHeader ? r - 1 : r, c, '');
                                this._setColumn(columns, c, undefined);
                            } else {
                                item = row[c];
                                flex.setCellData(currentIncludeRowHeader ? r - 1 : r, c, this._getItemValue(item));
                                if (!isGroupHeader) {
                                    this._setColumn(columns, c, item);
                                }
                                if (item && !item.visible && columns[c]) {
                                    columns[c].visible = false;
                                }
                            }
                        }

                        if (row && row[0] && !row[0].rowVisible) {
                            flex.rows[currentIncludeRowHeader ? r - 1 : r].visible = false;
                        }
                    }

                    if (currentSheet.frozenPane) {
                        frozenColumns = currentSheet.frozenPane.columns;
                        if (wijmo.isNumber(frozenColumns) && !isNaN(frozenColumns)) {
                            flex.frozenColumns = frozenColumns;
                        }

                        frozenRows = currentSheet.frozenPane.rows;
                        if (wijmo.isNumber(frozenRows) && !isNaN(frozenRows)) {
                            flex.frozenRows = currentIncludeRowHeader && frozenRows > 0 ? frozenRows - 1 : frozenRows;
                        }
                    }

                    for (c = 0; c < flex.columnHeaders.columns.length; c++) {
                        columnSetting = columns[c];
                        column = flex.columns[c];
                        if (currentIncludeRowHeader) {
                            sheetHeader = sheetHeaders ? sheetHeaders[c] : undefined;
                            if (sheetHeader && sheetHeader.value) {
                                headerForamt = this._parseExcelFormat(sheetHeader);
                                columnHeader = wijmo.Globalize.format(sheetHeader.value, headerForamt);
                            } else {
                                columnHeader = this._numAlpha(c);
                            }
                        } else {
                            columnHeader = this._numAlpha(c);
                        }
                        column.header = columnHeader;
                        if (columnSetting) {
                            if (columnSetting.dataType) {
                                column.dataType = columnSetting.dataType;
                            }
                            column.format = columnSetting.format;
                            column.visible = columnSetting.visible;
                        }
                    }
                }
            };

            // export the flexgrid to excel file
            ExcelConverter._exportFlexGrid = function (flex, file, convertOption) {
                var worksheetData = [], columnSettings = [], workSheet = {
                    name: '',
                    data: [],
                    frozenPane: {}
                }, groupLevel = 0, worksheetDataHeader, rowHeight, column, row, groupRow, isGroupRow, value, columnSetting, ri, ci;


                
                // add the headers in the worksheet.
                if (convertOption.includeColumnHeader) {
                    for (ri = 0; ri < flex.columnHeaders.rows.length; ri++) {
                        worksheetDataHeader = [];
                        rowHeight = flex.columnHeaders.rows[ri].height;
                        if (rowHeight) {
                            rowHeight = rowHeight * 72 / 96;
                        }
                        for (ci = 0; ci < flex.columnHeaders.columns.length; ci++) {
                            column = flex.columnHeaders.columns[ci];
                            if(!column.visible){
                            	continue;
                            }
                            
                            value = flex.columnHeaders.getCellData(ri, ci, true);

                            if (ri === 0) {
                                columnSetting = this._getColumnSetting(column, flex.columnHeaders.columns.defaultSize);
                                columnSettings.push(columnSetting);
                            }

                            worksheetDataHeader.push({
                                value: value,
                                bold: true,
                                autoWidth: true,
                                hAlign: columnSetting.alignment,
                                width: columnSetting.width,
                                height: rowHeight,
                                visible: columnSetting.visible
                            });
                        }
                        if (worksheetDataHeader.length > 0) {
                            worksheetDataHeader[0].rowVisible = true;
                        }

                        worksheetData.push(worksheetDataHeader);
                    }
                } else {
                    for (ci = 0; ci < flex.columnHeaders.columns.length; ci++) {
                        column = flex.columnHeaders.columns[ci];

                        columnSetting = this._getColumnSetting(column, flex.columnHeaders.columns.defaultSize);
                        columnSettings.push(columnSetting);
                    }
                }

                for (ri = 0; ri < flex.cells.rows.length; ri++) {
                    row = flex.rows[ri];
                    isGroupRow = row instanceof grid.GroupRow;

                    if (isGroupRow) {
                        groupRow = wijmo.tryCast(row, grid.GroupRow);
                        groupLevel = groupRow.level + 1;
                    }

                    // Only the common grid row and group row need be exported to xlsx file.
                    if (row.constructor === wijmo.grid.Row || isGroupRow) {
                        worksheetData.push(this._parseFlexGridRowToSheetRow(flex, row, ri, columnSettings, isGroupRow, groupLevel));
                    }
                }

                workSheet.data = worksheetData;
                workSheet.frozenPane = {
                    rows: convertOption.includeColumnHeader ? (flex.frozenRows + flex.columnHeaders.rows.length) : flex.frozenRows,
                    columns: flex.frozenColumns
                };

                file.worksheets.push(workSheet);
            };

            // export the flexsheet to the excel file
            ExcelConverter._exportFlexSheet = function (flex, file) {
                var worksheetData, columnSettings, workSheet, groupLevel = 0, column, row, groupRow, isGroupRow, columnSetting, ri, ci, sheet, sheetIndex;

                for (sheetIndex = 0; sheetIndex < flex['sheets'].length; sheetIndex++) {
                    worksheetData = [], columnSettings = [], workSheet = {
                        name: '',
                        data: [],
                        frozenPane: {}
                    }, groupLevel = 0, sheet = flex['sheets'][sheetIndex];
                    workSheet.name = sheet.name;

                    for (ci = 0; ci < sheet.gridData.columns.length; ci++) {
                        column = sheet.gridData.columns[ci];

                        columnSetting = this._getColumnSetting(column, sheet.gridData.columns.defaultSize);
                        columnSettings.push(columnSetting);
                    }

                    for (ri = 0; ri < sheet.gridData.rows.length; ri++) {
                        row = sheet.gridData.rows[ri];
                        isGroupRow = row instanceof grid.GroupRow;

                        if (isGroupRow) {
                            groupRow = wijmo.tryCast(row, grid.GroupRow);
                            groupLevel = groupRow.level + 1;
                        }

                        // Only the common grid row, header row and group row need be exported to xlsx file.
                        if (row.constructor === wijmo.grid.Row || row.constructor === wijmo.grid['sheet']['HeaderRow'] || isGroupRow) {
                            worksheetData.push(this._parseFlexSheetRowToSheetRow(sheet, row, ri, columnSettings, isGroupRow, groupLevel));
                        }
                    }

                    workSheet.data = worksheetData;
                    workSheet.frozenPane = {
                        rows: sheet.gridData.frozenRows,
                        columns: sheet.gridData.frozenCols
                    };

                    file.worksheets.push(workSheet);
                }
            };

            // Parse the row data of flex grid to a sheet row
            ExcelConverter._parseFlexGridRowToSheetRow = function (flex, row, rowIndex, columnSettings, isGroupRow, groupLevel) {
                var rowHeight = row.height, worksheetDataItem = [], groupName = undefined, colSpan = 0, groupNameAdded = false, columnSetting, format, val;

                if (rowHeight) {
                    rowHeight = rowHeight * 72 / 96;
                }

                var columnSettingsIndex = 0;
                for (var ci = 0; ci < flex.columnHeaders.columns.length; ci++) {

                   	if(!flex.columns[ci].visible){
                   		continue;
                   	}
                   	
                	columnSetting = columnSettings[columnSettingsIndex];
                    val = flex.getCellData(rowIndex, ci, true);

                    //START- OVERPASS EXCEL COMBO 출력 처리 추가 2015/10/12/ - 장진철
                   	var colId = flex.columns[ci].name;
                   	
                   	if(flex.usercolumns.hasOwnProperty(colId)){               

                    	var userColumn = flex.usercolumns[colId];
        				var type = flex.celltypes[rowIndex + "_" + colId]	|| (userColumn.hasOwnProperty("type")) ? userColumn.type: "";

        				if(type =="C"){
	    					var comboId = null;
	    					var isCombo = true;
	    					if(flex.combos[rowIndex+"_"+colId]){
	    						comboId = rowIndex+"_"+colId;
	    					}else if(flex.combos[colId]){
	    						comboId = colId;
	    					}else{						
	    						if(userColumn.combo){
	    							comboId = colId;
	    						}else{
	    							isCombo = false;								
	    						}
	    					}
	    					
	    					if(isCombo && flex.combos[comboId]){
	
	    						$.each(flex.combos[comboId], function(k, v) {
	
	    							if (val == v.key ) {
	    								val = v.value;								
	    							}
	    						});
	    					}
        				}else if(type =="N" && val == ""){
        					val = "0";
        				}
    					
    					//컬럼 갯수랑 같게 해준다.
    					columnSettingsIndex++;
                    }
                    //END - OVERPASS EXCEL COMBO 출력 처리 추가 2015/10/12/ - 장진철
                    
                    format = columnSetting.format ? this._parseCellFormat(columnSetting.format) : wijmo.isDate(val) ? this._formatMap['d'] : !wijmo.isNumber(val) || wijmo.isInt(val) ? 'General' : this._formatMap['n'];

                    if (isGroupRow) {
                        // Process the group row of the flex grid.
                        if (row.dataItem) {
                            if (val) {
                                // Add the group header in the non-aggregate fields.
                                if (groupName && !groupNameAdded) {
                                    worksheetDataItem.push({
                                        value: row.dataItem ? row.dataItem.groupDescription.propertyName + ': ' + groupName + ' (' + row.dataItem.items.length + ' items)' : groupName,
                                        colSpan: colSpan,
                                        bold: true,
                                        autoWidth: true,
                                        height: rowHeight,
                                        visible: true,
                                        groupLevel: groupLevel - 1,
                                        indent: groupLevel - 1
                                    });
                                    groupNameAdded = true;
                                }
                                worksheetDataItem.push({
                                    value: val,
                                    formatCode: format,
                                    bold: true,
                                    autoWidth: true,
                                    hAlign: wijmo.isDate(val) && columnSetting.alignment === '' ? 'left' : columnSetting.alignment,
                                    width: columnSetting.width,
                                    height: rowHeight,
                                    visible: columnSetting.visible,
                                    groupLevel: groupLevel - 1
                                });
                            } else {
                                groupName = groupName || row.dataItem ? row.dataItem.name : val;
                                colSpan++;
                                if (ci === flex.columnHeaders.columns.length - 1 && !groupNameAdded) {
                                    worksheetDataItem.push({
                                        value: row.dataItem ? row.dataItem.groupDescription.propertyName + ': ' + groupName + ' (' + row.dataItem.items.length + ' items)' : groupName,
                                        colSpan: colSpan,
                                        bold: true,
                                        autoWidth: true,
                                        height: rowHeight,
                                        visible: true,
                                        groupLevel: groupLevel - 1,
                                        indent: groupLevel - 1
                                    });
                                } else if (groupNameAdded) {
                                    worksheetDataItem.push({
                                        value: val,
                                        formatCode: format,
                                        bold: true,
                                        autoWidth: true,
                                        hAlign: wijmo.isDate(val) && columnSetting.alignment === '' ? 'left' : columnSetting.alignment,
                                        width: columnSetting.width,
                                        height: rowHeight,
                                        visible: columnSetting.visible,
                                        groupLevel: groupLevel - 1
                                    });
                                }
                            }
                        } else {
                            if (!groupNameAdded) {
                                worksheetDataItem.push({
                                    value: val,
                                    bold: true,
                                    autoWidth: true,
                                    height: rowHeight,
                                    width: columnSetting.width,
                                    visible: true,
                                    groupLevel: groupLevel - 1,
                                    indent: groupLevel - 1
                                });
                                groupNameAdded = true;
                            } else {
                                worksheetDataItem.push({
                                    value: val,
                                    formatCode: format,
                                    bold: true,
                                    autoWidth: true,
                                    hAlign: wijmo.isDate(val) && columnSetting.alignment === '' ? 'left' : columnSetting.alignment,
                                    width: columnSetting.width,
                                    height: rowHeight,
                                    visible: columnSetting.visible,
                                    groupLevel: groupLevel - 1
                                });
                            }
                        }
                    } else {
                        console.log(val)

                        // Add the cell content
                        worksheetDataItem.push({
                            value: val,
                            formatCode: format,
                            autoWidth: true,
                            hAlign: wijmo.isDate(val) && columnSetting.alignment === '' ? 'left' : columnSetting.alignment,
                            width: columnSetting.width,
                            height: rowHeight,
                            visible: columnSetting.visible,
                            groupLevel: groupLevel
                        });
                    }
                }

                if (worksheetDataItem.length > 0) {
                    worksheetDataItem[0].rowVisible = row.visible;
                }

                return worksheetDataItem;
            };

            // parse the flexsheet row data to worksheet row.
            ExcelConverter._parseFlexSheetRowToSheetRow = function (sheet, row, rowIndex, columnSettings, isGroupRow, groupLevel) {
                var rowHeight = row.height, worksheetDataItem = [], groupName = undefined, colSpan = 0, groupNameAdded = false, val, column, columnSetting, format, ci;

                if (rowHeight) {
                    rowHeight = rowHeight * 72 / 96;
                }

                for (ci = 0; ci < sheet.gridData.columns.length; ci++) {
                    columnSetting = columnSettings[ci];
                    column = sheet.gridData.columns[ci];

                    // get column header as the value of the column in the HeaderRow for flexsheet.
                    if (row.constructor === wijmo.grid['sheet']['HeaderRow']) {
                        val = column.header;
                    } else {
                        // get bound value from data item
                        if (row.dataItem && column.binding) {
                            val = column._binding.getValue(row.dataItem);
                        } else if (row._ubv) {
                            val = row._ubv[column._hash];
                        }
                    }

                    format = columnSetting.format ? this._parseCellFormat(columnSetting.format) : wijmo.isDate(val) ? this._formatMap['d'] : !wijmo.isNumber(val) || wijmo.isInt(val) ? 'General' : this._formatMap['n'];

                    if (isGroupRow) {
                        // Process the group row of the flex grid.
                        if (row.dataItem) {
                            if (val) {
                                // Add the group header in the non-aggregate fields.
                                if (groupName && !groupNameAdded) {
                                    worksheetDataItem.push({
                                        value: row.dataItem ? row.dataItem.groupDescription.propertyName + ': ' + groupName + ' (' + row.dataItem.items.length + ' items)' : groupName,
                                        colSpan: colSpan,
                                        bold: true,
                                        autoWidth: true,
                                        height: rowHeight,
                                        visible: true,
                                        groupLevel: groupLevel - 1,
                                        indent: groupLevel - 1
                                    });
                                    groupNameAdded = true;
                                }
                                worksheetDataItem.push({
                                    value: val,
                                    formatCode: format,
                                    bold: true,
                                    autoWidth: true,
                                    hAlign: wijmo.isDate(val) && columnSetting.alignment === '' ? 'left' : columnSetting.alignment,
                                    width: columnSetting.width,
                                    height: rowHeight,
                                    visible: columnSetting.visible,
                                    groupLevel: groupLevel - 1
                                });
                            } else {
                                groupName = groupName || row.dataItem ? row.dataItem.name : val;
                                colSpan++;
                                if (ci === sheet.columns.length - 1 && !groupNameAdded) {
                                    worksheetDataItem.push({
                                        value: row.dataItem ? row.dataItem.groupDescription.propertyName + ': ' + groupName + ' (' + row.dataItem.items.length + ' items)' : groupName,
                                        colSpan: colSpan,
                                        bold: true,
                                        autoWidth: true,
                                        width: columnSetting.width,
                                        height: rowHeight,
                                        visible: true,
                                        groupLevel: groupLevel - 1,
                                        indent: groupLevel - 1
                                    });
                                } else if (groupNameAdded) {
                                    worksheetDataItem.push({
                                        value: val,
                                        formatCode: format,
                                        bold: true,
                                        autoWidth: true,
                                        hAlign: wijmo.isDate(val) && columnSetting.alignment === '' ? 'left' : columnSetting.alignment,
                                        width: columnSetting.width,
                                        height: rowHeight,
                                        visible: columnSetting.visible,
                                        groupLevel: groupLevel - 1
                                    });
                                }
                            }
                        } else {
                            if (!groupNameAdded) {
                                worksheetDataItem.push({
                                    value: val,
                                    bold: true,
                                    autoWidth: true,
                                    width: columnSetting.width,
                                    height: rowHeight,
                                    visible: true,
                                    groupLevel: groupLevel - 1,
                                    indent: groupLevel - 1
                                });
                                groupNameAdded = true;
                            } else {
                                worksheetDataItem.push({
                                    value: val,
                                    formatCode: format,
                                    bold: true,
                                    autoWidth: true,
                                    hAlign: wijmo.isDate(val) && columnSetting.alignment === '' ? 'left' : columnSetting.alignment,
                                    width: columnSetting.width,
                                    height: rowHeight,
                                    visible: columnSetting.visible,
                                    groupLevel: groupLevel - 1
                                });
                            }
                        }
                    } else {
                        // Add the cell content
                        worksheetDataItem.push({
                            value: val,
                            formatCode: format,
                            autoWidth: true,
                            hAlign: wijmo.isDate(val) && columnSetting.alignment === '' ? 'left' : columnSetting.alignment,
                            width: columnSetting.width,
                            height: rowHeight,
                            visible: columnSetting.visible,
                            groupLevel: groupLevel
                        });
                    }
                }

                if (worksheetDataItem.length > 0) {
                    worksheetDataItem[0].rowVisible = row.visible;
                }

                return worksheetDataItem;
            };

            // Parse the cell format of flex grid to excel format.
            ExcelConverter._parseCellFormat = function (format) {
                var dec = 0, mapFormat = this._formatMap[format[0]], decimalArray = [], xlsxFormat;

                if (format.length > 1) {
                    dec = parseInt(format.substr(1));
                }

                if (!isNaN(dec)) {
                    for (var i = 0; i < dec; i++) {
                        decimalArray.push(0);
                    }
                }

                if (decimalArray.length > 0) {
                    xlsxFormat = mapFormat.replace(/\.00/g, '.' + decimalArray.join(''));
                } else {
                    if (mapFormat) {
                        xlsxFormat = mapFormat;
                    } else {
                        xlsxFormat = format.replace(/tt/, 'AM/PM');
                    }
                }

                return xlsxFormat;
            };

            // parse the basic excel format to js format
            ExcelConverter._parseExcelFormat = function (item) {
                if (item === undefined || item === null || item.value === undefined || item.value === null || isNaN(item.value)) {
                    return undefined;
                }

                if (!item.formatCode || item.formatCode === 'General') {
                    return '';
                }

                var format = '', lastDotIndex;
                if (wijmo.isDate(item.value)) {
                    format = item.formatCode.replace(/[\/\s\-,]m+|m+[\/\s\-,]/, function (str) {
                        return str.toUpperCase();
                    }).replace(/\\[\-\s,]/g, function (str) {
                        return str.substring(1);
                    }).replace(/;@/g, '').replace(/\[\$\-.+\]/g, '');
                } else if (wijmo.isNumber(item.value)) {
                    lastDotIndex = item.formatCode.lastIndexOf('.');
                    if (item.formatCode.indexOf('$') > -1) {
                        format = 'c';
                    } else if (item.formatCode[item.formatCode.length - 1] === '%') {
                        format = 'p';
                    } else {
                        format = 'n';
                    }

                    if (lastDotIndex > -1) {
                        format += item.formatCode.substring(lastDotIndex, item.formatCode.lastIndexOf('0')).length;
                    } else {
                        format += '0';
                    }
                }

                return format;
            };

            // Gets the column setting, include width, visible, format and alignment
            ExcelConverter._getColumnSetting = function (column, defaultWidth) {
                var width = column.width;

                width = width ? width / 8 : defaultWidth / 8;

                return {
                    width: width,
                    visible: column.visible,
                    format: column.format,
                    alignment: column.getAlignment()
                };
            };

            // gets column count for specific row
            ExcelConverter._getColumnCount = function (sheetData) {
                var columnCount = 0, data;

                for (var i = 0; i < sheetData.length; i++) {
                    data = sheetData[i];
                    if (data && data.length > columnCount) {
                        columnCount = data.length;
                    }
                }

                return columnCount;
            };

            // convert the column index to alphabet
            ExcelConverter._numAlpha = function (i) {
                var t = Math.floor(i / 26) - 1;
                return (t > -1 ? this._numAlpha(t) : '') + this._alphabet.charAt(i % 26);
            };

            // Get DataType for value of the specific excel item
            ExcelConverter._getItemType = function (item) {
                if (item === undefined || item === null || item.value === undefined || item.value === null || isNaN(item.value)) {
                    return undefined;
                }

                return wijmo.getType(item.value);
            };

            // Set column definition for the Flex Grid
            ExcelConverter._setColumn = function (columns, columnIndex, item) {
                var dataType;
                if (!columns[columnIndex]) {
                    columns.push({
                        visible: true,
                        dataType: this._getItemType(item),
                        format: this._parseExcelFormat(item)
                    });
                } else {
                    dataType = this._getItemType(item);
                    if (columns[columnIndex].dataType === undefined || (dataType !== undefined && dataType !== 1 /* String */ && columns[columnIndex].dataType === 1 /* String */)) {
                        columns[columnIndex].dataType = dataType;
                    }

                    if (!columns[columnIndex].format) {
                        columns[columnIndex].format = this._parseExcelFormat(item);
                    }
                }
            };

            // Get value from the excel cell item
            ExcelConverter._getItemValue = function (item) {
                if (item === undefined || item === null || item.value === undefined || item.value === null) {
                    return undefined;
                }

                var val = item.value;

                if (wijmo.isNumber(val) && isNaN(val)) {
                    return '';
                } else if (val instanceof Date && isNaN(val.getTime())) {
                    return '';
                } else {
                    return val;
                }
            };

            // taken from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Base64_encoding_and_decoding#The_.22Unicode_Problem.22
            ExcelConverter._b64ToUint6 = function (nChr) {
                return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
            };

            // decode the base64 string to int array
            ExcelConverter._base64DecToArr = function (sBase64, nBlocksSize) {
                var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""), nInLen = sB64Enc.length, nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2, taBytes = new Uint8Array(nOutLen);

                for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                    nMod4 = nInIdx & 3;
                    nUint24 |= this._b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                    if (nMod4 === 3 || nInLen - nInIdx === 1) {
                        for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                            taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                        }
                        nUint24 = 0;
                    }
                }
                return taBytes;
            };

            // taken from https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
            /* Base64 string to array encoding */
            ExcelConverter._uint6ToB64 = function (nUint6) {
                return nUint6 < 26 ? nUint6 + 65 : nUint6 < 52 ? nUint6 + 71 : nUint6 < 62 ? nUint6 - 4 : nUint6 === 62 ? 43 : nUint6 === 63 ? 47 : 65;
            };

            ExcelConverter._base64EncArr = function (aBytes) {
                var nMod3 = 2, sB64Enc = "";

                for (var nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
                    nMod3 = nIdx % 3;
                    if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) {
                        sB64Enc += "\r\n";
                    }
                    nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
                    if (nMod3 === 2 || aBytes.length - nIdx === 1) {
                        sB64Enc += String.fromCharCode(this._uint6ToB64(nUint24 >>> 18 & 63), this._uint6ToB64(nUint24 >>> 12 & 63), this._uint6ToB64(nUint24 >>> 6 & 63), this._uint6ToB64(nUint24 & 63));
                        nUint24 = 0;
                    }
                }

                return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
            };
            ExcelConverter._formatMap = {
                n: '#,##0.00',
                c: '$#,##0.00_);($#,##0.00)',
                p: '0.00%',
                d: 'm/dd/yyyy'
            };
            ExcelConverter._alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            return ExcelConverter;
        })();
        grid.ExcelConverter = ExcelConverter;
    })(wijmo.grid || (wijmo.grid = {}));
    var grid = wijmo.grid;
})(wijmo || (wijmo = {}));




//# sourceMappingURL=ExcelConverter.js.map

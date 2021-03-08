
// N2O UTF-8 Support

function utf8_dec(ab) { return (new TextDecoder()).decode(ab); }
function utf8_enc(ab) { return (new TextEncoder("utf-8")).encode(ab); }
function utf8_arr(ab) { if (!(ab instanceof ArrayBuffer)) ab = new Uint8Array(utf8_enc(ab)).buffer;
                        return utf8_dec(ab); }


// API

function tuple() { return { t: 104, v: Array.apply(null, arguments) }; }
function list() { return { t: 108, v: Array.apply(null, arguments) }; }
function map() { return { t: 116, v: Array.apply(null, arguments) }; }
function atom(o) { return { t: 100, v: utf8_enc(o) }; }
function string(o) { return { t: 107, v: utf8_enc(o) }; }
function float(o) { return { t: 70, v: o }; }
function number(o) {
  var s, isInteger = (o % 1 === 0);
  if (isInteger && o >= 0 && o < 256) { return { t: 97, v: o };  }
  if (isInteger && o >= -134217728 && o <= 134217727) { return {t: 98, v: o}; }
  return {t: 110, v: o}; }
function bin(o) {
  return { t: 109, v: o instanceof ArrayBuffer ? new Uint8Array(o) :
                      o instanceof Uint8Array  ? o : utf8_enc(o) }; }

// ENCODER

function enc(o) { return fl([131, ein(o)]); }
function ein(o) { return Array.isArray(o) ? en_108({ t: 108, v: o }) : eval('en_' + o.t)(o); }
function en_undefined(o) { return [106]; }
function en_70(o) {
  var x = Array(8).fill(0).flat();
  write_Float(x,o.v,0,false,52,8);
  return [70].concat(x);
}
function en_97(o) { return [97, o.v]; }
function en_98(o) { return [98, o.v >>> 24, (o.v >>> 16) & 255, (o.v >>> 8) & 255, o.v & 255]; }
function en_99(o) {
  var obj = o.v.toExponential(20),
      match = /([^e]+)(e[+-])(\d+)/.exec(obj),
      exponentialPart = match[3].length == 1 ? "0" + match[3] : match[3],
      num = Array.from(bin(match[1] + match[2] + exponentialPart).v);
  return [o.t].concat(num).concat(Array(31 - num.length).fill(0).flat());
}
function en_106(o) { return [106]; }
function en_115(o) { return [115, o.v.length, ar(o)]; }
function en_119(o) { return [119, ar(o).length, ar(o)]; }
function en_118(o) { return [118, ar(o).length >>> 8, ar(o).length & 255, ar(o)]; }
function en_100(o) { return [100, o.v.length >>> 8, o.v.length & 255, ar(o)]; }
function en_107(o) { return [107, o.v.length >>> 8, o.v.length & 255, ar(o)]; }
function en_104(o) {
  var l = o.v.length, r = [];
  for (var i = 0; i < l; i++)r[i] = ein(o.v[i]);
  return [104, l, r];
}
function unilen(o) {
  return (o.v instanceof ArrayBuffer || o.v instanceof Uint8Array) ? o.v.byteLength :
         (new TextEncoder().encode(o.v)).byteLength;
}

function en_109(o) {
  var l = unilen(o);
  return [109, l >>> 24, (l >>> 16) & 255, (l >>> 8) & 255, l & 255, ar(o)];
}
function en_108(o) {
  var l = o.v.length, r = [];
  for (var i = 0; i < l; i++)r.push(ein(o.v[i]));
  return o.v.length == 0 ? [106] :
         [108, l >>> 24, (l >>> 16) & 255, (l >>> 8) & 255, l & 255, r, 106];
}
function en_116(o) {
  var l=o.v.length,x=[],r = [];
  for (var i = 0; i < l; i++) r.push([ein(o.v[i].k),ein(o.v[i].v)]);
  x = [116, l >>> 24, (l >>> 16) & 255, (l >>> 8) & 255, l & 255];
  return o.v.length == 0 ? x : [x,r];
}
function en_110(o) {
  var s=int_to_bytes(o.v); return [110,s.length,(o.v<0)?1:0].concat(s);
}

// DECODER

function nop(b) { return []; };
function big(b) {
  var sk = b == 1 ? sx.getUint8(ix++) : sx.getInt32((a = ix, ix += 4, a));
  var ret = 0, sig = sx.getUint8(ix++), count = sk;
  while (count-- > 0) { ret = 256 * ret + sx.getUint8(ix + count); }
  ix += sk; return ret * (sig == 0 ? 1 : -1);
}
function int(b) {
  return b == 1 ? sx.getUint8(ix++) : sx.getInt32((a = ix, ix += 4, a));
}
function dec(d) {
  sx = new DataView(d); ix = 0;
  if (sx.getUint8(ix++) !== 131) throw ("BERT?");
  return din();
}
function str(b) {
  var dv, sz = (b==2?sx.getUint16(ix):(b==1?sx.getUint8(ix):sx.getUint32(ix)));
  ix += b; var r = sx.buffer.slice(ix, ix += sz);
  return utf8_arr(r);
}
function run(b) {
  var sz = (b == 1 ? sx.getUint8(ix) : sx.getUint32(ix)), r = []; ix += b;
  for (var i = 0; i < sz; i++) r.push(din());
  return r;
}
function rut(b) {
  var sz = (b == 1 ? sx.getUint8(ix) : sx.getUint32(ix)), r = []; ix += b;
  for (var i = 0; i < sz; i++) r.push(din()); din();
  return r;
}
function dic(b) {
  var sz = sx.getUint32(ix), r = []; ix += 4;
  for (var i = 0; i < sz; i++) r.push({k:din(),v:din()});
  return r;
}
function iee(x) {
  return read_Float(new Uint8Array(sx.buffer.slice(ix,ix+=8)),0,false,52,8);
}
function flo(x) {
  return parseFloat(utf8_arr(sx.buffer.slice(ix, ix += 31)));
}
function arr(b) {
  var dv, sz = sx.getUint16(ix); ix += b;
  return new Uint8Array(sx.buffer.slice(ix, ix += sz));
}
function ref(cr) {
  var adj = sx.getUint8(ix++), d; adj += sx.getUint8(ix++);
  d = din(); ix += cr+adj*4; return d;
}

function din() {
  var c = sx.getUint8(ix++), x;
  switch (c) {
    case  97: x = [int, 1]; break; case  98: x = [int, 4]; break;
    case  99: x = [flo, 0]; break; case  70: x = [iee, 0]; break;
    case 100: x = [str, 2]; break; case 104: x = [run, 1]; break;
    case 107: x = [arr, 2]; break; case 108: x = [rut, 4]; break;
    case 109: x = [str, 4]; break; case 110: x = [big, 1]; break;
    case 111: x = [big, 4]; break; case 115: x = [str, 1]; break;
    case 118: x = [str, 2]; break; case 119: x = [str, 1]; break;
    case 105: x = [run, 4]; break; case 116: x = [dic, 4]; break;
     case 90: x = [ref, 4]; break; case 114: x = [ref, 1]; break;
    default:  x = [nop, 0];
  } return { t: c, v: x[0](x[1]) };
}

// HELPERS

function int_to_bytes(Int) {
  if (Int % 1 !== 0) return [0];
  var isNegative, OriginalInt, i, Rem, s = [];
  isNegative = (Int < 0);
  if (isNegative) { Int = - Int - 1; }
  OriginalInt = Int;
  var length = 0;
  while (Int !== 0) { Rem = Int % 256;
    if (isNegative) { Rem = 255 - Rem; }
    s.push(Rem); Int = Math.floor(Int / 256); length++; }
  if (Int > 0) { throw ("Argument out of range: " + OriginalInt); }
  return s;
}
function uc(u1, u2) {
  if (u1.byteLength == 0) return u2; if (u2.byteLength == 0) return u1;
  var a = new Uint8Array(u1.byteLength + u2.byteLength);
  a.set(u1, 0); a.set(u2, u1.byteLength); return a;
}
function ar(o) {
  return o.v instanceof ArrayBuffer ? new Uint8Array(o.v) : o.v instanceof Uint8Array ? o.v :
    Array.isArray(o.v) ? new Uint8Array(o.v) : new Uint8Array(utf8_enc(o.v));
}
function fl(a) {
  return a.reduce(function (f, t) {
    return uc(f, t instanceof Uint8Array ? t :
      Array.isArray(t) ? fl(t) : new Uint8Array([t]));
  }, new Uint8Array());
}


// WebSocket Transport

$ws = { heart: true, interval: 5000,
        creator: function(url) { return window.WebSocket ? new window.WebSocket(url) : false; },
        onheartbeat: function() { this.channel.send('PING');
                                  } };

// N2O Reliable Connection

$conn = { onopen: nop, onmessage: nop, onclose: nop, onconnect: nop,
          send:  function(data)   { if (this.port.channel) this.port.channel.send(data); },
          close: function()       { if (this.port.channel) this.port.channel.close(); } };

ct = 0;
transports = [ $ws ];
heartbeat = null;
reconnectDelay = 1000;
maxReconnects = 100;

function nop() { }
function bullet(url) { $conn.url = url; return $conn; }
function xport() { return maxReconnects <= ct ? false : transports[ct++ % transports.length]; }
function reconnect() { setTimeout(function() { connect(); }, reconnectDelay); }
function next() { $conn.port = xport(); return $conn.port ? connect() : false; }
function connect() {
    $conn.port.channel = $conn.port.creator($conn.url);
    if (!$conn.port.channel) return next();
    $conn.port.channel.binaryType = "arraybuffer";
    $conn.port.channel.onmessage = function(e) { $conn.onmessage(e); };
    $conn.port.channel.onopen = function() {
        if ($conn.port.heart) heartbeat = setInterval(function(){$conn.port.onheartbeat();}, $conn.port.interval);
        $conn.onopen();
        $conn.onconnect(); };
    $conn.port.channel.onclose = function() { $conn.onclose(); clearInterval(heartbeat); reconnect(); };
    return $conn; }


function read_Float(buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]
  i += d
  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}
  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}
  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

function write_Float(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
  value = Math.abs(value)
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }
    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }
  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
  buffer[offset + i - d] |= s * 128
}


// N2O CORE

var active = false,
    debug = false,
    session = "site-sid",
    protocol = window.location.protocol == 'https:' ? "wss://" : "ws://",
    querystring = window.location.pathname + window.location.search;

function client() { return ''; }
function token()  { return sessionStorage.getItem("token") || tokenC(); }
function tokenC() { var c = document.cookie.match(new RegExp('(^| )X-Auth-Token=([^;]+)')); return (c ? c[2] : ''); }
function qi(name) { return document.getElementById(name); }
function qs(name) { return document.querySelector(name); }
function qa(name) { return document.querySelectorAll(name); }
function qn(name) { return document.createElement(name); }
function is(x, num, name) { return x == undefined ? false : (x.t == 106 ? false : (x.v.length === num && x.v[0].v === name)); }
function co(name) { match = document.cookie.match(new RegExp(name + '=([^;]+)')); return match ? match[1] : undefined; }

function N2O_start() {
    document.cookie = 'X-Auth-Token=' + token() + '; path=/;' + (host == 'localhost' ? '' : ' domain=' + domain +';');
    ws = new bullet(protocol + host + (port==""?"":":"+port) + "/ws" + querystring);
    ws.onmessage = function (evt) { // formatters loop
    for (var i=0;i<protos.length;i++) { p = protos[i]; if (p.on(evt, p.do).status == "ok") return; } };
    ws.onopen = function() { if (!active) { ws.send('N2O,'+token()); console.log('WS Connect'); active=true; } };
    ws.onclose = function() { active = false; console.log('WS Disconnect'); }; next(); }

/// N2O Protocols

var $io = {}; $io.on = function onio(r, cb) {
    if (is(r, 3, 'io')) {
        if (r.v[2].v != undefined && r.v[2].v[1] != undefined && r.v[2].v.length == 2 &&
           (r.v[2].v[0].v == "Token" || r.v[2].v[0].v == "Auth"))
         { sessionStorage.setItem("token",utf8_arr(r.v[2].v[1].v)); }
        if (typeof cb == 'function') cb(r.v[2]);
        var evalex = utf8_arr(r.v[1].v);
        if (debug) console.log(evalex);
        try { eval(evalex); return { status: "ok" }; }
        catch (e) { console.log(evalex);
                    console.error("Eval failed:",e); 
                    return { status: '' }; }
    } else return { status: '' };
}

var $file = {}; $file.on = function onfile(r, cb) {
    if (is(r, 10, 'ftpack')) {
        if (typeof cb == 'function') cb(r); return { status: "ok" };
    } else return { status: '' };
}

// BERT Formatter

var $bert = {}; $bert.protos = [$io, $file]; $bert.on = function onbert(evt, cb) {
    if (ArrayBuffer.prototype.isPrototypeOf(evt.data) &&
       (evt.data.byteLength > 0)) {
        try {
            var erlang = dec(evt.data);
            if (typeof cb == 'function') cb(erlang);
            for (var i = 0; i < $bert.protos.length; i++) {
                var p = $bert.protos[i];
                var ret = p.on(erlang, p.do);
                if (ret != undefined && ret.status == "ok") return ret;
            }
        } catch (e) { console.error(e); }
        return { status: "ok" };
    } else return { status: "error", desc: "data" };
}

var protos = [$bert];


// N2O File Transfer Protocol

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8); return v.toString(16); });
}

var ftp = {
    queue: [],
    init: function (file) {
        var item = {
            id: uuid(),
            status: 'init',
            autostart: ftp.autostart || false,
            name: ftp.filename || file.name,
            sid: ftp.sid || token(), // co(session),
            meta: ftp.meta || bin(client()),
            offset: ftp.offset || 0,
            block: 1,
            total: file.size,
            file: file
        };
        ftp.queue.push(item);
        ftp.send(item, '', 1);
        return item.id;
    },
    start: function (id) {
        if (ftp.active) { id && (ftp.item(id).autostart = true); return false; }
        var item = id ? ftp.item(id) : ftp.next();
        if (item) { ftp.active = true; ftp.send_slice(item); }
    },
    stop: function (id) {
        var item = ftp.item(id);
        var index = ftp.queue.indexOf(item);
        ftp.queue.splice(index, 1);
        ftp.active = false;
        ftp.start();
    },
    send: function (item, data) {
        ws.send(enc(tuple(atom('ftp'),
            bin(item.id),
            bin(item.sid),
            bin(item.name),
            item.meta,
            number(item.total),
            number(item.offset),
            number(item.block || data.byteLength),
            bin(data),
            bin(item.status || 'send')
        )));
    },
    send_slice: function (item) {
        this.reader = new FileReader();
        this.reader.onloadend = function (e) {
            var res = e.target, data = e.target.result;
            if (res.readyState === FileReader.DONE && data.byteLength >= 0) {
                ftp.send(item, data);
            }
        };
        this.reader.readAsArrayBuffer(item.file.slice(item.offset, item.offset + item.block));
    },
    item: function (id) { return ftp.queue.find(function (item) { return item && item.id === id; }); },
    next: function () { return ftp.queue.find(function (next) { return next && next.autostart }); }
};

$file.progress = function onprogress(offset,total) {
    var x = qi('ftp_status'); if (x) x.innerHTML = offset;
};

$file.do = function (rsp) {
    var total = rsp.v[5].v, offset = rsp.v[6].v, block = rsp.v[7].v, status = utf8_arr(rsp.v[9].v);
    switch (status) {
        case 'init':
            if(block == 1) return;
            var item = ftp.item(utf8_arr(rsp.v[1].v)) || '0';
            item.offset = offset;
            item.block = block;
            item.name = utf8_arr(rsp.v[3].v);
            item.status = undefined;
            if (item.autostart) ftp.start(item.id);
            break;
        case 'send':
            $file.progress(offset,total);
            var item = ftp.item(utf8_arr(rsp.v[1].v));
            item.offset = offset;
            item.block = block;
            (block > 0 && ftp.active) ? ftp.send_slice(item) : ftp.stop(item.id)
            break;
        case 'relay': debugger; if (typeof ftp.relay === 'function') ftp.relay(rsp); break;
    }
};

// Nitrogen Compatibility Layer

function unbase64(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);
    return bytes.buffer;
}

// Nitrogen Compatibility Layer

function direct(term) { ws.send(enc(tuple(atom('direct'),term))); }
function validateSources() { return true; }
function querySourceRaw(Id) {
    var val, el = document.getElementById(Id);
    if (!el) {
       val = qs('input[name='+Id+']:checked'); val = val ? val.value : "";
    } else switch (el.tagName) {
        case 'FIELDSET':
            val = qs('[id="'+Id+'"]:checked'); val = val ? val.value : ""; break;
        case 'INPUT':
            switch (el.getAttribute("type")) {
                case 'radio': val = qs('input[name='+Id+']:checked'); val = val ? val.value : ""; break;
                case 'checkbox': val = qs('input[id='+Id+']:checked'); val = val ? val.value : ""; break;
                case 'date': val = Date.parse(el.value);  val = val && new Date(val) || ""; break;
                case 'calendar': val = pickers[el.id]._d || ""; break;
                case 'comboLookup': case 'hidden':
                    if (el.hasAttribute('data-bind')) {
                        val = { 'text' : el.value, 'bind' : el.getAttribute('data-bind')};
                    } else {
                        val = el.value;
                    }
                    break;
                default: var edit = el.contentEditable;
                    if (edit && edit === 'true') val = el.innerHTML;
                    else val = el.value;
            }
            break;
        default:
            if (el.getAttribute('data-vector-input')) {
                val = querySourceRaw(el.children[1].id);
            } else if (el.getAttribute('data-edit-input')) {
                val = querySourceRaw(el.children[0].children[0].children[0].id);
            } else if (el.getAttribute('data-sortable-list')) {
                val = getSortableValues('#' + el.id);
            } else if (el.contentEditable === 'true') {
                val = el.innerHTML;
            } else {
                val = el.value;
                switch (val) {
                    case "true": val = new Boolean(true); break;
                    case "false": val = new Boolean(false); break;
                }
            }
    }
    return val;
}

function querySourceConvert(qs) {
    if (qs && qs.hasOwnProperty('text') && qs.hasOwnProperty('bind')) {
        return dec(unbase64(qs.bind)); }
    else if (qs instanceof Date) {
        return tuple(number(qs.getFullYear()),
                     number(qs.getMonth() + 1),
                     number(qs.getDate())); }
    else if (qs instanceof Boolean) {
        return atom(qs.valueOf()); }
    else if (qs instanceof Array) {
        return list.apply(null, qs.map(querySourceConvert)); }
    else { return bin(qs); }
}

function querySource(Id) {
    var qs = querySourceRaw(Id);
    return querySourceConvert(qs);
}

//# sourceMappingURL=n2o.js.map

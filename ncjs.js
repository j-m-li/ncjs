
/* *
 * valid integer range : -7174453 to +7174453 (15 trits)
 * */


var fs;

if (typeof entry != 'undefined') {
	import('fs').then((m) => {fs = m; entry();});
} else {
	fs = require('fs');
}

global.include = function(a) {
	include1(a,0);
}

global.include1 = function(a,i)
{
	if (i < a.length) {
        	import(a[i][1]).then((m) => {global[a[i][0]] = m;include1(a,i+1);});
	} else {
		if (typeof setup != 'undefined') {
			setup();
			init_event();
		}
	}
}

class event_class {
	type;
	state_machine;
	err;
	url;
	remains;
	read;
	buffer;
	offset;
	position;
	count;
	timeout;
	timer;
	START = 0;
	BLOCK_READ = 1;
	BLOCK_WRITE = 2;
	TIMER = 3;
	KEYBOARD = 4;
	MOUSE = 5;
	SERIAL = 6;
	AUDIO = 7;
	NETWORK = 8;
	END = -1;
}

global.alloc = function(n) 
{
	return new Uint8Array(n);
}

global.free = function(buffer)
{
	
}

global.exit = function(n)
{
	process.exit(n);
}

global.evt = 0;

function tmr_cb()
{
	evt.type = 3;
	evt.timer = evt.timer + 1;

	loop();
	evt.type = -1;
	setTimeout(tmr_cb, 10);
}

function call_loop()
{
	loop();
	evt.type = -1;
}

function init_event()
{
	evt = new event_class();
	evt.type = 0;
	evt.timer = 0;
	evt.state_machine = 0;
	loop();
	evt.type = -1;
	evt.timeout = setTimeout(tmr_cb, 10);
}

global.div = function(a,b)
{
	return Math.floor(a / b);
}

global.read_block = function(url,buffer,offset,position,callback)
{
	var fd = fs.openSync(url, 'r', 0x1B6); 
	fs.read(fd, buffer,
		 {offset:offset,length:512,position:position*512},
		function (err, bytesRead, buffer) {
			fs.close(fd);
			evt.type = evt.BLOCK_READ;
			evt.url = url;
			evt.err = err;
			evt.read = bytesRead;
			evt.buffer = buffer;
			evt.offset = offset;
			evt.position = position;
			if (typeof callback !== 'undefined') {
				callback(url, err, bytesRead, 
					buffer, offset, position);
			} else {
				call_loop();
			}
		});
}

global.write_block = function(url,buffer,offset,length,position,callback)
{
	var l = length;
	var fd;
	try {
		fd = fs.openSync(url, 'r+', 0x1B6);
	} catch {
		fd = fs.openSync(url, 'w', 0x1B6);
	}
	if (l > 512) {
		l = 512;
	} 
	fs.write(fd, buffer,
		 {offset:offset,length:l,position:position*512},
		function (err, bytesWritten, buffer) {
			length = length - bytesWritten;
			fs.close(fd);
			evt.type = evt.BLOCK_WRITE;
			evt.url = url;
			evt.err = err;
			evt.remains = length;
			evt.buffer = buffer;
			evt.offset = offset;
			evt.position = position;
			if (typeof callback !== 'undefined') {
				callback(url, err, length, 
					buffer, offset, position);
			} else {
				call_loop();
			}
		});
}


global.to_string = function(bytes, buffer, offset)
{
	return ((new TextDecoder('utf-8')).decode(buffer.slice(offset,bytes+offset)));
}

global.to_binary = function(str, buffer, offset, length, position) 
{
	var t = (new TextEncoder('utf-8')).encode(str);
	if (t.length > position) {
		var l = t.length - position;
		if (l > length - offset) {
			l = length - offset;
			t = t.slice(position, position + l);
		}
		buffer.set(t, offset);	
	}
	return t.length - position;
}

global.from_int = function(n)
{
	return "" + n;
}

var print_buf = "";

global.print = function(str)
{
	print_buf += str;
}

global.println = function(str)
{
	console.log(print_buf + str);
	print_buf = "";
}

function run(obj)
{
	return Function("runit", `"_use strict";${obj}; return;`)();
}

if (typeof entry === 'undefined' && process !== 'undefined') {
	var read_buffer = alloc(512);
	var data = "";
	evt = new event_class();
	read_block(process.argv[2], read_buffer,0,0,read_cb);
	function read_cb(url, err, bytesRead, buffer, offset, position)
	{
		if (err) {
			console.log("Error reading file");
			return -1;
		}
		data += to_string(bytesRead, buffer, offset);
		if (bytesRead === 512) {
			read_block(url, read_buffer,0,position + 1 ,read_cb);
			return;
		}
		run(fs.readFileSync(process.argv[1]) + data);
	}
}


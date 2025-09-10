
/* *
 * valid integer range : -7174453 to +7174453 (15 trits)
 * */


var fs;

if (typeof startup != 'undefined') {
	import('fs').then((m) => {fs = m; startup();});
} else {
	fs = require('fs');
}

function alloc(n) 
{
	return new Uint8Array(n);
}

function free(buffer)
{
	
}

function exit(n)
{
	process.exit(n);
}

function div(a,b)
{
	return Math.floor(a / b);
}

function read_block(url,buffer,offset,position,callback)
{
	var fd = fs.openSync(url, 'r', 0x1B6); 
	fs.read(fd, buffer,
		 {offset:offset,length:512,position:position*512},
		function (err, bytesRead, buffer) {
			fs.close(fd);
			callback(url, err, bytesRead, 
				buffer, offset, position);
		});
}

function write_block(url,buffer,offset,length,position,callback)
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
			callback(url, err, length, 
				buffer, offset, position);
		});
}


function to_string(bytes, buffer, offset)
{
	return ((new TextDecoder('utf-8')).decode(buffer.slice(offset,bytes+offset)));
}

function to_binary(str, buffer, offset, length, position) 
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

function from_int(n)
{
	return "" + n;
}

var print_buf = "";

function print(str)
{
	print_buf += str;
}

function println(str)
{
	console.log(print_buf + str);
	print_buf = "";
}

function run(obj)
{
	return Function("runit", `"_use strict";${obj}; return;`)();
}

if (typeof startup === 'undefined' && process !== 'undefined') {
	var read_buffer = alloc(512);
	var data = "";
	read_block(process.argv[2], read_buffer,0,0,read_cb);
	function read_cb(url, err, bytesRead, buffer, offset, position)
	{
		if (err) {
			console.log("Error reading file");
			return -1;
		}
		data += to_string(bytesRead, buffer, offset);
		if (bytesRead == 512) {
			read_block(url, read_buffer,0,position + 1 ,read_cb);
			return;
		}
		run(fs.readFileSync(process.argv[1]) + data);
	}
}


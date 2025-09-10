
/* *
 * valid integer range : -7174453 to +7174453 (15 trits)
 * */

var fs = require('fs');

function alloc(n) 
{
	return new Uint8Array(n);
}

function free(buffer)
{
	
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

function write_block(url,buffer,offset,position,callback)
{
	var fd = fs.openSync(url, 'w', 0x1B6); 
	fs.write(fd, buffer,
		 {offset:offset,length:512,position:position*512},
		function (err, bytesWritten, buffer) {
			fs.close(fd);
			callback(url, err, bytesWritten, 
				buffer, offset, position);
		});
}


function to_string(bytes, buffer, offset)
{
	return ((new TextDecoder('utf-8')).decode(buffer.slice(offset,bytes+offset)));
}

function from_int(n)
{
	return "" + n;
}

var pbuf = "";

function print(str)
{
	pbuf += str;
}

function println(str)
{
	console.log(pbuf + str);
	pbuf = 0;
}

if (typeof main === 'undefined' && process !== 'undefined') {
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
		eval(fs.readFileSync(process.argv[1]) + data + "\nmain();");
	}
}



var std;

class my_cls {
	a = 65;
	b;
	c;	
}


function startup()
{
	import('./std.mjs').then((m) => {std = m; setup(); /*loop();*/});
}

function loop()
{
	exit();
}

function setup()
{
	var a, b, c;
	c = 1 + 2;
	c = 1 - 2;
	c = 1 * 2;
	c = div(1,2);
	a = 1 % 2;
	print(from_int(c));
	print(" == ");
	println(from_int(a));
	if (a === b) {
	} else if (a !== b) {
	} else {
	}
	while (a > 100 || (a < 10 && a <= 10 && a > 10 && a >= 10)) {
		c = c + 1;
	}

	c = new my_cls();
	println(c.a);

	b = alloc(512 + 6);
//	read_block("hello.js", b, 0,0, cb);
	read_block("test.mjs", b, 0,0, cb);

	b = alloc(2048);
	var len = to_binary("Hello world...",b,0,2048,0);
	while (len < 1500) {
		 len += to_binary("YO world...",b,len,2048,0);
	}
	write_block("hello.txt", b, 0, len, 0, cb_w);
}

function cb_w(url, err, remains, buffer, offset, position)
{
	if (err) {
		println("Error");
		return;
	}
	if (remains > 0) {
		write_block(url, buffer, offset+512, remains, position+1, cb_w);
		return;
	}
	println("write success.");
	free(buffer);
}

function cb(url, err, bytesRead, buffer, offset, position)
{
	if (err) {
		println("Error");
		return;
	}
	var off = offset - offset % 512;
	var br = bytesRead + off - offset;

	if (bytesRead === 512) {
		var n = 0;
		while (n < 5) {
			var c = buffer[offset + 511 - n];
			if (c < 0x80) {
				break;
			}
			if (c >= 0xC0) {
				n = n + 1;
				break;
			}
			n = n + 1;
		}
		print(to_string(br-n,buffer,off));
		offset = off + n;
		while (offset !== off) {
			buffer[off] = buffer[off + 512 - n];
			off = off + 1;
		}
		read_block(url, buffer, offset, position+1, cb);
		return;
	}
	
	println(to_string(br,buffer,off));
	free(buffer);
}


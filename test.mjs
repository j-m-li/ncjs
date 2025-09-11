
function entry()
{
	include([['std','./std.mjs']]);
}

class my_cls {
	a = 65;
	b;
	c;
	dispose(){};	
}

function setup()
{
	var a, b, c;
	std.hello();
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
	c.dispose();
}


function loop()
{
	var b;
	if (evt.type === evt.START) {
		b = alloc(512 + 6);
		evt.state_machine = 1;
		read_block("test.mjs", b, 0,0);
	} else if (evt.type === evt.BLOCK_READ) {
		if (evt.state_machine === 1 && cb_r()) {
			evt.state_machine = -evt.state_machine;
		}
	} else if (evt.type === evt.BLOCK_WRITE) {
		if (evt.state_machine === 2 && cb_w()) {
			evt.state_machine = -evt.state_machine;
		}
	} else if (evt.type === evt.TIMER) {
		if (evt.state_machine === -1) {
			b = alloc(2048);
			var len = to_binary("Hello world...",b,0,2048,0);
			while (len < 1500) {
				 len += to_binary("YO world...",b,len,2048,0);
			}
			evt.state_machine = 2;
			write_block("hello.txt", b, 0, len, 0);
		} else if (evt.state_machine === -2) {
			exit(0);
		}
	} else if (evt.type === evt.MOUSE) {
	} else if (evt.type === evt.KEYBOARD) {
	} else if (evt.type === evt.AUDIO) {
	} else if (evt.type === evt.SERIAL) {
	} else if (evt.type === evt.NETWORK) {
	} else {
		exit(-1);
	}
}

function cb_w()
{
	if (evt.err) {
		println("Error");
		return -1;
	}
	if (evt.remains > 0) {
		write_block(evt.url, evt.buffer, 
			evt.offset+512, evt.remains, evt.position+1);
		return 0;
	}
	println("write success.");
	free(evt.buffer);
	evt.buffer = null;
	return 1;
}

function cb_r()
{
	var offset = evt.offset;
	if (evt.err) {
		println("Error");
		return -1;
	}
	var off = evt.offset - evt.offset % 512;
	var br = evt.read + off - evt.offset;

	if (evt.read === 512) {
		var n = 0;
		while (n < 5) {
			var c = evt.buffer[evt.offset + 511 - n];
			if (c < 0x80) {
				break;
			}
			if (c >= 0xC0) {
				n = n + 1;
				break;
			}
			n = n + 1;
		}
		print(to_string(br-n,evt.buffer,off));
		offset = off + n;
		while (offset !== off) {
			evt.buffer[off] = evt.buffer[off + 512 - n];
			off = off + 1;
		}
		read_block(evt.url, evt.buffer, offset, evt.position+1);
		return 0;
	}
	
	println(to_string(br,evt.buffer,off));
	free(evt.buffer);
	evt.buffer = null;
	return 1;
}


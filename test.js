
function main()
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
	b = alloc(512 + 6);
//	read_block("hello.js", b, 0,0, cb);
	read_block("test.js", b, 0,0, cb);
	return 0;
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


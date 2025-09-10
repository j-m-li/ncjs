
function main()
{
	var a, b, c;
	c = 1 + 2;
	c = 1 - 2;
	c = 1 * 2;
	c = div(1,2);
	a = 1 % 2;
	println(from_int(c));
	println(from_int(a));
	if (a === b) {
	} else if (a !== b) {
	} else {
	}
	while (a > 100 || (a < 10 && a <= 10 && a > 10 && a >= 10)) {
		c = c + 1;
	}
	b = alloc(512);
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
	var i = "iééééééééééééééééééééééééééééé";
	println(from_int(bytesRead));
	println(offset);
	if (bytesRead === 512) {
/*
		var n = 511;
		buffer[offset - 1] = 0;
		if (buffer[offset+n] >= 0xC0) {
			buffer[offset+n-512] = buffer[offset+n];
			n--;
		} else if (buffer[offset+n] >= 0x80) {
			buffer[offset+n-512] = buffer[offset+n];
			n--;
			while (n > 500 &&
				buffer[offset+n] < 0xC0 && 
				buffer[offset+n] >= 0x80) 
			{
				buffer[offset+n-512] = buffer[offset+n];
				n--;
			}
			buffer[offset+n-512] = buffer[offset+n];
			n--;
		}
*/
		println(to_string(bytesRead,buffer,offset));
		read_block(url, buffer, offset, position+1, cb);
		return;
	}
	println(to_string(bytesRead,buffer,offset));
	free(buffer);
}


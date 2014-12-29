function encode() {
	var ms = $("[name ='money']").val();
	var money = [parseInt(""+Math.floor(ms/10000), 16), parseInt(""+Math.floor(ms%10000/100), 16), parseInt(""+Math.floor(ms%100), 16)|0];
	
	var model = [parseInt($("[name='model']:checked").val())];
	
	var story = [parseInt($("[name='story']:checked").val(), 16)];
	
	var part1 = parseInt($("[name='part1']:checked").val());
	var part2 = parseInt($("[name='part2']:checked").val());
	var part3 = parseInt($("[name='part3']:checked").val());
	var ctr = parseInt($("[name='ctr']:checked").val());
	var pwr = parseInt($("[name='pwr']:checked").val());
	var heal = parseInt($("[name='heal']:checked").val());
	var spc1 = parseInt($("[name='spc1']:checked").val());
	var spc2 = parseInt($("[name='spc2']:checked").val());
	var parts = [spc2<<7 | spc1<<6 | part2<<3 | part1, pwr<<7 | heal<<6 | ctr<<3 | part3]
	
	var encoding = money.concat(model).concat(story).concat(parts);
	
	console.log("Encoding:")
	console.log(encoding);
	
	encrypt(encoding);
}

function swap(val) {
	return ((val&15)<<4) | ((val&240)>>4);
}

function encrypt(encoding) {
	var sum = 0;
	for (var i=0; i<7; i++) {
		console.log("Adding: " + (((encoding[i]&240)>>4) + (encoding[i]&15)));
		sum += ((encoding[i]&240)>>4) + (encoding[i]&15)
	}
	
	console.log("Nibble sum result:")
	console.log((sum&15)<<4);
	
	encoding.push((sum&15)<<4);

	var D = ((sum&15)<<4) | (sum&15);
	
	console.log("XOR value:");
	console.log(D);
	
	for (var i=0; i<7; i++) {
		encoding[i] = encoding[i]^D;
	}
	
	console.log("XOR result:");
	console.log(encoding);
	
	var result = [];
	var B = 0;
	
	result.push(encoding[0]>>3);
	B = (encoding[0]<<2) & 28;
	result.push((swap(encoding[1])>>2) & 3 | B);
	result.push((encoding[1]>>1) & 31);
	B = swap(encoding[1]) & 16;
	result.push(swap(encoding[2]) & 15 | B);
	B = (encoding[2]<<1) & 30;
	result.push((swap(encoding[3])>>3) & 1 | B);
	result.push((encoding[3]>>2) & 31);
	B = (encoding[3]<<3) & 24;
	result.push((swap(encoding[4])>>1) & 7 | B);
	result.push(encoding[4] & 31);
	result.push(encoding[5]>>3);
	B = (encoding[5]<<2) & 28;
	result.push((swap(encoding[6])>>2) & 3 | B);
	result.push((encoding[6]>>1) & 31);
	B = swap(encoding[6]) & 16;
	result.push(swap(encoding[7]) & 15 | B);
	
	/*
	XLoad $FFD4, shift right 3 times, store in $C248.
	XLoad $FFD4, shift left 2 times, AND 1C, store in B
	XLoad $FFD5, swap, shift right 2 times, AND 03, OR B,  store in $C249
	XLoad $FFD5, shift right, AND 1F, store in $C24A
	XLoad $FFD5, swap, AND 10, store in B
	XLoad $FFD6, swap, AND 0F, OR B, store in $C24B
	XLoad $FFD6, shift left, AND 1E, store in B
	XLoad $FFD7, swap, shift right 3 times, AND 01, OR B, store $C24C
	XLoad $FFD7, shift right 2 times, AND 1F, store in $C24D
	XLoad $FFD7, shift left 3 times, AND 18, store in B
	XLoad $FFD8, swap, shift right, AND 07, OR B, store in $C24E
	XLoad $FFD8, AND 1F, store in $C24F
	XLoad $FFD9, shift right 3 times, store in $C250
	XLoad $FFD9, shift left 2 times, AND 1C, store in B
	XLoad $FFDA, swap, shift right 2 times, AND 03, OR B, store in $C251
	XLoad $FFDA, shift right, AND 1F, store in $C252
	XLoad $FFDA, swap, AND 10, store in B
	XLoad $FFDB, swap, and 0F, OR B, store in $C253
	*/

	console.log("Result:");
	console.log(result);
	
	password(result);
}

function password(encryption) {
	var chars = "★BCDFGHJKLMNPQRSTVWXYZ0123456789";
	
	var pass = "Password is:\n\n";
	for (var i=0; i<12; i++) {
		pass += chars[encryption[i]];
		if ((i+1)%4 == 0)
			pass += "\n";
	}
	
	alert(pass);
}

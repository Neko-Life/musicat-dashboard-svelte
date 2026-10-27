function checkObject(o: object, dec: object) {
	for (const k in o) {
		const on = o[k as keyof typeof o];
		const ot = (dec as typeof o)[k as keyof typeof o];
		if (typeof on == 'object') {
			checkObject(on, ot);
			continue;
		}

		if (on !== ot) {
			console.error({ o, dec, on, ot });
			throw new TypeError('o and dec is not the same!');
		}
	}
}

export class WSProtocol {
	static encode(o: object): String {
		/*
          {
            test: "a",
            nest: {
              test: "b",
              testint: 1,
              testfloat: 1.5,
              testnull: null
              testtrue: true
              testfalse: false
            }
          }
            |
            V
          test=a;nest.test=b;nest.testint=1;nest.testfloat=1.5;testnull=0;testtrue=1;testfalse=0
          */

		for (const k in o) {
			const ok = o[k as keyof typeof o];
                        // !TODO
		}
	}

	static decode(s: String): object {}
}

export function testWSProtocol() {
	const o = {
		test: 'a',
		nest: {
			test: 'b',
			testint: 1,
			testfloat: 1.5,
			testnull: null,
			testtrue: true,
			testfalse: false
		}
	};
	const r =
		'test=a;nest.test=b;nest.testint=1;nest.testfloat=1.5;testnull=0;testtrue=1;testfalse=0';

	const enc = WSProtocol.encode(o);
	if (enc != r) {
		throw new Error('Test failed!');
	}

	const dec = WSProtocol.decode(enc);

	checkObject(o, dec);
}

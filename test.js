var spellcheck = require('./index.js');

var req = {};
req.body = {};
req.body.action = "get_incorrect_words";
req.body.text = ["Clikc","on","the","spellchecker","icn","above","to","check","the","pselling","of","this","text"];

spellcheck(req, function(result){
	if(result.outcome === 'success'){

		var testdata = [];
		var test = [];
		test.push('Clikc');
		test.push('icn');
		test.push('pselling');
		testdata.push(test);

		if(JSON.stringify(result.data) === JSON.stringify(testdata)){
			console.log("Very basic get_incorrect_words test passed");
		}
	}
});

req.body.action = "get_suggestions";
req.body.word = "iz";

spellcheck(req, function(result){
	var testdata = [ 'Oz', 'oz', 'ix', 'I', 'Z', 'i', 'z', 'AZ', 'is', 'Liz', 'biz', 'viz', 'wiz', 'IA', 'IE', 'Ia', 'Io', 'Ir', 'ii', 'CZ', 'Hz', 'ID', 'IL', 'IN', 'IQ', 'IT', 'IV', 'In', 'It', 'NZ', 'dz', 'id', 'if', 'in', 'it', 'iv', 'I\'s', 'I\'d', 'I\'m'];

	if(JSON.stringify(testdata) === JSON.stringify(result)){
		console.log("Very basic get_suggestions test passed");
	}
});

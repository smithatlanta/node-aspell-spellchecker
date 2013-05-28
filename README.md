node-aspell-spellchecker
========================

Node replacement for php required webservice for jquery-spellchecker

Requirements:

* aspell
* node v0.10.x
* jquery-spellchecker(https://github.com/badsyntax/jquery-spellchecker)
* express v3.2.x

How to install:

    npm install node-aspell-spellchecker

How to use:

Replace path in spellcheck instantiation:

    var spellchecker = new $.SpellChecker('textarea', {
			lang: 'en',
			parser: 'text',
			webservice: {
				path: '../../webservices/php/SpellChecker.php',
				driver: 'pspell'
			},
			suggestBox: {
				position: 'above'
			},
			incorrectWords: {
				container: '#incorrect-word-list'
			}
		});

With:

    var spellchecker = new $.SpellChecker('textarea', {
			lang: 'en',
			parser: 'text',
			webservice: {
				path: '../spellchecker',
				driver: 'pspell'
			},
			suggestBox: {
				position: 'above'
			},
			incorrectWords: {
				container: '#incorrect-word-list'
			}
		});

Add express route:

    app.post('/spellchecker', spellchecker);

Add spellcheck function call:

		var spellcheck = requires('node-aspell-spellchecker);
		function spellchecker(req, res)
		{
			spellcheck(req, function(data){
				res.json(data);
			});
		};

var spawn = require('child_process').spawn;
var underscore = require('underscore');

module.exports = function(req, callback){
	var language = req.body.lang;
    if(req.body.action === 'get_incorrect_words')
    {
        var unescapedwords = JSON.parse('["' + underscore.unescape(req.body.text) + '"]');
        words(unescapedwords, language, function(outcome, data, message){
            var out = {};
            out.outcome = outcome;
            out.data = data;
            if(outcome === 'fail'){
                out.message = message;
            }
            callback(out);
            return;
        });
    }

    if(req.body.action === 'get_suggestions')
    {
        suggestions(req.body.word, language, function(data){
            callback(data);
            return;
        });
    }
};

function suggestions(word, language, callback)
{
    var message = '';
    var words = [];
    var cnt = 0;
    words.push(word);

    var proc1 = spawn('/bin/echo', words);
    var proc2 = spawn('aspell', ['-a', '--lang=' + language, '--encoding=utf-8', '--sug-mode=normal']);

    proc1.stdout.on('data', function (data) {
        proc2.stdin.write(data);
    });

    proc1.stderr.on('data', function (data) {
        message = data;
    });

    proc1.on('close', function (code) {
        if (code !== 0) {
            message = 'echo process exited with code ' + code;
        }

        proc2.stdin.end();
    });


    proc2.stdout.on('data', function (data) {
        var res = data.toString().replace(/ /g,'').replace(/(\r\n|\n|\r)/gm,"");
        cnt++;
        if(cnt === 2){
            var a = res.split(':');
            var b = a[1].split(',');
            callback(b);
        }
    });

    proc2.stderr.on('data', function (data) {
        message = 'aspell stderr: ' + data;
    });

    proc2.on('error', function (code) {
        if (code !== 'spawn ENOENT') {
            console.log('Please install aspell.');
        }
        else{
            message = 'aspell process exited with code ' + code;
        }
    });

    proc2.on('close', function (code) {
        if (code !== 0) {
            message = 'aspell process exited with code ' + code;
        }

        if(message !== undefined){
            console.log(message);
        }
    });
}

function words(words, language, callback)
{
    var res = '';
    var message = '';
    var proc1 = spawn('/bin/echo', words);
    var proc2 = spawn('aspell', ['--lang=' + language, '--encoding=utf-8', 'list']);
		var outcome;

    proc1.stdout.on('data', function (data) {
        proc2.stdin.write(data);
    });

    proc1.stderr.on('data', function (data) {
        message = data;
    });

    proc1.on('close', function (code) {
        if (code !== 0) {
            message = 'echo process exited with code ' + code;
        }
        proc2.stdin.end();
    });


    proc2.stdout.on('data', function (data) {
        res = data.toString();
    });

    proc2.stderr.on('data', function (data) {
        message = 'aspell stderr: ' + data;
    });

    proc2.on('close', function (code) {
        if (code !== 0) {
            message = 'aspell process exited with code ' + code;
        }

        if(message === ""){
            outcome = 'success';
        }
        else{
            outcome = 'fail';
        }

        // if we have no misspelled words, we send back an empty array inside of array
        var data =[];
        if(res === undefined){
            var z = [];
            data.push(z);
        }
        else // we send back the array of misspelled words in the array
        {
            var x = res.split('\n');
            x.pop();
            data.push(x);
        }

        callback(outcome, data, message);
    });
}

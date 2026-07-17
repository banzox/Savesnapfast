const fs = require('fs');

function readAndPrint(filename) {
    if (!fs.existsSync(filename)) {
        console.log(`=== File ${filename} does not exist ===`);
        return;
    }
    const buf = fs.readFileSync(filename);
    // Detect if it is UTF-16LE
    let content = '';
    if (buf[0] === 0xff && buf[1] === 0xfe) {
        content = buf.toString('utf16le');
    } else {
        content = buf.toString('utf8');
    }
    console.log(`=== Content of ${filename} ===`);
    console.log(content.substring(0, 2000));
}

readAndPrint('build_log.txt');
readAndPrint('check_errors.txt');
readAndPrint('build.log');

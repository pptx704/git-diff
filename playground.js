const fs = require('fs');
const path = require('path');


// Read the contents of the directory
fs.readdir("./git-repos", (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Filter out subdirectories (if needed)
    const fileList = files.filter((file) => {
        return fs.statSync(path.join('./git-repos', file)).isFile();
    });

    console.log('Files in the directory:');
    fileList.forEach((file) => {
        console.log(file);
    });
});
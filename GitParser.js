const gitDiffParser = require('gitdiff-parser');

const fs = require('fs')
function readFile(path) {
    return fs.readFileSync(path, 'utf8');
}

const gitDiffText = readFile('/Users/fedorkrasilnikov/Desktop/git-diff/file.txt')

gitDiffParser.parse(gitDiffText)

console.log(gitDiffParser.parse(gitDiffText).map(entry => entry.hunks.map(entry => entry.changes.toString())));

import 'repository/RepositoryOps.js'

getBranches()
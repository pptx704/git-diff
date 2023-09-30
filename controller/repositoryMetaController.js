const repositoryOps = module.require('../repository/RepositoryOps')

const express = require('express');
const app = express();
const port = 3000;

const repoPath = 'git-repos/casey'

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/branches', async (req, res) => {
    let branches = await repositoryOps.getBranches(repoPath)
    res.json(branches);
});

app.get('/commits', async (req, res) => {
    let commits = await repositoryOps.getCommits(repoPath, req.query.branch)
    res.json(commits);
});
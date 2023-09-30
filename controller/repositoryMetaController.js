const repositoryOps = module.require('../repository/RepositoryOps')
const cors = module.require('cors')

const express = require('express');
const app = express();

app.use(cors());
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

app.get('/diff', async (req, res) => {
    let originalHash = req.query.original
    let updatedHash = req.query.updated
    let commits = await repositoryOps.getDiff(repoPath, originalHash, updatedHash)
    res.json(commits);
});
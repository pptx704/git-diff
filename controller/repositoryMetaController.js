const repositoryOps = module.require('../repository/RepositoryOps')
const cors = module.require('cors')

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
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
    try {
        let originalHash = req.query.originalHash
        let updatedHash = req.query.updatedHash
        let rawDiff = await repositoryOps.getRawDiff(repoPath, originalHash, updatedHash)
        res.json({rawDiff: rawDiff});
    } catch (error) {
        console.error("Error: ${error}");
    }
});

app.get('/repositories', async (req, res) => {
    let repositories = await repositoryOps.getAvailableRepositories()
    res.json(repositories);
});

app.post('/repository', async (req, res) => {
    // log the request body
    // console.log(req.body.url)
    let repository = req.body.url

    // clone the repository into the git-repos folder
    let result = await repositoryOps.cloneRepository(repository)
    res.json({ message: result })
});
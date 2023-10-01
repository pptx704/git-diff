const repositoryOps = module.require('../repository/RepositoryOps')
const cors = module.require('cors')

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());
const port = 3000;

const repoPath = 'git-repos/'

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/branches', async (req, res) => {
    try {
        let repoName = req.query.repoName ? req.query.repoName : "casey"
        let branches = await repositoryOps.getBranches(repoPath + repoName)
        res.json(branches);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});

app.get('/commits', async (req, res) => {
    try {
        let repoName = req.query.repoName ? req.query.repoName : "casey"
        let commits = await repositoryOps.getCommits(repoPath + repoName, req.query.branch)
        res.json(commits);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});

app.get('/diff', async (req, res) => {
    try {
        let repoName = req.query.repoName ? req.query.repoName : "casey"
        let originalHash = req.query.originalHash
        let updatedHash = req.query.updatedHash
        let rawDiff = await repositoryOps.getRawDiff(repoPath + repoName, originalHash, updatedHash)
        res.json({rawDiff: rawDiff});
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});

app.get('/files', async (req, res) => {
    try {
        let repoName = req.query.repoName ? req.query.repoName : "casey"
        let originalHash = req.query.originalHash
        let updatedHash = req.query.updatedHash
        let files = await repositoryOps.getFilePaths(repoPath + repoName, originalHash, updatedHash)
        res.json(files);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});

app.get('/filediff', async (req, res) => {
    try {
        let repoName = req.query.repoName ? req.query.repoName : "casey"
        let originalHash = req.query.originalHash
        let updatedHash = req.query.updatedHash
        let filePath = req.query.filePath
        let rawDiff = await repositoryOps.getFileDiff(repoPath + repoName, originalHash, updatedHash, filePath)
        res.json({rawDiff: rawDiff});
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});

app.get('/listdiff', async (req, res) => {
    try {
        let repoName = req.query.repoName ? req.query.repoName : "casey"
        let originalHash = req.query.originalHash
        let updatedHash = req.query.updatedHash
        let rawDiff = await repositoryOps.getListDiff(repoPath + repoName, originalHash, updatedHash)
        res.json({rawDiff: rawDiff});
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});

app.get('/repositories', async (req, res) => {
    try {
        let repositories = await repositoryOps.getAvailableRepositories()
        res.json(repositories);
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});

app.post('/repository', async (req, res) => {
    try {
        // log the request body
        // console.log(req.body.url)
        let repository = req.body.url

        // clone the repository into the git-repos folder
        let result = await repositoryOps.cloneRepository(repository)
        res.json({message: result})
    } catch (error) {
        console.error(`Error: ${error}`);
    }
});

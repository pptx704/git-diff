let Git = require("nodegit");

function getBranches(repoPath) {
    return Git.Repository.open(repoPath)
        .then(repo => {
            return repo.getReferenceNames(Git.Reference.TYPE.ALL);
        })
        .then(branchNames => {
            const branchRefs = branchNames.filter(name => name.startsWith('refs/heads/'));
            branchNames = branchRefs.map(ref => ref.replace('refs/heads/', ''));
            return branchNames
        })
        .catch(err => {
            console.error('Error:', err);
        });
}

async function getCommits(repoPath, branchName) {
    let repo = await Git.Repository.open(repositoryPath);
    const branch = await repo.getBranch(branchName);
    const history = await branch.history();
    history.start();

}

module.exports = { getBranches }

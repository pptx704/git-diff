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
    const commitsList = [];
    try {
        let repo = await Git.Repository.open(repoPath);
        let revwalk = Git.Revwalk.create(repo);
        revwalk.sorting(Git.Revwalk.SORT.TOPOLOGICAL);
        let branch = await repo.getBranch(branchName);
        revwalk.pushRef(branch.name());

        let commit;

        while ((commit = await revwalk.next()) !== null) {
            const commitObj = await repo.getCommit(commit);
            commitsList.push({
                sha: commitObj.sha(),
                message: commitObj.message(),
            });
        }
        return commitsList
    } catch (error) {
        console.error(`Error: ${error}`);
    }
    return commitsList;
}

module.exports = { getBranches, getCommits }

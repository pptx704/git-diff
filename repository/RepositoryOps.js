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
    try {
        let repo = await Git.Repository.open(repoPath)
        let revwalk = Git.Revwalk.create(repo);
        revwalk.sorting(Git.Revwalk.SORT.TOPOLOGICAL);
        let branch = await repo.getBranch(branchName);
        revwalk.pushRef(branch.name());
        const commitsList = [];
        let commit = revwalk.next();

        while (!commit.done) {
            const commitObj = await repo.getCommit(commit);
            // commitsList.push({
            //     sha: commitObj.sha(),
            //     date: commitObj.date(),
            //     message: commitObj.message(),
            // });
            console.log({
                sha: commitObj.sha(),
                date: commitObj.date(),
                message: commitObj.message(),
            });
            commit = revwalk.next();
        }
        return commitsList
    } catch (error) {
        console.error(`Error: ${error}`);
        return [];
    }
}

module.exports = { getBranches }

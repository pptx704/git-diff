const Git = require("nodegit");
const execSync = require('child_process').execSync;

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

async function cloneRepository(url) {
    // get the name of the repository
    let repoName = url.split('/').pop().split('.')[0]
    try {
        let repo = await Git.Clone(url, 'git-repos/' + repoName);
        return repo
    } catch (error) {
        console.error(`Error: ${error}`);
    }
}

async function getRawDiff(repoPath, originalHash, updatedHash) {
    let command = `cd ${repoPath} && git diff ${originalHash} ${updatedHash}`
    console.log(command)
    return execSync(command, { encoding: 'utf-8' });
}


// async function getDiff(repoPath, original, updated) {
//     let repo = await Git.Repository.open(repoPath);
//     let originalCommit = await repo.getCommit(original);
//     let updatedCommit = await repo.getCommit(updated);
//
//     const fromTree = await originalCommit.getTree();
//     const toTree = await updatedCommit.getTree();
//
//     const diff = await toTree.diff(fromTree);
//     const patches
// }

module.exports = { getBranches, getCommits, cloneRepository, getRawDiff}
//
// let Git = require("nodegit");
//
// repository = await Git.Repository.open('git-repos/casey');
// let commitA = await repository.getCommit('851bab3db71f8d1b6dd45e12e75b4e6bbc103439')
// let commitB = await repository.getCommit('40a3cb04e7487bfce47c7e2e0d0017627f764c7f')
//
// const fromTree = await commitA.getTree();
// const toTree = await commitB.getTree();
//
// const diff = await toTree.diff(fromTree);
// patches = await diff.patches()
// patches.forEach(async (patch) => {
//     console.log((await patch).);
// });
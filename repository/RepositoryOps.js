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

async function getListDiff(repoPath, originalHash, updatedHash) {
    let command = `cd ${repoPath} && git diff ${originalHash} ${updatedHash}`
    console.log(command)
    let rawdiff = execSync(command, { encoding: 'utf-8' });
    // split the rawdiff into array. `diff --git`.
    let diffArray = rawdiff.split('diff --git')
    // keep the `diff --git` in each element of the array
    diffArray = diffArray.map((diff) => 'diff --git' + diff)
    // remove the first element of the array which is an empty string
    return diffArray.slice(1)
}

async function getFileDiff(repoPath, originalHash, updatedHash, fileName) {
    // get the list diff
    let listDiff = await getListDiff(repoPath, originalHash, updatedHash)
    // find the diff that contains the fileName
    let diff = listDiff.find((diff) => diff.includes(fileName))
    console.log(fileName)
    // return the diff
    return diff
}

async function getFilePaths(repoPath, originalHash, updatedHash){
    // get the list diff
    let listDiff = await getListDiff(repoPath, originalHash, updatedHash)
    // get the file paths
    let filePaths = listDiff.map((diff) => {
        let filePath = diff.split('b/')[1].split(' ')[0]
        // split the file path by the new line character and keep the first element
        filePath = filePath.split('\n')[0]
        return filePath
    })
    // return the file paths
    return filePaths
}

async function getAvailableRepositories() {
    let command = `cd git-repos && ls`
    // get the name of those repositories in the git-repos folder
    let data = execSync(command, { encoding: 'utf-8' });
    // strip the newline character from the end of the string
    data = data.replace(/\n$/, "");
    // split the string into an array
    return data.split('\n')
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

module.exports = { getBranches, getCommits, cloneRepository, getRawDiff, getAvailableRepositories, getListDiff, getFileDiff, getFilePaths}
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
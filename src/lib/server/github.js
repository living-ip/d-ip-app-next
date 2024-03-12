import {Octokit} from '@octokit/rest';
import prisma from "@/lib/server/prisma";


const githubToken = "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";
const octokit = new Octokit({
        auth: githubToken
})


export const getRepoPulls = async (owner, repo) => {
    // Octokit doesn't provide a 'listRullRequests()'!
    // https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28#list-pull-requests
    // So instead we have to use the 'request()' method
    // TODO: update if Occtokit gets less lame
    const response = await octokit.request(`GET /repos/${owner}/${repo}/pulls`, {
        owner: 'OWNER',
        repo: 'REPO',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
            'accept': 'application/vnd.github+json'
        },
        // By default this only shows open PRs
        state: 'open',
    });

    if (response.status !== 200) {
        throw new Error(`Bad response from GitHub: ${response.status}`);
    }

    if (!response.data.length) {
        console.log(`Oh no! No pull requests found!`);
        return [];
    }
    return response.data;
}

export const getPullRequestData = async (owner, repo, pullNumber) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/pulls/${pullNumber}`, {
        owner: 'OWNER',
        repo: 'REPO',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
        pull_number: 'PULL_NUMBER',
    });

    if (response.status !== 200) {
        throw new Error(`Bad response from GitHub: ${response.status}`);
    }

    if (!response.data) {
        console.log(`Not found oof.`);
        return {};
    }

    const diffData = await octokit.request(`GET /repos/${owner}/${repo}/pulls/${pullNumber}.diff`, {
        owner: 'OWNER',
        repo: 'REPO',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
            'accept': 'application/vnd.github.diff'
        },
        pull_number: 'PULL_NUMBER',
    });

    if (diffData.status !== 200) {
        throw new Error(`Bad response from GitHub: ${diffData.status}`);
    }
    return {
        response: response.data,
        diffData: diffData.data
    }
}

export const getRepoTree = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/git/trees/main`, {
        owner: 'OWNER',
        repo: 'REPO',
        tree_sha: 'TREE_SHA',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
}

export const getBlob = async (owner, repo, sha) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/git/blobs/${sha}`, {
        owner: 'OWNER',
        repo: 'REPO',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return content;
}

const titleize = (slug) => {
    const words = slug.split('-');
    return words
        .map((word, index, arr) => {
            if (index === 0 && !isNaN(word) && index < arr.length - 1) {
                // If the word is a number and it's not the last word
                return word + ' -';
            } else {
                return word.charAt(0).toUpperCase() + word.slice(1)
            }
        })
        .join(' ');
}

export const getRepoTreeRecursive = async (owner, repo) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/git/trees/main?recursive=1`, {
        owner: 'OWNER',
        repo: 'REPO',
        tree_sha: 'TREE_SHA',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
    const blobs = response.data.tree.filter(item => item.type === "blob" && item.path.endsWith(".md") && item.path !== "README.md" && item.path !== "SUMMARY.md");
    // Grouping by chapter
    const chapters = [];

    blobs.forEach(blob => {
        const parts = blob.path.split('/');
        if (parts.length === 2) { // Ensure the format is 'chapter/section'
            const title = titleize(parts[0]);
            let chapterObj = chapters.find(chap => chap.title === title);

            if (!chapterObj) {
                chapterObj = {
                    title,
                    sections: []
                };
                chapters.push(chapterObj);
            }

            chapterObj.sections.push({
                title: titleize(parts[1].replace('.md', '')),
                sha: blob.sha,
                url: blob.url,
                path: blob.path
            });
        }
    });
    console.log(JSON.stringify(chapters));
    const firstPage = await getBlob(owner, repo, chapters[0].sections[0].sha);
    return {
        chapters,
        firstPage
    };
}

export const getBookChapters = async (owner, repo, chaptersFile) => {
    const response = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/${chaptersFile}`)
    const chapters = await response.json()
    const pageResponse = await fetch(chapters[0].sections[0].url)
    const firstPage = await pageResponse.text()
    return {
        chapters,
        firstPage
    }
}

export const getGithubContents = async (owner, repo, path, ref) => {
    const response = await octokit.request(`GET /repos/${owner}/${repo}/contents/${path}?ref=${ref}`, {
        owner: 'OWNER',
        repo: 'REPO',
        path: 'PATH',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    })
    console.log(JSON.stringify(response))
    return response.data;
}

export const updateGithubFile = async (doc, change, content) => {
    const response = await octokit.request(`PUT /repos/${doc.owner}/${doc.repo}/contents/${change.lastEditFilePath}`, {
        owner: 'OWNER',
        repo: 'REPO',
        path: 'PATH',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
        branch: change.branchName,
        sha: change.lastEditFileSha,
        message: "Change from Decentralized IP App",
        content: content
    })
    return response
}

const getDefaultBranch = async (owner, repo) => {
    const { data } = await octokit.repos.get({ owner, repo });
    return data.default_branch;
}

const getLatestCommit = async (owner, repo, branch) => {
    const { data } = await octokit.repos.getBranch({ owner, repo, branch });
    return data.commit.sha;
}

const createBranch = async (owner, repo, newBranch, sha) => {
    await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${newBranch}`,
        sha
    });
}

const createBlob = async (owner, repo, content) => {
    const { data } = await octokit.git.createBlob({
        owner,
        repo,
        content,
        encoding: 'utf-8'
    });
    return data.sha;
}

const createTree = async (owner, repo, baseTreeSha, path, blobSha) => {
    const { data } = await octokit.git.createTree({
      owner,
      repo,
      base_tree: baseTreeSha,
      tree: [{ path, mode: '100644', type: 'blob', sha: blobSha }]
    });
    return data.sha;
}

const createCommit = async (owner, repo, message, treeSha, parentCommitSha) => {
    const { data } = await octokit.git.createCommit({
        owner,
        repo,
        message,
        tree: treeSha,
        parents: [parentCommitSha]
    });
    return data.sha;
}

const updateBranch = async (owner, repo, branch, commitSha) => {
    await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: commitSha
    });
}

const createPR = async (owner, repo, title, head, base) => {
    const { data } = await octokit.pulls.create({
        owner,
        repo,
        title,
        head,
        base,
    });
    return data.number;
}

export const createDraftPullRequest = async (owner, repo, title, newBranch) => {
    const defaultBranch = await getDefaultBranch(owner, repo);
    const latestCommit = await getLatestCommit(owner, repo, defaultBranch);
    await createBranch(owner, repo, newBranch, latestCommit);
    const blobSha = await createBlob(owner, repo, "");
    const treeSha = await createTree(owner, repo, latestCommit, `.${owner}`, blobSha);
    const commitSha = await createCommit(owner, repo, "init", treeSha, latestCommit);
    await updateBranch(owner, repo, newBranch, commitSha);
    const prNumber = await createPR(owner, repo, title, newBranch, defaultBranch);
    return prNumber;
}

export const mergePullRequest = async (owner, repo, prNumber) => {
    const { data } = await octokit.pulls.merge({
        owner,
        repo,
        pull_number: prNumber,
    });
    return data;
}

export const closePullRequest = async (owner, repo, prNumber) => {
    const { data } = await octokit.pulls.update({
        owner,
        repo,
        pull_number: prNumber,
        state: "closed",
    });
    return data;
}

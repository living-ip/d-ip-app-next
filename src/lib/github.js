import {Octokit} from '@octokit/rest';
import prisma from "@/lib/prisma";

export const getRepoPulls = async (owner, repo, authToken) => {
    const octokit = new Octokit({
        auth: authToken
    })
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
        state: 'all',
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

export const getPullRequestData = async (owner, repo, pullNumber, authToken) => {
    const octokit = new Octokit({
        auth: authToken
    })
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

export const getRepoTree = async (owner, repo, authToken) => {
    const octokit = new Octokit({
        auth: authToken
    })
    const response = await octokit.request(`GET /repos/${owner}/${repo}/git/trees/main`, {
        owner: 'OWNER',
        repo: 'REPO',
        tree_sha: 'TREE_SHA',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        },
    });
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

export const getGithubContents = async (owner, repo, path, ref, authToken) => {
    const octokit = new Octokit({
        auth: authToken
    })
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

export const updateGithubFile = async (doc, change, content, authToken) => {
    const octokit = new Octokit({
        auth: authToken
    })
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
    // TODO update Change with new sha hash.
    const dbResponse = await prisma.Change.update({
        where: {
            cid: change.cid
        },
        data: {
            lastEditFileSha: response.data.content.sha
        }
    })
    console.log(dbResponse)
    return response
}
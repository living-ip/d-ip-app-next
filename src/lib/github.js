import {Octokit} from '@octokit/rest';

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
        response,
        diffData
    }
}
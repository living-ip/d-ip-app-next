import {Octokit} from '@octokit/rest';

const HEADERS = {
    'X-GitHub-Api-Version': '2022-11-28',
    'accept': 'application/vnd.github+json'
};

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
        headers: HEADERS,
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
const client_id = "Ov23liZuknYEJtToPGqQ"

export function GithubLink() {
    const redirect_uri = window.location.origin + "/github/link"
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user:email`;
}

export function GithubAuth() {
    const redirect_uri = window.location.origin + "/auth/github"
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=user:email`;
}
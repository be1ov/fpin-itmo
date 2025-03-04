import requests

client_id = "Ov23liZuknYEJtToPGqQ"
client_secret = "d63bc105dee7777dbe6a2827ddf6ebac6e2e3668"

def get_access_token(code):
    token_url = 'https://github.com/login/oauth/access_token'
    headers = {'Accept': 'application/json'}
    data = {
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
    }
    response = requests.post(token_url, headers=headers, data=data)
    access_token = response.json().get('access_token')

    if not access_token:
        raise Exception('Failed to get access token')
    return access_token

def get_user_data(access_token):
    user_data_url = 'https://api.github.com/user'
    headers = {'Authorization': f'token {access_token}'}
    response = requests.get(user_data_url, headers=headers)
    user_data = response.json()
    return user_data
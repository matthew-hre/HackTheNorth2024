import requests
import json

def endpoint(endpoint: str) -> str:
    return f"https://api.massive.app/v1/{endpoint}"


password = "HackTheNorthPassword1029!"
email = 'bringolfj@gmail.com'
API_KEY = "r5ebKFg6W1!.0zuk8l@aRdn=M29ftoLB/mw7Dci4IUTv3}SO[-Zqj]xPy(YENAHQ"

# curl -d '{"email": "$EMAIL_ADDRESS", "password": "$PASSWORD"}' \
#  -H 'Content-Type: application/json' \
#  -s -X POST https://api.massive.app/v1/auth
# teamId =
response = requests.post(
    endpoint('auth'),
    data=json.dumps({'email': email, 'password': password}),
    headers={'Content-Type': 'application/json'}
)
print(response.json())
print(response.status_code)

token = response.json()['token']
teamId = response.json()['teams'][0]['id']

print(token)
print(teamId)

requests(
    endpoint(f'teams/{teamId}/packages'),
    headers={'X-API-KEY': API_KEY, 'Content-Type': 'application/json'},
    data=json.dumps({'description': 'test', 'name': 'test', 'recipients': [email]})
)

 curl -d "{\"access_limit\":$ACCESS_LIMIT, \"description\":\"$DESCRIPTION\", \"name\":\"$NAME\", \"password\": \"$PASSWORD\", \"recipients\":[\"$RECIPIENT_EMAIL\"]}" \
  -H "X-API-KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -s -X POST https://api.massive.app/v1/teams/$TEAM_ID/packages
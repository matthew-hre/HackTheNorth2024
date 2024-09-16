import requests
import json

from argparse import ArgumentParser

def main(upload_root: str, package_name: str) -> None:
    # Simplify Endpoints
    def endpoint(endpoint: str) -> str:
        return f'https://api.massive.app/v1/{endpoint}'

    email = 'bringolfj@gmail.com'
    password = 'HackTheNorthPassword1029!'
    API_KEY = "wW*4u9_NrOZKQXGJ5HnFeB#vyz3![8gf2):AM0scPhl?U76kSt~iDbqp(RdET1Im"

    # Get JWT and team ID for future requests
    response = requests.post(
        endpoint('auth'), 
        data=json.dumps({"email": email, "password": password}), 
        headers={"Content-Type": "application/json"})
    json_obj = response.json()

    if response.status_code != 200:
        print("Failed to authenticate")
        print(response.json())
        return

    token = json_obj['token']
    team_id = json_obj['teams'][0]['id']
    portal_id = "1793314271"

    response = requests.post(
        
        endpoint(f'teams/{team_id}/portals'),
        data={'description': package_name, 'name': package_name, 'recipients': [email]},
        headers={
            'X-Auth-Token': API_KEY,
            'Content-Type': 'application/json'
        }
    )
    print(response.json())

    


if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument('root', type=str)
    parser.add_argument('package_name', type=str)
    args = parser.parse_args()

    main(args.root, args.package_name)
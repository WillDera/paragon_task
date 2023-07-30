import os
from dotenv import load_dotenv
import json
import requests
import glob

load_dotenv()

# # insitalize SDK
contract_addresses = [
    "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
    "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270",
]


def make_request(url, params):
    headers = {
        "Content-Type": "application/json",
        "X-API-KEY": os.environ["transpose_key"],
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to make request: {response.status_code}")
        return None


def save_to_json(data, filename):
    with open(filename, "w") as json_file:
        json.dump(data, json_file)


# Extract all NFTs by contract address
c_url = "https://api.transpose.io/nft/nfts-by-contract-address"
for address in contract_addresses:
    params = {
        "chain_id": "ethereum",
        "contract_address": address,
        "limit": 200,
    }

    response_data = make_request(c_url, params)
    if response_data:
        directory = "nfts_list"
        if not os.path.exists(directory):
            os.makedirs(directory)
        output_file = os.path.join(directory, f"nfts-{address}.json")
        save_to_json(response_data, output_file)
        print("Data saved to JSON file successfully.")

# # Extract NFT Owners by Contract address
o_url = "https://api.transpose.io/nft/owners-by-contract-address"
for address in contract_addresses:
    params = {
        "chain_id": "ethereum",
        "contract_address": address,
        "limit": 200,
    }
    response_data = make_request(o_url, params)
    if response_data:
        directory = "nft_owners"
        if not os.path.exists(directory):
            os.makedirs(directory)
        output_file = os.path.join(directory, f"nfts-{address}.json")
        save_to_json(response_data, output_file)
        print("Data saved to JSON file successfully.")

## Extract 10,000 NFT sales
# get a list of folders
folders = ["nfts_list"]

# Loop through each folder and find a file with the desired_text in its name
matching_files = []
for folder in folders:
    for contract_address in contract_addresses:
        folder_path = os.path.join(os.getcwd(), folder)
        files_in_folder = glob.glob(os.path.join(folder_path, f"*{contract_address}*"))
        if len(files_in_folder) > 0:
            matching_files.append(files_in_folder[0])

# If no matching file found in any folder, exit the script
if len(matching_files) == 0:
    print("No matching files found!")
    exit()


# Read data from the three json files for 0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270
def read_json_file(file_path):
    with open(file_path, "r") as file:
        return json.load(file)


for file, contract_address in zip(matching_files, contract_addresses):
    nfts_data = read_json_file(file)
    all_responses = []
    directory = "sales/"

    for entry in nfts_data["results"]:
        token_id = entry["token_id"]
        params = {
            "chain_id": "ethereum",
            "contract_address": contract_address,
            "token_id": token_id,
            "order": "asc",
            "limit": 50,
        }

        s_url = "https://api.transpose.io/nft/sales-by-token-id"
        response_data = make_request(s_url, params)

        if response_data["stats"]["count"] > 0:
            all_responses.append(response_data["results"])

    output_file = os.path.join(directory, f"sales-{contract_address}.json")
    save_to_json(all_responses, output_file)
    print("Data saved to JSON file successfully.")

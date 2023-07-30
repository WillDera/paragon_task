import os
import glob
import json
import psycopg2
from datetime import datetime


# Function to check if the database exists
def check_database_exists(host, database, user, password):
    try:
        conn = psycopg2.connect(
            host=host, database=database, user=user, password=password
        )
        conn.close()
        return True
    except psycopg2.OperationalError:
        return False


host = "localhost"
database = "paragon_task"
user = "postgres"
password = "postgres"

"""
Each contract would have its own table, this is to avoid data conflicts
"""
# Check if the database exists
if not check_database_exists(host, database, user, password):
    # Connect to the default "postgres" database
    conn = psycopg2.connect(
        host=host, database="postgres", user=user, password=password
    )

    # Create the target database
    conn.autocommit = True
    with conn.cursor() as cursor:
        cursor.execute(f"CREATE DATABASE {database}")

    conn.close()

conn = psycopg2.connect(
    host=host,
    database=database,
    user=user,
    password=password,
)

cursor = conn.cursor()


# Read data from the three json files for 0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270
def read_json_file(file_path):
    with open(file_path, "r") as file:
        return json.load(file)


# get a list of folders
folders = ["nft_owners", "nfts_list", "sales"]

# desired text to match in filename
desired_texts = [
    "0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
    "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
    "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270",
]

for desired_text in desired_texts:
    # Loop through each folder and find a file with the desired_text in its name
    matching_files = []
    for folder in folders:
        folder_path = os.path.join(os.getcwd(), folder)
        files_in_folder = glob.glob(os.path.join(folder_path, f"*{desired_text}*"))
        if len(files_in_folder) > 0:
            matching_files.append(files_in_folder[0])

    # If no matching file found in any folder, exit the script
    if len(matching_files) == 0:
        print(f"No matching files found for {desired_text}!")
        exit()

    # Assuming there is only one matching file in each folder, read their data
    owner_data = read_json_file(matching_files[0])
    nfts_data = read_json_file(matching_files[1])
    sales_data = read_json_file(matching_files[2])

    name = nfts_data["results"][0]["name"]
    if name is None:
        table_name = "Bored_Ape_Yacht_Club"
    else:
        table_name = nfts_data["results"][0]["name"].split()[0]

    """
        Pack owner and nfts data into one
        Create a table from NFT name
        Insert data into table
    """
    for owner, nft in zip(owner_data["results"], nfts_data["results"]):
        cursor.execute(
            f"""
            CREATE TABLE IF NOT EXISTS {table_name}_nft_info (
                info_id SERIAL PRIMARY KEY,
                contract_address VARCHAR(50), 
                token_id INT UNIQUE, 
                owner_address VARCHAR(50), 
                metadata_url VARCHAR(255), 
                external_url VARCHAR(255)
            )

            """
        )
        if (
            # entry_a["contract_address"] == entry_b["contract_address"]
            owner["token_id"]
            == nft["token_id"]
            # and entry_a["contract_address"] == entry_c["contract_address"]
        ):
            combined_entry = {
                "contract_address": owner["contract_address"],
                "token_id": owner["token_id"],
                "owner_address": owner["owner"],
                "metadata_url": nft["metadata_url"],
                "properties": nft["properties"],
                "external_url": nft["external_url"],
            }

            # Insert the data into the paragon_task table
            cursor.execute(
                f"""
                INSERT INTO {table_name}_nft_info (
                    contract_address, 
                    token_id, 
                    owner_address, 
                    metadata_url, 
                    external_url
                ) VALUES (%s, %s, %s, %s, %s) ON CONFLICT DO NOTHING""",
                (
                    combined_entry["contract_address"],
                    combined_entry["token_id"],
                    combined_entry["owner_address"],
                    combined_entry["metadata_url"],
                    combined_entry["external_url"],
                ),
            )

    for sale_entry in sales_data:
        for sale in sale_entry:
            cursor.execute(
                f"""
                CREATE TABLE IF NOT EXISTS {table_name}_sale_info (
                    sale_id SERIAL PRIMARY KEY,
                    contract_address VARCHAR(50), 
                    token_id INT, 
                    transaction_hash VARCHAR(255),
                    timestamp TIMESTAMP,
                    exchange_name VARCHAR(100),
                    contract_version VARCHAR(100),
                    quantity INT,
                    eth_price REAL,
                    usd_price REAL,
                    buyer VARCHAR(50),
                    seller VARCHAR(50),
                    royalty_fee INT,
                    platform_fee INT,
                    FOREIGN KEY (token_id) REFERENCES {table_name}_nft_info (token_id) ON DELETE CASCADE
                )

                """
            )

            combined_entry = {
                "contract_address": sale["contract_address"],
                "token_id": sale["token_id"],
                "transaction_hash": sale["transaction_hash"],
                "timestamp": datetime.fromisoformat(
                    sale["timestamp"].replace("Z", "+00:00")
                ),
                "exchange_name": sale["exchange_name"],
                "contract_version": sale["contract_version"],
                "quantity": sale["quantity"],
                "eth_price": sale["eth_price"],
                "usd_price": sale["usd_price"],
                "buyer": sale["buyer"],
                "seller": sale["seller"],
                "royalty_fee": sale["royalty_fee"],
                "platform_fee": sale["platform_fee"],
            }

            # Insert the data into the paragon_task table
            cursor.execute(
                f"""
                INSERT INTO {table_name}_sale_info (
                    contract_address, 
                    token_id, 
                    transaction_hash,
                    timestamp,
                    exchange_name,
                    contract_version,
                    quantity,
                    eth_price,
                    usd_price,
                    buyer,
                    seller,
                    royalty_fee,
                    platform_fee
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    combined_entry["contract_address"],
                    combined_entry["token_id"],
                    combined_entry["transaction_hash"],
                    combined_entry["timestamp"],
                    combined_entry["exchange_name"],
                    combined_entry["contract_version"],
                    combined_entry["quantity"],
                    combined_entry["eth_price"],
                    combined_entry["usd_price"],
                    combined_entry["buyer"],
                    combined_entry["seller"],
                    combined_entry["royalty_fee"],
                    combined_entry["platform_fee"],
                ),
            )


# Commit changes to the database
conn.commit()

# Close the cursor and connection
cursor.close()
conn.close()

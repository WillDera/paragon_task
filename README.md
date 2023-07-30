# Backend Engineering Task : Analysing an Existing NFT Collection

### Postman Documentation: [HERE](https://documenter.getpostman.com/view/21354552/2s9XxtxEtf)

### Backend API URL: [https://paragon-task.vercel.app/api/](https://paragon-task.vercel.app/api/)

## Architecture

- NestJS: NestJs is a framework for building scalable Node.js applications. It makes use of Express under the hood and strongly follows Angular's philosophy on Project structure and Architecture.
  - Reasons: I picked this over vanilla Node.js approach because of its out of the box support for Typescript and it's strict design rules.
- PrismaORM: An open source ORM.
  - Reasons: I used this because, I am very familiar and comfortable with Prisma, coupled with the fact that one can also write raw (and safe) SQL if they choose to.
- Data Source: Transpose
  - Reasons: For a first timer Transpose made data extraction easy and less painful compared to its competition. It also allows one to pull data directly from the blockchain (ethereum) in this case and not just data available to a provider (i.e flipsidecrypto restricts you to the node provider's data, eg. alchemy)
- PostgreSQL: An open-source, object-relational database management system (DBMS).
  - Reasons: Asides my familiarity and bias towards PostgreSQL. It has advantages over other SQL databases. One common example is it's support for advanced data types like JSON and custom datatypes.

## Data Extraction and Aggregation

- The sample size were: <br>
  i. First 200 tokens from each collection <br>
  ii. Maximum of 50 transactions (if available) for each token.

1. The data_extraction.py script handled connecting to the Transpose API, pulling blockchain data for 3 NFT collections and storing them in named json files (they can be found [here](https://github.com/WillDera/paragon_task/tree/main/nft_owners), [here](https://github.com/WillDera/paragon_task/tree/main/nfts_list) and [here](https://github.com/WillDera/paragon_task/tree/main/sales). Data extracted were Sale data, Ownership data and Collection data.
2. The data_aggregation.py script handled processing the of the json files created in step 1 and storing them on the database for later use. Only parts of interest from the data were stored on the database.

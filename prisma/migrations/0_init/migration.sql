-- CreateTable
CREATE TABLE "bored_ape_yacht_club_nft_info" (
    "info_id" SERIAL NOT NULL,
    "contract_address" VARCHAR(50),
    "token_id" INTEGER,
    "owner_address" VARCHAR(50),
    "metadata_url" VARCHAR(255),
    "external_url" VARCHAR(255),

    CONSTRAINT "bored_ape_yacht_club_nft_info_pkey" PRIMARY KEY ("info_id")
);

-- CreateTable
CREATE TABLE "bored_ape_yacht_club_sale_info" (
    "sale_id" SERIAL NOT NULL,
    "contract_address" VARCHAR(50),
    "token_id" INTEGER,
    "transaction_hash" VARCHAR(255),
    "timestamp" TIMESTAMP(6),
    "exchange_name" VARCHAR(100),
    "contract_version" VARCHAR(100),
    "quantity" INTEGER,
    "eth_price" REAL,
    "usd_price" REAL,
    "buyer" VARCHAR(50),
    "seller" VARCHAR(50),
    "royalty_fee" INTEGER,
    "platform_fee" INTEGER,

    CONSTRAINT "bored_ape_yacht_club_sale_info_pkey" PRIMARY KEY ("sale_id")
);

-- CreateTable
CREATE TABLE "cryptoblots_nft_info" (
    "info_id" SERIAL NOT NULL,
    "contract_address" VARCHAR(50),
    "token_id" INTEGER,
    "owner_address" VARCHAR(50),
    "metadata_url" VARCHAR(255),
    "external_url" VARCHAR(255),

    CONSTRAINT "cryptoblots_nft_info_pkey" PRIMARY KEY ("info_id")
);

-- CreateTable
CREATE TABLE "cryptoblots_sale_info" (
    "sale_id" SERIAL NOT NULL,
    "contract_address" VARCHAR(50),
    "token_id" INTEGER,
    "transaction_hash" VARCHAR(255),
    "timestamp" TIMESTAMP(6),
    "exchange_name" VARCHAR(100),
    "contract_version" VARCHAR(100),
    "quantity" INTEGER,
    "eth_price" REAL,
    "usd_price" REAL,
    "buyer" VARCHAR(50),
    "seller" VARCHAR(50),
    "royalty_fee" INTEGER,
    "platform_fee" INTEGER,

    CONSTRAINT "cryptoblots_sale_info_pkey" PRIMARY KEY ("sale_id")
);

-- CreateTable
CREATE TABLE "cryptopunk_nft_info" (
    "info_id" SERIAL NOT NULL,
    "contract_address" VARCHAR(50),
    "token_id" INTEGER,
    "owner_address" VARCHAR(50),
    "metadata_url" VARCHAR(255),
    "external_url" VARCHAR(255),

    CONSTRAINT "cryptopunk_nft_info_pkey" PRIMARY KEY ("info_id")
);

-- CreateTable
CREATE TABLE "cryptopunk_sale_info" (
    "sale_id" SERIAL NOT NULL,
    "contract_address" VARCHAR(50),
    "token_id" INTEGER,
    "transaction_hash" VARCHAR(255),
    "timestamp" TIMESTAMP(6),
    "exchange_name" VARCHAR(100),
    "contract_version" VARCHAR(100),
    "quantity" INTEGER,
    "eth_price" REAL,
    "usd_price" REAL,
    "buyer" VARCHAR(50),
    "seller" VARCHAR(50),
    "royalty_fee" INTEGER,
    "platform_fee" INTEGER,

    CONSTRAINT "cryptopunk_sale_info_pkey" PRIMARY KEY ("sale_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bored_ape_yacht_club_nft_info_token_id_key" ON "bored_ape_yacht_club_nft_info"("token_id");

-- CreateIndex
CREATE UNIQUE INDEX "cryptoblots_nft_info_token_id_key" ON "cryptoblots_nft_info"("token_id");

-- CreateIndex
CREATE UNIQUE INDEX "cryptopunk_nft_info_token_id_key" ON "cryptopunk_nft_info"("token_id");

-- AddForeignKey
ALTER TABLE "bored_ape_yacht_club_sale_info" ADD CONSTRAINT "bored_ape_yacht_club_sale_info_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "bored_ape_yacht_club_nft_info"("token_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cryptoblots_sale_info" ADD CONSTRAINT "cryptoblots_sale_info_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "cryptoblots_nft_info"("token_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cryptopunk_sale_info" ADD CONSTRAINT "cryptopunk_sale_info_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "cryptopunk_nft_info"("token_id") ON DELETE CASCADE ON UPDATE NO ACTION;


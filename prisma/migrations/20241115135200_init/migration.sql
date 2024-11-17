-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "amount" INTEGER NOT NULL,
    "image" TEXT,
    "salesPrice" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Shopping" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shoppingDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalValue" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "ShoppingItens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shoppingId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    CONSTRAINT "ShoppingItens_shoppingId_fkey" FOREIGN KEY ("shoppingId") REFERENCES "Shopping" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ShoppingItens_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sales" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "client" TEXT NOT NULL,
    "totalValue" REAL NOT NULL,
    "salesDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SalesItens" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "salesId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "unitPrice" REAL NOT NULL,
    "subtotal" REAL NOT NULL,
    CONSTRAINT "SalesItens_salesId_fkey" FOREIGN KEY ("salesId") REFERENCES "Sales" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalesItens_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingItens_shoppingId_productId_key" ON "ShoppingItens"("shoppingId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "SalesItens_salesId_productId_key" ON "SalesItens"("salesId", "productId");

-- Add the states used by the airtime and data purchase reconciliation flows.
ALTER TYPE "PurchaseStatus" ADD VALUE IF NOT EXISTS 'PENDING';
ALTER TYPE "WalletTxType" ADD VALUE IF NOT EXISTS 'CREDIT';
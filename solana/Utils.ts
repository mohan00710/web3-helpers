import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import {
  Connection,
  Keypair,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import "dotenv/config";

export const payer = Keypair.fromSecretKey(
  bs58.decode(process.env.Delete || "")
);

export const _connection = () => {
  let connection = new Connection(clusterApiUrl("devnet"));
  return connection;
};

/**
 * Sign and submit Versioned transaction
 * @param instruction
 * @returns
 */
export const signAndExecuteTransactionInstruction = async (
  instruction: TransactionInstruction
) => {
  //creating a versioned transaction
  let blockhash = await _connection()
    .getLatestBlockhash()
    .then((res) => res.blockhash);

  const messageV0 = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: blockhash,
    instructions: [instruction], //you can add multiple instruction into the array
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);
  transaction.sign([payer]);
  let transactionId = await _connection().sendTransaction(transaction, {
    maxRetries: 2,
  });
  let block = await _connection().getLatestBlockhash("confirmed");
  await _connection().confirmTransaction(
    {
      signature: transactionId,
      blockhash: block.blockhash,
      lastValidBlockHeight: block.lastValidBlockHeight,
    },
    "confirmed"
  );
  console.log("transaction signed and submitted", transactionId);
  return transactionId;
};

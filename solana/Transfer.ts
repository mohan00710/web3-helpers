import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  _connection,
  payer,
  signAndExecuteTransactionInstruction,
} from "./Utils";
import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  createTransferCheckedInstruction,
  createTransferInstruction,
} from "@solana/spl-token";

let connection = _connection();

const transferSol = async () => {
  const transferInstruction = await SystemProgram.transfer({
    fromPubkey: payer.publicKey,
    toPubkey: new PublicKey(""),
    lamports: 100, //1 sol = 1000000000
  });

  //sign and submit the transaction
  const transactionId = await signAndExecuteTransactionInstruction(
    transferInstruction
  );

  console.log("Sol transfered successfully", transactionId);
};


const transferToken_1 = async (mint: PublicKey, receiverAddress: PublicKey) => {
  const fromTokenAccount = await getAssociatedTokenAddress(
    mint,
    payer.publicKey
  );
  const toTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    receiverAddress,
    undefined,
    "confirmed",
    { maxRetries: 2 }
  );

  let transferInstruction = await createTransferInstruction(
    fromTokenAccount,
    toTokenAccount.address,
    payer.publicKey,
    100
  );

  //sign and submit the transaction
  const transactionId = await signAndExecuteTransactionInstruction(
    transferInstruction
  );

  console.log("token transfered successfully", transactionId);

  //transfer tokens
};

import { AddressLookupTableProgram, PublicKey } from "@solana/web3.js";
import {
  _connection,
  payer,
  signAndExecuteTransactionInstruction,
} from "./Utils";

const connection = _connection();

const addresses = [
  new PublicKey("11111111111111111111111111111111"), //add your Publickeys
];

const main = async () => {
  //   await createAddressLookupTable();
  let lookupAddress = "";
  //   await insertIntoTable(lookupAddress);
  //   getAddressTable(lookupAddress);
};

/**
 * create an address lookup table
 * @returns
 */
const createAddressLookupTable = async () => {
  const slot = await connection.getSlot();
  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: payer.publicKey,
      payer: payer.publicKey,
      recentSlot: slot,
    });

  //Sign the transaction instruction for creating address lookup table
  await signAndExecuteTransactionInstruction(lookupTableInst);
  console.log("created address lookup table :", lookupTableAddress.toBase58());

  //extend address lookup table

  return lookupTableAddress.toString();
};

/**
 * Insert publickeys into the table
 * @param lookupTableAddress
 */
const insertIntoTable = async (lookupTableAddress: string) => {
  const extendInstruction = AddressLookupTableProgram.extendLookupTable({
    payer: payer.publicKey,
    authority: payer.publicKey,
    lookupTable: new PublicKey(lookupTableAddress),
    addresses: addresses,
  });
  await signAndExecuteTransactionInstruction(extendInstruction);
  console.log("publickey inserted successfully");
};

/**
 * Get the list of all inserted publickeys into the address table
 * @param lookupTableAddress
 */
const getAddressTable = async (lookupTableAddress: string) => {
  const lookupTableAccount = await connection
    .getAddressLookupTable(new PublicKey(lookupTableAddress))
    .then((res) => res.value);

  // `lookupTableAccount` will now be a `AddressLookupTableAccount` object
  if (lookupTableAccount != null) {
    console.log(
      "Table address from cluster:",
      lookupTableAccount.key.toBase58()
    );
    for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
      const address = lookupTableAccount.state.addresses[i];
      console.log(i, address.toBase58());
    }
  } else {
    console.log("Lookup table not found..");
  }
};

main();

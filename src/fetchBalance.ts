import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import chalk from "chalk";

export const fetchBalance = async (
  connection: Connection,
  publicKey: PublicKey
) => {
  const balance = await connection.getBalance(publicKey);
  console.log(
    chalk.bold.greenBright(
      "Balance:",
      chalk.bold.redBright((balance / LAMPORTS_PER_SOL).toString()),
      "SOL"
    )
  );
};

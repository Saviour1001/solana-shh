import * as ed from "@noble/ed25519";
import { sign } from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import {
  Cluster,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Elusiv, SEED_MESSAGE } from "@elusiv/sdk";
import inquirer, { Answers } from "inquirer";
import chalk from "chalk";
import { DEVNET_RPC_URL, MAINNET_RPC_URL } from "./constants";
import { readFileSync } from "fs";
import { homedir } from "os";
import { fetchBalance } from "./fetchBalance";
import { topUpTxn } from "./topUpTxn";

export const sendSol = async (userKP: Keypair) => {
  const connectionQuestion = [
    {
      message: "Which network do you want to use?",
      name: "network",
      type: "list",
      choices: ["Mainnet", "Devnet"],
    },
  ];

  let cluster: Cluster;

  inquirer
    .prompt(connectionQuestion)
    .then((answers: Answers) => {
      switch (answers.network) {
        case "Mainnet":
          cluster = "mainnet-beta";
          break;
        case "Devnet":
          cluster = "devnet";
          break;
        default:
          console.log("default");
      }
    })
    .then(async () => {
      //   const connection = new Connection(
      //     cluster === "mainnet-beta" ? MAINNET_RPC_URL : DEVNET_RPC_URL,
      //     "confirmed"
      //   );

      const connection = new Connection(DEVNET_RPC_URL, "confirmed");

      const seed = await sign(
        Buffer.from(SEED_MESSAGE, "utf-8"),
        userKP.secretKey.slice(0, 32)
      );

      const elusiv = await Elusiv.getElusivInstance(
        seed,
        userKP.publicKey,
        connection,
        cluster
      );

      const question = [
        {
          message: "Enter the recipient's public key",
          name: "recipient",
          type: "input",
        },
        {
          message: "Enter the amount of SOL you want to send",
          name: "amount",
          type: "number",
        },
      ];

      const { recipient, amount }: Answers = await inquirer.prompt(question);

      const sendTxData = await elusiv.buildSendTx(
        amount * LAMPORTS_PER_SOL,
        recipient,
        "LAMPORTS"
      );

      const tx = elusiv.sendElusivTx(sendTxData);

      console.log("Send transaction sent", (await tx).signature);

      return;
    });
};

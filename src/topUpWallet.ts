import * as ed from "@noble/ed25519";
import { sign } from "@noble/ed25519";
import { sha512 } from "@noble/hashes/sha512";
import { Cluster, Connection, Keypair } from "@solana/web3.js";
import { Elusiv, SEED_MESSAGE } from "@elusiv/sdk";
import inquirer, { Answers } from "inquirer";
import chalk from "chalk";
import { DEVNET_RPC_URL, MAINNET_RPC_URL } from "./constants";
import { readFileSync } from "fs";
import { homedir } from "os";
import { fetchBalance } from "./fetchBalance";
import { topUpTxn } from "./topUpTxn";
import { establishing } from "./establishing";
import { sendSol } from "./sendSol";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

export const topUpWallet = async () => {
  const question = [
    {
      message:
        "Do you want to use your CLI wallet or a burner wallet? ( Expecting your CLI wallet to be in ~/.config/solana/id.json )",
      name: "wallet",
      type: "list",
      choices: ["CLI wallet", "Burner wallet"],
    },
  ];

  let userKP: Keypair;

  inquirer
    .prompt(question)
    .then(async (answers: Answers) => {
      switch (answers.wallet) {
        case "CLI wallet":
          try {
            // fetching private key from ~/.config/solana/id.json
            userKP = await Keypair.fromSecretKey(
              Buffer.from(
                JSON.parse(
                  readFileSync(`${homedir()}/.config/solana/id.json`, "utf-8")
                )
              )
            );
            console.log(
              chalk.bold.greenBright(
                "Public Key:",
                chalk.bold.redBright(userKP.publicKey.toString())
              )
            );
          } catch (e) {
            console.log("Something went wrong, please try again");
            return;
          }
          break;
        case "Burner wallet":
          try {
            const keypair = Keypair.generate();
            userKP = keypair;
            console.log(
              chalk.bold.greenBright(
                "Public Key:",
                chalk.bold.redBright(keypair.publicKey.toString())
              )
            );
          } catch (e) {
            console.log("Something went wrong, please try again");
            return;
          }
          break;
        default:
          console.log("default");
      }
    })
    .then(async () => {
      const question = [
        {
          message: "What do you want to do?",
          name: "option",
          type: "list",
          choices: ["Top up your private balance", "Exit"],
        },
      ];

      inquirer.prompt(question).then((answers: Answers) => {
        switch (answers.option) {
          case "Top up your private balance":
            establishing(userKP);
            break;

          default:
            console.log("default");
        }
      });
    });
};

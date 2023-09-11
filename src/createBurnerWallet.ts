import { Keypair } from "@solana/web3.js";
import chalk from "chalk";
import { writeFileSync } from "fs";
import inquirer, { Answers } from "inquirer";

export const createBurnerWallet = () => {
  const keypair = Keypair.generate();

  console.log(
    chalk.bold.greenBright(
      "Public Key:",
      chalk.bold.redBright(keypair.publicKey.toString())
    )
  );
  const question = [
    {
      message: "Do you want to save the private key?",
      name: "save",
      type: "confirm",
    },
  ];

  inquirer.prompt(question).then((answers: Answers) => {
    if (answers.save) {
      console.log(
        chalk.bold.greenBright(
          "Saving the private key",
          chalk.bold.redBright("DO NOT SHARE THIS WITH ANYONE")
        )
      );
      writeFileSync("privateKey.json", JSON.stringify(keypair.secretKey));
    }
  });

  // log that you are saving the private key to a file

  return {
    publicKey: keypair.publicKey.toString(),
    privateKey: keypair.secretKey.toString(),
  };
};

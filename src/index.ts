#!/usr/bin/env node

import chalk from "chalk";
// @ts-ignore
import figlet from "figlet";
// @ts-ignore
import inquirer, { Answers, QuestionCollection } from "inquirer";

import { topUpWallet } from "./topUpWallet";

const availableOptions: string[] = ["Play with a private zk Wallet", "Exit"];

console.log(
  chalk.magentaBright(
    figlet.textSync(`Solana Shh`, { horizontalLayout: "full" })
  )
);

const question = [
  {
    message: "What do you want to do?",
    name: "option",
    type: "list",
    choices: availableOptions,
  },
];

inquirer.prompt(question).then((answers: Answers) => {
  switch (answers.option) {
    case "Play with a private zk Wallet":
      topUpWallet();
      break;
    default:
      console.log("default");
  }
});

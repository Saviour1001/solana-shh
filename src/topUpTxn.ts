import { Elusiv, TokenType } from "@elusiv/sdk";
import inquirer, { Answers } from "inquirer";
import chalk from "chalk";
import {
  Cluster,
  Connection,
  Keypair,
  ConfirmedSignatureInfo,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

export const topUpTxn = async (elusivInstance: Elusiv, userKP: Keypair) => {
  const question = [
    {
      message:
        "How much balance do you want to top up? ( Recommended is to top up more than required for better privacy )",
      name: "amount",
      type: "number",
    },
  ];

  const { amount }: Answers = await inquirer.prompt(question);

  const topupTxData = await elusivInstance.buildTopUpTx(
    0.2 * LAMPORTS_PER_SOL,
    "LAMPORTS"
  );
  topupTxData.tx.partialSign(userKP);
  const tx = elusivInstance.sendElusivTx(topupTxData).then(async (tx) => {
    console.log("Top up transaction sent", (await tx).signature);
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

    const sendTxData = await elusivInstance.buildSendTx(
      amount * LAMPORTS_PER_SOL,
      new PublicKey(recipient),
      "LAMPORTS"
    );

    const sendTX = elusivInstance.sendElusivTx(sendTxData);

    console.log("Send transaction sent", (await sendTX).signature);
  });

  return;
};

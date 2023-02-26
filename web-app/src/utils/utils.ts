export const truncateWallet = (add: string) => {
  console.log('add ', add)
  if (add === undefined) {
    return;
  }
  return add.substring(0, 4) + "..." + add.substring(14, 18);
}

export type TxnStatus = {
    blockId: string;
    status: number;
    statusString: string;
    statusCode: number;
    errorMessage: string;
    events: any[];
  };
  
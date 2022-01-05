import { BigNumber, ethers } from "ethers";
import express, { Request, Response } from "express";
import cors from "cors";

import { opensea, ids } from "./costants";

const provider = new ethers.providers.JsonRpcBatchProvider(
	"https://eth-mainnet.alchemyapi.io/v2/-UOP0L4hKO3XEHYWhpJdkitn8RF7woN3"
);

const contract = new ethers.Contract(
	opensea,
	[
		"function balanceOfBatch(address[], uint256[]) external view returns (uint256[])",
	],
	provider
);

const app = express();
app.use(express.json());
app.use(cors());

app.get("/votes/:address", async (req: Request, res: Response) => {
	const { address } = req.params;
	const blockTag = req.query.blockTag || "latest";

	let balance = await contract.balanceOfBatch(
		Array(ids.length).fill(address),
		ids,
		{
			blockTag: isNaN(parseInt(blockTag as string))
				? blockTag
				: parseInt(blockTag as string),
		}
	);
	balance = (balance as BigNumber[]).map((balance) => balance.toNumber());
	balance = (balance as number[]).reduce((prev, curr) => prev + curr, 0);

	res.json(balance);
});

app.listen(8080, () => console.log("Listening on http://localhost:8080"));

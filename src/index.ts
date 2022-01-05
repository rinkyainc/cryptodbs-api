import { BigNumber } from "@ethersproject/bignumber";
import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

import { ids } from "./constants";
import { opensea, token } from "./clients";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/votes", async (req: Request, res: Response) => {
	console.log(req.query);
	const addresses = (req.query.addresses as string).split(",");
	const snapshot = req.query.snapshot as string;
	const blockTag =
		typeof snapshot !== "undefined"
			? isNaN(Number(snapshot))
				? snapshot
				: Number(snapshot)
			: "latest";

	interface Score {
		address: string;
		score: number;
	}

	const score: Score[] = [];

	for (const [index, address] of addresses.entries()) {
		const [OSBalances, tokenBalances]: [BigNumber[], BigNumber] =
			await Promise.all([
				opensea.balanceOfBatch(Array(ids.length).fill(address), ids, {
					blockTag,
				}),
				token.balanceOf(address, {
					blockTag,
				}),
			]);

		score[index] = {
			address,
			score:
				OSBalances.reduce((prev, curr) => prev + curr.toNumber(), 0) +
				tokenBalances.toNumber(),
		};
	}

	return res.json({ score });
});

app.use("*", (_, res: Response) =>
	res.send(
		`<div style="display: flex; justify-content: center; margin-top: 32px">
			<video autoplay loop muted playsinline disableremoteplayback poster="https://www.cryptodickbutts.com/static/img/gifanime-1.png">
				<source media="(max-width: 1199px)" src="https://www.cryptodickbutts.com/static/img/gifanime-sm-945.webm" type="video/webm" width="315" height="225">
				<source media="(max-width: 1199px)" src="https://www.cryptodickbutts.com/static/img/gifanime-sm-945.mp4" type="video/mp4" width="315" height="225">
				<source media="(min-width: 1200px)" src="https://www.cryptodickbutts.com/static/img/gifanime-xl-1701.webm" type="video/webm" width="567" height="405">            
				<source media="(min-width: 1200px)" src="https://www.cryptodickbutts.com/static/img/gifanime-xl-1701.mp4" type="video/mp4" width="567" height="405">
				Your browser does not support the video tag.                  
			</video>
		</div>
		`
	)
);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}`));

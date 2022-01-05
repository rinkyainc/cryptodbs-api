import { JsonRpcBatchProvider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { abis, addresses } from "./constants";

const provider = new JsonRpcBatchProvider(
	"https://eth-mainnet.alchemyapi.io/v2/-UOP0L4hKO3XEHYWhpJdkitn8RF7woN3"
);

export const opensea = new Contract(addresses.opensea, abis.erc1155, provider);
export const token = new Contract(addresses.token, abis.erc721, provider);

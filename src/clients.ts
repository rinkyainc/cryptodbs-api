import { JsonRpcBatchProvider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { abis, addresses } from "./constants";

const provider = new JsonRpcBatchProvider(process.env.RPC_URL);

export const opensea = new Contract(addresses.opensea, abis.erc1155, provider);
export const token = new Contract(addresses.token, abis.erc721, provider);

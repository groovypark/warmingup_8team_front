import ProviderLib from "./provider";
import { useSocket as useSocketLib } from "./useSocket";

export const ClientSocket: any = ProviderLib;
export const useSocket = useSocketLib;
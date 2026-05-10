import { ethers } from "ethers";

// Replace with the user's deployed contract address once they deploy it
export const CONTRACT_ADDRESS: string = "0x66e7dEFCeca8351d088958011D0e2e79700d01Cc"; // Deployed on Polygon Amoy

export const CONTRACT_ABI = [
  "function notarize(bytes32 _hash) public",
  "function verify(bytes32 _hash) public view returns (uint256)"
];

export async function connectWallet() {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    throw new Error("MetaMask is not installed!");
  }
  
  await (window as any).ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await provider.getSigner();
  
  // Optional: check network
  const network = await provider.getNetwork();
  // 80002 is Polygon Amoy Testnet
  if (network.chainId !== BigInt(80002)) {
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13882" }], // 80002 in hex
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        await (window as any).ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13882",
              chainName: "Polygon Amoy Testnet",
              rpcUrls: ["https://rpc-amoy.polygon.technology/"],
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              blockExplorerUrls: ["https://amoy.polygonscan.com/"],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }

  return { provider, signer, address: await signer.getAddress() };
}

export async function notarizeHash(signer: ethers.Signer, hashHex: string) {
  if (CONTRACT_ADDRESS === "0x...") {
    throw new Error("Smart contract address not set. Please deploy the contract first.");
  }
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  const tx = await contract.notarize(hashHex);
  return await tx.wait();
}

export async function verifyHash(provider: ethers.Provider, hashHex: string) {
  if (CONTRACT_ADDRESS === "0x...") {
    throw new Error("Smart contract address not set. Please deploy the contract first.");
  }
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  const timestamp = await contract.verify(hashHex);
  return timestamp;
}

import { ethers } from 'ethers';
import { NETWORK_URLS, DEFAULT_CHAIN_ID } from '@/config/constants';

export function getProvider(chainId = DEFAULT_CHAIN_ID) {
  const rpcUrl = NETWORK_URLS[chainId as keyof typeof NETWORK_URLS];
  if (!rpcUrl) throw new Error(`No RPC URL for chain ID ${chainId}`);
  
  return new ethers.providers.JsonRpcProvider(rpcUrl);
}

export function getContract(address: string, abi: any, signerOrProvider?: ethers.Signer | ethers.providers.Provider) {
  if (!address || !abi) throw new Error('Missing contract address or ABI');
  
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(address, abi, provider);
}

export async function connectWallet() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask to use this feature');
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    return {
      provider,
      signer,
      address,
      chainId: network.chainId
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

export async function switchNetwork(chainId: number) {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Please install MetaMask to use this feature');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // If the chain hasn't been added to MetaMask
    if (error.code === 4902) {
      const networkUrl = NETWORK_URLS[chainId as keyof typeof NETWORK_URLS];
      if (!networkUrl) throw new Error(`Network ${chainId} not supported`);

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${chainId.toString(16)}`,
          rpcUrls: [networkUrl],
          chainName: `Network ${chainId}`,
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
        }],
      });
    } else {
      throw error;
    }
  }
}
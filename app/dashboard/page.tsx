"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ethers } from 'ethers';
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Import ABI and contract address
import CryptoLoanABI from '@/contracts/CryptoLoan.json';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Dashboard() {
  const { user } = useUser();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('0');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [loans, setLoans] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    checkWalletConnection();
  }, []);

  async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletConnected(true);
          setWalletAddress(accounts[0]);
          const balance = await provider.getBalance(accounts[0]);
          setEthBalance(ethers.utils.formatEther(balance));
          fetchLoans(accounts[0], provider);
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
      }
    }
  }

  async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        checkWalletConnection();
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast({
          title: "Wallet Connection Failed",
          description: "Please make sure MetaMask is installed and try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "MetaMask Not Detected",
        description: "Please install MetaMask to use this feature.",
        variant: "destructive",
      });
    }
  }

  async function handleLoanRequest() {
    if (!walletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CryptoLoanABI.abi, signer);

      const tx = await contract.requestLoan(
        ethers.utils.parseEther(loanAmount),
        ethers.utils.parseEther(collateralAmount),
        loanDuration
      );

      await tx.wait();

      toast({
        title: "Loan Request Submitted",
        description: `Requested $${loanAmount} for ${loanDuration} days with ${collateralAmount} ETH as collateral.`,
      });

      // Refresh loans
      fetchLoans(walletAddress, provider);
    } catch (error) {
      console.error("Failed to request loan:", error);
      toast({
        title: "Loan Request Failed",
        description: "An error occurred while processing your loan request.",
        variant: "destructive",
      });
    }
  }

  async function fetchLoans(address, provider) {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CryptoLoanABI.abi, provider);
      const loanCount = await contract.getLoanCount(address);
      const loanPromises = [];

      for (let i = 0; i < loanCount; i++) {
        loanPromises.push(contract.loans(address, i));
      }

      const loanResults = await Promise.all(loanPromises);
      setLoans(loanResults);
    } catch (error) {
      console.error("Failed to fetch loans:", error);
    }
  }

  async function handleRepayLoan(loanId) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CryptoLoanABI.abi, signer);

      const tx = await contract.repayLoan(loanId);
      await tx.wait();

      toast({
        title: "Loan Repaid",
        description: "Your loan has been successfully repaid.",
      });

      // Refresh loans
      fetchLoans(walletAddress, provider);
    } catch (error) {
      console.error("Failed to repay loan:", error);
      toast({
        title: "Loan Repayment Failed",
        description: "An error occurred while processing your loan repayment.",
        variant: "destructive",
      });
    }
  }

  if (!user) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.firstName}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Connection</CardTitle>
            <CardDescription>Connect your Ethereum wallet to get started</CardDescription>
          </CardHeader>
          <CardContent>
            {walletConnected ? (
              <>
                <p>Connected: {walletAddress}</p>
                <p>ETH Balance: {ethBalance} ETH</p>
              </>
            ) : (
              <Button onClick={connectWallet}>Connect Wallet</Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request a Loan</CardTitle>
            <CardDescription>Use your ETH as collateral</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (USD)</Label>
                <Input
                  id="loanAmount"
                  placeholder="Enter loan amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="collateralAmount">Collateral Amount (ETH)</Label>
                <Input
                  id="collateralAmount"
                  placeholder="Enter collateral amount"
                  value={collateralAmount}
                  onChange={(e) => setCollateralAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanDuration">Loan Duration (Days)</Label>
                <Input
                  id="loanDuration"
                  placeholder="Enter loan duration"
                  value={loanDuration}
                  onChange={(e) => setLoanDuration(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLoanRequest} disabled={!walletConnected}>Request Loan</Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Loans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Collateral</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan, index) => (
                <TableRow key={index}>
                  <TableCell>{ethers.utils.formatEther(loan.amount)} USD</TableCell>
                  <TableCell>{ethers.utils.formatEther(loan.collateralAmount)} ETH</TableCell>
                  <TableCell>{loan.duration.toString()} days</TableCell>
                  <TableCell>{loan.active ? (loan.repaid ? 'Repaid' : 'Active') : 'Pending'}</TableCell>
                  <TableCell>
                    {loan.active && !loan.repaid && (
                      <Button onClick={() => handleRepayLoan(index)}>Repay</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
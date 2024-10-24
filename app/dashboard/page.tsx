"use client"

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
  const { user } = useUser();
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('0');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanDuration, setLoanDuration] = useState('');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [loans] = useState<{ amount: string; collateral: string; duration: string; status: string; }[]>([]);

  async function connectWallet() {
    setWalletConnected(true);
    setWalletAddress('0x1234...5678');
    setEthBalance('1.5');
  }

  async function handleLoanRequest() {
    console.log('Loan requested:', { loanAmount, loanDuration, collateralAmount });
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
                  <TableCell>{loan.amount} USD</TableCell>
                  <TableCell>{loan.collateral} ETH</TableCell>
                  <TableCell>{loan.duration} days</TableCell>
                  <TableCell>{loan.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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
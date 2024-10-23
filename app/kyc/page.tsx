"use client";

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function KYCPage() {
  const { user } = useUser();
  const [documentType, setDocumentType] = useState('');
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !documentType || !documentFront || !documentBack) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields and upload both document images.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('documentType', documentType);
    formData.append('documentFront', documentFront);
    formData.append('documentBack', documentBack);

    try {
      const response = await fetch('/api/kyc', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "KYC Submitted",
          description: "Your KYC documents have been submitted for review.",
        });
      } else {
        throw new Error('Failed to submit KYC');
      }
    } catch (error) {
      console.error('KYC submission error:', error);
      toast({
        title: "KYC Submission Failed",
        description: "An error occurred while submitting your KYC documents. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <div>Please sign in to complete KYC.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Complete Your KYC</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>KYC Document Upload</CardTitle>
          <CardDescription>Please upload your identification documents</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Input
                id="documentType"
                placeholder="e.g., Passport, Driver's License"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentFront">Front of Document</Label>
              <Input
                id="documentFront"
                type="file"
                onChange={(e) => setDocumentFront(e.target.files?.[0] || null)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentBack">Back of Document</Label>
              <Input
                id="documentBack"
                type="file"
                onChange={(e) => setDocumentBack(e.target.files?.[0] || null)}
                required
              />
            </div>
            <Button type="submit">Submit KYC Documents</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
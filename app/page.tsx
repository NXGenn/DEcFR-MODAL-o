import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Wallet2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Wallet2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">DEcFR</h1>
        </div>
        <div className="space-x-4">
          <Link href="/sign-in">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto mt-20 text-center">
        <h2 className="text-5xl font-bold mb-6">Get Fiat Loans Without Selling Your Crypto</h2>
        <p className="text-xl mb-10">Use your cryptocurrency as collateral and access instant fiat loans.</p>
        
        <Link href="/sign-up">
          <Button size="lg" className="text-lg px-8 py-6">Get Started</Button>
        </Link>
        
        <section className="mt-20">
          <h3 className="text-3xl font-semibold mb-10">Why Choose DEcFR?</h3>
          <Carousel className="max-w-xl mx-auto">
            <CarouselContent>
              <CarouselItem>
                <FeatureCard 
                  title="Crypto Collateral" 
                  description="Lock your crypto assets securely as collateral for fiat loans."
                />
              </CarouselItem>
              <CarouselItem>
                <FeatureCard 
                  title="Instant Approval" 
                  description="Get your loan request approved and disbursed in minutes."
                />
              </CarouselItem>
              <CarouselItem>
                <FeatureCard 
                  title="Secure KYC" 
                  description="Your identity is verified securely for compliance and trust."
                />
              </CarouselItem>
              <CarouselItem>
                <FeatureCard 
                  title="Flexible Terms" 
                  description="Choose loan durations that suit your needs."
                />
              </CarouselItem>
              <CarouselItem>
                <FeatureCard 
                  title="Low Interest Rates" 
                  description="Enjoy competitive interest rates on your crypto-backed loans."
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <section className="mt-20">
          <h3 className="text-3xl font-semibold mb-10">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>How does CryptoLoan work?</AccordionTrigger>
              <AccordionContent>
                CryptoLoan allows you to use your cryptocurrency as collateral to obtain fiat loans. You lock your crypto in a smart contract, receive a fiat loan, and can retrieve your crypto by repaying the loan with interest.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What cryptocurrencies can I use as collateral?</AccordionTrigger>
              <AccordionContent>
                Currently, we support ETH as collateral. We plan to add support for more cryptocurrencies in the future.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How is the loan amount determined?</AccordionTrigger>
              <AccordionContent>
                The loan amount is based on the current market value of your collateral and our loan-to-value (LTV) ratio. Typically, you can borrow up to 50-70% of your collateral's value.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>What happens if I can't repay the loan?</AccordionTrigger>
              <AccordionContent>
                If you're unable to repay the loan by the due date, your collateral may be liquidated to cover the outstanding loan amount. We always recommend borrowing responsibly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Is KYC required to use CryptoLoan?</AccordionTrigger>
              <AccordionContent>
                Yes, we require all users to complete our Know Your Customer (KYC) process. This helps us comply with regulations and ensure the security of our platform.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Is DEcFR safe?</AccordionTrigger>
              <AccordionContent>
                Yes, we require all users to complete our Know Your Customer (KYC) process. This helps us comply with regulations and ensure the security of our platform.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
      <footer>
        <Link href="/terms">
          <p className="text-center text-sm">Terms & Conditions</p>
        </Link>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-lg h-full flex flex-col justify-center">
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <p>{description}</p>
    </div>
  );
}
'use client';

import * as React from 'react';
import { useState } from 'react';

import { type ExercisePlan } from '@/lib/types';
import { generatePlanAction } from '@/app/actions';
import { PainInsightsForm } from '@/components/PainInsightsForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Loader } from '@/components/Loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Stethoscope, Terminal } from 'lucide-react';

function Header() {
  return (
    <div className="text-center pt-12 pb-8 px-4">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Stethoscope className="w-12 h-12 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground tracking-tight">
          Pain Insights
        </h1>
      </div>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
        Describe your pain, and our AI assistant will provide potential reasons
        and a personalized exercise plan to help you feel better.
      </p>
    </div>
  );
}

export default function Home() {
  const [plan, setPlan] = useState<ExercisePlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const result = await generatePlanAction(data);
      if (result) {
        setPlan(result);
      } else {
        setError('The AI could not generate a plan. Please try again.');
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (plan && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [plan]);

  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Header />
        <PainInsightsForm onSubmit={handleFormSubmit} isLoading={isLoading} />

        {isLoading && <Loader />}

        {error && (
          <div className="my-8">
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <div ref={resultsRef}>
          {plan && !isLoading && <ResultsDisplay plan={plan} />}
        </div>

      </div>
    </main>
  );
}

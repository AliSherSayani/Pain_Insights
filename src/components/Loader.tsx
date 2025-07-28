import { Loader2 } from 'lucide-react';

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-16 text-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <h2 className="text-2xl font-semibold text-foreground">
        Analyzing your symptoms...
      </h2>
      <p className="text-muted-foreground max-w-sm">
        Our AI is crafting your personalized plan. This may take a moment.
      </p>
    </div>
  );
}

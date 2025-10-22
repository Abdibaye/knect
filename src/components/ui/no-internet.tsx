import { WifiOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NoInternetProps {
  className?: string;
  heading?: string;
  description?: string;
  onRetry?: () => void;
}

const defaultDescription =
  "We couldn't reach the server. This might be due to a disconnected or unstable network connection.";

export function NoInternetFallback({
  className,
  heading = "No internet connection",
  description = defaultDescription,
  onRetry,
}: NoInternetProps) {
  const tips = [
    "Checking the network cables, modem, and router",
    "Reconnecting to Wi-Fi",
    "Trying again in a moment",
  ];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card/50 p-8 text-center shadow-sm",
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <WifiOff className="size-7" aria-hidden="true" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="text-sm text-left text-muted-foreground">
          <p className="font-medium">Try:</p>
          <ul className="mt-1 pl-8 list-inside list-disc text-left">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          onClick={onRetry}
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  );
}

export default NoInternetFallback;

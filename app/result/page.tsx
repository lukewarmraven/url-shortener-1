"use client";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Copy } from "lucide-react";

function ResultContent() {
  const params = useSearchParams();
  const generatedCode = params.get("c");
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  if (!generatedCode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>No URL found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push("/")}>
              Shorten a URL
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fullUrl = origin ? `${origin}/${generatedCode}` : "";

  const handleCopy = async () => {
    if (!fullUrl) return;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Your Short URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 truncate text-sm font-medium hover:underline"
            >
              {fullUrl}
            </a>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCopy}
              className="h-8 w-8 shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button className="w-full" onClick={() => router.push("/")}>
            Shorten a new URL
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Result() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}

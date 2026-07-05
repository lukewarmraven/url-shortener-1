

"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";

export default function Result() {
  const params = useSearchParams()
  const generatedCode = params.get("c")

  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-md">
        <CardContent>
          <p>Generated URL Key: {generatedCode}</p>
          <p>URL: sample.com/{generatedCode}</p>
        </CardContent>
      </Card>
      <Button variant="outline" onClick={() => router.push("/")}>
        Shorten a new URL
      </Button>
    </div>
  );
}

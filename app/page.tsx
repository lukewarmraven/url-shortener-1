"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type FormValues = {
  url: string
}

export default function Home() {
  const {register, handleSubmit, watch} = useForm<FormValues>()
  const router = useRouter();
  const urlWatcher = watch("url") || "";
  const len = urlWatcher.length;
  const badgeColor =
    len < 10
      ? "bg-muted text-muted-foreground"
      : len <= 50
        ? "bg-emerald-500 text-white"
        : len <= 100
          ? "bg-amber-500 text-white"
          : "bg-red-500 text-white";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-center">
          <h1>
            URL Shortener
           </h1>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(async (data) => {
              const res = await fetch("/api/shorten_url", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({url: data.url})
              })
              const { code } = await res.json()
              router.push(`/result?c=${code}`);
            })}
            className="space-y-4"
          >
            <Label htmlFor="url">Shorten a URL</Label>
            <div className="relative">
              <Input
                id="url"
                placeholder="https://example.com/very-long-url"
                className="pr-16"
                type="url"
                {...register("url")}
                required
              />
              <span
                className={`absolute inset-y-0 right-0 flex items-center rounded-r-lg border-l px-3 text-sm transition-colors ${badgeColor}`}
              >
                {len}
              </span>
            </div>
            <Button type="submit" className="w-full">Shorten</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-4xl font-bold text-gray-900">Welcome</h1>
        <p className="text-gray-600">
          Please sign in or create an account to continue.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/sign-up">Create Account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

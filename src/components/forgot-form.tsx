import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link'


export function ForgotForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Oops did you get lost!</CardTitle>
          
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                
                
              </div>
              
              <div className="grid gap-6">
                <div className="grid gap-3">
                  
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>
                
                
                <Button type="submit" className="w-full">
                  Find my account
                </Button>
              </div>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="underline underline-offset-4">
                   Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
    </div>
  );
}

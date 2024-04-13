import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Spinner from "./Spinner";
import { z } from "zod";
interface SignInFormProps {
  showForm: any;
  setShowForm: any;
}
const emailSchema = z.object({
  email: z.string().email(),
});
function SignInForm({ showForm, setShowForm }: SignInFormProps) {
  const [emailAddress, setEmailAddress] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isCustomLoading, setIsCustomLoading] = useState(false);
  const validateEmailWithZod = (email: string) => {
    try {
      emailSchema.parse({ email });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("email", {
      email: emailAddress,
      redirect: false,
    });
    if (result?.ok) {
      setIsDisabled(true);
      setIsButtonDisabled(true);
    }
  };

  const handleCustomEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailWithZod(emailAddress)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setIsCustomLoading(true);
    const result = await signIn("email", {
      email: emailAddress,
      redirect: false,
    });

    if (result?.ok) {
      setIsCustomLoading(false);
      setIsSent(true);
    } else {
      setIsCustomLoading(false);
      setEmailError("Failed to send the magic link.");
    }
  };
  return (
    <div>
      {!isSent ? (
        <div>
          <Dialog open={showForm}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center">Sign In</DialogTitle>
                <DialogDescription>
                  <div className="mt-6">
                    <form onSubmit={handleEmailSignIn}>
                      <div className="mb-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email Address
                        </label>
                        <div className="mt-1">
                          <Input
                            id="email"
                            type="email"
                            value={emailAddress}
                            onChange={(e) => {
                              setEmailAddress(e.target.value);
                            }}
                            placeholder="name@example.com"
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={!isSent && isCustomLoading}
                        onClick={handleCustomEmailSignIn}
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {isCustomLoading ? <Spinner /> : "Sign in with Email"}
                      </Button>
                    </form>
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button
                          onClick={() => {
                            signIn("google");
                            setShowForm(false);
                          }}
                          className="w-full bg-white text-gray-600 font-semibold py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <div className="flex items-center justify-center">
                            Continue with google
                          </div>
                        </Button>
                        <div
                          onClick={() => setShowForm(false)}
                          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                          <span className="sr-only">Close</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div>
          <Dialog open={showForm}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-center">Sign In</DialogTitle>
                <DialogDescription>
                  <div>Link has been sent</div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default SignInForm;
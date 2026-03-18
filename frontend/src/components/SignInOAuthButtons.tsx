import { Button } from "./ui/button";
import { useSignIn } from "@clerk/clerk-react";

const SignInOAuthButtons = () => {
  const {signIn,isLoaded} = useSignIn();

  if(!isLoaded) {
    return null
  }

    const signInWithGoogle =  () => {
      signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/auth-callback",
        redirectUrlComplete: "/",
      });
    }

  return <Button onClick={signInWithGoogle} variant={"secondary"} className="w-full text-white border-zinc-200 h-11">
    <img src="/google.webp" alt="google" className="size-5"/>
    Continue with Google
  </Button>
  
};

export default SignInOAuthButtons;
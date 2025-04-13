"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "@/configs/firebaseConfig";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/");
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      let userCredential;
      if (!isLogin) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name,
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      const user: User = userCredential.user;
      localStorage.setItem("user", JSON.stringify({ uid: user.uid, email: user.email }));
      router.replace("/home");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSuccess("Password reset link sent! Check your email.");
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send reset email.");
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white pt-6 px-4 font-poppins">
      {/* Pinterest-style Image Collage */}
      <div className="relative w-full max-w-sm h-[300px] mb-4">
        <div className="absolute top-0 left-0 w-24 h-32 rounded-xl overflow-hidden z-20 shadow-md border-4 border-white">
          <Image src="/images/gallery5.jpg" alt="img1" fill className="object-cover" />
        </div>
        <div className="absolute -top-5 right-5 w-28 h-28 rounded-xl overflow-hidden z-10 shadow-md border-4 border-white">
          <Image src="/images/gallery6.jpg" alt="img2" fill className="object-cover" />
        </div>
        <div className="absolute top-10 left-20 w-[200px] h-[240px] rounded-xl overflow-hidden z-30 shadow-xl border-4 border-white">
          <Image src="/images/gallery10.jpeg" alt="img3" fill className="object-cover" />
        </div>
        <div className="absolute bottom-0 right-12 w-20 h-20 rounded-xl overflow-hidden z-20 shadow-md border-4 border-white">
          <Image src="/images/gallery8.jpeg" alt="img4" fill className="object-cover" />
        </div>
        <div className="absolute -bottom-2 -left-0 w-32 h-32 rounded-xl overflow-hidden z-20 shadow-md border-4 border-white">
          <Image src="/images/gallery12.jpeg" alt="img4" fill className="object-cover" />
        </div>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-sm p-6 shadow-xl rounded-2xl font-poppins">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Welcome to Dliria Verse</CardTitle>
          <CardDescription>{isLogin ? "Login to your account" : "Create a new account"}</CardDescription>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {resetSuccess && <p className="text-green-500 text-sm mt-2">{resetSuccess}</p>}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth}>
            <div className="grid gap-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                </button>
              </div>
              <button
                className="w-full bg-navy-1 text-white font-medium py-2 rounded-xl mt-2"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </div>
          </form>
          {isLogin && (
            <p
              className="text-sm text-blue-500 text-center mt-3 cursor-pointer"
              onClick={handleResetPassword}
            >
              Forgot Password?
            </p>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <p
            className="text-sm cursor-pointer text-bluehee-600"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </p>
        </CardFooter>
      </Card>

      {/* Terms */}
      <p className="text-xs text-gray-400 text-center mt-6 max-w-xs pb-4">
        By continuing, you agree to {"Dliria verse's"} <span className="text-blue-600 underline">Terms</span> & <span className="text-blue-600 underline">Privacy Policy</span>.
      </p>
    </div>
  );
};

export default LoginPage;

"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  

const BudgetInputSection = () => {
  const [income, setIncome] = useState("");
  const [savings, setSavings] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can save this to Firebase or Zustand here
    console.log("Income:", income);
    console.log("Savings:", savings);
    console.log("Budget:", budget);
  };

  return (
    <div className="">
    <Dialog>
  <DialogTrigger className="border p-2 px-4 bg-navy-1 w-full text-white">Enter Your Finances</DialogTrigger>
  <DialogContent className="">
    <DialogHeader>
      <DialogTitle>Your Finances</DialogTitle>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 font-poppins">Monthly Income</label>
          <Input
            type="number"
            className="w-full p-2 border rounded-md font-poppins"
            placeholder="e.g. 100000"
            value={income}  
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-600 font-poppins">Monthly Savings</label>
          <Input
            type="number"
            className="w-full p-2 border rounded-md font-poppins"
            placeholder="e.g. 20000"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-600 font-poppins">Monthly Budget</label>
          <Input
            type="number"
            className="w-full p-2 border rounded-md font-poppins"
            placeholder="e.g. 80000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-navy-1 text-white py-2 rounded-md hover:bg-navy-2 transition font-poppins"
        >
          Save Details
        </button>
      </form>
    </DialogHeader>
  </DialogContent>
</Dialog>

    {/* <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-md border border-gray-300 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-navy-1 font-poppins"></h2>
      
    </div> */}
    </div>
  );
};

export default BudgetInputSection;

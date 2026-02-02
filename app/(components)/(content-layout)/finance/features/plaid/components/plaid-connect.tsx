"use client";

import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "../../../components/ui/button";

export const PlaidConnect = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Token'ı al
  useEffect(() => {
    const fetchToken = async () => {
      try {
        console.log("Fetching Plaid link token...");
        
        const response = await fetch("/api/onefinance/plaid/create-link-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Token response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to get token");
        }

        if (data.data) {
          console.log("✅ Token received");
          setToken(data.data);
        } else {
          throw new Error("No token in response");
        }
      } catch (err: any) {
        console.error("❌ Token error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  // Plaid Link
  const { open, ready } = usePlaidLink({
    token,
    onSuccess: (publicToken, metadata) => {
      console.log("✅ Success! Public token:", publicToken);
      alert(`Success! Public token: ${publicToken}`);
      
      // Token'ı exchange et
      fetch("/api/onefinance/plaid/exchange-public-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicToken }),
      })
      .then(response => response.json())
      .then(data => {
        console.log("Exchange response:", data);
        if (data.ok) {
          alert("Bank connected successfully!");
        }
      })
      .catch(error => {
        console.error("Exchange error:", error);
      });
    },
    onExit: (err, metadata) => {
      console.log("Plaid exit:", { err, metadata });
      if (err) {
        alert(`Error: ${err.display_message || err.error_message}`);
      }
    },
    env: "sandbox",
  });

  const handleClick = () => {
    if (!ready) {
      alert("Plaid is still loading. Please wait...");
      return;
    }

    if (!token) {
      alert("No token available. Please try again.");
      return;
    }

    console.log("Opening Plaid...");
    open();
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        disabled={!ready || loading || !token}
        size="sm"
        variant="ghost"
      >
        {loading ? "Loading..." : 
         !token ? "Failed to load" :
         !ready ? "Initializing..." : "Connect Bank"}
      </Button>
      
      {error && (
        <div className="mt-1 text-xs text-red-500">
          Error: {error}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        Status: {loading ? "⏳ Loading..." : 
                token ? "✅ Ready" : 
                error ? "❌ Error" : "⏳ Waiting"}
      </div>
    </div>
  );
};
"use client";

import { useSession } from "@/lib/auth-client";
import { loginWithDemo, logout } from "@/lib/auth-helpers";
import { useState } from "react";

/**
 * Authentication Test Page
 * Demonstrates the better-auth integration
 * 
 * This page can be accessed at /auth-test
 */
export default function AuthTestPage() {
  const { data: session, isPending, error } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithDemo();
      window.location.reload(); // Reload to update session
    } catch (error) {
      console.error("Demo login failed:", error);
      alert("Demo login failed. Please create the demo account first.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      window.location.reload(); // Reload to update session
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded p-4 mb-4">
              <strong>Error:</strong> {error.message}
            </div>
          )}

          {session ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="text-green-800 font-semibold">✓ Authenticated</p>
              </div>
              
              <div className="bg-gray-50 rounded p-4">
                <h3 className="font-semibold mb-2">User Information:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(session.user, null, 2)}
                </pre>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full bg-red-600 text-white rounded px-4 py-2 hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <p className="text-yellow-800 font-semibold">⚠ Not authenticated</p>
              </div>

              <button
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Logging in..." : "Login with Demo Account"}
              </button>

              <div className="bg-gray-50 rounded p-4 text-sm">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                <p>Email: demo@bloodos.app</p>
                <p>Password: Demo@123</p>
                <p className="mt-2 text-gray-600">
                  Note: Demo account must be created manually in MongoDB or via registration.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-6">
          <h2 className="text-xl font-semibold mb-4">Configuration Status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-semibold">✓</span>
              <span>better-auth server configured with extended user schema</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">✓</span>
              <span>better-auth client SDK initialized</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">✓</span>
              <span>JWT tokens stored in httpOnly cookies</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">✓</span>
              <span>AuthProvider wrapping application</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">✓</span>
              <span>Authentication helper functions available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">✓</span>
              <span>MongoDB direct connection configured</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            API endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/auth/[...all]</code>
          </p>
          <p>
            JWKS endpoint: <code className="bg-gray-100 px-2 py-1 rounded">/api/auth/.well-known/jwks.json</code>
          </p>
        </div>
      </div>
    </div>
  );
}

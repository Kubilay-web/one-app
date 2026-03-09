import LoginForm from "../../components/auth/login-form";
import Link from "next/link";




import Logo from "../../components/global/Logo";

// import Logo from "@/components/global/Logo";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{
    returnUrl?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const returnUrl = resolvedParams.returnUrl || "/dashboard";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Premium background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(59,130,246,0.08),transparent_50%)]"></div>

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/20 to-indigo-200/20 blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-to-tl from-cyan-200/15 to-blue-200/15 blur-2xl"></div>
      <div className="absolute top-1/2 left-10 w-20 h-20 rounded-lg bg-gradient-to-br from-indigo-300/10 to-purple-300/10 blur-lg rotate-45"></div>

      <div className="w-full max-w-lg p-8 relative z-10">
        {/* Premium card with glassmorphism */}
        <div className="relative rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden">
          {/* Gradient border */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 via-transparent to-indigo-200/30 p-[1px] rounded-2xl">
            <div className="rounded-2xl bg-white/90 backdrop-blur-xl h-full w-full border border-white/20"></div>
          </div>

          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-50/30 rounded-2xl"></div>

          <div className="relative p-10">
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Premium logo section */}
              <div className="relative">
                <div className="p-3 px-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white shadow border border-slate-200/50">
                  <Logo
                    href="/"
                    variant="light"
                    className="scale-110 transform"
                  />
                </div>
              </div>

              {/* Premium header */}
              <div className="text-center space-y-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent">
                  Welcome to Invoice Pro
                </h1>
                <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                  Sign in to access your professional invoice generator and
                  manage your business documents with ease
                </p>
              </div>

              {/* Form section */}
              <div className="w-full space-y-6">
                <LoginForm returnUrl={returnUrl} />
              </div>

              {/* Premium footer */}
              <div className="pt-6 border-t border-slate-100 w-full">
                <div className="text-center space-y-3">
                  <div className="text-sm text-slate-600">
                    Need help?{" "}
                    <Link
                      href="/contact"
                      className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline decoration-blue-600/30 underline-offset-4"
                    >
                      Contact our support team
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subtle corner highlights */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-100/60 to-transparent rounded-tl-2xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-indigo-100/40 to-transparent rounded-br-2xl"></div>
        </div>

        {/* Floating elements for extra premium feel */}
        <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-sm"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-tl from-cyan-400/30 to-blue-400/30 blur-sm"></div>
      </div>
    </div>
  );
}

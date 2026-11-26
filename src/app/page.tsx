import { LandingFeatures } from "@/features/landing/components/LandingFeatures";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingHero } from "@/features/landing/components/LandingHero";
import { createClient } from "@/lib/supabase/server";

async function checkIsAuthenticated(): Promise<boolean> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return false;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return Boolean(user);
  } catch {
    return false;
  }
}

export default async function HomePage() {
  const isAuthenticated = await checkIsAuthenticated();

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader isAuthenticated={isAuthenticated} />
      <main>
        <LandingHero isAuthenticated={isAuthenticated} />
        <LandingFeatures />
      </main>
    </div>
  );
}

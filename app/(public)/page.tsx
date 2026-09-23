import { Cover } from "@/components/cover/cover";

export const metadata = {
  title: "Matt Blanke",
  description: "CS student and software engineer.",
  alternates: { canonical: "/" },
};

// THE COVER (M3A). Replaces the placeholder "Matt Blanke / CS student and
// software engineer." body. See components/cover/cover.tsx.
export default function Home() {
  return <Cover />;
}

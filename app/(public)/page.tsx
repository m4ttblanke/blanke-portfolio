import { Cover } from "@/components/cover/cover";
import { SelectedWork } from "@/components/work/selected-work";

export const metadata = {
  title: "Matt Blanke",
  description: "CS student and software engineer.",
  alternates: { canonical: "/" },
};

// THE COVER (M3), then SELECTED WORK (M4A): the first physical intrusion of
// the work into the publication. See components/cover/cover.tsx and
// components/work/selected-work.tsx -- M3's own markup/CSS are untouched.
export default function Home() {
  return (
    <>
      <Cover />
      <SelectedWork />
    </>
  );
}

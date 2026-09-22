import { ContentFrame, PageFrame } from "@/components/shell/page";
import { TAGLINE } from "@/lib/site";

export const metadata = {
  title: "Matt Blanke",
  description: "CS student and software engineer.",
  alternates: { canonical: "/" },
};

// Intentionally sparse until the cover (M3). The masthead already carries the
// contents, so the old link list is gone.
export default function Home() {
  return (
    <PageFrame>
      <ContentFrame>
        <h1>Matt Blanke</h1>
        <p>{TAGLINE}</p>
      </ContentFrame>
    </PageFrame>
  );
}

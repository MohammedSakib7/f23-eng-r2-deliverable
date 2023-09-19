import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import AddSpeciesDialog from "./add-species-dialog";
import SpeciesCard from "./species-card";

export default async function SpeciesList() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // Deleting and updating species restructures rows on supabase table and consequently the species cards.
  // Ordering by id keeps the cards from moving out of place after editing
  const { data: species } = await supabase.from("species").select("*").order("id");

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <AddSpeciesDialog key={new Date().getTime()} userId={session.user.id} />
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {/* Pass in the userId to the species card in order to only allow a certain feature for certain users */}
        {species?.map((species) => <SpeciesCard key={species.id} species={species} userId={session.user.id}/>)}
      </div>
    </>
  );
}

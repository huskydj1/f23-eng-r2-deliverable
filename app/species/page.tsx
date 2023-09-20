import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import AddSpeciesDialog from "./add-species-dialog";

import type { Database } from "@/lib/schema";
type Species = Database["public"]["Tables"]["species"]["Row"];

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

  const { data: species } = await supabase.from("species").select("*");

  // Passing the session id to the Species Card, in order to handle edit species dialog
  function SpeciesCardWithSession(a: Species) {
    return SpeciesCard(a, session ? session.user.id : "");
  }

  // Sorting our species array in alphabetical order by common_name
  species?.sort(function (a, b) {
    if (a.common_name == null || b.common_name == null) {
      return 1;
    }
    return a.common_name.localeCompare(b.common_name);
  });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <AddSpeciesDialog key={new Date().getTime()} userId={session.user.id} />
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {species?.map((species) => <SpeciesCardWithSession key={species.id} {...species} />)}
      </div>
    </>
  );
}

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

  function SpeciesCardWithSession(a: Species) {
    return SpeciesCard(a, session ? session.user.id : "");
  }

  species?.sort(function (a, b) {
    return a.common_name.localeCompare(b.common_name);
  });
  /* eslint-disable no-console */
  // console.log(
  //   species?.sort(function (a, b) {
  //     return a.common_name.localeCompare(b.common_name);
  //   }),
  // );
  /* eslint-enable no-console */

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <AddSpeciesDialog key={new Date().getTime()} userId={session.user.id} />
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={sortAlphabetically()}>Top</DropdownMenuItem>
            <DropdownMenuItem onClick={sortAlphabetically()}>Bottom</DropdownMenuItem>
            <DropdownMenuItem onClick={sortAlphabetically()}>Right</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {species?.map((species) => <SpeciesCardWithSession key={species.id} {...species} />)}
      </div>
    </>
  );
}

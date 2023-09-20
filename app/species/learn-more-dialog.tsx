"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableHead, TableRow } from "@/components/ui/table";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import { useState } from "react";

type Species = Database["public"]["Tables"]["species"]["Row"];

// This function handles our "learn more" dialog. It is passed a species object, and displays the
// image, scientific_name, common_name, total_population, kingdom, and description.
export default function LearnMoreDialog(species: Species) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Learn More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <h2 className="mt-3 text-3xl font-bold">{species.common_name}</h2>
          </DialogTitle>
        </DialogHeader>
        {/* TODO: Conditionally add elements whose information we already have */}
        {species.image && (
          <div className="relative h-60 w-full">
            <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
          </div>
        )}
        <Table>
          {species.scientific_name ? (
            <TableRow>
              <TableHead>Scientific Name: </TableHead>
              <TableHead className="italic">{species.scientific_name}</TableHead>
            </TableRow>
          ) : null}
          {species.total_population ? (
            <TableRow>
              <TableHead>Total Population: </TableHead>
              <TableHead>{species.total_population}</TableHead>
            </TableRow>
          ) : null}
          {species.kingdom ? (
            <TableRow>
              <TableHead>Kingdom: </TableHead>
              <TableHead>{species.kingdom}</TableHead>
            </TableRow>
          ) : null}
        </Table>
        {species.description}
      </DialogContent>
    </Dialog>
  );
}

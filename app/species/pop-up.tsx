"use client";

// Adopted code from add-species-card-dialogue.tsx that opens a dialogue box for each species card and displays detailed information
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import type { Database } from "@/lib/schema";
type Species = Database["public"]["Tables"]["species"]["Row"];

// The function PopUp takes a species object detailing information about the species for the specific species card
export default function PopUp(species: Species) {
  const [open, setOpen] = useState<boolean>(false);

  // Access species information about the species from the species object and render in the dialogue box
  return(
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full" onClick={() => setOpen(true)}>Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.common_name}</DialogTitle>
          <DialogDescription>
            {species.scientific_name}
          </DialogDescription>
        </DialogHeader>
        {species.image && (
          <div className="relative h-96 w-auto">
            <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
          </div>
        )}
        <div className="mt-3 font-semibold italic" >Kingdom: {species.kingdom ? species.kingdom : "N/A"}
          <div>
            Total Population: {species.total_population ? species.total_population : "N/A"}
          </div>
        </div>
        <Separator className="my-4"/>
        <p>{species.description ? species.description : ""}</p>
        <Button
          type="button"
          className="mt-3 w-full"
          onClick={() => setOpen(false)}
        >
          Exit
        </Button>
      </DialogContent>
    </Dialog>
  );
};
{/* <Button className="mt-3 w-full">Learn More</Button> */}

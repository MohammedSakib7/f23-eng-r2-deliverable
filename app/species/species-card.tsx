// import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import Image from "next/image";
type Species = Database["public"]["Tables"]["species"]["Row"];
import PopUp from "./pop-up"
import EditSpecies from "./edit-species";
import DeleteSpecies from "./delete-species"

// Create an interface that includes the properties of species and an added userId
interface SpeciesCardProps {
  species: Species;
  userId : string;
 }

// Destructures multiple props and gives a type with the interface created earlier
export default function SpeciesCard({species, userId} : SpeciesCardProps) {
  return (
    <div className="min-w-72 m-4 w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.common_name}</h3>
      <h4 className="text-lg font-light italic">{species.scientific_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      {/* Replace with detailed view */}
      {/* Added a client side component PopUp that allows for users to see detailed information about the species in a dialogue box */}
      <PopUp {...species}/>
      {/* Gives the functionality to edit species the cards that the user has created */}
      {/* Conditiionally renders the componenet on the server side: If the author is the user then add functionality */}
      <div className="mt-3 mb-2 flex flex-wrap items-center">
        {species.author === userId && <EditSpecies {...species}/>}
      </div>
      {/* Gives the functionality to delete the species cards that the user has created */}
      {/* Conditiionally renders the componenet on the server side: If the author is the user then add functionality */}
      <div className="mt-1 mb-1 flex flex-wrap items-center">
        {species.author === userId && <DeleteSpecies {...species}/>}
      </div>

    </div>
  );
}


"use client";

/* Adopted code from "add-species-dialogue-box.tsx" file to create a form with only a submit button that will delete the selected species card*/
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { type Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
type Species = Database["public"]["Tables"]["species"]["Row"];

// The speciesSchema is empty because the form takes no input besides the submit button
const speciesSchema = z.object({});

type FormData = z.infer<typeof speciesSchema>;

export default function DeleteSpecies(species: Species) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    mode: "onChange",
  });

  // After updating priviledges on supabase, users can now run a delete query through the submit button to delete on of their species cards
  const onSubmit = async (input: FormData) => {
    // The `input` prop contains data that has already been processed by zod. We can now use it in a supabase query
    const supabase = createClientComponentClient<Database>();
    // Runs delete on the entry from the species table that has an id equal to the passed species id
    const { error } = await supabase.from("species").delete().eq("id", species.id);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    // Refresh and close the dialogue box to show updated information
    form.reset(input);
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full" onClick={() => setOpen(true)}>
          <Icons.trash className="mr-3 h-5 w-5" />
          Delete Species
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Do you want to delete this species card?</DialogTitle>
          <DialogDescription>This action is permanent.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex">
                <Button type="submit" className="ml-1 mr-1 flex-auto" variant="destructive">
                  Yes
                </Button>
                <Button
                  type="button"
                  className="ml-1 mr-1 flex-auto"
                  variant="secondary"
                  onClick={() => setOpen(false)}
                >
                  No
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

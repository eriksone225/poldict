
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

type VoteDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  voteType: 'happened' | 'not_happened';
  onSubmit: (name: string) => void;
  isSubmitting: boolean;
};

const formSchema = z.object({
  voterName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

export function VoteDialog({
  isOpen,
  onOpenChange,
  voteType,
  onSubmit,
  isSubmitting,
}: VoteDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voterName: '',
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.voterName);
    form.reset();
  };

  const title = `Vote: It ${voteType === 'happened' ? 'Will Happen' : "Won't Happen"}`;
  const description = 'To cast your vote, please enter your name. Each name can only vote once per item.';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="voterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
               <Button
                type="submit"
                disabled={isSubmitting}
                className={voteType === 'happened' ? 'bg-success text-success-foreground hover:bg-success/90' : ''}
                variant={voteType === 'not_happened' ? 'destructive' : 'default'}
               >
                {voteType === 'happened' ? <Check className="mr-2 h-4 w-4" /> : <X className="mr-2 h-4 w-4" />}
                Confirm Vote
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

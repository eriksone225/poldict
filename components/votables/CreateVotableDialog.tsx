
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';

import { createVotable } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  creatorName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  title: z.string().min(10, {
    message: 'Prediction must be at least 10 characters.',
  }),
  description: z.string().optional(),
  passcode: z.string().min(4, {
    message: 'Passcode must be at least 4 characters.',
  }),
  isSpecialEvent: z.boolean().default(false),
});

export function CreateVotableDialog() {
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creatorName: '',
      title: '',
      description: '',
      passcode: '',
      isSpecialEvent: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append('creatorName', values.creatorName);
    formData.append('title', values.title);
    if(values.description) {
        formData.append('description', values.description);
    }
    formData.append('passcode', values.passcode);
    if (values.isSpecialEvent) {
      formData.append('isSpecialEvent', 'on');
    }
    
    const result = await createVotable(null, formData);

    if (result.message === 'success') {
      toast({
        title: 'Votable Created!',
        description: 'Your prediction is now live for voting.',
      });
      form.reset();
      setIsOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: result.message || 'An unknown error occurred.',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-5 w-5 mr-2" />
          New Votable
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Votable</DialogTitle>
          <DialogDescription>
            Make a new prediction for others to vote on. Keep it clear and concise.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prediction / Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Will AI achieve sentience by 2030?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optional Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more context or details about your prediction..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="creatorName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="passcode"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Admin Passcode</FormLabel>
                    <FormControl>
                        <Input type="password" placeholder="Min. 4 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="isSpecialEvent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Special Event</FormLabel>
                    <FormDescription>
                      Highlight this votable as a major event.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Votable'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

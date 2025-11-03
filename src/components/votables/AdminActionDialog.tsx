
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

type AdminActionDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  actionType: 'resolve' | 'delete';
  onSubmit: (name: string, passcode: string) => void;
  isSubmitting: boolean;
};

const formSchema = z.object({
  creatorName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  passcode: z.string().min(4, {
    message: 'Passcode must be at least 4 characters.',
  }),
});

export function AdminActionDialog({
  isOpen,
  onOpenChange,
  actionType,
  onSubmit,
  isSubmitting,
}: AdminActionDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creatorName: '',
      passcode: '',
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.creatorName, values.passcode);
    form.reset();
  };
  
  const title = actionType === 'delete' ? 'Delete Votable' : 'Resolve Votable';
  const description = 'Please provide the creator name and passcode to proceed.';
  const buttonText = actionType === 'delete' ? 'Delete' : 'Resolve';

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
              name="creatorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creator Name</FormLabel>
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
                  <FormLabel>Passcode</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} variant={actionType === 'delete' ? 'destructive' : 'default'}>
                {isSubmitting ? 'Processing...' : buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

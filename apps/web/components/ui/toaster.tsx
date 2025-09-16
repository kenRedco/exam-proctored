'use client';

import * as React from 'react';
import { Toast } from './toast';
import { useToast } from './use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 z-[100] flex w-full flex-col items-end gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse sm:p-4">
      {toasts.map(({ id, title, description, variant }) => (
        <Toast
          key={id}
          variant={variant}
          title={title}
          description={description}
          className="w-full sm:w-auto"
        />
      ))}
    </div>
  );
}

# Server Actions Documentation

This directory contains Next.js Server Actions for BloodOS mutations. Server Actions provide better security, automatic error handling, and cache invalidation compared to client-side API calls.

## Available Actions

### Request Actions (`requests.ts`)
- `createBloodRequest(formData: FormData)` - Create a new blood request
- `updateRequestStatus(requestId: string, status: RequestStatus)` - Update request status
- `deleteRequest(requestId: string)` - Delete a blood request
- `respondToRequest(requestId: string, message: string)` - Respond to a request

### User Actions (`user.ts`)
- `updateUserProfile(data)` - Update user profile information
- `reportDonation(data)` - Report a new donation

### Admin Actions (`admin.ts`)
- `approveRequest(requestId: string)` - Approve a blood request
- `rejectRequest(requestId: string, reason?: string)` - Reject a blood request
- `verifyDonation(donationId: string)` - Verify a donation
- `banUser(userId: string, reason?: string)` - Ban a user
- `unbanUser(userId: string)` - Unban a user
- `changeUserRole(userId: string, role)` - Change user role

### Contact Actions (`contact.ts`)
- `submitContactForm(formData: FormData)` - Submit contact form
- `requestDonorContact(donorId: string, requestId?: string)` - Request donor contact info

## Usage Examples

### Basic Form with Server Action

```tsx
"use client";

import { createBloodRequest } from "@/app/actions/requests";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Request"}
    </button>
  );
}

export function CreateRequestForm() {
  const [state, formAction] = useFormState(createBloodRequest, null);

  // Show toast on success/error
  React.useEffect(() => {
    if (state?.success) {
      toast.success("Request created successfully!");
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input name="patientName" required />
      <select name="bloodGroup" required>
        <option value="A+">A+</option>
        {/* ... other options */}
      </select>
      {/* ... other fields */}
      <SubmitButton />
    </form>
  );
}
```

### Button with Server Action

```tsx
"use client";

import { updateRequestStatus } from "@/app/actions/requests";
import { useTransition } from "react";
import { toast } from "sonner";

export function FulfillButton({ requestId }: { requestId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await updateRequestStatus(requestId, "fulfilled");
      
      if (result.success) {
        toast.success("Request marked as fulfilled!");
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Updating..." : "Mark as Fulfilled"}
    </button>
  );
}
```

### Progressive Enhancement with useFormState

```tsx
"use client";

import { submitContactForm } from "@/app/actions/contact";
import { useFormState } from "react-dom";

export function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, null);

  return (
    <form action={formAction}>
      <input name="name" required />
      <input name="email" type="email" required />
      <textarea name="message" required />
      
      {state?.error && (
        <div className="text-destructive">{state.error}</div>
      )}
      
      {state?.success && (
        <div className="text-success">Message sent successfully!</div>
      )}
      
      <button type="submit">Send Message</button>
    </form>
  );
}
```

## Benefits of Server Actions

1. **Better Security**: Actions run on the server with automatic authentication
2. **Automatic Revalidation**: Built-in cache invalidation with `revalidatePath` and `revalidateTag`
3. **Progressive Enhancement**: Forms work without JavaScript
4. **Type Safety**: Full TypeScript support
5. **Error Handling**: Standardized error responses
6. **Reduced Bundle Size**: No client-side API calls needed

## Cache Invalidation Strategy

### Request Actions
- `createBloodRequest`: Revalidates `/requests`, `/requests/manage`, and `requests` tag
- `updateRequestStatus`: Revalidates `/requests`, `/requests/[id]`, `/requests/manage`, and `requests` tag
- `deleteRequest`: Revalidates `/requests`, `/requests/manage`, and `requests` tag

### User Actions
- `updateUserProfile`: Revalidates `/profile` and `/donors` (if donor status changed)
- `reportDonation`: Revalidates `/profile`

### Admin Actions
- `approveRequest`/`rejectRequest`: Revalidates `/admin`, `/requests`, and specific request page
- `verifyDonation`: Revalidates `/admin` and `/donors`
- User management actions: Revalidate `/admin`

## Migration from Client-side API Calls

To migrate existing client-side API calls to Server Actions:

1. Identify the mutation (POST, PATCH, DELETE)
2. Create or use existing Server Action
3. Replace `fetch` call with Server Action call
4. Use `useTransition` or `useFormState` for loading states
5. Remove manual cache invalidation (handled automatically)

### Before (Client-side)
```tsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch('/api/requests', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  if (response.ok) {
    router.refresh(); // Manual refresh
  }
};
```

### After (Server Action)
```tsx
const [isPending, startTransition] = useTransition();

const handleSubmit = (formData: FormData) => {
  startTransition(async () => {
    const result = await createBloodRequest(formData);
    // Cache automatically revalidated
  });
};
```

## Best Practices

1. Always return `{ success: boolean, error?: string, data?: any }` for consistent error handling
2. Use `revalidatePath` for specific pages, `revalidateTag` for broad invalidation
3. Handle authentication at the action level (not in components)
4. Use `useFormState` for form submissions, `useTransition` for button clicks
5. Provide user feedback with toasts or inline messages
6. Keep actions focused and single-purpose

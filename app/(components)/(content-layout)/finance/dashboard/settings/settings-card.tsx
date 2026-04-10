// "use client";

// import { Loader2 } from "lucide-react";

// import { PlaidConnect } from "../../features/plaid/components/plaid-connect";
// import { PlaidDisconnect } from "../../features/plaid/components/plaid-disconnect";
// import { useGetConnectedBank } from "../../features/plaid/api/use-get-connected-bank";

// import { useGetSubscription } from "../../features/subscriptions/api/use-get-subscription";
// import { SubscriptionCheckout } from "../../features/subscriptions/components/subscription-checkout";
// import { cn } from "@/app/lib/utils";
// import { Skeleton } from "../../components/ui/skeleton";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { Separator } from "../../components/ui/separator";

// export const SettingsCard = () => {
//   const {
//     data: connectedBank,
//     isLoading: isLoadingConnectedBank,
//   } = useGetConnectedBank();
//   const {
//     data: subscription,
//     isLoading: isLoadingSubscription,
//   } = useGetSubscription();

//   if (isLoadingConnectedBank || isLoadingSubscription) {
//     return (
//       <Card className="border-none drop-shadow-sm">
//         <CardHeader>
//           <CardTitle className="text-xl line-clamp-1">
//             <Skeleton className="h-6 w-24" />
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[350px] w-full flex items-center justify-center">
//             <Loader2 className="size-6 text-slate-300 animate-spin" />
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="border-none drop-shadow-sm">
//       <CardHeader>
//         <CardTitle className="text-xl line-clamp-1">
//           Settings
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Separator />
//         <div className="flex flex-col gap-y-2 lg:flex-row items-center py-4">
//           <p className="text-sm font-medium w-full lg:w-[16.5rem]">
//             Bank account
//           </p>
//           <div className="w-full flex items-center justify-between">
//             <div className={cn(
//               "text-sm truncate flex items-center",
//               !connectedBank && "text-muted-foreground",
//             )}>
//               {connectedBank
//                 ? "Bank account connected"
//                 : "No bank account connected"
//               }
//             </div>
//             {connectedBank
//               ? <PlaidDisconnect />
//               : <PlaidConnect />
//             }
//           </div>
//         </div>
//         <Separator />
//         <div className="flex flex-col gap-y-2 lg:flex-row items-center py-4">
//           <p className="text-sm font-medium w-full lg:w-[16.5rem]">
//             Subscription
//           </p>
//           <div className="w-full flex items-center justify-between">
//             <div className={cn(
//               "text-sm truncate flex items-center",
//               !subscription && "text-muted-foreground",
//             )}>
//               {subscription
//                 ? `Subscription ${subscription.status}`
//                 : "No subscription active"
//               }
//             </div>
//             <SubscriptionCheckout />
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };








"use client";

import { Loader2 } from "lucide-react";

import { PlaidConnect } from "../../features/plaid/components/plaid-connect";
import { PlaidDisconnect } from "../../features/plaid/components/plaid-disconnect";
import { useGetConnectedBank } from "../../features/plaid/api/use-get-connected-bank";

import { useGetSubscription } from "../../features/subscriptions/api/use-get-subscription";
import { SubscriptionCheckout } from "../../features/subscriptions/components/subscription-checkout";
import { cn } from "@/app/lib/utils";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";

export const SettingsCard = () => {
  const {
    data: connectedBank,
    isLoading: isLoadingConnectedBank,
  } = useGetConnectedBank();
  const {
    data: subscription,
    isLoading: isLoadingSubscription,
  } = useGetSubscription();

  if (isLoadingConnectedBank || isLoadingSubscription) {
    return (
      <Card className="border-none drop-shadow-sm bg-white text-black">
        <CardHeader>
          <CardTitle className="text-xl line-clamp-1">
            <Skeleton className="h-6 w-24 bg-gray-200" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[350px]">
          <Loader2 className="size-6 text-gray-400 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none drop-shadow-sm bg-white text-black">
      <CardHeader>
        <CardTitle className="text-xl line-clamp-1 text-black">
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-6">
        <Separator />

        {/* Bank Account Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-y-2">
          <p className="text-sm font-medium w-full lg:w-[16.5rem] text-black">
            Bank account
          </p>
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2 sm:gap-y-0">
            <div
              className={cn(
                "text-sm truncate flex items-center text-black",
                !connectedBank && "text-muted-foreground"
              )}
            >
              {connectedBank
                ? "Bank account connected"
                : "No bank account connected"}
            </div>
            <div className="mt-2 sm:mt-0">
              {connectedBank ? <PlaidDisconnect /> : <PlaidConnect />}
            </div>
          </div>
        </div>

        <Separator />

        {/* Subscription Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-y-2">
          <p className="text-sm font-medium w-full lg:w-[16.5rem] text-black">
            Subscription
          </p>
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2 sm:gap-y-0">
            <div
              className={cn(
                "text-sm truncate flex items-center text-black",
                !subscription && "text-muted-foreground"
              )}
            >
              {subscription
                ? `Subscription ${subscription.status}`
                : "No subscription active"}
            </div>
            <div className="mt-2 sm:mt-0">
              <SubscriptionCheckout />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
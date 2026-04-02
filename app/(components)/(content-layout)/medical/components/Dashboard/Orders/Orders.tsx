// import Image from "next/image";
// import Link from "next/link";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Copy,
//   CreditCard,
//   File,
//   ListFilter,
//   MoreVertical,
//   Truck,
// } from "lucide-react";

// import { Badge } from "../../../components/ui/badge";
// import { Button } from "../../../components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../../../components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../../../components/ui/dropdown-menu";
// import { Input } from "../../../components/ui/input";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
// } from "../../../components/ui/pagination";
// import { Progress } from "../../../components/ui/progress";
// import { Separator } from "../../../components/ui/separator";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../../components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";

// export default function Orders() {
//   return (
//     <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
//       <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
//         <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
//           <Card className="sm:col-span-2">
//             <CardHeader className="pb-3">
//               <CardTitle>Your Orders</CardTitle>
//               <CardDescription className="max-w-lg text-balance leading-relaxed">
//                 Introducing Our Dynamic Orders Dashboard for Seamless Management
//                 and Insightful Analysis.
//               </CardDescription>
//             </CardHeader>
//             <CardFooter>
//               <Button>Create New Order</Button>
//             </CardFooter>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardDescription>This Week</CardDescription>
//               <CardTitle className="text-4xl">$1329</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-xs text-muted-foreground">
//                 +25% from last week
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Progress value={25} aria-label="25% increase" />
//             </CardFooter>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardDescription>This Month</CardDescription>
//               <CardTitle className="text-3xl">$5,329</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-xs text-muted-foreground">
//                 +10% from last month
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Progress value={12} aria-label="12% increase" />
//             </CardFooter>
//           </Card>
//         </div>
//         <Tabs defaultValue="week">
//           <div className="flex items-center">
//             <TabsList>
//               <TabsTrigger value="week">Week</TabsTrigger>
//               <TabsTrigger value="month">Month</TabsTrigger>
//               <TabsTrigger value="year">Year</TabsTrigger>
//             </TabsList>
//             <div className="ml-auto flex items-center gap-2">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="h-7 gap-1 text-sm"
//                   >
//                     <ListFilter className="h-3.5 w-3.5" />
//                     <span className="sr-only sm:not-sr-only">Filter</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuLabel>Filter by</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuCheckboxItem checked>
//                     Fulfilled
//                   </DropdownMenuCheckboxItem>
//                   <DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
//                   <DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <Button size="sm" variant="outline" className="h-7 gap-1 text-sm">
//                 <File className="h-3.5 w-3.5" />
//                 <span className="sr-only sm:not-sr-only">Export</span>
//               </Button>
//             </div>
//           </div>
//           <TabsContent value="week">
//             <Card>
//               <CardHeader className="px-7">
//                 <CardTitle>Orders</CardTitle>
//                 <CardDescription>
//                   Recent orders from your store.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Customer</TableHead>
//                       <TableHead className="hidden sm:table-cell">
//                         Type
//                       </TableHead>
//                       <TableHead className="hidden sm:table-cell">
//                         Status
//                       </TableHead>
//                       <TableHead className="hidden md:table-cell">
//                         Date
//                       </TableHead>
//                       <TableHead className="text-right">Amount</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     <TableRow className="bg-accent">
//                       <TableCell>
//                         <div className="font-medium">Liam Johnson</div>
//                         <div className="hidden text-sm text-muted-foreground md:inline">
//                           liam../../..example.com
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         Sale
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         <Badge className="text-xs" variant="secondary">
//                           Fulfilled
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell">
//                         2023-06-23
//                       </TableCell>
//                       <TableCell className="text-right">$250.00</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell>
//                         <div className="font-medium">Olivia Smith</div>
//                         <div className="hidden text-sm text-muted-foreground md:inline">
//                           olivia../../..example.com
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         Refund
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         <Badge className="text-xs" variant="outline">
//                           Declined
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell">
//                         2023-06-24
//                       </TableCell>
//                       <TableCell className="text-right">$150.00</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell>
//                         <div className="font-medium">Noah Williams</div>
//                         <div className="hidden text-sm text-muted-foreground md:inline">
//                           noah../../..example.com
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         Subscription
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         <Badge className="text-xs" variant="secondary">
//                           Fulfilled
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell">
//                         2023-06-25
//                       </TableCell>
//                       <TableCell className="text-right">$350.00</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell>
//                         <div className="font-medium">Emma Brown</div>
//                         <div className="hidden text-sm text-muted-foreground md:inline">
//                           emma../../..example.com
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         Sale
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         <Badge className="text-xs" variant="secondary">
//                           Fulfilled
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell">
//                         2023-06-26
//                       </TableCell>
//                       <TableCell className="text-right">$450.00</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell>
//                         <div className="font-medium">Liam Johnson</div>
//                         <div className="hidden text-sm text-muted-foreground md:inline">
//                           liam../../..example.com
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         Sale
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         <Badge className="text-xs" variant="secondary">
//                           Fulfilled
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell">
//                         2023-06-23
//                       </TableCell>
//                       <TableCell className="text-right">$250.00</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell>
//                         <div className="font-medium">Liam Johnson</div>
//                         <div className="hidden text-sm text-muted-foreground md:inline">
//                           liam../../..example.com
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         Sale
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         <Badge className="text-xs" variant="secondary">
//                           Fulfilled
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell">
//                         2023-06-23
//                       </TableCell>
//                       <TableCell className="text-right">$250.00</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell>
//                         <div className="font-medium">Olivia Smith</div>
//                         <div className="hidden text-sm text-muted-foreground md:inline">
//                           olivia../../..example.com
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         Refund
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         <Badge className="text-xs" variant="outline">
//                           Declined
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell">
//                         2023-06-24
//                       </TableCell>
//                       <TableCell className="text-right">$150.00</TableCell>
//                     </TableRow>
//                     <TableRow>
//                       <TableCell>
//                         <div className="font-medium">Emma Brown</div>
//                         <div className="hidden text-sm text-muted-foreground md:inline">
//                           emma../../..example.com
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         Sale
//                       </TableCell>
//                       <TableCell className="hidden sm:table-cell">
//                         <Badge className="text-xs" variant="secondary">
//                           Fulfilled
//                         </Badge>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell">
//                         2023-06-26
//                       </TableCell>
//                       <TableCell className="text-right">$450.00</TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//       <div>
//         <Card className="overflow-hidden">
//           <CardHeader className="flex flex-row items-start bg-muted/50">
//             <div className="grid gap-0.5">
//               <CardTitle className="group flex items-center gap-2 text-lg">
//                 Order ID: Oe31b70H
//                 <Button
//                   size="icon"
//                   variant="outline"
//                   className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
//                 >
//                   <Copy className="h-3 w-3" />
//                   <span className="sr-only">Copy Order ID</span>
//                 </Button>
//               </CardTitle>
//               <CardDescription>Date: November 23, 2023</CardDescription>
//             </div>
//             <div className="ml-auto flex items-center gap-1">
//               <Button size="sm" variant="outline" className="h-8 gap-1">
//                 <Truck className="h-3.5 w-3.5" />
//                 <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
//                   Track Order
//                 </span>
//               </Button>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button size="icon" variant="outline" className="h-8 w-8">
//                     <MoreVertical className="h-3.5 w-3.5" />
//                     <span className="sr-only">More</span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem>Edit</DropdownMenuItem>
//                   <DropdownMenuItem>Export</DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem>Trash</DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </CardHeader>
//           <CardContent className="p-6 text-sm">
//             <div className="grid gap-3">
//               <div className="font-semibold">Order Details</div>
//               <ul className="grid gap-3">
//                 <li className="flex items-center justify-between">
//                   <span className="text-muted-foreground">
//                     Glimmer Lamps x <span>2</span>
//                   </span>
//                   <span>$250.00</span>
//                 </li>
//                 <li className="flex items-center justify-between">
//                   <span className="text-muted-foreground">
//                     Aqua Filters x <span>1</span>
//                   </span>
//                   <span>$49.00</span>
//                 </li>
//               </ul>
//               <Separator className="my-2" />
//               <ul className="grid gap-3">
//                 <li className="flex items-center justify-between">
//                   <span className="text-muted-foreground">Subtotal</span>
//                   <span>$299.00</span>
//                 </li>
//                 <li className="flex items-center justify-between">
//                   <span className="text-muted-foreground">Shipping</span>
//                   <span>$5.00</span>
//                 </li>
//                 <li className="flex items-center justify-between">
//                   <span className="text-muted-foreground">Tax</span>
//                   <span>$25.00</span>
//                 </li>
//                 <li className="flex items-center justify-between font-semibold">
//                   <span className="text-muted-foreground">Total</span>
//                   <span>$329.00</span>
//                 </li>
//               </ul>
//             </div>
//             <Separator className="my-4" />
//             <div className="grid grid-cols-2 gap-4">
//               <div className="grid gap-3">
//                 <div className="font-semibold">Shipping Information</div>
//                 <address className="grid gap-0.5 not-italic text-muted-foreground">
//                   <span>Liam Johnson</span>
//                   <span>1234 Main St.</span>
//                   <span>Anytown, CA 12345</span>
//                 </address>
//               </div>
//               <div className="grid auto-rows-max gap-3">
//                 <div className="font-semibold">Billing Information</div>
//                 <div className="text-muted-foreground">
//                   Same as shipping address
//                 </div>
//               </div>
//             </div>
//             <Separator className="my-4" />
//             <div className="grid gap-3">
//               <div className="font-semibold">Customer Information</div>
//               <dl className="grid gap-3">
//                 <div className="flex items-center justify-between">
//                   <dt className="text-muted-foreground">Customer</dt>
//                   <dd>Liam Johnson</dd>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <dt className="text-muted-foreground">Email</dt>
//                   <dd>
//                     <a href="mailto:">liam../../..acme.com</a>
//                   </dd>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <dt className="text-muted-foreground">Phone</dt>
//                   <dd>
//                     <a href="tel:">+1 234 567 890</a>
//                   </dd>
//                 </div>
//               </dl>
//             </div>
//             <Separator className="my-4" />
//             <div className="grid gap-3">
//               <div className="font-semibold">Payment Information</div>
//               <dl className="grid gap-3">
//                 <div className="flex items-center justify-between">
//                   <dt className="flex items-center gap-1 text-muted-foreground">
//                     <CreditCard className="h-4 w-4" />
//                     Visa
//                   </dt>
//                   <dd>**** **** **** 4532</dd>
//                 </div>
//               </dl>
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
//             <div className="text-xs text-muted-foreground">
//               Updated <time dateTime="2023-11-23">November 23, 2023</time>
//             </div>
//             <Pagination className="ml-auto mr-0 w-auto">
//               <PaginationContent>
//                 <PaginationItem>
//                   <Button size="icon" variant="outline" className="h-6 w-6">
//                     <ChevronLeft className="h-3.5 w-3.5" />
//                     <span className="sr-only">Previous Order</span>
//                   </Button>
//                 </PaginationItem>
//                 <PaginationItem>
//                   <Button size="icon" variant="outline" className="h-6 w-6">
//                     <ChevronRight className="h-3.5 w-3.5" />
//                     <span className="sr-only">Next Order</span>
//                   </Button>
//                 </PaginationItem>
//               </PaginationContent>
//             </Pagination>
//           </CardFooter>
//         </Card>
//       </div>
//     </main>
//   );
// }








// app/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  Truck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
} from 'lucide-react';

import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../../components/ui/pagination";
import { Progress } from "../../../components/ui/progress";
import { Separator } from "../../../components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useToast } from '@/app/projects/components/ui/use-toast';

// AppointmentStatus enum'daki değerler: pending, approved, rejected
// paymentStatus değerleri: unpaid, paid, refunded
interface Appointment {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  gender: string | null;
  doctorName: string | null;
  doctorId: string;
  patientId: string;
  charge: number;
  appointmentDate: string | null;
  appointmentFormattedDate: string;
  appointmentTime: string | null;
  appointmentReason: string | null;
  status: 'pending' | 'approved' | 'rejected'; // 'paid' burada değil!
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentAmount: number | null;
  paymentMethod: string | null;
  meetingLink: string;
  createdAt: string;
}

export default function Orders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    thisWeek: 0,
    thisMonth: 0,
    weekIncrease: 0,
    monthIncrease: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const page = searchParams.get('page') || '1';
      
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', '10');
      
      // Status filtresi (appointment durumu)
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      
      // Payment status filtresi (ödeme durumu)
      if (filterPaymentStatus !== 'all') {
        params.append('paymentStatus', filterPaymentStatus);
      }
      
      // API endpoint düzeltildi: appointments (appoinments değil!)
      const response = await fetch(`/api/onemedical/appoinments?${params.toString()}`);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setAppointments(data.appointments);
      setStats(data.stats);
      setPagination({
        page: data.pagination.page,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointmentDetail = async (id: string) => {
    try {
      const response = await fetch(`/api/onemedical/appoinments/${id}`);
      const data = await response.json();
      setSelectedAppointment(data);
    } catch (error) {
      console.error('Error fetching appointment detail:', error);
      toast({
        title: "Error",
        description: "Failed to fetch appointment details",
        variant: "destructive",
      });
    }
  };

  const updateAppointmentStatus = async (id: string, status?: string, paymentStatus?: string) => {
    try {
      const updateData: any = {};
      if (status) updateData.status = status;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;
      
      const response = await fetch(`/api/onemedical/appoinments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Appointment updated successfully",
        });
        fetchAppointments();
        if (selectedAppointment?.id === id) {
          fetchAppointmentDetail(id);
        }
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [searchParams, filterStatus, filterPaymentStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 text-white">Paid</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Refunded</Badge>;
      case 'unpaid':
        return <Badge variant="outline">Unpaid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <Card className="sm:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Appointments & Orders</CardTitle>
              <CardDescription className="max-w-lg text-balance leading-relaxed">
                Manage patient appointments, track payments, and view order history.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              {/* <Button onClick={() => router.push('/appointments/new')}>
                Create New Appointment
              </Button> */}
            </CardFooter>
          </Card>
 
  
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Appointment Status:</span>
            <select 
              className="px-2 py-1 text-sm border rounded-md bg-background"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Payment Status:</span>
            <select 
              className="px-2 py-1 text-sm border rounded-md bg-background"
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 gap-1"
            onClick={fetchAppointments}
          >
            <ListFilter className="h-3.5 w-3.5" />
            Apply Filters
          </Button>
        </div>

        {/* Appointments Table */}
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>
              Recent patient appointments and orders from your practice.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden sm:table-cell">Doctor</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Payment</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow 
                    key={appointment.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => fetchAppointmentDetail(appointment.id)}
                  >
                    <TableCell>
                      <div className="font-medium">
                        {appointment.firstName} {appointment.lastName}
                      </div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {appointment.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {appointment.doctorName || 'N/A'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(appointment.status)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getPaymentStatusBadge(appointment.paymentStatus)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {appointment.appointmentFormattedDate}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(appointment.charge)}
                    </TableCell>
                  </TableRow>
                ))}
                {appointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No appointments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-xs text-muted-foreground">
              Showing <strong>{appointments.length}</strong> of <strong>{pagination.total}</strong> appointments
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    disabled={pagination.page <= 1}
                    onClick={() => router.push(`?page=${pagination.page - 1}&status=${filterStatus}&paymentStatus=${filterPaymentStatus}`)}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => router.push(`?page=${pagination.page + 1}&status=${filterStatus}&paymentStatus=${filterPaymentStatus}`)}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </div>

      {/* Appointment Details Sidebar */}
      <div>
        {selectedAppointment ? (
          <Card className="overflow-hidden sticky top-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Appointment: {selectedAppointment.firstName} {selectedAppointment.lastName}
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => navigator.clipboard.writeText(selectedAppointment.id)}
                  >
                    <Copy className="h-3 w-3" />
                    <span className="sr-only">Copy Appointment ID</span>
                  </Button>
                </CardTitle>
                <CardDescription>
                  Date: {selectedAppointment.appointmentFormattedDate}
                  {selectedAppointment.appointmentTime && ` at ${selectedAppointment.appointmentTime}`}
                </CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                {selectedAppointment.meetingLink && selectedAppointment.status === 'approved' && (
                  <Button size="sm" variant="outline" className="h-8 gap-1" asChild>
                    <a href={selectedAppointment.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Truck className="h-3.5 w-3.5" />
                      <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        Join Meeting
                      </span>
                    </a>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='bg-white text-black' align="end">
                    <DropdownMenuItem onClick={() => updateAppointmentStatus(selectedAppointment.id, 'approved')}>
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateAppointmentStatus(selectedAppointment.id, 'rejected')}>
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => updateAppointmentStatus(selectedAppointment.id, undefined, 'paid')}>
                      Mark as Paid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateAppointmentStatus(selectedAppointment.id, undefined, 'refunded')}>
                      Mark as Refunded
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <div className="grid gap-3">
                <div className="font-semibold">Appointment Details</div>
                <ul className="grid gap-2">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reason</span>
                    <span>{selectedAppointment.appointmentReason || 'N/A'}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Doctor</span>
                    <span>{selectedAppointment.doctorName || 'N/A'}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span>{getStatusBadge(selectedAppointment.status)}</span>
                  </li>
                </ul>
                <Separator className="my-2" />
                <div className="font-semibold">Payment Details</div>
                <ul className="grid gap-2">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Consultation Fee</span>
                    <span>{formatCurrency(selectedAppointment.charge)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <span>{getPaymentStatusBadge(selectedAppointment.paymentStatus)}</span>
                  </li>
                  {selectedAppointment.paymentMethod && (
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span>{selectedAppointment.paymentMethod}</span>
                    </li>
                  )}
                  <li className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">Total</span>
                    <span>{formatCurrency(selectedAppointment.charge)}</span>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Patient Information</div>
                <dl className="grid gap-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <dt className="text-muted-foreground">Email:</dt>
                    <dd>{selectedAppointment.email || 'N/A'}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <dt className="text-muted-foreground">Phone:</dt>
                    <dd>{selectedAppointment.phone || 'N/A'}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <dt className="text-muted-foreground">Created:</dt>
                    <dd>{formatDate(selectedAppointment.createdAt)}</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Updated <time dateTime={selectedAppointment.createdAt}>
                  {formatDate(selectedAppointment.createdAt)}
                </time>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Select an Appointment</CardTitle>
              <CardDescription>
                Click on any appointment from the list to view details, update status, or manage payments.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <div className="text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No appointment selected</p>
                <p className="text-sm">Click on a row to view details</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
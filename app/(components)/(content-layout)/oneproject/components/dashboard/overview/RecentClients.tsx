import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { User } from "@prisma/client";
import { getInitials } from "../../../lib/generateInitials";
export default function RecentClients({
  recentClients,
}: {
  recentClients: User[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Clients</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentClients.map((client, i) => {
          return (
            <div key={i} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/oneproject/avatars/01.png" alt="Avatar" />
                <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  {client.name}
                </p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
              <div className="ml-auto font-medium">{client.location}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

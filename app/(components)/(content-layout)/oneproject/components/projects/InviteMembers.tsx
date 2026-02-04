"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "../../components/ui/sheet";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { Loader2, Plus, X } from "lucide-react";
import { ExistingUser } from "../../actions/users";
import { InvitationDetailsProps, sendMemberInvitation } from "../../actions/emails";
import { ProjectData } from "../../types/types";
import toast from "react-hot-toast";

// Mock data for members
export default function InviteMembers({
  allMembers,
  projectData,
}: {
  allMembers: ExistingUser[];
  projectData: ProjectData;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<ExistingUser[]>([]);

  const filteredMembers = allMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMember = (memberId: string) => {
    const member = allMembers.find((user) => user.id === memberId);
    if (!member) {
      return;
    }
    setSelectedMembers([...selectedMembers, member]);
    setSearchQuery("");
  };

  const handleRemoveSelected = (memberId: string) => {
    const updatedMembers = selectedMembers.filter(
      (member) => member.id !== memberId
    );
    setSelectedMembers(updatedMembers);
  };
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const projectDetails: InvitationDetailsProps = {
    loginLink: `${baseUrl}/login?returnUrl=/project/${projectData.slug}`,
    projectName: projectData.name,
    projectOwner: projectData.user.name,
    projectOwnerId: projectData.userId,
  };
  const [sending, setSending] = useState(false);
  const handleInvite = async () => {
    console.log("Inviting members:", selectedMembers);
    setSending(true);
    try {
      const res = await sendMemberInvitation(selectedMembers, projectDetails);
      setIsOpen(false);
      setSelectedMembers([]);
      setSearchQuery("");
      setSending(false);
      toast.success("Invite Sent Successfully");
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          <Plus className="w-4 h-4 mr-2" />
          Invite
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Invite Members</SheetTitle>
          <SheetDescription>
            Search and select members to invite to your project.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {selectedMembers.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Selected Members:</h3>
              <ScrollArea className="h-[100px]">
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((user) => {
                    const member = allMembers.find((m) => m.id === user.id);
                    return (
                      <Badge key={user.id} variant="secondary" className="py-1">
                        {member?.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 hover:bg-transparent"
                          onClick={() => handleRemoveSelected(user.id)}
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {member?.name}</span>
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
          {searchQuery && (
            <ScrollArea className="h-[300px] rounded-md border p-4">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selectedMembers.some(
                        (user) => user.id === member.id
                      )}
                      onCheckedChange={() => handleSelectMember(member.id)}
                    />
                    <label
                      htmlFor={`member-${member.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <div>{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.email}
                      </div>
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">
                  No members found
                </p>
              )}
            </ScrollArea>
          )}
          {!searchQuery && (
            <p className="text-center text-muted-foreground">
              Type to search for members
            </p>
          )}
        </div>
        <SheetFooter>
          {sending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Invite Please wait
            </Button>
          ) : (
            <Button
              onClick={handleInvite}
              disabled={selectedMembers.length === 0}
            >
              Invite Selected Members ({selectedMembers.length})
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

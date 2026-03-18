import { getServerSchool } from "../../../../actions/auth";
import { getRemindersByKey } from "../../../../actions/communications";
import { ReminderInbox } from "../../../../components/portal/Inbox";
import React from "react";

export default async function page() {
  const school = await getServerSchool();
  const schoolId = school?.id ?? "";
  const key = "Teachers";
  const reminders = await getRemindersByKey(schoolId, key);
  return (
    <div className="p-8">
      <ReminderInbox reminders={reminders} />
    </div>
  );
}

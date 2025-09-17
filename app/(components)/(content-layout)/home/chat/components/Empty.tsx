import React from "react";
import Image from "next/image";

function Empty() {
  return (
    <div className="flex items-center justify-center border-1 border-conversation-border h-screen w-full bg-colors-panel-header-background">
      <Image src="/chat/whatsapp.gif" alt="whatsapp" height={300} width={300} />
    </div>
  );
}

export default Empty;

"use client";

import dynamic from "next/dynamic";

const DynamicVideoUI = dynamic(() => import("./videoUiKit"), { ssr: false });

export default function VideoCall() {
  return <DynamicVideoUI />;
}

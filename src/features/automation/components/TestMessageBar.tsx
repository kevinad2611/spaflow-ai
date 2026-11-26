"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendTestMessageAction } from "@/features/automation/actions";

interface TestMessageBarProps {
  channel: "zalo" | "email";
  label: string;
  placeholder: string;
}

/** Shared inline bar to send an immediate test message via Zalo OA or Email. */
export function TestMessageBar({
  channel,
  label,
  placeholder,
}: TestMessageBarProps) {
  const [recipient, setRecipient] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  async function handleTest() {
    setIsTesting(true);
    const result = await sendTestMessageAction({ channel, recipient });
    setIsTesting(false);

    if (!result.success) {
      toast.error(result.error ?? "Gửi tin nhắn test thất bại.");
      return;
    }

    toast.success(
      channel === "zalo"
        ? "Đã gửi tin nhắn Zalo test thành công!"
        : "Đã gửi email kiểm tra thành công!"
    );
  }

  return (
    <div className="border-t border-border pt-4">
      <Label htmlFor={`test-${channel}`} className="text-[13px]">
        {label}
      </Label>
      <div className="mt-1.5 flex gap-2">
        <Input
          id={`test-${channel}`}
          type={channel === "email" ? "email" : "tel"}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder={placeholder}
          className="min-h-[44px] rounded-lg"
        />
        <Button
          type="button"
          variant="outline"
          disabled={isTesting}
          onClick={handleTest}
          className="min-h-[44px] shrink-0 rounded-lg px-4"
        >
          <Send className="h-4 w-4" />
          {isTesting ? "Đang gửi..." : "Gửi test"}
        </Button>
      </div>
    </div>
  );
}

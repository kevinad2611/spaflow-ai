"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateAutomationRuleAction } from "@/features/automation/actions";
import {
  TEMPLATE_VARIABLE_CHIPS,
  TRIGGER_METADATA,
} from "@/features/automation/template";
import type { AutomationRuleRow } from "@/features/automation/types";
import type { AutomationChannel } from "@/types/database.types";

interface SingleRuleEditorProps {
  rule: AutomationRuleRow;
}

function SingleRuleEditor({ rule }: SingleRuleEditorProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(rule.is_active);
  const [channel, setChannel] = useState<AutomationChannel>(rule.channel);
  const [template, setTemplate] = useState(rule.template_content);
  const [isSaving, setIsSaving] = useState(false);

  const meta = TRIGGER_METADATA[rule.trigger_type];

  async function handleSave() {
    setIsSaving(true);
    const result = await updateAutomationRuleAction({
      id: rule.id,
      channel,
      template_content: template,
      is_active: isActive,
    });
    setIsSaving(false);

    if (!result.success) {
      toast.error(result.error ?? "Không thể lưu kịch bản.");
      return;
    }
    toast.success(`Đã lưu kịch bản "${meta.title}"`);
    router.refresh();
  }

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 font-heading text-[17px]">
            <BellRing className="h-4 w-4 text-primary" />
            {meta.title}
          </CardTitle>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {meta.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={channel}
            onValueChange={(val) => setChannel(val as AutomationChannel)}
          >
            <SelectTrigger className="min-h-[44px] w-[140px] rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zalo">Zalo OA</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="both">Zalo &amp; Email</SelectItem>
            </SelectContent>
          </Select>

          <Switch
            checked={isActive}
            onCheckedChange={setIsActive}
            aria-label={`Bật tắt ${meta.title}`}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Textarea
          rows={3}
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="rounded-lg text-[15px]"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[12px] text-muted-foreground">
              Chèn nhanh:
            </span>
            {TEMPLATE_VARIABLE_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setTemplate((prev) => `${prev} ${chip}`)}
                className="rounded-md bg-secondary px-2 py-1 text-[12px] font-medium text-primary hover:bg-teal-100"
              >
                {chip}
              </button>
            ))}
          </div>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="min-h-[44px] rounded-lg px-5"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu kịch bản"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface AutomationRulesCardProps {
  rules: AutomationRuleRow[];
}

/** Editable automation rules list for 24h before, 2h before, and 24h post-visit triggers. */
export function AutomationRulesCard({ rules }: AutomationRulesCardProps) {
  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <SingleRuleEditor key={rule.id} rule={rule} />
      ))}
    </div>
  );
}

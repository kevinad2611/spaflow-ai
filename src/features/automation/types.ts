import type {
  AutomationTriggerType,
  MessageChannel,
  MessageStatus,
  PlatformType,
  Tables,
} from "@/types/database.types";

export interface SafePlatformConnection {
  id: string;
  platform: PlatformType;
  is_connected: boolean;
  profile_url: string | null;
  updated_at: string;
}

export type AutomationRuleRow = Tables<"automation_rules">;

export interface MessageLogItem {
  id: string;
  channel: MessageChannel;
  status: MessageStatus;
  error_message: string | null;
  sent_at: string;
  customer: {
    full_name: string;
    phone: string;
  } | null;
  rule: {
    trigger_type: AutomationTriggerType;
  } | null;
}

export interface AutomationPageData {
  connections: SafePlatformConnection[];
  rules: AutomationRuleRow[];
  logs: MessageLogItem[];
}

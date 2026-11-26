import { CheckCircle2, MailWarning, MessageSquareText } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TRIGGER_METADATA } from "@/features/automation/template";
import type { MessageLogItem } from "@/features/automation/types";
import { formatDateVN } from "@/lib/utils";

interface MessageLogsTableProps {
  logs: MessageLogItem[];
}

/** Delivery history table for automated Zalo and Email reminders. */
export function MessageLogsTable({ logs }: MessageLogsTableProps) {
  if (logs.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareText}
        title="Chưa có lịch sử gửi tin nhắn"
        description="Khi hệ thống tự động nhắc lịch khách hàng qua Zalo hoặc Email, lịch sử thành công/thất bại sẽ hiển thị tại đây."
      />
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Kịch bản</TableHead>
              <TableHead>Kênh</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium text-foreground">
                  {log.customer?.full_name ?? "Khách hàng"}
                  {log.customer?.phone ? (
                    <p className="text-[12px] font-normal text-muted-foreground">
                      {log.customer.phone}
                    </p>
                  ) : null}
                </TableCell>
                <TableCell className="text-[14px] text-muted-foreground">
                  {log.rule
                    ? TRIGGER_METADATA[log.rule.trigger_type].title
                    : "Tin nhắn tự động"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {log.channel === "zalo" ? "Zalo OA" : "Email"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {log.status === "sent" ? (
                    <span className="inline-flex items-center gap-1 text-[13px] font-medium text-spa-success">
                      <CheckCircle2 className="h-4 w-4" />
                      Thành công
                    </span>
                  ) : (
                    <div className="space-y-0.5 text-[13px] text-spa-error">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <MailWarning className="h-4 w-4" />
                        Thất bại
                      </span>
                      {log.error_message ? (
                        <p className="max-w-xs text-[12px] text-muted-foreground">
                          {log.error_message}
                        </p>
                      ) : null}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-[13px] text-muted-foreground">
                  {formatDateVN(log.sent_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">
                  {log.customer?.full_name ?? "Khách hàng"}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {log.rule
                    ? TRIGGER_METADATA[log.rule.trigger_type].title
                    : "Tin nhắn tự động"}
                </p>
              </div>
              <Badge variant="secondary">
                {log.channel === "zalo" ? "Zalo" : "Email"}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-[13px]">
              <span
                className={
                  log.status === "sent"
                    ? "font-medium text-spa-success"
                    : "font-medium text-spa-error"
                }
              >
                {log.status === "sent" ? "Thành công" : "Thất bại"}
              </span>
              <span className="text-muted-foreground">
                {formatDateVN(log.sent_at)}
              </span>
            </div>
            {log.error_message ? (
              <p className="mt-1.5 text-[12px] text-spa-error">
                {log.error_message}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}

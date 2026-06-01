"use client";

import Link from "next/link";
import { ArrowRight, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AuditStatus from "./AuditStatus";
import RiskBadge from "./RiskBadge";
import { AuditRecord } from "./types";

function formatDate(iso: string) {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) return iso;

  return value.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function AuditHistory({
  records,
}: {
  records: AuditRecord[];
}) {
  return (
    <Card className="rounded-[2rem] border-[#E7E7E9] bg-white/78 p-6 shadow-[0_24px_64px_rgba(13,12,34,0.06)] backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
            Audit History
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[#0D0C22]">
            Recent resume audits
          </h2>
          <p className="mt-2 text-sm text-[#6E6D7A]">
            Review status, fairness exposure, and report readiness in one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-[1.25rem] border border-[#E7E7E9] bg-[#F6F8FB] px-4 py-3">
            <Search size={18} className="text-[#6E6D7A]" />
            <span className="text-sm text-[#6E6D7A]">
              Search and filters coming next
            </span>
          </div>
          <Button asChild className="rounded-[1.25rem]">
            <Link href="/dashboard/upload">
              <Plus size={18} />
              <span className="ml-2">New Audit</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 hidden overflow-hidden rounded-[1.5rem] border border-[#E7E7E9] lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8FAFC]">
              <TableHead className="px-5">Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fairness</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className="bg-white/70">
                <TableCell className="px-5 py-4">
                  <div>
                    <p className="font-semibold text-[#0D0C22]">
                      {record.candidateName}
                    </p>
                    <p className="mt-1 text-xs text-[#6E6D7A]">{record.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-[#0D0C22]">{record.role}</p>
                  <p className="mt-1 text-xs text-[#6E6D7A]">
                    {record.department}
                  </p>
                </TableCell>
                <TableCell>
                  <AuditStatus status={record.status} />
                </TableCell>
                <TableCell>
                  <RiskBadge level={record.riskLevel} />
                </TableCell>
                <TableCell className="text-sm text-[#6E6D7A]">
                  {formatDate(record.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" className="rounded-[1.25rem]">
                    <Link href={`/dashboard/${record.id}`}>
                      Open
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 grid gap-4 lg:hidden">
        {records.map((record) => (
          <div
            key={record.id}
            className="rounded-[1.5rem] border border-[#E7E7E9] bg-white/70 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#0D0C22]">
                  {record.candidateName}
                </p>
                <p className="mt-1 text-xs text-[#6E6D7A]">
                  {record.role} • {record.id}
                </p>
              </div>
              <AuditStatus status={record.status} />
            </div>

            <p className="mt-3 text-sm text-[#6E6D7A]">{record.summary}</p>

            <div className="mt-4 flex items-center justify-between gap-3">
              <RiskBadge level={record.riskLevel} />
              <Button asChild variant="ghost" className="rounded-[1.25rem]">
                <Link href={`/dashboard/${record.id}`}>Open report</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

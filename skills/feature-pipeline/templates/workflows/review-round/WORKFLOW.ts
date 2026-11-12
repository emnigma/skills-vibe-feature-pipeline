export const meta = {
  name: "__NAME__",
  description: "Review round __ROUND__ of __FEATURE__: packet, reviewers per role and pass plus a ponytail lean pass, validation with a base-branch filter, report with the stop decision",
}

const R = "__SCRATCH__/__FEATURE__-review-r__ROUND__"

phase("Packet")
await stage("write-packet", { dir: R })

// Fill the groups from the packet's file grouping, and the passes from the routing of fp-code-review.
const groups: Record<string, string> = {
  __GROUPS__
}

const passes: { role: string; pass: string; others: string }[] = [
  __PASSES__
]

phase("Review")
const reviews = await forEach(
  [...passes.map((p) => ({ kind: "role", ...p })), { kind: "ponytail", role: "ponytail", pass: "all", others: "none" }],
  (p: any) => {
    const output = `${R}/review/${p.role}-${p.pass}.md`
    const files = groups[p.pass] ?? "all significant files in PACKET.md"
    return p.kind === "role"
      ? stage("review-role", { role: p.role, files, others: p.others, output, dir: R }, { label: `${p.role} ${p.pass}`, retries: 1 })
      : stage("review-ponytail", { output, dir: R }, { label: "ponytail", retries: 1 })
  },
  { onError: "skip" },
) as { output: string; findings: number }[]

const withFindings = reviews.filter((r) => r.findings > 0)
log(`${reviews.length} reviewer artifacts, ${withFindings.length} with findings`)

phase("Validate")
const validations = await forEach(
  withFindings,
  (r) => stage(
    "validate",
    { input: r.output, output: r.output.replace("/review/", "/validation/"), dir: R },
    { label: `validate ${r.output.split("/").pop()}`, retries: 1 },
  ),
  { onError: "skip" },
) as { output: string; tp: number; fp: number; needMoreData: number }[]

phase("Report")
const report = await stage("write-report", {
  dir: R,
  reviews: reviews.map((r) => r.output),
  validations: validations.map((v) => v.output),
}) as { tp: number; fp: number; needMoreData: number; outOfScope: number; incompleteFixes: number; aboveLow: number; summary: string }

return { reviewers: reviews.length, validated: validations.length, ...report }

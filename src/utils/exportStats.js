export function downloadJsonReport(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  triggerDownload(blob, filename);
}

export function downloadCsvReport(filename, rows) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function buildMasterReport({ profile, stats, ranks, favoriteCount, leads }) {
  return {
    exportedAt: new Date().toISOString(),
    master: {
      name: profile.name,
      category: profile.category,
      phone: profile.phone,
      address: profile.address,
    },
    stats: {
      ...stats,
      favoriteCount,
      searchRank: ranks.searchRank,
      categoryRank: ranks.categoryRank,
    },
    leadsCount: leads.length,
  };
}

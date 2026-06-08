export function getDefaultMasterStats() {
  return { profileViews: 0, contactClicks: 0 };
}

export function computeMasterRanks(masterId, allMasters) {
  const master = allMasters.find((item) => item.id === masterId);
  if (!master) {
    return {
      searchRank: null,
      categoryRank: null,
      totalInSearch: allMasters.length,
      totalInCategory: 0,
    };
  }

  const sortByDefault = (a, b) =>
    Number(b.pro) - Number(a.pro) || Number(b.rating) - Number(a.rating);

  const sortedAll = [...allMasters].sort(sortByDefault);
  const searchRank = sortedAll.findIndex((item) => item.id === masterId) + 1;

  const inCategory = allMasters.filter((item) => item.category === master.category);
  const sortedCategory = [...inCategory].sort(sortByDefault);
  const categoryRank =
    sortedCategory.findIndex((item) => item.id === masterId) + 1;

  return {
    searchRank: searchRank || null,
    categoryRank: categoryRank || null,
    totalInSearch: sortedAll.length,
    totalInCategory: sortedCategory.length,
  };
}

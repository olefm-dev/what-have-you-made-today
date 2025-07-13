// Parses the top sites from the browser result, and saves them to our data format
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  const c = (i & 0x00FFFFFF).toString(16).toUpperCase();
  return "00000".substring(0, 6 - c.length) + c;
}

function parseTopSites(sites) {
  var siteList = [];
  for (var site of sites) {
    if (!site.title) {
      site.title = "Configure Me";
    }

    if (!site.url) {
      site.url = "http://configure-me";
    }

    siteList.push({
      title: site.title,
      character: site.title.substring(0, 1),
      url: site.url,
      color: `#${intToRGB(hashCode(site.url))}`,
    });
  }

  return siteList;
}

function ensureValidData(sites) {
  let checkedSites = sites || [];  // Ensure sites is an array

  for (var i = 0; i < 9; i++) {
    if (!checkedSites[i]) {
      checkedSites.push({
        title: "Configure Me",
        character: "A",
        url: "http://configure-me",
        color: `#${intToRGB(hashCode("http://configure-me"))}`,
      });
    } else if (!checkedSites[i].title) {
      checkedSites[i].title = "Configure Me";
      checkedSites[i].character = "A";
    }
  }

  return checkedSites;
}

async function getTopSites() {
  let results;
  try {
    results = await browser.storage.sync.get("whymt-topSites");
  } catch (e) {
    console.error("Error accessing storage:", e);
    results = {};
  }

  if (!results["whymt-topSites"] || results["whymt-topSites"].length === 0) {
    let topResults;
    try {
      topResults = await browser.topSites.get();
    } catch (e) {
      console.error("Error accessing topSites:", e);
      topResults = [];
    }

    const siteList = ensureValidData(parseTopSites(topResults.slice(0, 9)));
    await saveTopSites(siteList);
    return siteList;
  } else {
    return ensureValidData(results["whymt-topSites"]);
  }
}

async function saveTopSites(siteList) {
  try {
    await browser.storage.sync.set({ "whymt-topSites": siteList });
  } catch (e) {
    console.error("Error saving to storage:", e);
  }
}

export default {
  getTopSites: getTopSites,
  saveTopSites: saveTopSites,
};
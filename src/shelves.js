/** COLD-MULTI-SHELF-1.0 machine registry. Author: Aziel Eliab.
 * Same-level Plane A hub cite as live corpus /shelves (corpus#96).
 * Canonical registry stays on the library hub. Do not invent DOIs or LIVE.
 */
import {
  AUTHOR,
  CANON_ORIGIN,
  GITHUB,
  GITHUB_SITE,
  GODLOCK,
  HEDIDNTJUMP,
  LIBRARY,
  PERSON_ID,
  RECEIPTS_HREF,
} from "./copy.js";
import { CITE_DONT_MERGE, GROWTH, INGEST_SPEC, REEXPAND_SPEC } from "./ingest.js";

export const COLD_MULTI_SHELF_SPEC = "COLD-MULTI-SHELF-1.0";
export const COLD_MULTI_SHELF_RULE =
  "Planes A/B/C: A=one CF/GitHub tunnel (5 surfaces / 2 family radii, not 5 shelves); B=alt independent forge/archive tip-pack SLOT; C=USB airgap SLOT. Survival = bytes↔hash. LIVE only after hash verify.";

export const LOCKSET_ID = "AZLOCK-INGEST-REEXPAND-1.0";
export const LOCKSET_TIP = "c831429befc221bd41caeb0a6d1c5361602db5684abab7af6d39714084b6b245";
export const LOCKSET_HREF = LIBRARY + "/lockset.json";

export const SHELVES_PATH = "/shelves";
export const SHELVES_HREF = CANON_ORIGIN + SHELVES_PATH;
export const SHELVES_JSON_PATH = "/v1/shelves";
export const SHELVES_JSON_HREF = CANON_ORIGIN + SHELVES_JSON_PATH;
export const SHELVES_REGISTRY = LIBRARY + "/shelves";
export const SHELVES_REGISTRY_JSON = LIBRARY + "/v1/shelves";
export const COLD_COPY_HREF = LIBRARY + "/cold-copy";

export const CODEBERG_TIP_PACK = "https://codeberg.org/AzielEliab/aziel-lockset-tip";
export const CODEBERG_PACK_SHA256 = "b549362c0736ddb54ddc488812327c464e0da1167281f92fd1a4263eedf5df37";
export const CODEBERG_BRANCH = "main";

export const NO_FAN = "NO-FAN-1.0";
export const NO_FAN_PHRASE = "No falsification. No ambiguity. No misleading.";

export const LAMB_LENS_PATH = "Service → Clarity → Peace";
export const LAMB_LENS_CORPUS = LIBRARY + "/corpus";

export const CAP7_SPEC = "CAP-7-BRIDGE-CITE-1.0";
export const CAP7_BRIDGE = LIBRARY + "/bridge.json";

export const CROSS_NETWORK_SURVIVAL = "CROSS-NETWORK-SURVIVAL";
export const CROSS_NETWORK_SURVIVAL_RULE =
  "If network + live data die tomorrow, the chain still survives via cold copies across independent shelves; survival = bytes↔hash.";
export const NOLIE_NO_REWRITE = "NO-LIE / NO-REWRITE";
export const NOLIE_NO_REWRITE_RULE =
  "receipts that still hash; copies not all on one tunnel; verify without voice; no rewrite key; network never lies even to stay alive.";
export const NOLIE_SPEC = "NO-LIE-NO-REWRITE-1.0";

export const FAMILY_BLAST_RADII = ["cloudflare", "github"];
export const PUBLISHED_SURFACES = 5;
export const PUBLISHED_SURFACE_IDS = [
  "azieleliab-com",
  "azielcorpuslibrary-net",
  "godlock-uk",
  "hedidntjump-com",
  "github-aziel-corpus",
];

const PLANE_A_NOTE =
  "4 CF hubs + GitHub = 5 published surfaces / 2 family radii (cloudflare + github). One cf-github plane, not five shelves.";

export function planeA() {
  return {
    name: "CF/GitHub tunnel",
    status: "live",
    independent: true,
    mirrors: 4,
    published_surfaces: PUBLISHED_SURFACES,
    family_blast_radii: FAMILY_BLAST_RADII.slice(),
    note: PLANE_A_NOTE,
  };
}

export function planeB() {
  return {
    name: "alternate independent forge/archive tip-pack",
    status: "slot",
    doi: null,
    working_targets: ["codeberg", "archive.org", "gitflic-ru"],
    zenodo_working_path: false,
    live_ready: false,
    refuse: "CNS-ZENODO-IP-BAN",
    checklist: "tools/cold_shelf/ALT-FORGE-TIP-PACK-CHECKLIST.md",
    note: "Codeberg uploaded + hash-verify PASS (still SLOT). archive.org + GitFlic RU unverified. LIVE only when all three pass (CNS-PLANE-B-ALL-TARGETS). Zenodo refused (CNS-ZENODO-IP-BAN).",
    codeberg: {
      url: CODEBERG_TIP_PACK,
      branch: CODEBERG_BRANCH,
      pack_sha256: CODEBERG_PACK_SHA256,
      lockset_tip: LOCKSET_TIP,
      hash_verify: "pass",
      tip_verified: true,
      live_ready: false,
      status: "slot",
      refuse: "CNS-PLANE-B-ALL-TARGETS",
    },
  };
}

export function planeC() {
  return {
    name: "USB airgap + optional second forge",
    status: "slot",
    primary: "usb_airgap",
    refuse: ["CNS-OPERATOR-ATTEST", "CNS-NO-FORGE-MIRROR"],
    checklist: "tools/cold_shelf/USB-AIRGAP-ATTEST.md",
    attest:
      "USB offline-verify before LIVE: copy the airgap pack off-network, run verify-airgap.sh / sha256sum -c SHA256SUMS against the published tip, then operator attest (CNS-OPERATOR-ATTEST).",
  };
}

export function planes() {
  return { A: planeA(), B: planeB(), C: planeC() };
}

/** Cap-7 is design_of only. Bridge is cited, not hosted. resolves_to_hub stays false. */
export function cap7Cite() {
  return {
    spec: CAP7_SPEC,
    design_of_only: true,
    bridge: CAP7_BRIDGE,
    resolves_to_hub: false,
    name_may_change: true,
    public_icann: false,
    fifth_product: false,
    visible_1520_chrome: false,
    sites: {
      azeliab: {
        design_of: CANON_ORIGIN + "/",
        resolves_to_hub: false,
      },
      azcorpus: {
        design_of: LIBRARY + "/",
        resolves_to_hub: false,
      },
      azlibrary: {
        design_of: LIBRARY + "/",
        resolves_to_hub: false,
      },
      godlock: {
        design_of: GODLOCK + "/",
        resolves_to_hub: false,
      },
      hedidntjump: {
        design_of: HEDIDNTJUMP + "/",
        resolves_to_hub: false,
      },
    },
    note: "Cap-7 names inherit design_of the four hubs only. If a bridge is present, resolves_to_hub stays false. Not aliases, not CNAME/redirect, not hub hostnames. This hub does not host /bridge.json.",
  };
}

export function lambLensCite() {
  return {
    path: LAMB_LENS_PATH,
    corpus: LAMB_LENS_CORPUS,
    plane_a_ui: LAMB_LENS_CORPUS,
    azbrowser: "AZBrowser (AZB-1.0): Lamb Lens ethical research browser. Cite; refuse harvest; no invented visits.",
    this_host_hosts_corpus_ui: false,
    note: "Lamb Lens path is Service → Clarity → Peace. Corpus / Lamb Lens Plane A UI stays on the library hub. This hub cites the path; it does not host /corpus.",
  };
}

export function noFanCite() {
  return {
    spec: NO_FAN,
    phrase: NO_FAN_PHRASE,
    invented_doi: false,
    invented_archive_org_url: false,
    invented_gitflic_url: false,
    five_surfaces_are_not_five_shelves: true,
    live_without_all_three_plane_b_targets: false,
  };
}

function planeAHost(id, origin, extras = {}) {
  return {
    id,
    plane: "A",
    kind: "other",
    status: "live",
    origin,
    lockset: LOCKSET_HREF,
    receipts: origin.replace(/\/$/, "") + "/receipts",
    shelves: origin.replace(/\/$/, "") + "/shelves",
    blast_radius: "cf-github",
    independent: false,
    lockset_shelf: true,
    lockset_local: false,
    verified_in_this_repo: false,
    verify: "Named Plane A mirror of the same tip; lockset bytes live on the corpus hub",
    note: "One of four Plane A host mirrors. Not an independent shelf.",
    ...extras,
  };
}

export function paperDeposits() {
  return [
    {
      doi: "10.5281/zenodo.21435707",
      payload: "ShadowLock paper",
      in_repo_cite: "dossiers/shadowlock-aziel-dossier-1.0.md",
      tip_verified: false,
      reuse_as_plane_b: false,
    },
    {
      doi: "10.5281/zenodo.21435730",
      payload: "DecisionGATE paper",
      in_repo_cite: "dossiers/decisiongate-aziel-dossier-1.0.md",
      tip_verified: false,
      reuse_as_plane_b: false,
    },
    {
      doi: "10.5281/zenodo.22258015",
      payload: "TrajectoryLock TL-WP-0.1",
      in_repo_cite: "dossiers/trajectorylock-aziel-dossier-1.0.md",
      tip_verified: false,
      reuse_as_plane_b: false,
    },
    {
      doi: "10.5281/zenodo.22257762",
      payload: "WhistleLock WL-WP-0.1 / FoldLock FL-WP-0.3",
      in_repo_cite: [
        "dossiers/whistlelock-aziel-dossier-1.0.md",
        "dossiers/foldlock-aziel-dossier-1.0.md",
      ],
      tip_verified: false,
      reuse_as_plane_b: false,
    },
    {
      doi: "10.5281/zenodo.22257493",
      payload: "EmployeeLock EL-WP-0.1",
      in_repo_cite: "dossiers/employeelock-aziel-dossier-1.0.md",
      tip_verified: false,
      reuse_as_plane_b: false,
    },
  ];
}

export function shelvesList() {
  return [
    {
      id: "plane-a-cf-github",
      plane: "A",
      kind: "other",
      status: "live",
      blast_radius: "cf-github",
      independent: true,
      lockset_shelf: true,
      mirrors: [
        {
          id: "azieleliab-com",
          origin: CANON_ORIGIN,
          lockset: LOCKSET_HREF,
          lockset_local: false,
          receipts: RECEIPTS_HREF,
          shelves: SHELVES_HREF,
          verified_in_this_repo: false,
        },
        {
          id: "azielcorpuslibrary-net",
          origin: LIBRARY,
          lockset: LOCKSET_HREF,
          receipts: LIBRARY + "/receipts",
          shelves: SHELVES_REGISTRY,
          verified_in_this_repo: true,
        },
        {
          id: "godlock-uk",
          origin: GODLOCK,
          lockset: LOCKSET_HREF,
          lockset_local: false,
          receipts: GODLOCK + "/receipts",
          shelves: GODLOCK + "/shelves",
          verified_in_this_repo: false,
        },
        {
          id: "hedidntjump-com",
          origin: HEDIDNTJUMP,
          lockset: LOCKSET_HREF,
          lockset_local: false,
          receipts: HEDIDNTJUMP + "/receipts",
          shelves: HEDIDNTJUMP + "/shelves",
          verified_in_this_repo: false,
        },
      ],
      git: "https://github.com/AzielEliab/aziel-corpus",
      tags: [
        { name: "v2.6.2", commit: "8ba6d9331da4854858e8e4c94319d402c36508e5" },
        { name: "v0.1.0", commit: "176172847f828ec4f20bfbb388c1edfcace64b8b" },
      ],
      verify:
        "in-repo Worker on the corpus hub serves lockset.json whose core SHA-256 is the published tip; four hosts are mirrors of that tip, not four shelves",
      note: "LIVE multi-host, same tunnel. Count as one CF/GitHub plane.",
    },
    {
      id: "plane-a-git-aziel-corpus",
      plane: "A",
      kind: "git_mirror",
      status: "live",
      url: "https://github.com/AzielEliab/aziel-corpus",
      blast_radius: "cf-github",
      independent: false,
      lockset_shelf: true,
      tags: [
        { name: "v2.6.2", commit: "8ba6d9331da4854858e8e4c94319d402c36508e5" },
        { name: "v0.1.0", commit: "176172847f828ec4f20bfbb388c1edfcace64b8b" },
      ],
      verify: "git tag objects exist on origin",
      note: "Same Plane A blast radius as the four CF hosts. Not a second independent shelf.",
    },
    planeAHost("plane-a-host-azieleliab-com", CANON_ORIGIN, {
      receipts: RECEIPTS_HREF,
      shelves: SHELVES_HREF,
      verify: "This hub publishes /shelves as a machine cite of the canonical corpus registry. Local lockset.json is not invented.",
    }),
    planeAHost("plane-a-host-azielcorpuslibrary-net", LIBRARY, {
      verified_in_this_repo: true,
      verify: "Worker origin serves published lockset tip",
    }),
    planeAHost("plane-a-host-godlock-uk", GODLOCK),
    planeAHost("plane-a-host-hedidntjump-com", HEDIDNTJUMP),
    {
      id: "plane-b-alt-forge-archive",
      plane: "B",
      kind: "other",
      status: "slot",
      doi: null,
      url: null,
      blast_radius: "alt-forge-archive",
      independent: true,
      lockset_shelf: true,
      lockset_doi: false,
      working_targets: ["codeberg", "archive.org", "gitflic-ru"],
      refuse: "CNS-NO-FORGE-MIRROR",
      checklist: "tools/cold_shelf/ALT-FORGE-TIP-PACK-CHECKLIST.md",
      reason:
        "Plane B working shelf is an alternate independent forge/archive tip-pack (Codeberg / archive.org / GitFlic RU). Codeberg hash-verify PASS; archive.org + GitFlic still unverified. SLOT until all three pass. cite.json / lockset doi stay null.",
      note: "Not Zenodo. Zenodo is not the Plane B working path (CNS-ZENODO-IP-BAN).",
    },
    {
      id: "plane-b-codeberg-tip-pack",
      plane: "B",
      kind: "git_mirror",
      status: "slot",
      forge: "codeberg",
      url: CODEBERG_TIP_PACK,
      branch: CODEBERG_BRANCH,
      files: ["aziel-tip-pack.tar", "SHA256SUMS", "lockset.json", "verify-airgap.sh"],
      pack_sha256: CODEBERG_PACK_SHA256,
      lockset_tip: LOCKSET_TIP,
      hash_verify: "pass",
      tip_verified: true,
      live_ready: false,
      doi: null,
      blast_radius: "codeberg",
      independent: true,
      lockset_shelf: true,
      refuse: "CNS-PLANE-B-ALL-TARGETS",
      reason:
        "Codeberg tip-pack uploaded and hash-verify PASS. SLOT until archive.org + GitFlic RU also hash-verify. Plane B LIVE only when all three working targets pass. doi null.",
    },
    {
      id: "plane-b-archive-org-tip-pack",
      plane: "B",
      kind: "archive_org",
      status: "slot",
      url: null,
      item: null,
      blast_radius: "archive-org",
      independent: true,
      lockset_shelf: true,
      refuse: "CNS-NO-WARC",
      reason:
        "archive.org tip-pack is a Plane B LIVE-promotion target. No published item in-repo. SLOT. Do not invent a URL. LIVE only after tip hash-verify.",
    },
    {
      id: "plane-b-gitflic-ru-tip-pack",
      plane: "B",
      kind: "git_mirror",
      status: "slot",
      forge: "gitflic-ru",
      url: null,
      blast_radius: "gitflic-ru",
      independent: true,
      lockset_shelf: true,
      refuse: "CNS-NO-FORGE-MIRROR",
      reason:
        "GitFlic (RU) tip-pack is a Plane B LIVE-promotion target. No verified URL in-repo. SLOT. Do not invent a URL. LIVE only after tip hash-verify.",
    },
    {
      id: "plane-b-zenodo-tip-pack",
      plane: "B",
      kind: "zenodo_doi",
      status: "refused",
      doi: null,
      url: null,
      blast_radius: "zenodo-cern",
      independent: true,
      lockset_shelf: false,
      lockset_doi: false,
      refuse: ["CNS-ZENODO-IP-BAN", "CNS-NO-TIP-DOI"],
      checklist: "tools/cold_shelf/ZENODO-TIP-PACK-CHECKLIST.md",
      reason:
        "Operator IP banned at Zenodo (CNS-ZENODO-IP-BAN). Zenodo is not the Plane B working shelf. No tip-pack DOI (CNS-NO-TIP-DOI). cite.json / lockset doi stay null. Do not invent. Paper deposits are not this slot.",
    },
    {
      id: "plane-c-usb-airgap",
      plane: "C",
      kind: "usb_airgap",
      status: "slot",
      blast_radius: "operator-airgap",
      independent: true,
      lockset_shelf: true,
      primary: true,
      refuse: "CNS-OPERATOR-ATTEST",
      pack: "node tools/cold_shelf/cli.mjs airgap",
      checklist: "tools/cold_shelf/USB-AIRGAP-ATTEST.md",
      attest:
        "USB offline-verify before LIVE: copy the airgap pack off-network, run verify-airgap.sh / sha256sum -c SHA256SUMS against the published tip, then operator attest (CNS-OPERATOR-ATTEST).",
      reason:
        "USB airgap export is the Plane C primary pack (tarball + SHA256SUMS + verify script). Shelf stays SLOT until an operator attests an off-network copy still hashes (CNS-OPERATOR-ATTEST). USB offline-verify before LIVE.",
    },
    {
      id: "plane-c-forge-off-github",
      plane: "C",
      kind: "git_mirror",
      status: "slot",
      url: null,
      forge: null,
      blast_radius: "second-forge",
      independent: true,
      lockset_shelf: true,
      refuse: "CNS-NO-FORGE-MIRROR",
      reason:
        "Optional Plane C second-forge slot. Codeberg / archive.org / GitFlic RU are Plane B working targets, not this slot. No account URL here. SLOT. Do not invent a URL.",
    },
    {
      id: "ipfs-lockset",
      plane: null,
      kind: "ipfs_cid",
      status: "slot",
      cid: null,
      url: null,
      independent: true,
      lockset_shelf: true,
      refuse: "CNS-NO-CID",
      reason: "Extra slot, not a named plane. No published CID. Do not invent one.",
    },
  ];
}

export function shelvesRegistry() {
  return {
    spec: COLD_MULTI_SHELF_SPEC,
    author: AUTHOR,
    identity: AUTHOR,
    umbrella: "CROSS-NETWORK-SURVIVAL-1.0",
    no_lie_spec: NOLIE_SPEC,
    lockset_id: LOCKSET_ID,
    lockset_tip: LOCKSET_TIP,
    lockset_zenodo: null,
    lockset_doi: null,
    planes: planes(),
    paper_deposits: paperDeposits(),
    published_surfaces: PUBLISHED_SURFACES,
    published_surface_ids: PUBLISHED_SURFACE_IDS.slice(),
    published_surfaces_note: "4 CF hubs + GitHub. Not 5 independent shelves.",
    family_blast_radii: FAMILY_BLAST_RADII.slice(),
    min_independent_shelves: 3,
    independent_live_blast_radii: ["cf-github"],
    independent_live_count: 1,
    independent_requirement_met: false,
    survival: "bytes↔hash",
    crawlers: "extra-shelf-not-reexpand",
    training_residue: "rumor",
    kinds: ["zenodo_doi", "git_mirror", "ipfs_cid", "archive_org", "usb_airgap", "other"],
    statuses: ["live", "slot", "refused"],
    live: [
      "plane-a-cf-github",
      "plane-a-git-aziel-corpus",
      "plane-a-host-azieleliab-com",
      "plane-a-host-azielcorpuslibrary-net",
      "plane-a-host-godlock-uk",
      "plane-a-host-hedidntjump-com",
    ],
    slot: [
      "plane-b-alt-forge-archive",
      "plane-b-codeberg-tip-pack",
      "plane-b-archive-org-tip-pack",
      "plane-b-gitflic-ru-tip-pack",
      "plane-c-usb-airgap",
      "plane-c-forge-off-github",
      "ipfs-lockset",
    ],
    refused: ["plane-b-zenodo-tip-pack"],
    shelves: shelvesList(),
    verify: {
      paste_hash: LIBRARY + "/receipts/verify?hash=",
      machine: LIBRARY + "/v1/receipts/verify?hash=",
      lockset: LOCKSET_HREF,
      shelves: SHELVES_REGISTRY,
      this_host: SHELVES_HREF,
      cli: "node tools/cold_shelf/cli.mjs verify --hash <64-hex> | --file ",
      rule:
        "yes/no against the published lockset tip " +
        LOCKSET_TIP +
        ". Cheap mismatch. cite, don't merge. bytes survive; crawlers do not re-expand.",
      reexpand: "original receipts + prev-hash; not index→mesh (" + REEXPAND_SPEC + ")",
      reheal: "self tip + trusted pull or phoenix-WAIT; never neighbor vote",
      crawlers: "extra shelves, not re-expand",
      training_residue: "rumor",
    },
    growth_on: true,
    softwares_tab: false,
    mesh_radio: false,
    az_gen_live_icann_publish: false,
    note:
      CROSS_NETWORK_SURVIVAL +
      ": " +
      CROSS_NETWORK_SURVIVAL_RULE +
      " " +
      NOLIE_NO_REWRITE +
      ": " +
      NOLIE_NO_REWRITE_RULE +
      " " +
      COLD_MULTI_SHELF_RULE +
      " Plane A is one CF/GitHub tunnel (5 published surfaces / 2 family radii; independent_live_count stays 1). Plane B is alt independent forge/archive SLOT; Zenodo tip-pack is refused (CNS-ZENODO-IP-BAN). doi null. Paper deposits are not tip-pack Plane B. Plane C USB stays SLOT until CNS-OPERATOR-ATTEST.",
  };
}

export function shelvesDoc() {
  const registry = shelvesRegistry();
  return {
    spec: COLD_MULTI_SHELF_SPEC,
    rule: COLD_MULTI_SHELF_RULE,
    author: AUTHOR,
    identity: AUTHOR,
    person_id: PERSON_ID,
    ingest_as_receipt: INGEST_SPEC,
    cross_network_survival: CROSS_NETWORK_SURVIVAL,
    cross_network_survival_rule: CROSS_NETWORK_SURVIVAL_RULE,
    no_lie: "NO-LIE",
    no_rewrite: "NO-REWRITE",
    no_lie_no_rewrite: NOLIE_NO_REWRITE,
    no_lie_no_rewrite_rule: NOLIE_NO_REWRITE_RULE,
    no_lie_spec: NOLIE_SPEC,
    cold_multi_shelf: COLD_MULTI_SHELF_SPEC,
    cold_multi_shelf_rule: COLD_MULTI_SHELF_RULE,
    lockset_id: LOCKSET_ID,
    lockset_tip: LOCKSET_TIP,
    cite: CANON_ORIGIN + "/cite.json",
    llms: CANON_ORIGIN + "/llms.txt",
    ai: CANON_ORIGIN + "/ai.txt",
    lockset: LOCKSET_HREF,
    lockset_local: false,
    canonical_registry: SHELVES_REGISTRY,
    this_host: SHELVES_HREF,
    this_host_json: SHELVES_JSON_HREF,
    github: GITHUB,
    github_site: GITHUB_SITE,
    doi: null,
    growth_on: GROWTH === "on",
    visible_1520_chrome: false,
    no_fan: noFanCite(),
    lamb_lens: lambLensCite(),
    cap7: cap7Cite(),
    cite_dont_merge: CITE_DONT_MERGE,
    registry,
    planes: planes(),
    verify: registry.verify,
  };
}

export function shelvesCite() {
  return {
    spec: COLD_MULTI_SHELF_SPEC,
    rule: COLD_MULTI_SHELF_RULE,
    author: AUTHOR,
    person_id: PERSON_ID,
    shelves: SHELVES_HREF,
    shelves_json: SHELVES_JSON_HREF,
    canonical_registry: SHELVES_REGISTRY,
    shelves_registry: SHELVES_REGISTRY,
    shelves_registry_json: SHELVES_REGISTRY_JSON,
    cold_copy: COLD_COPY_HREF,
    lockset: LOCKSET_HREF,
    lockset_id: LOCKSET_ID,
    lockset_tip: LOCKSET_TIP,
    lockset_doi: null,
    doi: null,
    published_surfaces: PUBLISHED_SURFACES,
    family_blast_radii: FAMILY_BLAST_RADII.slice(),
    independent_live_blast_radii: ["cf-github"],
    independent_live_count: 1,
    independent_requirement_met: false,
    planes: planes(),
    growth_on: true,
    visible_1520_chrome: false,
    software_tab: false,
    no_fan: noFanCite(),
    lamb_lens: lambLensCite(),
    cap7: cap7Cite(),
    note: "Machine cite of COLD-MULTI-SHELF-1.0. Canonical registry is the corpus hub. This host is a Plane A mirror, not a second independent shelf.",
  };
}

export function shelvesLlmsBlock() {
  return [
    "## " + COLD_MULTI_SHELF_SPEC,
    "",
    COLD_MULTI_SHELF_RULE,
    CROSS_NETWORK_SURVIVAL + ": " + CROSS_NETWORK_SURVIVAL_RULE,
    NOLIE_NO_REWRITE + ": " + NOLIE_NO_REWRITE_RULE,
    "Person @id: " + PERSON_ID,
    "Lamb Lens: " + LAMB_LENS_PATH + " (Corpus / Lamb Lens UI " + LAMB_LENS_CORPUS + "; this hub cites only)",
    "Growth-ON Allow.",
    NO_FAN + ": " + NO_FAN_PHRASE,
    "Cap-7: design_of only. If a bridge is present, resolves_to_hub: false. Bridge cite: " + CAP7_BRIDGE,
    "- Canonical registry: " + SHELVES_REGISTRY,
    "- This host: " + SHELVES_HREF + " · " + SHELVES_JSON_HREF,
    "- Lockset (canonical): " + LOCKSET_HREF + " tip " + LOCKSET_TIP,
    "- Plane A: 5 published surfaces / 2 family radii (cloudflare + github). independent_live_count stays 1. Not 5 shelves.",
    "- Plane B: Codeberg " +
      CODEBERG_TIP_PACK +
      " pack SHA-256 " +
      CODEBERG_PACK_SHA256 +
      " hash-verify PASS; still SLOT until archive.org + GitFlic also verify (CNS-PLANE-B-ALL-TARGETS). Zenodo refused (CNS-ZENODO-IP-BAN). doi null.",
    "- Plane C: USB airgap SLOT until CNS-OPERATOR-ATTEST.",
    "- LIVE only after hash verify. Do not invent archive.org / GitFlic URLs or tip-pack DOIs.",
    "",
  ].join("\n");
}

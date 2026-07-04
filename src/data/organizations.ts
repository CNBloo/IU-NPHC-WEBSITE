/**
 * Static placeholder data for the 8 active + 1 inactive NPHC chapters at IU
 * Bloomington. This exists so the Organizations page has real content before
 * Sanity CMS is wired up in Phase 2 — the Phase 2 seed script should reuse
 * these exact values (colors, founding info, official site URLs) when
 * creating the Sanity organization documents, so this research isn't
 * duplicated.
 *
 * Colors marked `source: "official"` come directly from each org's own
 * published brand/design guidelines. Colors marked `source: "approximate"`
 * are the closest well-established equivalent for orgs whose brand guide
 * PDF isn't easily accessible publicly — swap these for exact values if a
 * chapter officer can get the real guide from national HQ.
 *
 * `iuChartered` is deliberately `null` where a specific charter date isn't
 * publicly documented anywhere findable (Sigma Gamma Rho's Epsilon Chi) —
 * left for a chapter officer to fill in rather than guessed at.
 */

export type OrgColor = {
  label: string;
  hex: string;
  source: "official" | "approximate";
};

export type Organization = {
  slug: string;
  chapterDesignation: string;
  orgName: string;
  status: "active" | "inactive";
  statusNote?: string;
  colors: OrgColor[];
  nationalFounded: {
    date: string;
    location: string;
    founders: string[];
  };
  iuChartered: {
    date: string;
    note?: string;
  } | null;
  officialSiteUrl: string;
};

export const ORGANIZATIONS: Organization[] = [
  {
    slug: "delta-sigma-theta",
    chapterDesignation: "Gamma Nu",
    orgName: "Delta Sigma Theta Sorority, Inc.",
    status: "active",
    colors: [
      { label: "Crimson", hex: "#A6192E", source: "approximate" },
      { label: "Cream", hex: "#F9E6D3", source: "approximate" },
    ],
    nationalFounded: {
      date: "January 13, 1913",
      location: "Howard University",
      founders: [
        "Osceola Macarthy Adams",
        "Marguerite Young Alexander",
        "Winona Cargile Alexander",
        "Ethel Cuff Black",
        "Bertha Pitts Campbell",
        "Zephyr Chisom Carter",
        "Edna Brown Coleman",
        "Jessie McGuire Dent",
        "Frederica Chase Dodd",
        "Myra Davis Hemmings",
        "Olive C. Jones",
        "Jimmie Bugg Middleton",
        "Pauline Oberdorfer Minor",
        "Vashti Turley Murphy",
        "Naomi Sewell Richardson",
        "Mamie Reddy Rose",
        "Eliza Pearl Shippen",
        "Florence Letcher Toms",
        "Ethel Carr Watson",
        "Wertie Blackwell Weaver",
        "Madree Penn White",
        "Edith Motte Young",
      ],
    },
    iuChartered: {
      date: "November 8, 1947",
      note: "Chartered by 5 women at IU.",
    },
    officialSiteUrl: "https://www.deltasigmatheta.org",
  },
  {
    slug: "omega-psi-phi",
    chapterDesignation: "Zeta Epsilon",
    orgName: "Omega Psi Phi Fraternity, Inc.",
    status: "active",
    colors: [
      { label: "Royal Purple", hex: "#6D2077", source: "official" },
      { label: "Old Gold", hex: "#B7A57A", source: "official" },
    ],
    nationalFounded: {
      date: "November 17, 1911",
      location: "Howard University",
      founders: ["Edgar Amos Love", "Oscar James Cooper", "Frank Coleman"],
    },
    iuChartered: {
      date: "October 20, 1947",
    },
    officialSiteUrl: "https://oppf.org",
  },
  {
    slug: "sigma-gamma-rho",
    chapterDesignation: "Epsilon Chi",
    orgName: "Sigma Gamma Rho Sorority, Inc.",
    status: "active",
    colors: [
      { label: "Royal Blue", hex: "#002F87", source: "approximate" },
      { label: "Gold", hex: "#FFB81C", source: "approximate" },
    ],
    nationalFounded: {
      date: "November 12, 1922",
      location: "Butler University (Indianapolis, Indiana)",
      founders: [
        "Mary Lou Allison Gardner Little",
        "Nannie Mae Gahn Johnson",
        "Vivian Irene White Marbury",
        "Bessie Mae Downey Rhoades Martin",
        "Cubena McClure",
        "Hattie Mae Annette Dulin Redford",
        "Dorothy Hanley Whiteside",
      ],
    },
    iuChartered: null,
    officialSiteUrl: "https://www.sgrho1922.org",
  },
  {
    slug: "phi-beta-sigma",
    chapterDesignation: "Epsilon Iota",
    orgName: "Phi Beta Sigma Fraternity, Inc.",
    status: "active",
    colors: [
      { label: "Royal Blue", hex: "#19468D", source: "official" },
      { label: "Pure White", hex: "#FFFFFF", source: "official" },
    ],
    nationalFounded: {
      date: "January 9, 1914",
      location: "Howard University",
      founders: ["A. Langston Taylor", "Leonard F. Morse", "Charles I. Brown"],
    },
    iuChartered: {
      date: "January 3, 1972",
    },
    officialSiteUrl: "https://phibetasigma1914.org",
  },
  {
    slug: "alpha-kappa-alpha",
    chapterDesignation: "Tau",
    orgName: "Alpha Kappa Alpha Sorority, Inc.",
    status: "active",
    colors: [
      { label: "Salmon Pink", hex: "#F9B5AC", source: "approximate" },
      { label: "Apple Green", hex: "#8DB600", source: "approximate" },
    ],
    nationalFounded: {
      date: "January 15, 1908",
      location: "Howard University",
      founders: [
        "Ethel Hedgeman Lyle",
        "Anna Easter Brown",
        "Beulah Burke",
        "Lillie Burke",
        "Marjorie Hill",
        "Margaret Flagg Holmes",
        "Lavinia Norman",
        "Lucy Diggs Slowe",
        "Marie Woolfolk Taylor",
      ],
    },
    iuChartered: {
      date: "December 16, 1922",
      note: "The first sorority for Black women at IU, chartered by 5 women.",
    },
    officialSiteUrl: "https://www.aka1908.com",
  },
  {
    slug: "alpha-phi-alpha",
    chapterDesignation: "Gamma Eta",
    orgName: "Alpha Phi Alpha Fraternity, Inc.",
    status: "active",
    colors: [
      { label: "Black", hex: "#000000", source: "official" },
      { label: "Old Gold", hex: "#BB8D09", source: "official" },
    ],
    nationalFounded: {
      date: "December 4, 1906",
      location: "Cornell University",
      founders: [
        "Henry Arthur Callis",
        "Charles Henry Chapman",
        "Eugene Kinckle Jones",
        "George Biddle Kelley",
        "Nathaniel Allison Murray",
        "Robert Harold Ogle",
        "Vertner Woodson Tandy",
      ],
    },
    iuChartered: {
      date: "September 11, 1947",
      note: "Founded by 7 men at IU on March 29, 1947, chartered that September.",
    },
    officialSiteUrl: "https://apa1906.net",
  },
  {
    slug: "zeta-phi-beta",
    chapterDesignation: "Delta Epsilon",
    orgName: "Zeta Phi Beta Sorority, Inc.",
    status: "active",
    colors: [
      { label: "Royal Blue", hex: "#184B8D", source: "official" },
      { label: "White", hex: "#FFFFFF", source: "official" },
    ],
    nationalFounded: {
      date: "January 16, 1920",
      location: "Howard University",
      founders: [
        "Arizona Cleaver Stemons",
        "Pearl Anna Neal",
        "Myrtle Tyler Faithful",
        "Viola Tyler Goings",
        "Fannie Pettie Watts",
      ],
    },
    iuChartered: {
      date: "April 23, 1973",
      note: "Chartered by 15 charter members.",
    },
    officialSiteUrl: "https://zphib1920.org",
  },
  {
    slug: "kappa-alpha-psi",
    chapterDesignation: "Alpha",
    orgName: "Kappa Alpha Psi Fraternity, Inc.",
    status: "inactive",
    statusNote: "Chapter inactive — anticipated to return in the 2027 academic year.",
    colors: [
      { label: "Crimson", hex: "#70110C", source: "official" },
      { label: "Cream", hex: "#F2EBD7", source: "official" },
    ],
    nationalFounded: {
      date: "January 5, 1911",
      location: "Indiana University Bloomington",
      founders: [
        "Elder Watson Diggs",
        "John Milton Lee",
        "Byron K. Armstrong",
        "Guy Levis Grant",
        "Ezra D. Alexander",
        "Henry T. Asher",
        "Marcus P. Blakemore",
        "Paul Caine",
        "Edward G. Irvin",
        "George W. Edmonds",
      ],
    },
    iuChartered: {
      date: "January 5, 1911",
      note: "The Alpha chapter is the fraternity's founding chapter — Kappa Alpha Psi was born at IU.",
    },
    officialSiteUrl: "https://www.kappaalphapsi1911.com",
  },
];

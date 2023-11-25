export enum AreaType {
  REGION = 'region',
  DEPARTMENT = 'department',
  COMMUNITY = 'community',
  MUNICIPALITY = 'municipality',
  CITY = 'city',
  VILLAGE = 'village',
  NEIGHBORHOOD = 'neighborhood',
  DISTRICT = 'district',
  QUARTER = 'quarter',
}

// Cyprus: 6555dc7b62dcf94c2b9dcd3a
export interface ICountry {
  name: string;
  countryCode: string;
  lowerCase: string;
  en: string;
  el?: string;
  ru?: string;
  tr?: string;
}

/*
* Regions:
*  - Nicosia:   6555ddc262dcf94c2b9dcd3f
*  - Limassol:  6555ded862dcf94c2b9dcd43
*  - Paphos:    6555df7762dcf94c2b9dcd44
*  - Larnaca:   6555dfe362dcf94c2b9dcd45
*  - Famagusta: 6555e04d62dcf94c2b9dcd46
*
* Cities:
*  - Nicosia:   6556057a62dcf94c2b9dcd50
*  - Limassol:  6556066462dcf94c2b9dcd51
*  - Paphos:    655606d762dcf94c2b9dcd52
*  - Larnaca:   6556076e62dcf94c2b9dcd54
*  - Famagusta: 6556082762dcf94c2b9dcd55
*
* Limassol Municipalities:
*  - Ypsonas Municipality:          655ecf1d62dcf94c2b9dcd99
*  - Kato Polemidia Municipality:   655ed0bb62dcf94c2b9dcd9a
*  - Limassol Municipality:         655ed1e362dcf94c2b9dcd9b
*  - Agios Athanasios Municipality: 655ed31c62dcf94c2b9dcd9c
*  - Germasogeia Municipality:      655ed43562dcf94c2b9dcd9d
*
* Nicosia Region Municipalities:
*  - Dali: 6561d6b262dcf94c2b9dcda5
*
* Nicosia City Municipalities:
*  - Aglantzia:      655ef09262dcf94c2b9dcd9e
*  - Agios Dometios: 655ef2bb62dcf94c2b9dcd9f
*  - Latsia:         655ef42362dcf94c2b9dcda0
*  - Egkomi:         655ef64362dcf94c2b9dcda1
*  - Lakatamia:      6561d01d62dcf94c2b9dcda2
*  - Strovolos:      6561d17162dcf94c2b9dcda3
*  - Geri:           6561d40862dcf94c2b9dcda4
*  - Tseri:          6561dad362dcf94c2b9dcda7
*  - Nicosia:        6561dde762dcf94c2b9dcda8
* */
export interface IGeoArea<TCountry = string, TArea = string> {
  name: string;
  type: AreaType;
  country: TCountry;
  alterNames: string[];
  lowerCase: string;
  parent: TArea;
  children: TArea[];
  status: 'official' | 'unofficial';
  en: string;
  el?: string;
  ru?: string;
  tr?: string;
}

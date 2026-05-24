interface LastAction {
  status: string
  timestamp: number
  relative: string
}

interface Status {
  description: string
  details: string
  state: string
  color: string
  until: number
}

export interface PlayerInformation {
  rank: string
  level: number
  gender: string
  property: string
  signup: string
  awards: number
  friends: number
  enemies: number
  forum_posts: number
  karma: number
  age: number
  role: string
  donator: 1
  player_id: number
  name: string
  property_id: number
  competition: null
  revivable: number
  life: {
    current: number
    maximum: number
    increment: number
    interval: number
    ticktime: number
    fulltime: number
  }
  status: Status
  job: {
    position: string
    company_id: number
    company_name: string
    company_type: number
  }
  faction: {
    position: string
    faction_id: number
    days_in_faction: number
    faction_name: string
    faction_tag: string
  }
  states: {
    hospital_timestamp: number
    jail_timestamp: number
  }
  last_action: LastAction
}

export interface MemberInformation {
  name: string
  level: number
  days_in_faction: number
  last_action: LastAction
  status: Status
  position: string
  personalstats: Record<string, unknown>
}

export interface MemberInformationWithId extends MemberInformation {
  member_id: string
}

export interface EmployeeInformation {
  name: string
  position: string
  days_in_company: number
  wage: number
  manual_labor: number
  intelligence: number
  endurance: number
  effectiveness: {
    working_stats: number
    settled_in: number
    director_education: number
    addiction: number
    total: number
  }
  last_action: LastAction
  status: Status
}

export interface CompanyInformation {
  company_employees: {
    [key: string]: EmployeeInformation
  }
}

export interface FactionInformation {
  ID: number
  name: string
  tag: string
  tag_image: string
  leader: number
  'co-leader': number
  respect: number
  age: number
  capacity: number
  best_chain: number
  ranked_wars: Record<string, unknown>
  raid_wars: Record<string, unknown>
  peace: Record<string, unknown>
  rank: {
    level: number
    name: string
    division: number
    position: number
    wins: number
  }
  members: {
    [key: string]: MemberInformation
  }
}

const PersonalStatCategories = [
  'combat',
  'trading',
  'crime',
  'weapons',
  'medical',
  'money',
  'drugs',
  'travel',
  'faction',
  'boosters',
  'activity',
  'job',
  'racing',
  'education',
  'miscellaneous',
] as const
type PersonalStatCategory = (typeof PersonalStatCategories)[keyof typeof PersonalStatCategories]

const PersonalStatTypes = ['time', 'money', 'number', 'percentage', 'liquid', 'other'] as const
type PersonalStatType = (typeof PersonalStatTypes)[keyof typeof PersonalStatTypes]

export interface PersonalStat {
  category: PersonalStatCategory
  label: string
  type: PersonalStatType
}

export interface CustomPersonalStat extends PersonalStat {
  calculate: (stats: PersonalStatsRaw) => number
}

export interface CustomPersonalStats {
  [key: string]: CustomPersonalStat
}

export interface PersonalStats {
  [key: string]: PersonalStat
}

export interface PersonalStatsRaw {
  [key: string]: number
}

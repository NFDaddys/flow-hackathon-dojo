export interface Reward {
    name: string;
    icon: string;
    image: string;
    level?: number;
    criteria: number;
    reward: string;
    claimed: false,
    rid: 0,
    type: string 
}

export interface UserObject {
  checkins: [];
  address: string;
  created: string,
  membersince?: string;
  lastcheckin?: string;
  totalPoints?: number;
  level?: number;
  rewards?: [];
}

export const InitValue : UserObject = {
    checkins: [],
      address: '',
      created: '',
      membersince: '',
      lastcheckin: '',
      totalPoints: 0,
      level: 0,
      rewards: []
  }
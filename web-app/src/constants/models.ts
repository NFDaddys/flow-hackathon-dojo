export interface Reward {
    name: string;
    icon: string;
    image: string;
    level: number | undefined | string;
    criteria: number;
    reward: string;
    claimed: false,
    rid: 0,
    type: string 
    pointTotal?: number;
    title?: any;
}

export interface MediaMetadata {
    userName?: string;
    avatar?: string;
    bio?: string;
    email?: string;
    twitter?: string;
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
  metaData?: MediaMetadata;
  tests: [];
  testRewards?: [];
}

export const InitUserMetaData : MediaMetadata = {
    userName: '',
    avatar: 'Gravatar',
    bio: '',
    email: '',
    twitter: ''
}

export const InitValue : UserObject = {
    checkins: [],
    address: '',
    created: '',
    membersince: '',
    lastcheckin: '',
    totalPoints: 0,
    level: 0,
    rewards: [],
    tests: []
}

export const InitReward : Reward = {
    name: '',
    icon: '',
    image: '',
    level: 0,
    criteria: 0,
    reward: '',
    claimed: false,
    rid: 0,
    type: '',
    pointTotal: 0
}
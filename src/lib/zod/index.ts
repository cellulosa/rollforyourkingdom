import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { defaults } from '../game/defaults';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const AccountScalarFieldEnumSchema = z.enum(['id','userId','type','provider','providerAccountId','refresh_token','access_token','expires_at','expires_in','token_type','scope','id_token','session_state']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const SessionScalarFieldEnumSchema = z.enum(['id','sessionToken','userId','expires']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const StateScalarFieldEnumSchema = z.enum(['id','startTime','userId','turn','action','dice','playedDice','wood','food','gold','outlawsAlliance','blackrockClan','nomadicRiders','citySlots','fight','invadingHightown','assignedBarbariansAtGate','built','traded','mercenaryTroopsHired','plagueErased','unlockedAdvancements','paidToThieves','dieReRolledOrChanged','extraGoldForCoinage']);

export const TempScalarFieldEnumSchema = z.enum(['id','resource']);

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','emailVerified','image']);

export const VerificationTokenScalarFieldEnumSchema = z.enum(['identifier','token','expires']);

export const DieReRolledOrChangedSchema = z.enum(['reRolled','changed']);

export type DieReRolledOrChangedType = `${z.infer<typeof DieReRolledOrChangedSchema>}`

export const FightEnumSchema = z.enum(['stepZero','stepOne','stepTwo','stepThree']);

export type FightEnumType = `${z.infer<typeof FightEnumSchema>}`

export const DieEnumSchema = z.enum(['one','two','three','four','five','six']);

export type DieEnumType = `${z.infer<typeof DieEnumSchema>}`

export const CityDistrictEnumSchema = z.enum(['hightown','mountainside','theGrove','countryDistrict']);

export type CityDistrictEnumType = `${z.infer<typeof CityDistrictEnumSchema>}`

export const ResourceEnumSchema = z.enum(['wood','food','gold']);

export type ResourceEnumType = `${z.infer<typeof ResourceEnumSchema>}`

export const EnemyEnumSchema = z.enum(['outlawsAlliance','blackrockClan','nomadicRiders']);

export type EnemyEnumType = `${z.infer<typeof EnemyEnumSchema>}`

export const BuildingEnumSchema = z.enum(['none','tree','farm','lumberjack','quarry','castle','market','abbey','tavern']);

export type BuildingEnumType = `${z.infer<typeof BuildingEnumSchema>}`

export const ActionEnumSchema = z.enum(['rollTheDice','reRollOrChange','reRollOrChangeForAstronomy','playDie','feedTheHungry','barbariansAtGate','claimVictory','harvest','nomadsAttack','collect','outlawsAttack','mineGold','blackrockClanAttacks','trade','mercenaryTroop','plague','build','attack','thieves','worship','research','riot','doneWithDie']);

export type ActionEnumType = `${z.infer<typeof ActionEnumSchema>}`

export const AdvancementEnumSchema = z.enum(['cropRotation','improvedWoodaxe','smelting','cavalry','archers','steelWeaponry','medicine','fyrdMilitia','guildOfThieves','astronomy','masonry','coinage']);

export type AdvancementEnumType = `${z.infer<typeof AdvancementEnumSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  refresh_token: z.string().nullable(),
  access_token: z.string().nullable(),
  expires_at: z.number().int().nullable(),
  expires_in: z.number().int().nullable(),
  token_type: z.string().nullable(),
  scope: z.string().nullable(),
  id_token: z.string().nullable(),
  session_state: z.string().nullable(),
})

export type Account = z.infer<typeof AccountSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.string().cuid(),
  sessionToken: z.string(),
  userId: z.string(),
  expires: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  emailVerified: z.coerce.date().nullable(),
  image: z.string().nullable(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// VERIFICATION TOKEN SCHEMA
/////////////////////////////////////////

export const VerificationTokenSchema = z.object({
  identifier: z.string(),
  token: z.string(),
  expires: z.coerce.date(),
})

export type VerificationToken = z.infer<typeof VerificationTokenSchema>

/////////////////////////////////////////
// STATE SCHEMA
/////////////////////////////////////////

export const StateSchema = z.object({
  action: ActionEnumSchema,
  dice: DieEnumSchema.array().max(defaults.dice),
  playedDice: DieEnumSchema.array().max(defaults.dice),
  citySlots: BuildingEnumSchema.array().length(defaults.cityDistrictSlots),
  fight: FightEnumSchema,
  built: BuildingEnumSchema.array().max(defaults.buildUpTo),
  plagueErased: CityDistrictEnumSchema.array(),
  unlockedAdvancements: AdvancementEnumSchema.array(),
  paidToThieves: CityDistrictEnumSchema.array(),
  dieReRolledOrChanged: DieReRolledOrChangedSchema.nullable(),
  id: z.string().cuid(),
  startTime: z.coerce.date(),
  userId: z.string(),
  turn: z.number().nonnegative(),
  wood: z.number().nonnegative().max(defaults.maxResource),
  food: z.number().nonnegative().max(defaults.maxResource),
  gold: z.number().nonnegative().max(defaults.maxResource),
  outlawsAlliance: z.number().nonnegative().max(defaults.maxEnemyTroop),
  blackrockClan: z.number().nonnegative().max(defaults.maxEnemyTroop),
  nomadicRiders: z.number().nonnegative().max(defaults.maxEnemyTroop),
  invadingHightown: z.boolean(),
  assignedBarbariansAtGate: z.number().int(),
  traded: z.number().int(),
  mercenaryTroopsHired: z.number().int(),
  extraGoldForCoinage: z.boolean(),
})

export type State = z.infer<typeof StateSchema>

/////////////////////////////////////////
// TEMP SCHEMA
/////////////////////////////////////////

export const TempSchema = z.object({
  resource: ResourceEnumSchema.nullable(),
  id: z.string().cuid(),
})

export type Temp = z.infer<typeof TempSchema>

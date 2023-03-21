import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { type State, StateSchema } from '$lib/zod';
import { newGame } from '$lib/game/newGame';

export const state = t.router({
	load: t.procedure.input(z.string().optional()).query(async ({ ctx, input }) => {
		// query database only if we passed a userId (meaning there is an active session)
		if (input) {
			const result = await ctx.prisma.state.findUnique({
				select: {
					id: true,
					startTime: true,
					user: true,
					userId: true,
					turn: true,
					action: true,
					dice: true,
					playedDice: true,
					wood: true,
					food: true,
					gold: true,
					outlawsAlliance: true,
					blackrockClan: true,
					nomadicRiders: true,
					citySlots: true,
					fight: true,
					invadingHightown: true,
					assignedBarbariansAtGate: true,
					built: true,
					traded: true,
					mercenaryTroopsHired: true,
					plagueErased: true,
					unlockedAdvancements: true,
					paidToThieves: true,
					dieReRolledOrChanged: true,
					extraGoldForCoinage: true
				},
				where: { userId: input }
			});

			// Return game state if found
			if (result) return result as State;

			// Otherwise we need to create a new game
			return (await ctx.prisma.state.create({
				data: {
					...newGame,
					userId: input
				}
			})) as State;
		}
	}),

	save: t.procedure.input(StateSchema).mutation(async ({ ctx, input: { id, ...rest } }) => {
		if (id) {
			await ctx.prisma.state.update({
				data: {
					...rest
				},
				where: { id }
			});
		} else {
			await ctx.prisma.state.create({
				data: {
					...rest
				}
			});
		}
	})
});

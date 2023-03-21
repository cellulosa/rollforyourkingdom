<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { signIn } from '@auth/sveltekit/client';
	import { Github, Facebook, Twitter, Google } from '@steeze-ui/simple-icons';
</script>

<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
	<h2 class="text-center text-2xl font-bold mb-8">Login to play</h2>

	<div class="mt-6 flex flex-col gap-2">
		<button
			class="btn btn-block gap-2 bg-[#3B5998] hover:bg-[#3B5998] border-[#3b5998] hover:border-[#3B5998] text-white"
			on:click={() => signIn('facebook')}
		>
			<Icon src={Facebook} theme="outline" class="h-5 w-5" />
			Facebook
		</button>

		<button
			class="btn btn-block gap-2 bg-[#DB4437] hover:bg-[#C20806] border-[#C20806] hover:border-[#C20806] text-white"
			on:click={() => signIn('google')}
		>
			<Icon src={Google} theme="outline" class="h-5 w-5" />
			Google
		</button>

		<button
			class="btn btn-block gap-2 bg-[#1D9BF0] hover:bg-[#55acee] border-[#55acee] hover:border-[#55acee] text-white"
			on:click={() => signIn('twitter')}
		>
			<Icon src={Twitter} theme="outline" class="h-5 w-5" />
			Twitter
		</button>

		<button
			class="btn btn-block gap-2 bg-[#333333] hover:bg-[#040204] border-[#040204] hover:border-[#040204] text-white"
			on:click={() => signIn('github')}
		>
			<Icon src={Github} theme="outline" class="h-5 w-5" />
			GitHub
		</button>
	</div>
</div>

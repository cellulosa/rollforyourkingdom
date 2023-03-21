<script lang="ts">
	export let colour:
		| 'primary'
		| 'secondary'
		| 'accent'
		| 'info'
		| 'success'
		| 'warning'
		| 'end'
		| null = null;
</script>

<div class="chat chat-start">
	<div
		class="chat-bubble"
		class:chat-bubble-primary={colour === 'primary'}
		class:chat-bubble-secondary={colour === 'secondary'}
		class:chat-bubble-accent={colour === 'accent'}
		class:chat-bubble-info={colour === 'info'}
		class:chat-bubble-success={colour === 'success'}
		class:chat-bubble-warning={colour === 'warning'}
		class:chat-bubble-end={colour === 'end'}
	>
		<slot />
	</div>
</div>

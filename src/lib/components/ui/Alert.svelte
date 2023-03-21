<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { InformationCircle, CheckCircle, ExclamationCircle, XCircle } from '@steeze-ui/heroicons';

	export let type: 'info' | 'success' | 'warning' | 'error' = 'info';
	export let message: string = '';
</script>

<div
	class="alert shadow-lg"
	class:alert-info={type === 'info'}
	class:alert-success={type === 'success'}
	class:alert-warning={type === 'warning'}
	class:alert-error={type === 'error'}
>
	<div>
		<Icon
			src={{
				info: InformationCircle,
				success: CheckCircle,
				warning: ExclamationCircle,
				error: XCircle
			}[type] ?? InformationCircle}
			theme="outline"
			class="stroke-current flex-shrink-0 h-6 w-6"
		/>
		<span>{message}</span>
	</div>
</div>

import { toast } from '@zerodevx/svelte-toast';
import AlertContent from '$lib/components/ui/Alert.svelte';

const general = (type: 'info' | 'success' | 'warning' | 'error', message: string) =>
	toast.push({
		pausable: true,
		component: {
			src: AlertContent,
			props: { type, message }
		}
	});

const info = (message: string) => general('info', message);

const success = (message: string) => general('success', message);

const warning = (message: string) => general('warning', message);

const error = (message: string) => general('error', message);

export const alert = { info, success, warning, error };

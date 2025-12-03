import { registerSW } from 'virtual:pwa-register';

export function registerServiceWorker() {
  if (import.meta.env.MODE === 'development') {
    return;
  }

  registerSW({ immediate: true });
}

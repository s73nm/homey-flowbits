import { consoleLoggingIntegration, init } from '@sentry/browser';

init({
    dsn: 'https://8194cbe2cfab68de4f313fbba1a0f005@o4510381025984512.ingest.de.sentry.io/4510381027229776',
    enableLogs: true,
    integrations: [
        consoleLoggingIntegration({
            levels: ['warn', 'error']
        })
    ],
    sendDefaultPii: false
});

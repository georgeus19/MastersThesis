import z from 'zod';
import axios from 'axios';
import { logAxiosError, ObservabilityTools } from '@klofan/server-utils';
import { SERVER_ENV } from '@klofan/config/env/server';

export type AnalysisNotification = AnalysisDoneProvoNotification;

export async function sendAnalysisNotification(
    notification: AnalysisNotification,
    data: any,
    observability: ObservabilityTools
): Promise<void> {
    return axios
        .post(notification.url, data, {
            timeout: SERVER_ENV.NOTIFICATION_TIMEOUT,
            timeoutErrorMessage: `Timed out when sending notification to ${notification.url}`,
            headers: {
                'Content-Type': 'application/ld+json',
            },
        })
        .then(() => {
            observability.logger.info(
                `Successfully sent ${notification.type} to ${notification.url}.`
            );
        })
        .catch((error) => {
            logAxiosError(
                observability.logger,
                error,
                `Failed to send ${notification.type} to ${notification.url}.`
            );
        });
}

export type AnalysisDoneProvoNotification = {
    type: 'analysis-done-provo-notification';
    url: string;
};

export function isAnalysisDoneProvoNotification(
    notification: AnalysisNotification
): notification is AnalysisDoneProvoNotification {
    return notification.type === 'analysis-done-provo-notification';
}

export const analysisDoneProvoNotificationSchema = z.object({
    type: z.enum(['analysis-done-provo-notification']),
    url: z.string().url(),
});

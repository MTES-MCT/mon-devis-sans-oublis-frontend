// Import main styles from the DSFR
import '@gouvfr/dsfr/dist/dsfr.min.css';

// Import icons from the DSFR
import '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css';
// fr-icon-calendar-event-line,fr-icon-mail-line
import '@gouvfr/dsfr/dist/utility/icons/icons-communication/icons-communication.min.css';
// fr-icon-questionnaire-fill
import '@gouvfr/dsfr/dist/utility/icons/icons-document/icons-document.min.css';
// fr-icon-file-download-line
import '@gouvfr/dsfr/dist/utility/icons/icons-health/icons-health.min.css';
// fr-icon-heart-line
import '@gouvfr/dsfr/dist/utility/icons/icons-map/icons-map.min.css';
// fr-icon-map-pin-2-line
import '@gouvfr/dsfr/dist/utility/icons/icons-media/icons-media.min.css';
// fr-icon-headphone-fill
import '@gouvfr/dsfr/dist/utility/icons/icons-others/icons-others.min.css';
// fr-icon-recycle-fill
import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';
// fr-icon-account-line, fr-icon-arrow-right-line, fr-icon-check-line, fr-icon-information-fill, fr-icon-question-line, fr-icon-star-fill, fr-icon-timer-fill
import '@gouvfr/dsfr/dist/utility/icons/icons-weather/icons-weather.min.css';
// fr-icon-flashlight-fill

// Initialize the DSFR library if running in a browser environment
export async function initDsfr() {
  if (typeof window !== 'undefined') {
    await Promise.all([
      import('@gouvfr/dsfr/dist/dsfr.module.min.js'),
      import('@gouvfr/dsfr/dist/dsfr.nomodule.min.js'),
    ]);
  }
}

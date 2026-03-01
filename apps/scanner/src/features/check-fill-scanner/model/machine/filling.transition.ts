import { FillingEffect } from './filling.effects';
import { FillingState } from './filling.state';
import { FillingEvent } from './filling.types';

export function transition(
  state: FillingState,
  event: FillingEvent,
): { state: FillingState; effects: FillingEffect[] } {
  switch (state.step) {
    case 'SCAN_BUCKET':
      switch (event.type) {
        case 'SCAN_BUCKET': {
          // Request validation via effect
          return {
            state: state, // remain in scan_bucket until async result
            effects: [
              { type: 'SHOW_SCANNER_PROGRESS' },
              { type: 'VALIDATE_BUCKET', qrCode: event.qrCode },
            ],
          };
        }

        case 'BUCKET_VALIDATION_SUCCESS': {
          return {
            state: { step: 'BUCKET_COMPLETED', bucket: event.bucket },
            effects: [{ type: 'SHOW_BUCKET_SUCCESS', bucket: event.bucket }],
          };
        }

        case 'BUCKET_VALIDATION_FAILURE': {
          return {
            state: { step: 'ERROR', message: event.message, prev: state },
            effects: [{ type: 'SHOW_BUCKET_ERROR', message: event.message }],
          };
        }

        default:
          return { state, effects: [] };
      }

    case 'BUCKET_COMPLETED':
      switch (event.type) {
        case 'SCAN_COMPONENT': {
          return {
            state: {
              step: 'COMPONENT_VALIDATING',
              bucket: state.bucket,
              componentScanRequest: { barCode: event.barCode },
            },
            effects: [
              { type: 'SHOW_SCANNER_PROGRESS' },
              {
                type: 'VALIDATE_COMPONENT',
                barCode: event.barCode,
                bucket: state.bucket,
              },
            ],
          };
        }

        default:
          return { state, effects: [] };
      }

    case 'COMPONENT_VALIDATING':
      switch (event.type) {
        case 'COMPONENT_VALIDATION_SUCCESS':
          return {
            state: { step: 'SCAN_COMPLETED', fillingAct: event.fillingAct },
            effects: [
              { type: 'SHOW_COMPONENT_SUCCESS', fillingAct: event.fillingAct },
            ],
          };

        case 'COMPONENT_VALIDATION_FAILURE':
          return {
            state: {
              step: 'ERROR',
              message: event.message,
              prev: { step: 'BUCKET_COMPLETED', bucket: state.bucket },
            },
            effects: [{ type: 'SHOW_COMPONENT_ERROR', message: event.message }],
          };

        default:
          return { state, effects: [] };
      }

    case 'SCAN_COMPLETED':
      return { state, effects: [] };

    case 'ERROR':
      switch (event.type) {
        case 'RESET_ERROR':
          return { state: state.prev, effects: [] };
        default:
          return { state, effects: [] };
      }
  }
}

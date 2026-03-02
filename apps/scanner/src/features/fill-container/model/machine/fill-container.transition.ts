import { FillContainerEffect } from './fill-container.effects';
import { FillContainerState } from './fill-container.state';
import { FillContainerEvent } from './fill-container.types';

export function transition(
  state: FillContainerState,
  event: FillContainerEvent,
): { state: FillContainerState; effects: FillContainerEffect[] } {
  switch (state.step) {
    case 'SCAN_BUCKET':
      switch (event.type) {
        case 'SCAN_BUCKET': {
          return {
            state,
            effects: [
              { type: 'SHOW_SCANNER_PROGRESS' },
              { type: 'VALIDATE_BUCKET', qrCode: event.qrCode },
            ],
          };
        }

        case 'BUCKET_VALIDATION_SUCCESS': {
          return {
            state: { step: 'BUCKET_READY', bucket: event.bucket },
            effects: [{ type: 'SHOW_BUCKET_SUCCESS', bucket: event.bucket }],
          };
        }

        case 'BUCKET_VALIDATION_FAILURE': {
          return {
            state: { step: 'ERROR', message: event.message, prev: state },
            effects: [{ type: 'SHOW_BUCKET_ERROR', message: event.message }],
          };
        }

        case 'RESET_FLOW':
          return { state: { step: 'SCAN_BUCKET' }, effects: [] };

        default:
          return { state, effects: [] };
      }

    case 'BUCKET_READY':
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

        case 'RESET_FLOW':
          return { state: { step: 'SCAN_BUCKET' }, effects: [] };

        default:
          return { state, effects: [] };
      }

    case 'COMPONENT_VALIDATING':
      switch (event.type) {
        case 'COMPONENT_VALIDATION_SUCCESS':
          return {
            state: {
              step: 'SCAN_COMPLETED',
              bucket: state.bucket,
              fillingAct: event.fillingAct,
            },
            effects: [
              {
                type: 'SHOW_COMPONENT_SUCCESS',
                fillingAct: event.fillingAct,
                bucket: state.bucket,
              },
            ],
          };

        case 'COMPONENT_VALIDATION_FAILURE':
          return {
            state: {
              step: 'ERROR',
              message: event.message,
              prev: { step: 'BUCKET_READY', bucket: state.bucket },
            },
            effects: [{ type: 'SHOW_COMPONENT_ERROR', message: event.message }],
          };

        case 'RESET_FLOW':
          return { state: { step: 'SCAN_BUCKET' }, effects: [] };

        default:
          return { state, effects: [] };
      }

    case 'SCAN_COMPLETED':
      switch (event.type) {
        case 'RESET_FLOW':
          return { state: { step: 'SCAN_BUCKET' }, effects: [] };
        default:
          return { state, effects: [] };
      }

    case 'ERROR':
      switch (event.type) {
        case 'RESET_ERROR':
          return { state: state.prev, effects: [] };
        case 'RESET_FLOW':
          return { state: { step: 'SCAN_BUCKET' }, effects: [] };
        default:
          return { state, effects: [] };
      }
  }
}
import { AudioWaveform } from '../AudioWaveform';
import type { IStartRecording } from '../types';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { useEffect, useState } from 'react';

export const useAudioRecorder = (onStateChange?: (state: string) => void) => {
  const [recorderState, setRecorderState] = useState('stopped');

  const { AudioWaveform: NativeAudioWaveform } = NativeModules; // Ensure this matches your native module name
  const audioEventEmitter = new NativeEventEmitter(NativeAudioWaveform);

  const startRecording = (args?: Partial<IStartRecording>) => {
    setRecorderState('recording');
    return AudioWaveform.startRecording(args);
  };

  const stopRecording = () => {
    setRecorderState('stopped');
    return AudioWaveform.stopRecording();
  };

  const pauseRecording = () => {
    setRecorderState('paused');
    return AudioWaveform.pauseRecording();
  };

  const resumeRecording = () => {
    setRecorderState('recording');
    return AudioWaveform.resumeRecording();
  };

  useEffect(() => {
    const handleRecorderStateChange = (event: { state: string }) => {
      if (event?.state) {
        setRecorderState(event.state);
        if (onStateChange) {
          onStateChange(event.state);
        }
      }
    };

    const listener = audioEventEmitter.addListener(
      'onRecorderStateChange',
      handleRecorderStateChange
    );

    return () => {
      listener.remove();
    };
  }, [audioEventEmitter, onStateChange]);

  const getDecibel = () => AudioWaveform.getDecibel();

  return {
    recorderState,
    getDecibel,
    pauseRecording,
    resumeRecording,
    startRecording,
    stopRecording,
  };
};

import { useEffect, useRef } from 'react';

/**
 * Custom hook desenvolvido para interceptar eventos de input de leitores de código de barras
 * (USB/Bluetooth), permitindo a leitura sem depender de um elemento de formulário em foco na UI.
 */
export function useBarcode(onScan) {
  const barcodeBuffer = useRef('');
  const lastKeyTime = useRef(Date.now());

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Evita interceptar o evento keydown caso o foco do usuário esteja em campos de formulário (ex: input, textarea)
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const currentTime = Date.now();
      const timeSinceLastKey = currentTime - lastKeyTime.current;
      
      // Threshold de tempo: leitores de hardware emitem inputs em ~10-20ms. Intervalos maiores que 100ms inferem input de teclado humano.
      if (timeSinceLastKey > 100) { 
        barcodeBuffer.current = '';
      }
      
      lastKeyTime.current = currentTime;

      // Flush do buffer: leitores físicos emitem a tecla "Enter" (CR/LF) no final da leitura do código
      if (e.key === 'Enter') {
        if (barcodeBuffer.current.length >= 3) {
          onScan(barcodeBuffer.current);
          barcodeBuffer.current = '';
        }
      } else if (e.key.length === 1) { // Concatena no buffer apenas se o payload for um caractere validável

        barcodeBuffer.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan]);
}

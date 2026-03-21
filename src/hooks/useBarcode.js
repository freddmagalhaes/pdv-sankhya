import { useEffect, useRef } from 'react';

/**
 * Hook feito especificamente para capturar a digitação ultra-rápida de Leitores
 * Físicos (USB/Bluetooth), sem precisar ter um input de texto selecionado!
 */
export function useBarcode(onScan) {
  const barcodeBuffer = useRef('');
  const lastKeyTime = useRef(Date.now());

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Não queremos interceptar a digitação se o usuário ativamente clicou num campo de texto (ex: input, textarea)
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const currentTime = Date.now();
      const timeSinceLastKey = currentTime - lastKeyTime.current;
      
      // Leitores cospem números com 10 a 20ms de intervalo. Se demorar mais que 100ms, foi teclado humano normal
      if (timeSinceLastKey > 100) { 
        barcodeBuffer.current = '';
      }
      
      lastKeyTime.current = currentTime;

      // Leitores físicos geralmente encerram a bipagem com a tecla "Enter"
      if (e.key === 'Enter') {
        if (barcodeBuffer.current.length >= 3) {
          onScan(barcodeBuffer.current);
          barcodeBuffer.current = '';
        }
      } else if (e.key.length === 1) { // Só grava coisas de 1 caractere ('a', '1', etc)
        barcodeBuffer.current += e.key;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan]);
}

// Utils/audio.js
// Sintetizador nativo do navegador para o Bipe. Não precisamos trazer arquivos .mp3 e lidar com eles offline!

export function playBeep(type = 'success') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return; // Segurança caso navegador bem antigo
    
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    if (type === 'success') {
      oscillator.type = 'sine'; // Som suave e claro
      oscillator.frequency.setValueAtTime(1000, context.currentTime); // Pitch (agudo de leitura)
      gainNode.gain.setValueAtTime(0.1, context.currentTime); // Volume
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1); 
      oscillator.start();
      oscillator.stop(context.currentTime + 0.1);
      
    } else if (type === 'error') {
      oscillator.type = 'sawtooth'; // Som rasgado (erro)
      oscillator.frequency.setValueAtTime(150, context.currentTime); // Pitch grave
      gainNode.gain.setValueAtTime(0.2, context.currentTime); 
      oscillator.start();
      oscillator.stop(context.currentTime + 0.3); // Mais longo e incômodo
    }

  } catch (e) {
    console.error("Audio API error:", e);
  }
}

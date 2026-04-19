// utils/audio.js
// Implementação baseada na Web Audio API nativa para síntese de beep. Dispensa a requisição de assets .mp3 externos.

export function playBeep(type = 'success') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return; // Fallback de compatibilidade para evitar exceptions em browsers legado
    
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    if (type === 'success') {
      oscillator.type = 'sine'; // Define uma onda suave para feedback sonoro positivo
      oscillator.frequency.setValueAtTime(1000, context.currentTime); // Frequência (Pitch agudo do beep)
      gainNode.gain.setValueAtTime(0.1, context.currentTime); // Nível de ganho (volume)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.1); 
      oscillator.start();
      oscillator.stop(context.currentTime + 0.1);
      
    } else if (type === 'error') {
      oscillator.type = 'sawtooth'; // Onda distorcida para feedback de erro
      oscillator.frequency.setValueAtTime(150, context.currentTime); // Pitch grave para indicar falha
      gainNode.gain.setValueAtTime(0.2, context.currentTime); 
      oscillator.start();
      oscillator.stop(context.currentTime + 0.3); // Delay maior para gerar atenção do usuário
    }

  } catch (e) {
    console.error("Audio API error:", e);
  }
}

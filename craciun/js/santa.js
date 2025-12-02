// Animația Moșului: traversează orizontal, apoi se ascunde și permite mesajele centrale.
// Poți ajusta durata pentru "zbor" (ms).
const SANTA_DURATION = 2600;

window.addEventListener('DOMContentLoaded', () => {
    const santaCont = document.getElementById('santa-container');
    // Reset la poziția inițială (off-screen stânga)
    santaCont.style.left = '-110px';
    santaCont.style.transition = `left ${SANTA_DURATION}ms cubic-bezier(.67, .13, .58, .89)`;
    santaCont.classList.remove('hide');
    setTimeout(() => {
        santaCont.style.left = (window.innerWidth + 120) + 'px';
        // După ce trece Moș Crăciun, ascunde și pornește mesajele festive
        setTimeout(() => {
            santaCont.classList.add('hide');
            // Declanșează zona de mesaje (custom event)
            document.dispatchEvent(new Event('santaDone'));
        }, SANTA_DURATION + 350); // mic delay extra pentru final
    }, 145); // mic delay la start să fie natural
});
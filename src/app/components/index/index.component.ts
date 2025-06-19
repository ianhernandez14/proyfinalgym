import { Component, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  menuFijo = false;
  private lectorActivo = false;
  private mensaje: SpeechSynthesisUtterance | null = null;

  constructor(private renderer: Renderer2) {}

  toggleFijarMenu() {
    this.menuFijo = !this.menuFijo;
  }

  activarLector() {
    // Si ya está leyendo, cancelamos
    if (window.speechSynthesis.speaking) {
      this.detenerLector();
      return;
    }

    const texto = this.extraerTextoVisible(document.body);
    this.mensaje = new SpeechSynthesisUtterance(texto);
    this.mensaje.lang = 'es-MX';
    this.mensaje.rate = 1;
    this.mensaje.pitch = 1;

    window.speechSynthesis.speak(this.mensaje);
    this.lectorActivo = true;
  }

  pausarLector() {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  }

  reanudarLector() {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  detenerLector() {
    window.speechSynthesis.cancel();
    this.lectorActivo = false;
  }

  private extraerTextoVisible(element: HTMLElement): string {
    let texto = '';
    const elementos = element.querySelectorAll('*');

    elementos.forEach(el => {
      const estilo = window.getComputedStyle(el);
      const visible = estilo.display !== 'none' && estilo.visibility !== 'hidden';

      if (visible && el.childNodes.length > 0) {
        el.childNodes.forEach(node => {
          if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
            texto += node.textContent.trim() + ' ';
          }
        });
      }
    });

    return texto.trim();
  }

  toggleContraste() {
    document.body.classList.toggle('alto-contraste');
  }

  aumentarTexto() {
    document.body.classList.toggle('fuente-grande');
  }

  cambiarTipografia() {
    document.body.classList.toggle('tipografia-alternativa');
  }
}

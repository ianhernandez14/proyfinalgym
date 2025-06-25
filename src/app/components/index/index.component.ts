import { Component, Renderer2, ViewChild, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  
  menuFijo = false;
  private lectorActivo = false;
  private mensaje: SpeechSynthesisUtterance | null = null;

  //Almacena el evento de instalación cuando es compatible (Android/Chrome)
  deferredPrompt: any = null;

  //Controla si se debe mostrar el botón de instalación
  showInstallButton: boolean = false;

  //Detecta si es un dispositivo iOS
  esIOS: boolean = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  
  //Propiedades para control de volumen
  isMuted = true;
  volume = 50;
  showVolumeControls = false;

  private isDragging = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    //Inicializar el video con volumen 0 
    setTimeout(() => {
      if (this.videoPlayer) {
        this.videoPlayer.nativeElement.volume = 0;
        this.videoPlayer.nativeElement.muted = true;
      }
    }, 1);

this.showInstallButton = true;
     console.log('¿es iOS?', this.esIOS);

    //Caso Android: se lanza el evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton = true;
      console.log('Evento beforeinstallprompt capturado');
    });


    //Caso iOS
    if (this.esIOS)
    {
      this.showInstallButton = true;
    }
  }

   instalarPWA(): void
  {
    console.log('Botón de instalar presionado');
    console.log(this.deferredPrompt);

    //Caso Android con deferredPrompt disponible
    if (this.deferredPrompt)
    {
      Swal.fire({
        title: '¿Instalar aplicación?',
        text: '¿Quieres agregar esta app a tu pantalla de inicio?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, instalar',
        cancelButtonText: 'Cancelar'
      }).then((result) =>
      {
        if (result.isConfirmed)
        {
          //Lanza el prompt oficial del navegador
          this.deferredPrompt.prompt();

          //Espera la respuesta del usuario
          this.deferredPrompt.userChoice.then((choiceResult: any) =>
          {
            if (choiceResult.outcome === 'accepted')
            {
              console.log('App instalada');
            }
            else
            {
              console.log('App no instalada');
            }

            //Limpia el evento
            this.deferredPrompt = null;
            this.showInstallButton = false;
          });
        }
      });
    }

    //Caso iOS
    else if (this.esIOS)
    {
      Swal.fire({
        title: '¿Agregar a pantalla de inicio?',
        html: `
          <p>Para instalar esta app, toca el botón <b>Compartir</b> en Safari y selecciona <b>"Agregar a pantalla de inicio"</b>.</p>
          <img src="assets/icons/ios-share.png" alt="Instrucción iOS" style="width: 100px; margin-top: 10px;">
        `,
        icon: 'info',
        confirmButtonText: 'Entendido'
      });
    }
  }

  toggleMute() {
    if (this.videoPlayer) {
      this.isMuted = !this.isMuted;
      this.videoPlayer.nativeElement.muted = this.isMuted;
      
      if (!this.isMuted && this.volume === 0) {
        this.volume = 50;
        this.videoPlayer.nativeElement.volume = this.volume / 100;
      }
    }
  }

  onVolumeChange(event: any) {
    this.volume = event.target.value;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.volume = this.volume / 100;
      this.isMuted = this.volume === 0;
      this.videoPlayer.nativeElement.muted = this.isMuted;
    }
  }

  subirVolumen() {
    if (this.videoPlayer) {
      this.volume = Math.min(100, this.volume + 10);
      this.videoPlayer.nativeElement.volume = this.volume / 100;
      this.isMuted = false;
      this.videoPlayer.nativeElement.muted = false;
    }
  }

  bajarVolumen() {
    if (this.videoPlayer) {
      this.volume = Math.max(0, this.volume - 10);
      this.videoPlayer.nativeElement.volume = this.volume / 100;
      this.isMuted = this.volume === 0;
      this.videoPlayer.nativeElement.muted = this.isMuted;
    }
  }

  onVolumeBarClick(event: MouseEvent) {
    this.isDragging = true;
    this.updateVolumeFromEvent(event);
  }

  onVolumeBarDrag(event: MouseEvent) {
    if (this.isDragging) {
      this.updateVolumeFromEvent(event);
    }
  }

  onVolumeBarRelease() {
    this.isDragging = false;
  }

  private updateVolumeFromEvent(event: MouseEvent) {
    const volumeBar = event.currentTarget as HTMLElement;
    const rect = volumeBar.getBoundingClientRect();
    const width = rect.width;
    const clickX = event.clientX - rect.left;
    
    //Calcular el porcentaje (de izquierda a derecha)
    const percentage = Math.max(0, Math.min(100, (clickX / width) * 100));
    
    this.volume = Math.round(percentage);
    
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.volume = this.volume / 100;
      this.isMuted = this.volume === 0;
      this.videoPlayer.nativeElement.muted = this.isMuted;
    }
  }

  toggleFijarMenu() {
    this.menuFijo = !this.menuFijo;
  }

  activarLector() {
    //Si ya está leyendo, cancelamos
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-entrenador-detalle',
  templateUrl: './entrenador-detalle.component.html',
  styleUrls: ['./entrenador-detalle.component.css']
})
export class EntrenadorDetalleComponent implements OnInit {
  id: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    //Aquí puedes usar el id para buscar el entrenador en tu API o servicio
  }
}
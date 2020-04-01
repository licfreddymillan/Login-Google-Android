import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-modal-corazon-info',
  templateUrl: './modal-corazon-info.page.html',
  styleUrls: ['./modal-corazon-info.page.scss'],
})
export class ModalCorazonInfoPage implements OnInit {
  @Input() dato
  mostrar:boolean = false
  heart_rate:number
  escapar:boolean = false

  constructor(public modalController: ModalController , private usuarioservicio:UsuarioService) { }

  ngOnInit() {
    if(this.dato == 'cuello'){
      this.mostrar = true
    }else{
      this.mostrar = false
    }
  }

  valor(valor){
    if(valor.target.value > 1 && valor.target.value <= 25  ) {
      this.heart_rate = valor.target.value * 6;
      this.escapar = true
    }else{
      this.escapar = false
    }
    
  }

  salir(){
    if(this.escapar && this.heart_rate > 10 && this.heart_rate  <= 100){
      this.usuarioservicio.latidos(this.heart_rate)
      console.log(this.usuarioservicio.condicionPersona)
      this.modalController.dismiss({
        salir:true
      });
    }else{
      return
    }
  }



}

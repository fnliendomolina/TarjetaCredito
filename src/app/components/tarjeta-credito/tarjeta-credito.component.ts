import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {

  public listarTarjetas:any;
  public form:FormGroup;
  public id:number | undefined;
  public action:string = "agregar";

  constructor(private formBuilder:FormBuilder,
              private toastr: ToastrService,
              private tarjetaService: TarjetaService) {
    this.listarTarjetas = [];
    this.form = this.formBuilder.group({
      id : ['0'],
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    });
   }

  ngOnInit(): void {
    this.getTarjetas();
  }

  agregarTarjeta(){
    if (this.id == undefined)
      this.saveTarjeta(this.form.value);
    else this.editTarjeta(this.form.value);
  }

  editTarjeta(tarjeta:any) {
    this.tarjetaService.editTarjeta(tarjeta,this.id).subscribe(response => {
      if (response.exito == 1)
      {
        this.toastr.success('La tarjeta fue actualizada.','Tarjeta de Credito');
        this.form.reset();
        this.getTarjetas();
      }
    },
    error => {
      this.toastr.error(error.error.mensaje,'Tarjeta de Credito');
    });
  }

  selectTarjeta(tarjeta:any) {
    this.action = "Editar";
    this.id = tarjeta.id;
    this.form.patchValue({
      id: this.id,
      titular: tarjeta.titular,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv,
      numeroTarjeta: tarjeta.numeroTarjeta
    });
  }

  eliminarTarjeta(id:number) {
    this.tarjetaService.deleteTarjeta(id).subscribe(response => {
      if (response.exito == 1)
      {
        this.toastr.error('La tarjeta fue eliminada.','Tarjeta de Credito');
        this.getTarjetas();
      }
    },
    error => {
      this.toastr.error(error.error.mensaje,'Tarjeta de Credito');
    });
    
  }

  getTarjetas()
  {
    this.tarjetaService.getListTarjetas().subscribe(response => {
      if (response.exito == 1) {
        this.listarTarjetas = response.data;
      }
    },
    error => {
        this.toastr.error(error.error.mensaje,'Error Consulta');
    });
  }

  saveTarjeta(tarjeta:any)
  {
    this.tarjetaService.saveTarjeta(tarjeta).subscribe(response => {
      if (response.exito == 1)
      {
        this.toastr.success('Tarjeta ingresada','Tarjeta Credito');
        this.getTarjetas();
        this.form.reset();
      }
    }, error => {
      var errores:any[] = error.error.errors;
      var str:string = '';

      for (let prop in errores) {
        let _err:any[] = errores[prop];
        _err.forEach(element => {
          str += element;
        });
      }
      
      this.toastr.error(str,'Error Consulta');
    });
  }

}

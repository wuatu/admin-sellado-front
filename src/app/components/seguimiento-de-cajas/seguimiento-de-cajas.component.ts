import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SeguimientoDeCajasService } from '../../services/seguimiento-de-cajas.service';
import { CalibradorService } from '../../services/calibrador.service';
import { LineaService } from '../../services/linea.service';
import { Linea } from '../../models/linea';
import { Calibrador } from '../../models/calibrador';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { SeguimientoDeCajas } from '../../models/seguimiento-de-cajas';
import { RegistroDevService } from '../../services/registro-dev.service';



@Component({
  selector: 'app-seguimiento-de-cajas',
  templateUrl: './seguimiento-de-cajas.component.html',
  styleUrls: ['./seguimiento-de-cajas.component.css']
})
export class SeguimientoDeCajasComponent implements OnInit {
  closeResult = '';

  seguimientoDeCajas: any = [];
  seguimientoDeCajasAux: any = [];
  cantidadDeCajas: any = [];
  lineas: any = [];
  calibradores: any = [];
  pageOfItems: Array<any>;

  p: number = 1;

  nombreLinea: string = "lineaPrueba";
  nombreCalibrador: string = "calibradorPrueba";


  currentCalibradorSelected: Calibrador;
  currentLineaSelected: Linea;


  selectedCalibradorText: string = "Seleccionar calibrador";
  selectedCalibradorObject: any;

  selectedLineaText: string = "Seleccionar linea";
  selectedLineaObject: any;

  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = null;
  hasta: string = null;
  tituloBuscarPatente = "Búsqueda de patente";
  cantidadResultadoBusqueda = 0;

  toSearch: string;

  dateSave: string;
  timeStart: string;
  dateStart: string;
  timeFinish: string = " ";
  dateFinish: string = " ";
  dateStartSearch: string;
  dateFinishSearch: string;

  // Array para el dropdown del selector de atributos de busqueda de la caja
  dropDownSearch: any[] = [{ nombre: 'Envase' }, { nombre: 'Variedad' }, { nombre: 'Categoria' }, { nombre: 'Calibre' }];
  SearchText: string = "Seleccionar criterio";
  selectedSearch: any;

  numBox: number = 0;
  bandera: number = 0;
  nombreColaborador: any;

  marked = true;
  theCheckbox = true;

  constructor(private toastr: ToastrService,
    private seguimientoDeCajasService: SeguimientoDeCajasService,
    private calibradorService: CalibradorService,
    private lineaService: LineaService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private registroDevService: RegistroDevService) { }

  ngOnInit() {
    this.fromDate = this.calendar.getToday();
    this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "yyyy-MM-dd", 'en-US');
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    this.agregarRegistroDeCajas();
    this.listarCalibradores();
  }

  toggleVisibility(e) {
    this.marked = e.target.checked;
    console.log("marked: ", this.marked);
    this.setBusquedaCheckBox(this.marked);
  }

  setBusquedaCheckBox(isChecked: boolean) {
    this.seguimientoDeCajas = [];
    for (let i = 0; i < this.seguimientoDeCajasAux.length; i++) {
      if (isChecked && this.seguimientoDeCajasAux[i].is_verificado == '1') {
        console.log("entre añl primer if");
        this.seguimientoDeCajas.push(this.seguimientoDeCajasAux[i]);
      } else if (!isChecked && this.seguimientoDeCajasAux[i].is_verificado == '0') {
        console.log("entre al segundo if");
        this.seguimientoDeCajas.push(this.seguimientoDeCajasAux[i]);
      }
    }
    console.log("aaaa number"+this.seguimientoDeCajasAux[0].is_verificado);
    console.log("aaaa lenght"+this.numBox);
    this.numBox = this.seguimientoDeCajas.length;
  }

  listarLineas(id: string) {
    this.lineaService.getLineasId(id).subscribe(
      res => {
        this.lineas = res.body;
        if (res.status == 200) {
        } else if (res.status == 204) {
          this.toastr.success('no existen líneas actualmente para mostrar', 'Operación satisfactoria');
          return;
        }
        //this.listarSeguimientoDeCajas();

      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener las líneas del calibrador, método listarLineas, component seguimiento-de-cajas');
        this.toastr.error('No se pudo obtener lineas', 'Oops');
      }
    );
  }



  listarCalibradores() {
    this.calibradorService.getCalibradores().subscribe(
      res => {
        this.calibradores = res.body;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component seguimiento-de-cajas');
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }

  buscarPorCriterio() {
    console.log(this.selectedSearch + " " + this.toSearch + " " + this.desde + " " + this.hasta);
    //this.seguimientoDeCajas = [];
    this.seguimientoDeCajasAux = [];
    if (!this.selectedLineaObject && !this.selectedCalibradorObject) {
      this.toastr.error('Se debe seleccionar calibrador y linea', 'Oops');
      return;
    } else if (this.desde == null) {
      this.toastr.error('Se debe seleccionar el rango de fecha de busqueda', 'Oops');
      return;
    } else if (this.selectedLineaObject && this.selectedCalibradorObject) {
      console.log(this.theCheckbox);
      this.seguimientoDeCajasService.getSearchLineAndCaliper(this.selectedSearch, this.toSearch, this.desde, this.hasta, this.selectedLineaObject.id, this.selectedCalibradorObject.id).subscribe(
        res => {
          this.seguimientoDeCajasAux = res.body;

          if (res.status == 200) {
            //this.countBoxSearch();
            this.toastr.success('Cajas selladas obtenidas', 'Operación satisfactoria');
          } else if (res.status == 204) {
            this.toastr.success('no existen cajas selladas actualmente para mostrar', 'Operación satisfactoria');
            return;
          }          
          if (this.bandera == 0) {
            this.nombreColaborador = this.seguimientoDeCajasAux[0].nombre_usuario;
            console.log(this.seguimientoDeCajasAux.nombre_usuario + "!!!!!!!!!!!!!");
            this.bandera++;
          }
          this.toastr.success('Operación satisfactoria', 'Registros obtenidos');
          console.log(this.marked);
          this.setBusquedaCheckBox(this.marked);
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudieron obtener las cajas por el criterio seleccionado, método buscarPorCriterio, component seguimiento-de-cajas');
          this.toastr.error('No se pudo obtener la busqueda de seguimiento de cajas', 'Oops');
        }
      );
    }
  }

  countBoxSearch() {
    this.seguimientoDeCajasService.countBox(this.selectedSearch, this.toSearch, this.desde, this.hasta, this.selectedLineaObject.id, this.selectedCalibradorObject.id).subscribe(
      res => {
        this.numBox = 0;
        this.cantidadDeCajas = res.body;
        if (res.status == 200) {
          this.numBox = this.cantidadDeCajas[0].cantidad;
        } else if (res.status == 204) {
          return;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener la cantidad de cajas por el criterio seleccionado, método buscarPorCriterio, component seguimiento-de-cajas');
      }
    );
  }


  changeSelectedSearch(newSelected: any) {
    this.SearchText = newSelected.nombre;
    this.selectedSearch = newSelected.nombre;
  }

  changeSelectedLinea(newSelected: any) {
    this.selectedLineaText = newSelected.nombre;
    this.selectedLineaObject = newSelected;

  }

  changeSelectedCalibrador(newSelected: any) {
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject = newSelected;
    this.listarLineas(this.selectedCalibradorObject.id);
  }

  fecha() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    return localISOTime;
  }

  //calendar
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "yyyy-MM-dd", 'es-CL');
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.hasta = formatDate(new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day), "yyyy-MM-dd", 'es-CL');


    } else {
      this.toDate = null;
      this.fromDate = date;
      this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "yyyy-MM-dd", 'es-CL');
      this.hasta = null;
    }



  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  dia: string;
  hora: string;
  minuto: string;
  segundo: string;
  agregarRegistroDeCajas() {

    /*let registroCaja = new SeguimientoDeCajas(null, 1, "Calibrador 1", 22, "Línea 1", 21458, "Rfid 1", "192.168.0.2", 1, "Lector 1", "192.168.10.10", 1, "17505454-5", "Ignacio", "Correa", "546545544486", 1, "caja grande", "variedad caja", "categoria de caja", "calibre de caja", "correlativo caja", "ponderación caja", "2020-11-13",  "15:15:10", "2020-11-13", "15:16:35", 0, 1, 0);
    this.seguimientoDeCajasService.saveSeguimientoDeCajas(registroCaja).subscribe(
      res => {
        console.log("agrege!!!!!!!!");
        this.toastr.success('Operación satisfactoria', 'Registro agregado');
      },
      err => {
        //console.log(err);
        //this.toastr.error('No se pudo obtener a los registros', 'Oops');
      }
    ); */

    //for (let d = 30; d <= 30; d++) {
    let count = 3300;
    for (let h = 19; h <= 19; h++) {
      for (let m = 0; m < 30; m++) {
        for (let s = 0; s < 60; s = s + 10) {
          count++;
          //this.dia = d.toString();
          //if (d < 10) {
          //  this.dia = "0" + d;
          //}
          this.hora = h.toString();
          if (h < 10) {
            this.hora = "0" + h;
          }
          this.minuto = m.toString();
          if (m < 10) {
            this.minuto = "0" + m;
          }
          this.segundo = s.toString();
          if (s < 10) {
            this.segundo = "0" + s;
          }
          let date = new Date();
          let registroCaja = new SeguimientoDeCajas(null, 2, "Calibrador 2", 29, "Línea 1", 21458458, "Rfid 1", "192.168.0.2", 1, "Lector 1", "192.168.10.10", 1, "17505454-5", "Ignacio", "Correa", "5468254875" + count, 1, "caja mediana", "variedad caja", "categoria de caja", "calibre de caja", "correlativo caja", "ponderación caja", "2020-11-26", this.hora + ":" + this.minuto + ":" + this.segundo, "", "","1606515300000", 1, 1, 71);
          this.seguimientoDeCajasService.saveSeguimientoDeCajas(registroCaja).subscribe(
            res => {
              console.log("agrege!!!!!!!!");
              //this.toastr.success('Operación satisfactoria', 'Registro agregado');
            },
            err => {
              //console.log(err);
              this.toastr.error('No se pudo obtener a los registros', 'Oops');
            }
          );
          count++;
        }
      }
    }
    //console.log("TERMINE DE AGREGAR LOS DATOS DEL DIA :" + d);
    //}

    /*let registroCaja = new SeguimientoDeCajas(null, 1, "calibrador_"+1, 22, "linea_"+2, 2000+1100, "rfid_"+1213, "192.168.0."+2, 2, "lector_"+1, "192.168.10."+2, 2, "13954687-7", "Ignacio", "Correa", "5468"+2000, 2000, "caja mediana", "variedad caja", "categoria de caja", "calibre de caja", "correlativo caja", "ponderación caja", "2020-10-08", "12:16:40" , "2020-09-24", "08:39:02" , 1,1, 0);
    this.seguimientoDeCajasService.saveSeguimientoDeCajas(registroCaja).subscribe(
      res=>{
       this.toastr.success('Operación satisfactoria', 'Registro agregado');
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener a los registros', 'Oops');
      }
    ); */

    //for(let j=1; j<10 ; j++){
    /*for(let i=30; i<59 ;i++){
      let registroCaja = new SeguimientoDeCajas(null, 1, "calibrador_"+1, 22, "linea_"+2, 2000+1100, "rfid_"+1213, "192.168.0."+2, 2, "lector_"+1, "192.168.10."+2, 2, "13954687-7", "Ignacio", "Correa", "5468"+2000, 2000, "caja mediana", "variedad caja", "categoria de caja", "calibre de caja", "correlativo caja", "ponderación caja", "2020-10-15", "15:"+i+":15" , "2020-10-16", "08:39:02" , 1,1, 0);
      this.seguimientoDeCajasService.saveSeguimientoDeCajas(registroCaja).subscribe(
        res=>{
          this.toastr.success('Operación satisfactoria', 'Registro agregado');
        },
        err=>{
          console.log(err);
          this.toastr.error('No se pudo obtener a los registros', 'Oops');
        }
      ); 
    }*/
    //}


    /*for (let i = 1100 ; i<=1200; i++){
      let registroCaja = new SeguimientoDeCajas(null, 1, "calibrador_"+i, 22, "linea_"+i, i+1100, "rfid_"+i, "192.168.0."+i, i, "lector_"+i, "192.168.10."+i, i, "rut_"+i, "nombre_"+i, "apellido_"+i, "5468"+i, i, "caja grande", "variedad caja", "categoria de caja", "calibre de caja", "correlativo caja", "ponderación caja", "2020-09-01", "2020-09-05", 1,1 );
      this.seguimientoDeCajasService.saveSeguimientoDeCajas(registroCaja).subscribe(
        res=>{
          this.toastr.success('Operación satisfactoria', 'Registro agregado');
        },
        err=>{
          console.log(err);
          this.toastr.error('No se pudo obtener a los registros', 'Oops');
        }
      );
    }*/
  }

}

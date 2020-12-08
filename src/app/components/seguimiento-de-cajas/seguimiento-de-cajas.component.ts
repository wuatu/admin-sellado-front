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
  dropDownSearch: any[] = [{ nombre: 'Envase' }, { nombre: 'Embalaje' }, { nombre: 'Categoria' }, { nombre: 'Calibre' }];
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
    //this.agregarRegistroDeCajas();
    this.listarCalibradores();
  }

  toggleVisibility(e) {
    this.marked = e.target.checked;
    console.log("marked: ", this.marked);
    this.buscarPorCriterio();
    //this.setBusquedaCheckBox(this.marked);
  }

  setBusquedaCheckBox(isChecked: boolean) {
    this.seguimientoDeCajas = [];
    for (let i = 0; i < this.seguimientoDeCajasAux.length; i++) {
      if (isChecked && this.seguimientoDeCajasAux[i].is_verificado == '1') {
        this.seguimientoDeCajas.push(this.seguimientoDeCajasAux[i]);
      } else if (!isChecked && this.seguimientoDeCajasAux[i].is_verificado == '0') {
        this.seguimientoDeCajas.push(this.seguimientoDeCajasAux[i]);
      }
    }
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
    this.seguimientoDeCajas = [];
    this.seguimientoDeCajasAux = [];
    if (!this.selectedLineaObject && !this.selectedCalibradorObject) {
      this.toastr.error('Se debe seleccionar calibrador y linea', 'Oops');
      return;
    } else if (this.desde == null) {
      this.toastr.error('Se debe seleccionar el rango de fecha de busqueda', 'Oops');
      return;
    } else if (this.selectedLineaObject && this.selectedCalibradorObject) {
      console.log(this.theCheckbox);
      console.log("el hasta es : "+ this.hasta);
      this.seguimientoDeCajasService.getSearchLineAndCaliper(this.selectedSearch, this.toSearch, this.desde, this.hasta, this.selectedLineaObject.id, this.selectedCalibradorObject.id,this.marked).subscribe(
        res => {
          this.seguimientoDeCajasAux = res.body;
          this.seguimientoDeCajas= res.body;

          if (res.status == 200) {            
            this.countBoxSearch();
            //this.toastr.success('Cajas selladas obtenidas', 'Operación satisfactoria');
          } else if (res.status == 204) {
            this.numBox = 0; //si no existen cajas que mostrar
            this.toastr.success('no existen cajas selladas actualmente para mostrar', 'Operación satisfactoria');
            return;
          }          
          if (this.bandera == 0) {
            this.nombreColaborador = this.seguimientoDeCajasAux[0].nombre_usuario;
            console.log(this.seguimientoDeCajasAux.nombre_usuario + "!!!!!!!!!!!!!");
            this.bandera++;
          }
          //this.toastr.success('Operación satisfactoria', 'Registros obtenidos');
          console.log(this.marked);
          //this.setBusquedaCheckBox(this.marked);
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudieron obtener las cajas por el criterio seleccionado, método buscarPorCriterio, component seguimiento-de-cajas');
          this.toastr.error('No se pudo obtener la busqueda de seguimiento de cajas', 'Oops');
        }
      );
    }
  }

  countBoxSearch() {
    this.seguimientoDeCajasService.countBox(this.selectedSearch, this.toSearch, this.desde, this.hasta, this.selectedLineaObject.id, this.selectedCalibradorObject.id, this.marked).subscribe(
      res => {
        this.numBox = 0;
        this.cantidadDeCajas = res.body;
        if (res.status == 200) {
          this.numBox = this.cantidadDeCajas[0].cantidad;
        } else if (res.status == 204) {
          this.numBox = 0; //si no encuentra registros
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
    let count = 100;
    let x = 1;
    for(let b = 1; b<=10 ; b++){ // b = numero linea
      for (let h = 18; h <= 18; h++) {
        for (let m = 20; m < 33; m++) {
          x =  Math.random() * (21 - 10) + 10;
          for (let s = 0; s < 60; s = s + x) {
            count++;
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
            let datew  = new Date("2020-12-08" + "T" + this.hora+":"+this.minuto+":"+this.segundo);
            let registroCaja = new SeguimientoDeCajas(null, 1, "Calibrador 1", b, "Línea "+b, 21458458, "Rfid 1", "192.168.0.2", 1, "Lector 1", "192.168.10.10", 1, "17505454-5", "Ignacio", "Correa", "5468254875" + count, "", "", "", "", "", "", "", "", "", "", "", "","" ,"2020-12-07", this.hora + ":" + this.minuto + ":" + this.segundo, "" ,"2020-12-08", "00:50:00",datew.getTime().toString(), 1, 1, 9);
            this.seguimientoDeCajasService.saveSeguimientoDeCajas(registroCaja).subscribe(
              res => {
                console.log("agrege!!!!!!!!");
                //this.toastr.success('Operación satisfactoria', 'Registro agregado');
              },
              err => {
                //console.log(err);
                this.toastr.error('No se pudo agregar', 'Oops');
              }
            );
            count++;
          }
        }
      }
    };
    
  }

}

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

@Component({
  selector: 'app-seguimiento-de-cajas',
  templateUrl: './seguimiento-de-cajas.component.html',
  styleUrls: ['./seguimiento-de-cajas.component.css']
})
export class SeguimientoDeCajasComponent implements OnInit {
  closeResult = '';

  seguimientoDeCajas: any = [];
  lineas: any = [];
  calibradores: any = [];
  pageOfItems: Array<any>;

  p: number = 1;

  nombreLinea: string ="lineaPrueba";
  nombreCalibrador: string = "calibradorPrueba";


  currentCalibradorSelected: Calibrador;
  currentLineaSelected: Linea;


  selectedCalibradorText: string="Seleccionar calibrador";  
  selectedCalibradorObject:any;

  selectedLineaText: string="Seleccionar linea";    
  selectedLineaObject:any;

  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = "";
  hasta: string = "";
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
  dropDownSearch: any [] = [{nombre:'Envase'}, {nombre:'Variedad'}, {nombre:'Categoria'}, {nombre:'Calibre'}];
  SearchText: string="Seleccionar criterio";    
  selectedSearch:any;

  constructor(private toastr: ToastrService,
    private seguimientoDeCajasService: SeguimientoDeCajasService,
    private calibradorService: CalibradorService,
    private lineaService: LineaService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter) { }

  ngOnInit() {
    this.listarCalibradores();
    
    //this.agregarRegistroDeCajas();
  }
  
  listarSeguimientoDeCajas(){
    this.seguimientoDeCajasService.getSeguimientoDeCajas(this.selectedLineaObject.id, this.selectedCalibradorObject.id).subscribe(
      res=>{
        console.log(res);
        this.seguimientoDeCajas=res;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener a los registros', 'Oops');
      }
    );
  }

  listarLineas(id:string){
    console.log("HOLA ESTOY LISTANDO !!!!");
    this.lineaService.getLineasId(id).subscribe(
      res2=>{
        console.log(res2);
        this.lineas=res2;
        //this.listarSeguimientoDeCajas();
        
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener lineas', 'Oops');
      }
    );
  }

  listarCalibradores(){
    this.calibradorService.getCalibradores().subscribe(
      res=>{
        console.log(res);
        this.calibradores=res;
        
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }

  buscarPorCriterio(){
    console.log(this.selectedSearch + this.toSearch + this.desde + this.hasta);
    this.seguimientoDeCajas = [];
    if(!this.selectedLineaObject && !this.selectedCalibradorObject && this.selectedSearch){
      console.log("busqueda de solo busqueda");
      this.toastr.error('Se debe seleccionar calibrador y linea', 'Oops');
    }else if(this.selectedLineaObject && this.selectedCalibradorObject && this.selectedSearch){
      console.log("busqueda de con caliper y line");
      this.seguimientoDeCajasService.getSearchLineAndCaliper(this.selectedSearch, this.toSearch, this.desde, this.hasta, this.selectedLineaObject.id, this.selectedCalibradorObject.id).subscribe(
        res=>{
          console.log(res);
          this.seguimientoDeCajas=res;
          console.log(this.seguimientoDeCajas);
          //this.listarSeguimientoDeCajas();
        },
        err=>{
          console.log(err);
          this.toastr.error('No se pudo obtener la busqueda de seguimiento de cajas', 'Oops');
        }
      );
    }
  }
  
  changeSelectedSearch(newSelected: any) { 
    this.SearchText = newSelected.nombre;
    this.selectedSearch = newSelected.nombre;
    console.log(this.selectedSearch);      
  }

  changeSelectedLinea(newSelected: any) { 
    console.log("CHANGESELECTEDLINEA");
    this.selectedLineaText = newSelected.nombre;
    this.selectedLineaObject=newSelected;
    this.listarSeguimientoDeCajas();
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
      //const dateStringAux:string=(this.fromDate.year+"-"+(this.fromDate.month-1)+"-"+this.fromDate.day);
      this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month-1, this.fromDate.day), "yyyy-MM-dd", 'es-CL');
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.hasta = formatDate(new Date(this.toDate.year, this.toDate.month-1, this.toDate.day), "yyyy-MM-dd", 'es-CL');

    
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month-1, this.fromDate.day), "yyyy-MM-dd", 'es-CL');
      this.hasta=null;
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

  agregarRegistroDeCajas(){
    
    let registroCaja = new SeguimientoDeCajas(null, 2, "calibrador_"+2, 25, "linea_"+2, 1000+1200, "rfid_"+2200, "192.168.0."+2200, 2200, "lector_"+1000, "192.168.10."+2200, 2200, "rut_"+2200, "nombre_"+2200, "apellido_"+2200, "5468"+2200, 2200, "caja grande", "variedad caja", "categoria de caja", "calibre de caja", "correlativo caja", "ponderación caja", "2020-09-01", "2020-09-31", 1,1);
    this.seguimientoDeCajasService.saveSeguimientoDeCajas(registroCaja).subscribe(
      res=>{
        this.toastr.success('Operación satisfactoria', 'Registro agregado');
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener a los registros', 'Oops');
      }
    ); 
    

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

  onSubmitBuscarUsuarioForm(){

  }

}

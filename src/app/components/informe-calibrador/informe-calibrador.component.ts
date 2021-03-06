import { Component, OnInit } from '@angular/core';
import { CalibradorService } from 'src/app/services/calibrador.service';
import { ToastrService } from 'ngx-toastr';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ProduccionPorCalibradorService } from '../../services/produccion-por-calibrador.service';

import { SeguimientoDeCajas } from '../../models/seguimiento-de-cajas';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { NgForm } from '@angular/forms';

import { ProduccionColaboradorExcel } from '../../models/produccion-colaborador-excel';

import * as XLSX from 'xlsx';
import { RegistroService } from '../../services/registro.service';
import { RegistroDevService } from '../../services/registro-dev.service';
import { resolve } from 'url';

@Component({
  selector: 'app-informe-calibrador',
  templateUrl: './informe-calibrador.component.html',
  styleUrls: ['./informe-calibrador.component.css']
})
export class InformeCalibradorComponent implements OnInit {
  closeResult = '';
  currentSeguimientoSelected: SeguimientoDeCajas;
  pageOfItems: Array<any>;
  p: number = 1;

  verificado: number;
  a_tiempo: number;

  nombreExcel = 'Produccion Colibrador';
  nombre: any;
  apellido: any;

  // Array para el dropdown del selector de si o no
  dropDownVerified: any[] = [{ opcion: 'si' }, { opcion: 'no' }];
  SearchTextVerified: string = "Seleccionar opción";
  selectedOptionVerified: string = null;

  dropDownToTime: any[] = [{ opcion: 'si' }, { opcion: 'no' }];
  SearchTextToTime: string = "Seleccionar opción";
  selectedOptionToTime: string = null;

  //Atributo para contar la cantidad de cajas 
  numBox: number;
  //Atributos para el dropdown de calibrador
  calibradores: any = [];
  cajasCalibrador: any;
  _cajasCalibrador: any;
  produccionCalibrador: any = [];
  _produccionCalibrador: any = [];
  produccionCalibradorExportarExcel: any = [];
  selectedCalibradorText: string = "Seleccionar calibrador";
  selectedCalibradorObject: any;

    //Atributos para el dropdown de turnos
    turnos: any = [];
    //cajasCalibrador: any = [];
    //produccionCalibrador: any = [];
    //produccionCalibradorExportarExcel: any = [];
    selectedTurnoText: string = "Seleccionar turno";
    selectedTurnoObject: any;
    turnosShow: any = [];

    produccionColaboradores: any = [];
    _produccionColaboradores: any = [];

  //******************************************/
  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = " ";
  hasta: string = " ";
  tituloBuscarPatente = "Búsqueda de patente";
  cantidadResultadoBusqueda = 0;
  dateSave: string;
  timeStart: string;
  dateStart: string;
  timeFinish: string = " ";
  dateFinish: string = " ";
  dateStartSearch: string;
  dateFinishSearch: string;
  mostrarGrafico: any;
  produccionColaboradorExcel:any = [];

  produccionLineaCalibrador:any = [];
  _produccionLineaCalibrador:any = [];

  produccionPorMinutoTurno: any = [];
  _produccionPorMinutoTurno: any = [];
  
  rol: number;
  
  isDisabled: boolean = false;

  descarga:boolean = false;
  
  showSpinner = false;
  constructor(
    private toastr: ToastrService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private calibradorService: CalibradorService,
    private produccionPorCalibradorService: ProduccionPorCalibradorService,
    private modalService: NgbModal,
    private registroService: RegistroService,
    private registroDevService: RegistroDevService
  ) {
    this.fromDate = calendar.getToday();
    this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "yyyy-MM-dd", 'en-US');    
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 0);
    this.hasta = formatDate(new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day), "yyyy-MM-dd", 'en-US');
  }

  ngOnInit() {
    this.listarCalibradores();
    this.rol = JSON.parse(localStorage.getItem('USER')).rol;
  }


  //Método que ejecuta los metodos para obtener los distindos array de producción al presionar el botón buscar
  async buscar(){
    if(this.selectedCalibradorObject && this.selectedTurnoObject){
      this.showSpinner = true;
      console.log("INICIO... ");
      this.produccionCalibrador = await this.buscarRegistroCalibrador();
      console.log("1 produccionCalibrador");
      //console.log(this.produccionCalibrador);

      this.cajasCalibrador = await this.contarCajasCalibradorPorFecha();
      console.log("2 cajasCalibrador");
      //console.log(this.cajasCalibrador);

      this.produccionColaboradores = await this.getProduccionColaborador();
      console.log("3 produccionColaboradores");
      //console.log(this.produccionColaboradores);

      this.produccionLineaCalibrador = await this.getProduccionLineasCalibrador();
      console.log(" 4 produccionLineaCalibrador");
      //console.log(this.produccionLineaCalibrador);

      this.produccionPorMinutoTurno = await this.promedioCajasPorMinutoTurno();
      console.log("5 produccionPorMinutoTurno");
      //console.log(this.produccionPorMinutoTurno);
      
      console.log("TERMINO ... ");
      this.showSpinner = false ;
      this.isDisabled = true;
    }else{
      this.toastr.info("Por favor seleccione fecha, calibrador y turno");
    }
  }
  //Método para obtener el listado de turno filtrado por calibrador y fecha...

  listarTurnos(){
    this.turnosShow = [];
    console.log("listar turnos, fechas: "+this.desde+"  "+this.hasta);
    this.produccionPorCalibradorService.getTurnos(this.selectedCalibradorObject.id, this.desde, this.hasta).subscribe(
      res => {
        if(res.status == 200 ){
          this.turnos = res.body;
          console.log("  ");
          console.log("TURNOS !!!");
          console.log(this.turnos);
          console.log(this.turnos.length);
          console.log("  ");
          for(let i = 0; i < this.turnos.length ; i ++){
            this.turnosShow.push({turno:this.turnos[i].id_turno+ "  inicio turno: "+ this.turnos[i].fApertura+" "+this.turnos[i].hApertura+" "+"termino turno: "+ this.turnos[i].fCierre+" "+this.turnos[i].hCierre, id_turno: this.turnos[i].id_turno, seleccionar: "  Inicio: "+ this.turnos[i].fApertura+" "+this.turnos[i].hApertura.substring(0,5),
          fApertura: this.turnos[i].fApertura, hApertura: this.turnos[i].hApertura, fCierre: this.turnos[i].fCierre, hCierre: this.turnos[i].hCierre});
          }
        }else{
          this.toastr.success("No existen turnos para este calibrador en la fecha indicada","Operación Satisfactoria");
        }
      },
      err => {
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudieron obtener los turnos del calibrador por la fecha indicada, método listarTurnos, component monitoreo-por-calibrador');
        this.toastr.error('No se pudo obtener los turnos', 'Oops');
      }
    );
  }

  promedioCajasPorMinutoTurno(): Promise<any>{
    return new Promise((resolve, reject) => {  
      //console.log("método promedioCajasPorMinuto()");
      this._produccionPorMinutoTurno = [];
      //console.log(this.selectedTurnoObject);
      let fCierre;
      let hCierre;
      if(this.selectedTurnoObject.fCierre == "" && this.selectedTurnoObject.hCierre == "" ){
        fCierre = "undefine";
        hCierre = "undefine";
      }else{
        fCierre = this.selectedTurnoObject.fCierre;
        hCierre = this.selectedTurnoObject.hCierre;
      }
      this.produccionPorCalibradorService.getPromedioCajasPorMinutoTurno(this.selectedCalibradorObject.id, this.selectedTurnoObject.id_turno, this.selectedTurnoObject.fApertura, this.selectedTurnoObject.hApertura, fCierre, hCierre).subscribe(
        res => {
          if(res.status == 200 ){
            this._produccionPorMinutoTurno = res.body;
            //console.log("  ");
            //console.log("produccion por minuto!!!");
            //console.log(this._produccionPorMinutoTurno);
            //console.log("  ");
            resolve(this._produccionPorMinutoTurno);
          }
        },
        err => {
          //console.log(err);
          this.registroDevService.creaRegistroDev('No se pudieron obtener los turnos del calibrador por la fecha indicada, método listarTurnos, component monitoreo-por-calibrador');
          
          this.toastr.info("El turno seleccionado aún no finaliza");
        }
      );
    })
  }

  getProduccionLineasCalibrador(): Promise<any>{
    return new Promise((resolve, reject) => {
      this._produccionLineaCalibrador = [];
      this.produccionPorCalibradorService.getProduccionLineaCalibrador(this.selectedCalibradorObject.id, this.selectedTurnoObject.id_turno).subscribe(
        res => {
          if(res.status == 200 ){
            this._produccionLineaCalibrador = res.body;
            //console.log("  ");
            //console.log("produccion por linea!!!");
            //console.log(this._produccionLineaCalibrador);
            //console.log(this._produccionLineaCalibrador.length);
            //console.log("  ");
            resolve(this._produccionLineaCalibrador);
          }
        },
        err => {
          console.log(err);
          this.registroDevService.creaRegistroDev('No se pudieron obtener los turnos del calibrador por la fecha indicada, método listarTurnos, component monitoreo-por-calibrador');
          this.toastr.error('No se pudo obtener los turnos', 'Oops');
        }
      );
    })
  }

  getProduccionColaborador(): Promise<any>{
    return new Promise((resolve, reject) => {
      this._produccionColaboradores = [];
      this.produccionPorCalibradorService.getProduccionColaborador(this.selectedTurnoObject.id_turno).subscribe(
        res => {
          if(res.status == 200 ){
            this._produccionColaboradores = res.body;
            resolve(this._produccionColaboradores);
          }
        },
        err => {
          //console.log(err);
          this.registroDevService.creaRegistroDev('No se pudieron obtener los turnos del calibrador por la fecha indicada, método listarTurnos, component monitoreo-por-calibrador');
          this.toastr.error('No se pudo obtener los turnos', 'Oops');
        }
      );
    })
  }

  //metodo que lista las calibradores
  listarCalibradores() {
    this.calibradorService.getCalibradores().subscribe(
      res => {
        this.calibradores = res.body;
        console.log(this.calibradores);
      },
      err => {
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component monitoreo-por-calibrador');
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }

  imprimirGrafico() {
    window.print();
  }

  contarCajasCalibradorPorFecha():Promise<any> {
    return new Promise((resolve, reject) => {
      this._cajasCalibrador = null;
      //this.produccionSearchNumberBox(this.rutBusqueda, this.desde, this.hasta);
      //console.log(this.selectedCalibradorObject.id + " por fecha " + this.desde + " " + this.hasta);
      this._cajasCalibrador = [];
      this.produccionPorCalibradorService.getboxInCaliper(this.selectedCalibradorObject.id, this.desde, this.hasta, this.selectedTurnoObject.id_turno).subscribe(
        res => {
          this.numBox =0;
          this._cajasCalibrador = res;
          //console.log("NUMERO : ");
          //console.log(this._cajasCalibrador);
          this.numBox = this._cajasCalibrador.numero;
          //console.log("numBox: "+this.numBox );
          resolve(this._cajasCalibrador);
          //this.mostrarGrafico = "true";
          //console.log(this.cajasCalibrador);
          //this.cajasTotales(this.cajasCalibrador);
          //this.pushData(this.cajasCalibrador);
  
        },
        err => {
          //this.registroDevService.creaRegistroDev('No se pudo obtener la produccion del calibrador, método contarCajarCalibradorPorFecha, component monitoreo-por-calibrador');
          if (this.selectedCalibradorText != "Seleccionar calibrador" && this.desde != " " && this.hasta != " ") {
            //this.toastr.error('No se pudo obtener las cajas del calibrador', 'Oops');
          }
  
        }
      );
    })
  }

  async buscarRegistroCalibrador(): Promise <any> {
    return new Promise((resolve, reject) => {
      //console.log(this.selectedCalibradorObject.id + this.desde + this.hasta);
      this._produccionCalibrador = [];
      this.produccionCalibradorExportarExcel = [];
    
      this.produccionPorCalibradorService.getProduccionSearch(this.selectedCalibradorObject.id, this.desde, this.hasta, this.selectedTurnoObject.id_turno).subscribe(
        res => {
          //console.log(res);
          this._produccionCalibrador = res.body;
          //console.log(this.produccionColaborador);
          if (res.status == 200) {
          } else if (res.status == 204) {
            this.toastr.success('No hay producción para este calibrador actualmente para mostrar', 'Operación satisfactoria');
            this.showSpinner = false;
            return;
          }
          var bandera = 0;
          var newVerificado;
          var newIsTime;
          for (let element of this._produccionCalibrador) {
            if (element.is_verificado) {
              newVerificado = "si";
            } else {
              newVerificado = "no";
            }
            if (element.is_before_time) {
              newIsTime = "si";
            } else {
              newIsTime = "no";
            }
            let exportExcelProduccion = new ProduccionColaboradorExcel(element.codigo_de_barra, element.envase_caja, element.nombre_linea, element.nombre_lector, element.ip_lector, element.nombre_usuario, element.apellido_usuario, element.rut_usuario, element.fecha_sellado, element.hora_sellado, newVerificado, newIsTime);
            this.produccionCalibradorExportarExcel.push(exportExcelProduccion);
            if (bandera == 0) {
              this.nombre = element.nombre_usuario;
              this.apellido = element.apellido_usuario;
              bandera = 1;
            }
  
          }
  
  
          if (this._produccionCalibrador.length == 0) {
            this.produccionCalibradorExportarExcel = null;
          }
          resolve(this._produccionCalibrador);
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener la producción del calibrador, método buscarRegistroCalibrador, component monitoreo-por-calibrador2');
          this.toastr.error('No se pudo obtener la busqueda de produccion del calibrador', 'Oops');
        }
      );
    })
  }
  //metodo que sirve para editar una linea
  editarRegistroProduccion(form: NgForm) {

    this.SearchTextToTime = "Seleccionar opción";
    if (this.selectedOptionVerified == null || this.selectedOptionToTime == null) {
      this.toastr.error('Valores incorrectos', 'registro no editado');
      return;
    }
    //console.log("Verificado nuevo : "+ this.verificado + " a tiempo : "+ this.a_tiempo);
    if (this.selectedOptionVerified == "si") {
      this.verificado = 1;
      this.currentSeguimientoSelected.fecha_validacion_time = new Date().getTime().toString();
    } else {
      this.verificado = 0;
      this.currentSeguimientoSelected.fecha_validacion_time = "";
    }
    if (this.selectedOptionToTime == "si") {
      this.a_tiempo = 1;
    } else {
      this.a_tiempo = 0;
    }

    if (this.verificado != this.currentSeguimientoSelected.is_verificado || this.a_tiempo != this.currentSeguimientoSelected.is_before_time) {
      let registroProduccionColaborador = new SeguimientoDeCajas(form.value.id, this.currentSeguimientoSelected.id_calibrador, this.currentSeguimientoSelected.nombre_calibrador, this.currentSeguimientoSelected.id_linea, this.currentSeguimientoSelected.nombre_linea, this.currentSeguimientoSelected.id_rfid, this.currentSeguimientoSelected.nombre_rfid, this.currentSeguimientoSelected.ip_rfid, this.currentSeguimientoSelected.id_lector, this.currentSeguimientoSelected.nombre_lector, this.currentSeguimientoSelected.ip_lector, this.currentSeguimientoSelected.id_usuario, this.currentSeguimientoSelected.rut_usuario, this.currentSeguimientoSelected.nombre_usuario, this.currentSeguimientoSelected.apellido_usuario, this.currentSeguimientoSelected.codigo_de_barra, this.currentSeguimientoSelected.Cod_Caja_Unitec, this.currentSeguimientoSelected.Codigo_Confection_Unitec, this.currentSeguimientoSelected.Confection_Unitec,this.currentSeguimientoSelected.Codigo_Embalaje_Unitec ,this.currentSeguimientoSelected.Embalaje_Unitec,this.currentSeguimientoSelected.Codigo_Envase_Unitec,this.currentSeguimientoSelected.Envase_Unitec, this.currentSeguimientoSelected.Categoria_Unitec, this.currentSeguimientoSelected.Categoria_Timbrada_Unitec,this.currentSeguimientoSelected.Codigo_Calibre_Unitec, this.currentSeguimientoSelected.Calibre_Unitec, this.currentSeguimientoSelected.id_caja_sellada, this.currentSeguimientoSelected.ponderacion_caja_sellada, this.currentSeguimientoSelected.fecha_sellado, this.currentSeguimientoSelected.hora_validacion, this.currentSeguimientoSelected.fecha_sellado_time,this.currentSeguimientoSelected.fecha_validacion,this.currentSeguimientoSelected.hora_validacion,this.currentSeguimientoSelected.fecha_validacion_time ,this.verificado, this.a_tiempo, this.currentSeguimientoSelected.id_apertura_cierre_de_turno);
      this.produccionPorCalibradorService.updateRegistroProduccionCaliper(registroProduccionColaborador.id, registroProduccionColaborador).subscribe(
        res => {
          this.registroService.creaRegistro("Se ha editado un registro de caja sellada, id registro: " + registroProduccionColaborador.id);
          this.buscarRegistroCalibrador();
          this.currentSeguimientoSelected = null;
        },
        err => {
          console.log(err);
          this.toastr.error('No se pudo editar registro', 'Oops',);
        }
      );
    } else {
      this.registroDevService.creaRegistroDev('No se pudo editar el registro de produccion, método editarRegistroProduccion, component produccion-por-calibrador');
      this.toastr.error('Los valores seleccionados ya estan registrados', 'Oops',);
    }
  }

  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto calibrador clickeado a variable global currentLineaSelected
  onEditar(seguimientoDeCajas: SeguimientoDeCajas) {
    this.currentSeguimientoSelected = seguimientoDeCajas;
    //console.log(this.currentSeguimientoSelected.is_verificado);
    //console.log(this.currentSeguimientoSelected.is_before_time);
    if (this.currentSeguimientoSelected.is_verificado) {
      this.SearchTextVerified = "si";
      this.selectedOptionVerified = "si";
    } else {
      this.SearchTextVerified = "no";
      this.selectedOptionVerified = "no";
    }
    if (this.currentSeguimientoSelected.is_before_time) {
      this.SearchTextToTime = "si";
      this.selectedOptionToTime = "si";
    } else {
      this.SearchTextToTime = "no";
      this.selectedOptionToTime = "no";
    }
  }

  //metodo que abre un modal
  open(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //metodo que sirve para saber la razon por la cual un modal fue cerrado
  private getDismissReason(reason: any): string {
    console.log(reason);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log("sera");
      return 'by clicking on a backdrop';
    } else {
      if (reason == 'ok') {
        console.log("hola");
      }
      return `with: ${reason}`;
    }
  }


  cajasTotales(cajas: any[]) {
    this.numBox = 0;
    for (let caja of cajas) {
      this.numBox = caja.numero + this.numBox;
    }
  }

  changeSelectedCalibrador(newSelected: any) {
    
    if(!this.desde || !this.hasta){
      this.toastr.info("Por favor seleccione un rango de fechas");
      return;
    }else{
      this.selectedCalibradorText = newSelected.nombre;
      this.selectedCalibradorObject = newSelected;
      this.selectedTurnoText = "Seleccionar turno";
      this.turnosShow = [];
      this.listarTurnos();
    }
  }

  changeSelectedTurno(newSelected: any) {
    this.selectedTurnoText = newSelected.seleccionar;
    this.selectedTurnoObject = newSelected;
    console.log("turno seleccionado");
    console.log(this.selectedTurnoObject);
  }

  changeSelectedVerified(newSelected: any) {
    this.SearchTextVerified = newSelected.opcion;
    this.selectedOptionVerified = this.SearchTextVerified;
  }

  changeSelectedToTime(newSelected: any) {
    this.SearchTextToTime = newSelected.opcion;
    this.selectedOptionToTime = this.SearchTextToTime;
  }


  exportarArchivoExcel() {
    try {
      this.descarga = true;
      if (this.produccionCalibradorExportarExcel.length > 50000) {

        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        // Se convierte el arreglo con los usuarios en linea 
        var jsonArray = JSON.parse(JSON.stringify(this.produccionPorMinutoTurno))
        //se convierte el Json a xlsx en formato workSheet
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray);
        /* genera el workbook y agrega el worksheet */
        XLSX.utils.book_append_sheet(wb, ws, 'Producción por minuto');

        var jsonArray2 = JSON.parse(JSON.stringify(this.produccionLineaCalibrador));
        const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray2);
        XLSX.utils.book_append_sheet(wb, ws2, 'Producción Líneas');

        var jsonArray3 = JSON.parse(JSON.stringify(this.produccionColaboradores));
        const ws3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray3);
        XLSX.utils.book_append_sheet(wb, ws3, 'Producción colaboradores');


        let array: any[];
        let i = 0;
        let j = 50000;
        let cont = 1;
        
        while (i < this.produccionCalibradorExportarExcel.length) {
          array = this.produccionCalibradorExportarExcel.slice(i, j);
          // Se convierte el arreglo con los usuarios en linea 
          var jsonArray4 = JSON.parse(JSON.stringify(array));
          //se convierte el Json a xlsx en formato workSheet
          const ws4: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray4);
          /* genera el workbook y agrega el worksheet */
          XLSX.utils.book_append_sheet(wb, ws4, 'Producción de calibrador ' + cont);
          i = j;
          if (j + 50000 < this.produccionCalibradorExportarExcel.length) {
            j = j + 50000;
          } else {
            j = this.produccionCalibradorExportarExcel.length;

          }
          cont++;
        }
        /* Guarda el archivo */
        let dateDownload: string = new Date().toISOString();
        XLSX.writeFile(wb, "informe" + "_" + this.selectedCalibradorObject.nombre + "_" + "idTurno-" + this.selectedTurnoObject.id_turno+"_"+this.selectedTurnoObject.fApertura+"_"+this.selectedTurnoObject.hApertura.substring(0,2)+"-"+this.selectedTurnoObject.hApertura.substring(3,5) +"-"+this.selectedTurnoObject.hApertura.substring(6,8)+".xls");
        this.descarga = false;
        
      } else {
        this.descarga = true;
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        // Se convierte el arreglo con los usuarios en linea 
        var jsonArray = JSON.parse(JSON.stringify(this.produccionPorMinutoTurno))
        console.log("json");
        console.log(jsonArray)
        //se convierte el Json a xlsx en formato workSheet
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray);
        /* genera el workbook y agrega el worksheet */
        XLSX.utils.book_append_sheet(wb, ws, 'Producción por minuto');

        var jsonArray2 = JSON.parse(JSON.stringify(this.produccionLineaCalibrador));
        const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray2);
        XLSX.utils.book_append_sheet(wb, ws2, 'Producción Líneas');

        var jsonArray3 = JSON.parse(JSON.stringify(this.produccionColaboradores));
        const ws3: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray3);
        XLSX.utils.book_append_sheet(wb, ws3, 'Producción colaboradores');

        var jsonArray4 = JSON.parse(JSON.stringify(this.produccionCalibradorExportarExcel))
        const ws4: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray4);
        XLSX.utils.book_append_sheet(wb, ws4, 'Producción de calibrador');
        /* Guarda el archivo */
        let dateDownload: string = new Date().toISOString();
        XLSX.writeFile(wb, "informe" + "_" + this.selectedCalibradorObject.nombre + "_" + "idTurno-" + this.selectedTurnoObject.id_turno+"_"+this.selectedTurnoObject.fApertura+"_"+this.selectedTurnoObject.hApertura.substring(0,2)+"-"+this.selectedTurnoObject.hApertura.substring(3,5) +"-"+this.selectedTurnoObject.hApertura.substring(6,8)+".xls");
        //this.descarga = false;
      }


    } catch (error) {
      this.registroDevService.creaRegistroDev('No se pudo exportar la producción al archivo excel, método exportarArchivoExcel, component monitoreo-por-calibrador');
      console.log("error!!!");
    }
  }



  fecha() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    return localISOTime;
  }

  /*********************** CALENDAR ************************************************************************************************************/
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      //const dateStringAux:string=(this.fromDate.year+"-"+(this.fromDate.month-1)+"-"+this.fromDate.day);
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

 
  /***************************************************************************************************************************************************/

  
}



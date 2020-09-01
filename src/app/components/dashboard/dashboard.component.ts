import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  ingenieros=
    [
      {
      nombre:"fito",
      apellido:"henzi"
    },
    {
      nombre:"cristian",
      apellido:"farias"
    },
  ]
  

  constructor(
    
  ) { }

  ngOnInit() {
  }



}

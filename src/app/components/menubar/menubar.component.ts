import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MenubarService } from 'src/app/services/menubar.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthModule } from 'src/app/auth/auth.module';
import { Router } from '@angular/router';
declare var name: any;
@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  
  constructor(
    public menubar:MenubarService,
    private authService:AuthService,
    private router:Router
    ) {
  }

  ngOnInit() {
    new name();
  }

  showMenu(isVisible:boolean) {
    this.menubar.visibleToggleAction();
  }

  logout(){    
    this.authService.logout();
    this.authService.isLogin();
    this.router.navigate(['/auth/login']);
  }
}

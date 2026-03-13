import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeepAliveService } from './service/keep-alive.service';
import { ToastComponent } from '../shared/animate/toast-notification/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'PT. Pandigi';

  constructor(private keepAlive: KeepAliveService) {}

  ngOnInit(): void {
    this.keepAlive.start();
  }
}
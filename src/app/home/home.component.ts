import { Component, OnInit } from '@angular/core';
import { MongoService } from '../mongo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;

  constructor(private mongoService: MongoService) { }

  async ngOnInit() {
    this.user = await this.mongoService.getUser();
  }

  async logout() {
    await this.mongoService.logout();
  }
}

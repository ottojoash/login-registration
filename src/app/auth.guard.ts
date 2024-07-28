import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MongoService } from './mongo.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private mongoService: MongoService, private router: Router) { }

  async canActivate(): Promise<boolean> {
    const user = await this.mongoService.getUser();
    if (user) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
